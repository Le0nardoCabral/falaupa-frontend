import { useEffect, useMemo, useState } from "react";
import { Activity, ClipboardList, FileClock } from "lucide-react";
import { api } from "../api/client";
import RiskBadge from "../components/ui/RiskBadge";
import PageHeader from "../components/ui/PageHeader";

export default function PainelMedicoPage() {
  const [fila, setFila] = useState([]);
  const [evolucao, setEvolucao] = useState("Paciente evoluindo sem sinais de instabilidade.");

  async function load() { const { data } = await api.get("/fila").catch(() => ({ data: [] })); setFila(data); }
  useEffect(() => { load(); }, []);

  const atual = useMemo(() => fila.find((p) => p.status === "EmAtendimento") || fila[0], [fila]);

  async function run(action) {
    if (!atual) return;
    const payload = action === "iniciar" ? atual.pacienteId : { pacienteId: atual.pacienteId, evolucao };
    await api.post(`/atendimentos/${action}`, payload).catch(() => null);
    await load();
  }

  return (
    <div className="page-wrap space-y-4">
      <PageHeader title="Painel profissional" subtitle="Atendimento médico com contexto clínico imediato e conduta em poucos cliques" />
      {!atual && <div className="panel-soft text-sm text-[#97afa8]">Nenhum paciente disponível para atendimento.</div>}
      {atual && (
        <div className="grid gap-4 xl:grid-cols-3">
          <section className="panel xl:col-span-2">
            <h2 className="text-lg font-bold text-[#eaf5f1]">Paciente atual: {atual.nomePaciente}</h2>
            <div className="mt-2 flex flex-wrap items-center gap-2"><RiskBadge risk={atual.corRisco} /><span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.08em] text-[#87a39b]"><Activity size={13} />{atual.status}</span></div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-xl border border-[#2a433d] bg-[#132522] p-3"><p className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.1em] text-[#92aba4]"><ClipboardList size={13} />Triagem e sintomas</p><p className="mt-1 text-sm text-[#d3e5df]">{atual.queixaPrincipal || "Sem descrição"}</p></div>
              <div className="rounded-xl border border-[#2a433d] bg-[#132522] p-3"><p className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.1em] text-[#92aba4]"><FileClock size={13} />Histórico resumido</p><p className="mt-1 text-sm text-[#d3e5df]">Sem alergias registradas. Último atendimento há 3 meses.</p></div>
            </div>
            <label className="label mt-4">Evolução clínica</label>
            <textarea className="field" rows={4} value={evolucao} onChange={(e) => setEvolucao(e.target.value)} />
            <div className="mt-3 flex flex-wrap gap-2">
              <button className="btn btn-primary" onClick={() => run("iniciar")}>Iniciar atendimento</button>
              <button className="btn !border-emerald-400/45 !bg-emerald-950/30 !text-emerald-200" onClick={() => run("finalizar")}>Finalizar</button>
              <button className="btn !border-amber-400/45 !bg-amber-950/30 !text-amber-200" onClick={() => run("encaminhar")}>Encaminhar</button>
            </div>
          </section>

          <aside className="panel-soft">
            <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-[#8ea8a1]">Fila priorizada</h3>
            <ul className="mt-2 space-y-2">
              {fila.slice(0, 6).map((p) => (
                <li key={p.pacienteId} className="rounded-xl border border-[#2a433d] bg-[#132522] p-2.5 text-sm">
                  <p className="font-semibold text-[#e8f5f1]">{p.nomePaciente}</p>
                  <div className="mt-1 flex items-center justify-between">
                    <p className="text-xs text-[#88a49c]">{p.status}</p>
                    <RiskBadge risk={p.corRisco} />
                  </div>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      )}
    </div>
  );
}

