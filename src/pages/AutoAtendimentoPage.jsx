import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useAuthStore } from "../store/authStore";

const PROFILE_KEY = "patient_profile";

const CHAT_FLOW = [
  { id: "queixaPrincipal", question: "Em uma frase, qual sua queixa principal agora?", type: "text" },
  { id: "sintomasRelatados", question: "Quais outros sintomas voce percebeu?", type: "text" },
  { id: "intensidadeDor", question: "Qual a intensidade da dor (0 a 10)?", type: "choice", options: ["0", "2", "4", "6", "8", "10"] },
  { id: "tempoSintomasMinutos", question: "Ha quantos minutos os sintomas comecaram?", type: "text" },
  { id: "observacoes", question: "Alguma observacao clinica importante? (alergias, doencas, medicacoes)", type: "text" }
];

function normalize(text) {
  return String(text || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function evaluateRisk(answers) {
  const dor = Number(answers.intensidadeDor || 0);
  const text = `${answers.queixaPrincipal || ""} ${answers.sintomasRelatados || ""} ${answers.observacoes || ""}`.toLowerCase();

  if (dor >= 9 || text.includes("falta de ar") || text.includes("dor no peito") || text.includes("desmaio")) {
    return "Laranja";
  }
  if (dor >= 7 || text.includes("febre") || text.includes("vomito")) {
    return "Amarelo";
  }
  if (dor >= 4) {
    return "Verde";
  }
  return "Azul";
}

export default function AutoAtendimentoPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [locais, setLocais] = useState([]);
  const [perfil, setPerfil] = useState(null);
  const [carregandoPerfil, setCarregandoPerfil] = useState(true);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const [chat, setChat] = useState([{ role: "bot", text: CHAT_FLOW[0].question }]);
  const [stepIndex, setStepIndex] = useState(0);
  const [chatInput, setChatInput] = useState("");
  const [answers, setAnswers] = useState({});

  const [form, setForm] = useState({
    unidadeUpa: "",
    queixaPrincipal: "",
    sintomasRelatados: "",
    intensidadeDor: 4,
    tempoSintomasMinutos: 60,
    observacoes: ""
  });

  useEffect(() => {
    api.get("/publico/cidades-sp-upa").then((r) => setLocais(r.data || [])).catch(() => setLocais([]));
  }, []);

  useEffect(() => {
    let ativo = true;

    async function carregarPerfil() {
      setCarregandoPerfil(true);

      const cachedRaw = localStorage.getItem(PROFILE_KEY);
      let cached = null;
      if (cachedRaw) {
        try {
          cached = JSON.parse(cachedRaw);
        } catch {
          cached = null;
        }
      }

      try {
        const { data } = await api.get("/pacientes");
        const lista = Array.isArray(data) ? data : Array.isArray(data?.value) ? data.value : [];

        const encontrado = lista.find((p) => normalize(p.nomeCompleto) === normalize(user?.nome));
        if (encontrado?.id) {
          const detalhe = await api.get(`/pacientes/${encontrado.id}`).then((r) => r.data).catch(() => null);
          if (detalhe && ativo) {
            const perfilReal = {
              nomeCompleto: detalhe.nomeCompleto,
              cpf: detalhe.cpf,
              dataNascimento: String(detalhe.dataNascimento || ""),
              sexo: detalhe.sexo,
              telefone: detalhe.telefone,
              endereco: detalhe.endereco,
              cidade: detalhe.cidade,
              uf: detalhe.uf,
              nomeResponsavel: detalhe.nomeResponsavel || ""
            };

            setPerfil(perfilReal);
            setForm((prev) => ({ ...prev, unidadeUpa: detalhe.unidadeUpa || prev.unidadeUpa }));

            localStorage.setItem(
              PROFILE_KEY,
              JSON.stringify({
                ...cached,
                ...perfilReal,
                convenio: detalhe.unidadeUpa || cached?.convenio || ""
              })
            );
            setCarregandoPerfil(false);
            return;
          }
        }
      } catch {
        // fallback para cache
      }

      if (ativo) {
        if (cached) {
          setPerfil({
            nomeCompleto: cached.nomeCompleto,
            cpf: cached.cpf,
            dataNascimento: cached.dataNascimento,
            sexo: cached.sexo || "NaoQueroIdentificar",
            telefone: cached.telefone,
            endereco: cached.endereco,
            cidade: cached.cidade,
            uf: cached.uf || "SP",
            nomeResponsavel: cached.nomeResponsavel || ""
          });
          setForm((prev) => ({ ...prev, unidadeUpa: cached.convenio || prev.unidadeUpa }));
        }
        setCarregandoPerfil(false);
      }
    }

    carregarPerfil();
    return () => {
      ativo = false;
    };
  }, [user?.nome]);

  const unidades = useMemo(() => {
    const cidade = perfil?.cidade;
    if (!cidade) return [];
    return locais.find((x) => normalize(x.cidade) === normalize(cidade))?.unidadesUpa || [];
  }, [locais, perfil?.cidade]);

  const chatDone = stepIndex >= CHAT_FLOW.length;
  const currentStep = CHAT_FLOW[stepIndex];

  const resumo = useMemo(() => {
    return [
      form.queixaPrincipal && `Queixa: ${form.queixaPrincipal}`,
      form.sintomasRelatados && `Sintomas: ${form.sintomasRelatados}`,
      `Dor: ${form.intensidadeDor}/10`,
      `Tempo: ${form.tempoSintomasMinutos} min`,
      form.observacoes && `Obs: ${form.observacoes}`
    ].filter(Boolean).join(" | ");
  }, [form]);

  const riscoSugerido = useMemo(() => evaluateRisk(answers), [answers]);

  function answerChat(value) {
    if (chatDone) return;
    const clean = String(value || "").trim();
    if (!clean) return;

    const step = CHAT_FLOW[stepIndex];
    const numeric = step.id === "intensidadeDor" || step.id === "tempoSintomasMinutos";

    const nextAnswers = { ...answers, [step.id]: clean };
    setAnswers(nextAnswers);

    setForm((prev) => ({
      ...prev,
      [step.id]: numeric ? Number(clean) : clean
    }));

    const nextChat = [...chat, { role: "user", text: clean }];
    const nextIndex = stepIndex + 1;

    if (nextIndex < CHAT_FLOW.length) {
      nextChat.push({ role: "bot", text: CHAT_FLOW[nextIndex].question });
    } else {
      nextChat.push({ role: "bot", text: "Entrevista concluida. Ja gerei um resumo para apoiar a triagem." });
    }

    setChat(nextChat);
    setStepIndex(nextIndex);
    setChatInput("");
  }

  async function submit(e) {
    e.preventDefault();
    setStatus("");
    setError("");

    if (!perfil?.nomeCompleto || !perfil?.cpf || !perfil?.dataNascimento || !perfil?.cidade || !perfil?.uf) {
      setError("Nao encontramos seu cadastro completo. Procure a recepcao para vincular seus dados e tente novamente.");
      return;
    }

    if (!form.unidadeUpa.trim()) {
      setError("Selecione a unidade UPA.");
      return;
    }

    if (!chatDone || !form.queixaPrincipal || !form.sintomasRelatados) {
      setError("Finalize o chat de pre-triagem para entrar na fila.");
      return;
    }

    const payload = {
      nomeCompleto: perfil.nomeCompleto,
      cpf: perfil.cpf,
      dataNascimento: perfil.dataNascimento,
      sexo: perfil.sexo || "NaoQueroIdentificar",
      telefone: perfil.telefone || "",
      endereco: perfil.endereco || "",
      cidade: perfil.cidade,
      uf: perfil.uf,
      unidadeUpa: form.unidadeUpa,
      nomeResponsavel: perfil.nomeResponsavel || null,
      queixaPrincipal: form.queixaPrincipal,
      sintomasRelatados: `${form.sintomasRelatados || ""} ${form.observacoes || ""}`.trim(),
      corSugerida: riscoSugerido
    };

    const { data } = await api.post("/publico/autoatendimento/paciente", payload).catch((err) => {
      const message = err?.response?.data;
      setError(typeof message === "string" ? message : "Nao foi possivel concluir sua pre-triagem.");
      return { data: null };
    });

    if (!data) return;

    setStatus(`Protocolo gerado: ${data.protocoloPublico}`);
    localStorage.setItem("last_protocol", data.protocoloPublico);
    navigate(`/acompanhar/${data.protocoloPublico}`);
  }

  return (
    <div className="page-wrap space-y-4">
      <header className="panel">
        <h1 className="text-2xl font-extrabold text-[#0F172A]">Iniciar pre-triagem</h1>
        <p className="text-sm text-[#475569]">Cadastro carregado automaticamente. Converse com a IA e selecione a UPA.</p>
      </header>

      {carregandoPerfil && <div className="panel-soft text-sm text-[#64748B]">Carregando cadastro do paciente...</div>}

      {!carregandoPerfil && !perfil && (
        <div className="panel-soft space-y-3">
          <p className="text-sm text-[#475569]">Nao encontramos seu cadastro completo para iniciar a triagem. Procure a recepcao para vincular seu cadastro.</p>
          <div className="flex gap-2">
            <Link to="/app/paciente/fila" className="btn btn-primary">Acompanhar fila</Link>
            <Link to="/app/paciente/triagem" className="btn btn-neutral">Tentar novamente</Link>
          </div>
        </div>
      )}

      {!carregandoPerfil && perfil && (
        <form className="grid gap-4 xl:grid-cols-3" onSubmit={submit}>
          <section className="panel xl:col-span-2 space-y-5">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-[#475569]">Cadastro identificado</h2>
              <div className="mt-3 grid gap-2 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3 text-sm text-[#334155] md:grid-cols-2">
                <p><strong>Nome:</strong> {perfil.nomeCompleto}</p>
                <p><strong>CPF:</strong> {perfil.cpf}</p>
                <p><strong>Nascimento:</strong> {perfil.dataNascimento}</p>
                <p><strong>Cidade/UF:</strong> {perfil.cidade} - {perfil.uf}</p>
              </div>
            </div>

            <div>
              <label className="label">UPA</label>
              {unidades.length > 0 ? (
                <select className="field" value={form.unidadeUpa} onChange={(e) => setForm({ ...form, unidadeUpa: e.target.value })} required>
                  <option value="">Selecione</option>
                  {unidades.map((u) => <option key={u} value={u}>{u}</option>)}
                </select>
              ) : (
                <input className="field" value={form.unidadeUpa} onChange={(e) => setForm({ ...form, unidadeUpa: e.target.value })} placeholder="Digite a unidade UPA" required />
              )}
            </div>

            <div>
              <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-[#475569]">Chat de pre-triagem IA</h2>
              <div className="mt-3 rounded-xl border border-[#E2E8F0] bg-white p-3">
                <div className="h-[300px] space-y-2 overflow-y-auto rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                  {chat.map((m, idx) => (
                    <div
                      key={`${m.role}-${idx}`}
                      className={`max-w-[90%] rounded-lg px-3 py-2 text-sm ${m.role === "bot"
                        ? "border border-[#E2E8F0] bg-white text-[#334155]"
                        : "ml-auto border border-[#BBF7D0] bg-[#DCFCE7] text-[#166534]"}`}
                    >
                      {m.text}
                    </div>
                  ))}
                </div>

                {!chatDone && (
                  <div className="mt-3 space-y-2">
                    {currentStep?.type === "choice" ? (
                      <div className="flex flex-wrap gap-2">
                        {currentStep.options.map((opt) => (
                          <button key={opt} type="button" className="btn btn-neutral" onClick={() => answerChat(opt)}>{opt}</button>
                        ))}
                      </div>
                    ) : (
                      <>
                        <textarea className="field" rows={2} value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Digite sua resposta" />
                        <button type="button" className="btn btn-primary" onClick={() => answerChat(chatInput)}>Enviar resposta</button>
                      </>
                    )}
                  </div>
                )}

                <div className="mt-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-2 text-sm text-[#334155]">
                  <p><strong>Risco sugerido:</strong> {riscoSugerido}</p>
                  <p className="mt-1 text-xs text-[#64748B]">Sugestao automatica para priorizacao inicial. A classificacao final e da equipe clinica.</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3">
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#475569]">Resumo gerado</p>
              <p className="mt-1 text-sm text-[#334155]">{resumo || "Conclua o chat para gerar o resumo clinico."}</p>
            </div>

            {status && <p className="rounded-md border border-emerald-200 bg-emerald-50 p-2 text-sm text-emerald-700">{status}</p>}
            {error && <p className="rounded-md border border-red-200 bg-red-50 p-2 text-sm text-red-700">{error}</p>}

            <div className="flex flex-wrap gap-2">
              <button type="submit" className="btn btn-primary">Entrar na fila</button>
              <Link to="/app/paciente/fila" className="btn btn-neutral">Acompanhar protocolo</Link>
            </div>
          </section>

          <aside className="panel">
            <h3 className="text-sm font-bold text-[#0F172A]">Fluxo</h3>
            <ol className="mt-3 space-y-2 text-sm text-[#475569]">
              <li className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-2">1. Cadastro carregado automaticamente</li>
              <li className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-2">2. Seleciona UPA</li>
              <li className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-2">3. Conversa no chat com IA</li>
              <li className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-2">4. Recebe protocolo e acompanha fila</li>
            </ol>
          </aside>
        </form>
      )}
    </div>
  );
}
