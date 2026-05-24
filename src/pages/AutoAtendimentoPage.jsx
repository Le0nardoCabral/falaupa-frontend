import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/client";

const FLOW = [
  { id: "queixaPrincipal", question: "Olá, eu sou a assistente de triagem. Em uma frase, o que você está sentindo agora?", type: "text" },
  { id: "sintomasRelatados", question: "Além disso, quais outros sintomas você percebeu?", type: "text" },
  { id: "dorNoPeito", question: "Você sente dor no peito agora?", type: "choice", options: ["Sim", "Não"] },
  { id: "faltaDeAr", question: "Está com falta de ar ou dificuldade para respirar?", type: "choice", options: ["Sim", "Não"] },
  { id: "sangramento", question: "Existe sangramento ativo agora?", type: "choice", options: ["Sim", "Não"] },
  { id: "intensidadeDor", question: "De 0 a 10, qual a intensidade da dor neste momento?", type: "choice", options: ["0", "2", "4", "6", "8", "10"] },
  { id: "tempoSintomasMinutos", question: "Há quanto tempo os sintomas começaram? (em minutos)", type: "text" },
  { id: "observacoes", question: "Tem algo importante para avisar? Exemplo: alergia, gravidez, diabetes, pressão alta, remédio em uso.", type: "text" }
];

function botMessage(text) { return { role: "bot", text }; }
function userMessage(text) { return { role: "user", text }; }

function formatCpf(value) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function formatPhone(value) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 10) {
    return digits
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }
  return digits
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
}

function getApiErrorMessage(err) {
  const data = err?.response?.data;
  const status = err?.response?.status;
  const statusText = err?.response?.statusText;

  if (!data) {
    const base = err?.message || "Erro ao cadastrar paciente.";
    return status ? `${base} (HTTP ${status}${statusText ? ` - ${statusText}` : ""})` : base;
  }

  if (typeof data === "string") return data;
  if (data?.message && typeof data.message === "string") return data.message;
  if (data?.title && typeof data.title === "string") {
    if (data?.errors && typeof data.errors === "object") {
      const details = Object.values(data.errors)
        .flat()
        .filter(Boolean)
        .join(" | ");
      return details ? `${data.title}: ${details}` : data.title;
    }
    return data.title;
  }

  try {
    const serialized = JSON.stringify(data);
    if (serialized && serialized !== "{}") return serialized;
  } catch {
    // ignore
  }

  const fallback = err?.message || "Erro ao cadastrar paciente.";
  return status ? `${fallback} (HTTP ${status}${statusText ? ` - ${statusText}` : ""})` : fallback;
}

function evaluateRisk(answers) {
  const dor = Number(answers.intensidadeDor || 0);
  const highAlert = ["sim"].includes(String(answers.dorNoPeito || "").toLowerCase()) || ["sim"].includes(String(answers.faltaDeAr || "").toLowerCase()) || ["sim"].includes(String(answers.sangramento || "").toLowerCase());
  const text = `${answers.queixaPrincipal || ""} ${answers.sintomasRelatados || ""} ${answers.observacoes || ""}`.toLowerCase();
  const severeTerms = ["desmaio", "convuls", "inconsciente", "avc", "fraqueza de um lado", "confusao"];
  const moderateTerms = ["febre", "vomito", "tontura", "dor forte", "pressao alta"];

  if (highAlert || severeTerms.some((t) => text.includes(t))) return { cor: "Vermelho", justificativa: "Sinal de alerta grave identificado na entrevista." };
  if (dor >= 9) return { cor: "Laranja", justificativa: "Dor muito intensa informada." };
  if (dor >= 7 || moderateTerms.some((t) => text.includes(t))) return { cor: "Amarelo", justificativa: "Sinais de urgência moderada no relato." };
  if (dor >= 4) return { cor: "Verde", justificativa: "Quadro estável, mas com necessidade de avaliação clínica." };
  return { cor: "Azul", justificativa: "Baixa urgência inicial no auto-relato." };
}

function buildSummary(answers) {
  const pontos = [
    answers.queixaPrincipal && `Queixa principal: ${answers.queixaPrincipal}.`,
    answers.sintomasRelatados && `Sintomas associados: ${answers.sintomasRelatados}.`,
    answers.intensidadeDor && `Dor atual: ${answers.intensidadeDor}/10.`,
    answers.tempoSintomasMinutos && `Início dos sintomas: há ${answers.tempoSintomasMinutos} minutos.`,
    answers.dorNoPeito && `Dor no peito: ${answers.dorNoPeito}.`,
    answers.faltaDeAr && `Falta de ar: ${answers.faltaDeAr}.`,
    answers.sangramento && `Sangramento ativo: ${answers.sangramento}.`,
    answers.observacoes && `Observações adicionais: ${answers.observacoes}.`
  ].filter(Boolean);
  return pontos.join(" ");
}

export default function AutoAtendimentoPage() {
  const navigate = useNavigate();
  const [locais, setLocais] = useState([]);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [chat, setChat] = useState([botMessage(FLOW[0].question)]);
  const [cityQuery, setCityQuery] = useState("");
  const [form, setForm] = useState({ nomeCompleto: "", cpf: "", dataNascimento: "", sexo: "", telefone: "", endereco: "", cidade: "", uf: "SP", unidadeUpa: "", nomeResponsavel: "", queixaPrincipal: "" });

  useEffect(() => { api.get("/publico/cidades-sp-upa").then((r) => setLocais(r.data)).catch(() => setLocais([])); }, []);

  const cidadesFiltradas = useMemo(() => {
    const q = cityQuery.trim().toLowerCase();
    if (!q) return locais.slice(0, 20);
    return locais.filter((x) => x.cidade.toLowerCase().includes(q)).slice(0, 20);
  }, [locais, cityQuery]);

  const unidades = useMemo(() => locais.find((x) => x.cidade === form.cidade)?.unidadesUpa || [], [locais, form.cidade]);
  const resumo = useMemo(() => buildSummary(answers), [answers]);
  const risk = useMemo(() => evaluateRisk(answers), [answers]);
  const finished = current >= FLOW.length;

  useEffect(() => {
    const found = locais.find((x) => x.cidade.toLowerCase() === cityQuery.trim().toLowerCase());
    if (!found) return;
    setForm((prev) => ({ ...prev, cidade: found.cidade, uf: found.uf || "SP", unidadeUpa: prev.unidadeUpa }));
  }, [cityQuery, locais]);

  function registerAnswer(value) {
    if (finished) return;
    const step = FLOW[current];
    const clean = String(value || "").trim();
    if (!clean) return;
    const nextAnswers = { ...answers, [step.id]: clean };
    const nextChat = [...chat, userMessage(clean)];
    if (step.id === "queixaPrincipal") setForm((f) => ({ ...f, queixaPrincipal: clean }));
    const nextIndex = current + 1;
    if (nextIndex >= FLOW.length) {
      const finalRisk = evaluateRisk(nextAnswers);
      nextChat.push(botMessage("Entrevista concluída. Vou montar seu resumo para acelerar sua triagem."));
      nextChat.push(botMessage(`Classificação preliminar sugerida: ${finalRisk.cor}. Essa sugestão será validada por um profissional de saúde.`));
    } else {
      if (["dorNoPeito", "faltaDeAr", "sangramento"].includes(step.id) && clean.toLowerCase() === "sim") nextChat.push(botMessage("Entendi. Esse sinal pode indicar urgência. Vamos continuar rápido para priorizar seu atendimento."));
      nextChat.push(botMessage(FLOW[nextIndex].question));
    }
    setAnswers(nextAnswers);
    setChat(nextChat);
    setChatInput("");
    setCurrent(nextIndex);
  }

  async function onSubmit(e) {
    e.preventDefault();
    setStatus("");
    setError("");
    if (!finished) return setError("Finalize a conversa com a assistente antes de entrar na fila.");

    const payload = { ...form, queixaPrincipal: resumo || form.queixaPrincipal, dataNascimento: form.dataNascimento || "1990-01-01", nomeResponsavel: form.nomeResponsavel || null };
    const { data } = await api.post("/publico/autoatendimento/paciente", payload).catch((err) => {
      setError(getApiErrorMessage(err));
      return { data: null };
    });
    if (data) {
      setStatus(`Cadastro concluído. Protocolo: ${data.protocoloPublico}. Classificação preliminar: ${risk.cor}.`);
      navigate(`/acompanhar/${data.protocoloPublico}`);
    }
  }

  const currentStep = FLOW[current];

  return (
    <div className="min-h-screen bg-[#070d0c]">
      <div className="mx-auto max-w-6xl p-4 md:p-6">
      <header className="panel mb-4">
        <h1 className="text-xl font-extrabold text-[#ecf7f3]">Autoatendimento com IA de triagem</h1>
        <p className="text-sm text-[#96afa8]">Converse com a assistente para gerar resumo clínico inicial e classificação preliminar de risco.</p>
      </header>

      <div className="grid gap-4 xl:grid-cols-2">
        <section className="panel">
          <h2 className="text-base font-bold text-[#e9f5f1]">1. Identificação</h2>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <input className="field" placeholder="Nome completo" value={form.nomeCompleto} onChange={(e) => setForm({ ...form, nomeCompleto: e.target.value })} required />
            <input className="field" placeholder="CPF" value={form.cpf} onChange={(e) => setForm({ ...form, cpf: formatCpf(e.target.value) })} required />
            <input className="field" type="date" value={form.dataNascimento} onChange={(e) => setForm({ ...form, dataNascimento: e.target.value })} required />
            <select className="field" value={form.sexo} onChange={(e) => setForm({ ...form, sexo: e.target.value })} required>
              <option value="">Sexo</option>
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
              <option value="NaoQueroIdentificar">Não quero identificar</option>
            </select>
            <input className="field" placeholder="Telefone" value={form.telefone} onChange={(e) => setForm({ ...form, telefone: formatPhone(e.target.value) })} required />
            <input className="field" placeholder="Endereço" value={form.endereco} onChange={(e) => setForm({ ...form, endereco: e.target.value })} required />

            <div className="relative md:col-span-2">
              <input
                className="field"
                placeholder="Digite para buscar cidade de SP"
                value={cityQuery}
                onChange={(e) => {
                  const value = e.target.value;
                  setCityQuery(value);
                  setForm((prev) => ({ ...prev, cidade: value }));
                }}
                list="cidades-sp-list"
                required
              />
              <datalist id="cidades-sp-list">
                {cidadesFiltradas.map((x) => <option key={x.cidade} value={x.cidade} />)}
              </datalist>
            </div>

            <select className="field" value={form.unidadeUpa} onChange={(e) => setForm({ ...form, unidadeUpa: e.target.value })} required>
              <option value="">UPA (simulação)</option>
              {unidades.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
            <input className="field" value={form.uf} readOnly />
          </div>
        </section>

        <section className="panel">
          <h2 className="text-base font-bold text-[#e9f5f1]">2. Chat de triagem</h2>
          <div
            className="mt-3 h-[360px] overflow-y-auto rounded-lg border border-[#2a433d] bg-[#11211d] p-3"
            style={{ scrollbarGutter: "stable" }}
          >
            <div className="space-y-2">
              {chat.map((item, idx) => (
                <div
                  key={`${item.role}-${idx}`}
                  className={`max-w-[90%] rounded-lg px-3 py-2.5 text-sm leading-relaxed ${
                    item.role === "bot"
                      ? "border border-[#35564d] bg-[#19312b] text-[#e5f3ee]"
                      : "ml-auto border border-emerald-300/40 bg-emerald-500 text-[#042017]"
                  }`}
                >
                  {item.text}
                </div>
              ))}
            </div>
          </div>

          {!finished && (
            <div className="mt-3 space-y-2">
              {currentStep?.type === "choice" ? (
                <div className="flex flex-wrap gap-2">
                  {currentStep.options.map((opt) => (
                    <button key={opt} type="button" className="btn btn-neutral" onClick={() => registerAnswer(opt)}>{opt}</button>
                  ))}
                </div>
              ) : (
                <>
                  <textarea className="field" rows={3} value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Digite sua resposta" />
                  <button type="button" onClick={() => registerAnswer(chatInput)} className="btn btn-primary">Enviar</button>
                </>
              )}
            </div>
          )}

          <div className="mt-3 rounded-lg border border-amber-400/35 bg-amber-950/25 p-3">
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-amber-200">Risco preliminar sugerido</p>
            <p className="mt-1 text-sm font-bold text-amber-200">{risk.cor}</p>
            <p className="text-sm leading-relaxed text-amber-100">{risk.justificativa}</p>
          </div>
        </section>
      </div>

      <form className="panel mt-4" onSubmit={onSubmit}>
        <h2 className="text-base font-bold text-[#e8f5f1]">3. Resumo e entrada na fila</h2>
        <div className="mt-2 rounded-lg border border-[#2a433d] bg-[#132522] p-3 text-sm leading-relaxed text-[#dcece7]">{resumo || "Resumo será gerado ao longo da conversa."}</div>
        <div className="mt-3 min-h-[44px]">
          {status && <div className="rounded-md border border-emerald-400/40 bg-emerald-950/25 p-2 text-sm text-emerald-200">{status}</div>}
          {error && <div className="rounded-md border border-red-400/40 bg-red-950/25 p-2 text-sm text-red-200">{error}</div>}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="submit" className="btn btn-primary">Entrar na fila</button>
          <Link to="/login" className="btn btn-neutral">Voltar ao login profissional</Link>
        </div>
      </form>
    </div>
    </div>
  );
}
