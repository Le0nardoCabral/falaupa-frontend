import { useEffect, useState } from "react";
import { BrainCircuit, ClipboardCheck, HeartPulse } from "lucide-react";
import { api } from "../api/client";
import AlertBanner from "../components/ui/AlertBanner";
import PageHeader from "../components/ui/PageHeader";

export default function TriagemPage() {
  const [pacientes, setPacientes] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    pacienteId: "", queixaPrincipal: "", sintomasRelatados: "", intensidadeDor: 4, tempoSintomasMinutos: 60, observacoes: "",
    sinaisVitais: { pressaoArterial: "120x80", frequenciaCardiaca: 80, frequenciaRespiratoria: 18, temperatura: 36.8, saturacaoOxigenio: 98 }
  });

  useEffect(() => { api.get("/pacientes").then((r) => setPacientes(r.data)).catch(() => setPacientes([])); }, []);

  async function submit(e) {
    e.preventDefault();
    setError("");
    const { data } = await api.post("/triagens", form).catch(() => ({ data: null }));
    if (!data) return setError("Não foi possível registrar triagem.");
    setResult(data);
  }

  return (
    <div className="page-wrap space-y-4">
      <PageHeader title="Triagem de enfermagem" subtitle="Fluxo clínico rápido, estruturado e com suporte inteligente" />
      <form className="grid gap-4 xl:grid-cols-3" onSubmit={submit}>
        <section className="panel xl:col-span-2">
          <div className="mb-3 flex items-center gap-2"><ClipboardCheck size={16} className="text-emerald-300" /><h2 className="text-base font-bold text-[#ebf6f2]">Coleta clínica</h2></div>

          <label className="label">Paciente</label>
          <select className="field" value={form.pacienteId} onChange={(e) => setForm({ ...form, pacienteId: e.target.value })} required>
            <option value="">Selecione</option>
            {pacientes.map((p) => <option key={p.id} value={p.id}>{p.nomeCompleto} ({p.protocoloPublico})</option>)}
          </select>

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

          <div className="mt-4 rounded-xl border border-[#29423c] bg-[#132522] p-3">
            <div className="mb-2 flex items-center gap-2"><HeartPulse size={16} className="text-emerald-300" /><h3 className="text-sm font-bold uppercase tracking-[0.12em] text-[#9ab3ac]">Sinais vitais</h3></div>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <div><label className="label">Dor (0-10)</label><input className="field" type="number" min="0" max="10" value={form.intensidadeDor} onChange={(e) => setForm({ ...form, intensidadeDor: Number(e.target.value) })} /></div>
              <div><label className="label">Tempo de sintomas (min)</label><input className="field" type="number" min="0" value={form.tempoSintomasMinutos} onChange={(e) => setForm({ ...form, tempoSintomasMinutos: Number(e.target.value) })} /></div>
              <div><label className="label">Pressão arterial (mmHg)</label><input className="field" placeholder="120x80" value={form.sinaisVitais.pressaoArterial} onChange={(e) => setForm({ ...form, sinaisVitais: { ...form.sinaisVitais, pressaoArterial: e.target.value } })} /></div>
              <div><label className="label">Freq. cardíaca (bpm)</label><input className="field" type="number" min="0" value={form.sinaisVitais.frequenciaCardiaca} onChange={(e) => setForm({ ...form, sinaisVitais: { ...form.sinaisVitais, frequenciaCardiaca: Number(e.target.value) } })} /></div>
              <div><label className="label">Freq. respiratória (irpm)</label><input className="field" type="number" min="0" value={form.sinaisVitais.frequenciaRespiratoria} onChange={(e) => setForm({ ...form, sinaisVitais: { ...form.sinaisVitais, frequenciaRespiratoria: Number(e.target.value) } })} /></div>
              <div><label className="label">Temperatura (C)</label><input className="field" type="number" step="0.1" value={form.sinaisVitais.temperatura} onChange={(e) => setForm({ ...form, sinaisVitais: { ...form.sinaisVitais, temperatura: Number(e.target.value) } })} /></div>
              <div><label className="label">Saturação O2 (%)</label><input className="field" type="number" min="0" max="100" value={form.sinaisVitais.saturacaoOxigenio} onChange={(e) => setForm({ ...form, sinaisVitais: { ...form.sinaisVitais, saturacaoOxigenio: Number(e.target.value) } })} /></div>
            </div>
          </div>

          <label className="label mt-3">Observações</label>
          <textarea className="field" rows={3} value={form.observacoes} onChange={(e) => setForm({ ...form, observacoes: e.target.value })} />
          {error && <div className="mt-3"><AlertBanner tone="danger">{error}</AlertBanner></div>}

          <button className="btn btn-primary mt-4">Registrar triagem</button>
        </section>

        <aside className="panel">
          <div className="mb-3 flex items-center gap-2"><BrainCircuit size={16} className="text-emerald-300" /><h2 className="text-base font-bold text-[#eaf5f1]">Apoio de IA</h2></div>
          <p className="text-sm text-[#96afa8]">A IA organiza sinais de risco para apoiar decisão. A classificação final permanece com a equipe clínica.</p>
          {!result && <div className="mt-3 rounded-xl border border-[#2a433d] bg-[#132522] p-3 text-sm text-[#9cb4ad]">Aguardando envio da triagem para gerar recomendação.</div>}
          {result && (
            <div className="mt-3 space-y-2">
              <AlertBanner tone="warning">Risco sugerido: <strong>{result.corSugerida || result.CorSugerida}</strong></AlertBanner>
              <div className="rounded-xl border border-[#2a433d] bg-[#132522] p-3 text-sm text-[#9cb4ad]">Revisar sinais vitais alterados e fatores de agravamento antes de confirmar a classificação institucional.</div>
            </div>
          )}
        </aside>
      </form>
    </div>
  );
}

