import { useEffect, useState } from "react";
import { BrainCircuit, ClipboardCheck, HeartPulse } from "lucide-react";
import { api } from "../api/client";
import AlertBanner from "../components/ui/AlertBanner";
import PageHeader from "../components/ui/PageHeader";

function isTriagemSelectableStatus(status) {
  return status === "AguardandoTriagem" || status === "EmTriagem" || status === "AguardandoAtendimento";
}

export default function TriagemPage() {
  const [pacientes, setPacientes] = useState([]);
  const [loadingPacientes, setLoadingPacientes] = useState(true);
  const [erroPacientes, setErroPacientes] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [classificacaoFinal, setClassificacaoFinal] = useState("AUTO");
  const [justificativaClassificacao, setJustificativaClassificacao] = useState("");
  const [form, setForm] = useState({
    pacienteId: "", queixaPrincipal: "", sintomasRelatados: "", intensidadeDor: 4, tempoSintomasMinutos: 60, observacoes: "",
    sinaisVitais: { pressaoArterial: "120x80", frequenciaCardiaca: 80, frequenciaRespiratoria: 18, temperatura: 36.8, saturacaoOxigenio: 98 }
  });

  async function loadPacientes() {
    setLoadingPacientes(true);
    setErroPacientes("");
    try {
      const r = await api.get("/fila");
      const payload = r?.data;
      const list = Array.isArray(payload) ? payload : Array.isArray(payload?.value) ? payload.value : [];
      const pendentesTriagem = list
        .filter((p) => isTriagemSelectableStatus(p.status))
        .map((p) => ({
          id: p.pacienteId,
          nomeCompleto: p.nomePaciente,
          protocoloPublico: p.protocoloPublico
        }));
      setPacientes(pendentesTriagem);
      const prefillId = localStorage.getItem("triagem_prefill_paciente_id");
      if (prefillId && pendentesTriagem.some((p) => String(p.id) === String(prefillId))) {
        setForm((prev) => ({ ...prev, pacienteId: prefillId }));
        localStorage.removeItem("triagem_prefill_paciente_id");
      }
    } catch {
      setPacientes([]);
      setErroPacientes("Nao foi possivel carregar a lista de pacientes.");
    } finally {
      setLoadingPacientes(false);
    }
  }

  useEffect(() => {
    loadPacientes();
  }, []);

  async function submit(e) {
    e.preventDefault();
    setError("");
    const { data } = await api.post("/triagens", form).catch(() => ({ data: null }));
    if (!data) return setError("Não foi possível registrar triagem.");

    const triagemId = data?.id || data?.Id;
    const corSugerida = String(data?.corSugerida || data?.CorSugerida || "");
    const precisaAjusteManual = classificacaoFinal !== "AUTO" && classificacaoFinal !== corSugerida;

    if (triagemId && precisaAjusteManual) {
      const justificativa = justificativaClassificacao.trim() || "Ajuste manual realizado pela equipe clinica.";
      const ok = await api.put(`/triagens/${triagemId}/classificacao`, null, {
        params: { corNova: classificacaoFinal, justificativa }
      }).then(() => true).catch(() => false);

      if (!ok) {
        return setError("Triagem registrada, mas nao foi possivel aplicar a classificacao manual.");
      }
    }

    setResult(data);
    setForm((prev) => ({ ...prev, pacienteId: "", queixaPrincipal: "", sintomasRelatados: "", observacoes: "" }));
    setClassificacaoFinal("AUTO");
    setJustificativaClassificacao("");
    loadPacientes();
  }

  return (
    <div className="page-wrap space-y-4">
      <PageHeader title="Triagem de enfermagem" subtitle="Fluxo clínico rápido, estruturado e com suporte inteligente" />
      <form className="grid gap-4 xl:grid-cols-3" onSubmit={submit}>
        <section className="panel xl:col-span-2">
          <div className="mb-3 flex items-center gap-2"><ClipboardCheck size={16} className="text-[#16A34A]" /><h2 className="text-base font-bold text-[#0F172A]">Coleta clínica</h2></div>

          <label className="label">Paciente</label>
          <select className="field" value={form.pacienteId} onChange={(e) => setForm({ ...form, pacienteId: e.target.value })} required>
            <option value="">{loadingPacientes ? "Carregando pacientes..." : "Selecione"}</option>
            {pacientes.map((p) => <option key={p.id} value={p.id}>{p.nomeCompleto} ({p.protocoloPublico})</option>)}
          </select>
          {!loadingPacientes && !erroPacientes && pacientes.length === 0 && <p className="mt-2 text-xs text-[#64748B]">Nenhum paciente encontrado para triagem.</p>}
          {erroPacientes && <p className="mt-2 text-xs text-[#DC2626]">{erroPacientes}</p>}

          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="label">Queixa principal</label>
              <input className="field" value={form.queixaPrincipal} onChange={(e) => setForm({ ...form, queixaPrincipal: e.target.value })} required />
            </div>
            <div className="md:col-span-2">
              <label className="label">Sintomas relatados</label>
              <textarea className="field" rows={3} value={form.sintomasRelatados} onChange={(e) => setForm({ ...form, sintomasRelatados: e.target.value })} required />
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
            <div className="mb-3 flex items-center gap-2"><HeartPulse size={16} className="text-[#16A34A]" /><h3 className="text-sm font-bold uppercase tracking-[0.12em] text-[#475569]">Sinais vitais</h3></div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="grid content-start gap-2"><label className="label min-h-[3.25rem]">Dor (0-10)</label><input className="field" type="number" min="0" max="10" value={form.intensidadeDor} onChange={(e) => setForm({ ...form, intensidadeDor: Number(e.target.value) })} /></div>
              <div className="grid content-start gap-2"><label className="label min-h-[3.25rem]">Tempo de sintomas (min)</label><input className="field" type="number" min="0" value={form.tempoSintomasMinutos} onChange={(e) => setForm({ ...form, tempoSintomasMinutos: Number(e.target.value) })} /></div>
              <div className="grid content-start gap-2"><label className="label min-h-[3.25rem]">Pressão arterial (mmHg)</label><input className="field" placeholder="120x80" value={form.sinaisVitais.pressaoArterial} onChange={(e) => setForm({ ...form, sinaisVitais: { ...form.sinaisVitais, pressaoArterial: e.target.value } })} /></div>
              <div className="grid content-start gap-2"><label className="label min-h-[3.25rem]">Freq. cardíaca (bpm)</label><input className="field" type="number" min="0" value={form.sinaisVitais.frequenciaCardiaca} onChange={(e) => setForm({ ...form, sinaisVitais: { ...form.sinaisVitais, frequenciaCardiaca: Number(e.target.value) } })} /></div>
              <div className="grid content-start gap-2"><label className="label min-h-[3.25rem]">Freq. respiratória (irpm)</label><input className="field" type="number" min="0" value={form.sinaisVitais.frequenciaRespiratoria} onChange={(e) => setForm({ ...form, sinaisVitais: { ...form.sinaisVitais, frequenciaRespiratoria: Number(e.target.value) } })} /></div>
              <div className="grid content-start gap-2"><label className="label min-h-[3.25rem]">Temperatura (C)</label><input className="field" type="number" step="0.1" value={form.sinaisVitais.temperatura} onChange={(e) => setForm({ ...form, sinaisVitais: { ...form.sinaisVitais, temperatura: Number(e.target.value) } })} /></div>
              <div className="grid content-start gap-2"><label className="label min-h-[3.25rem]">Saturação O2 (%)</label><input className="field" type="number" min="0" max="100" value={form.sinaisVitais.saturacaoOxigenio} onChange={(e) => setForm({ ...form, sinaisVitais: { ...form.sinaisVitais, saturacaoOxigenio: Number(e.target.value) } })} /></div>
              <div className="hidden xl:block" aria-hidden="true" />
            </div>
          </div>

          <label className="label mt-3">Observações</label>
          <textarea className="field" rows={3} value={form.observacoes} onChange={(e) => setForm({ ...form, observacoes: e.target.value })} />

          <div className="mt-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
            <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-[#475569]">Classificacao final (equipe clinica)</h3>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <div>
                <label className="label">Gravidade</label>
                <select className="field" value={classificacaoFinal} onChange={(e) => setClassificacaoFinal(e.target.value)}>
                  <option value="AUTO">Usar sugestao da IA</option>
                  <option value="Vermelho">Vermelho</option>
                  <option value="Laranja">Laranja</option>
                  <option value="Amarelo">Amarelo</option>
                  <option value="Verde">Verde</option>
                  <option value="Azul">Azul</option>
                </select>
              </div>
              {classificacaoFinal !== "AUTO" && (
                <div>
                  <label className="label">Justificativa clinica</label>
                  <input
                    className="field"
                    value={justificativaClassificacao}
                    onChange={(e) => setJustificativaClassificacao(e.target.value)}
                    placeholder="Ex.: sinais de agravamento observados na avaliacao"
                  />
                </div>
              )}
            </div>
          </div>

          {error && <div className="mt-3"><AlertBanner tone="danger">{error}</AlertBanner></div>}

          <button className="btn btn-primary mt-4">Registrar triagem</button>
        </section>

        <aside className="panel">
          <div className="mb-3 flex items-center gap-2"><BrainCircuit size={16} className="text-[#16A34A]" /><h2 className="text-base font-bold text-[#0F172A]">Apoio de IA</h2></div>
          <p className="text-sm text-[#475569]">A IA organiza sinais de risco para apoiar decisão. A classificação final permanece com a equipe clínica.</p>
          {!result && <div className="mt-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3 text-sm text-[#475569]">Aguardando envio da triagem para gerar recomendação.</div>}
          {result && (
            <div className="mt-3 space-y-2">
              <AlertBanner tone="warning">Risco sugerido: <strong>{result.corSugerida || result.CorSugerida}</strong></AlertBanner>
              <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3 text-sm text-[#475569]">Revisar sinais vitais alterados e fatores de agravamento antes de confirmar a classificação institucional.</div>
            </div>
          )}
        </aside>
      </form>
    </div>
  );
}

