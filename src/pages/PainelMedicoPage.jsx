import { useEffect, useMemo, useState } from "react";
import { Activity, ClipboardList, FileClock } from "lucide-react";
import { api } from "../api/client";
import RiskBadge from "../components/ui/RiskBadge";
import PageHeader from "../components/ui/PageHeader";
import { useFilaStore } from "../store/filaStore";

export default function PainelMedicoPage() {
  const { fila, loadFila, startRealtime } = useFilaStore();
  const [selectedId, setSelectedId] = useState("");
  const [evolucao, setEvolucao] = useState("Paciente evoluindo sem sinais de instabilidade.");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    loadFila();
    startRealtime();
    const id = setInterval(() => loadFila(), 8000);
    return () => clearInterval(id);
  }, [loadFila, startRealtime]);

  const filaAtendimento = useMemo(() => fila.filter((p) => p.status === "AguardandoAtendimento" || p.status === "EmAtendimento"), [fila]);
  const emAtendimento = useMemo(() => filaAtendimento.find((p) => p.status === "EmAtendimento") || null, [filaAtendimento]);
  const filaPendente = useMemo(() => filaAtendimento.filter((p) => p.status === "AguardandoAtendimento"), [filaAtendimento]);

  const atual = useMemo(() => {
    if (emAtendimento) return emAtendimento;
    if (selectedId) return filaPendente.find((p) => String(p.pacienteId) === String(selectedId)) || null;
    return filaPendente[0] || null;
  }, [emAtendimento, filaPendente, selectedId]);

  useEffect(() => {
    if (!atual) return;
    setSelectedId(String(atual.pacienteId));
  }, [atual?.pacienteId]);

  async function run(action) {
    if (!atual) return;

    if (action === "iniciar") {
      const ok = await api.post("/atendimentos/iniciar", atual.pacienteId).then(() => true).catch(() => false);
      setMsg(ok ? `Atendimento iniciado para ${atual.nomePaciente}.` : "Nao foi possivel iniciar o atendimento.");
      await loadFila();
      return;
    }

    if (atual.status !== "EmAtendimento") {
      setMsg("Selecione um paciente em atendimento para finalizar ou encaminhar.");
      return;
    }

    const payload = { pacienteId: atual.pacienteId, evolucao };
    const ok = await api.post(`/atendimentos/${action}`, payload).then(() => true).catch(() => false);
    setMsg(ok ? `Atendimento ${action} com sucesso.` : `Nao foi possivel ${action} atendimento.`);
    await loadFila();
  }

  async function callNext() {
    if (emAtendimento) {
      setMsg("Ja existe paciente em atendimento. Finalize ou encaminhe antes de chamar o proximo.");
      return;
    }
    const ok = await api.post("/fila/proximo/chamar").then(() => true).catch(() => false);
    setMsg(ok ? "Proximo paciente chamado para atendimento." : "Nao foi possivel chamar o proximo paciente.");
    await loadFila();
  }

  return (
    <div className="page-wrap space-y-4">
      <PageHeader
        title="Painel profissional"
        subtitle="Atendimento medico com contexto clinico imediato e conduta em poucos cliques"
        actions={<button className="btn btn-primary" onClick={callNext}>Chamar proximo</button>}
      />

      {!atual && <div className="panel-soft text-sm text-[#64748B]">Nenhum paciente aguardando atendimento no momento.</div>}

      {atual && (
        <div className="grid gap-4 xl:grid-cols-3">
          <section className="panel xl:col-span-2">
            <h2 className="text-lg font-bold text-[#0F172A]">Paciente atual: {atual.nomePaciente}</h2>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <RiskBadge risk={atual.corRisco} />
              <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.08em] text-[#16A34A]"><Activity size={13} />{atual.status}</span>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                <p className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.1em] text-[#475569]"><ClipboardList size={13} className="text-[#16A34A]" />Triagem e sintomas</p>
                <p className="mt-1 text-sm text-[#0F172A]">{atual.queixaPrincipal || "Pre-triagem IA concluida"}</p>
              </div>
              <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                <p className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.1em] text-[#475569]"><FileClock size={13} className="text-[#16A34A]" />Historico resumido</p>
                <p className="mt-1 text-sm text-[#0F172A]">Sem historico estruturado disponivel neste endpoint.</p>
              </div>
            </div>

            <label className="label mt-4">Evolucao clinica</label>
            <textarea className="field" rows={4} value={evolucao} onChange={(e) => setEvolucao(e.target.value)} />

            {msg && <p className="mt-3 rounded-md border border-[#E2E8F0] bg-[#F8FAFC] p-2 text-sm text-[#475569]">{msg}</p>}

            <div className="mt-3 flex flex-wrap gap-2">
              <button className="btn btn-primary" onClick={() => run("iniciar")}>Iniciar atendimento</button>
              <button className="btn !border-[#BBF7D0] !bg-[#DCFCE7] !text-[#166534] hover:!bg-[#bbf7d0]" onClick={() => run("finalizar")}>Finalizar</button>
              <button className="btn !border-[#FDE68A] !bg-[#FFFBEB] !text-[#B45309] hover:!bg-[#FEF3C7]" onClick={() => run("encaminhar")}>Encaminhar</button>
            </div>
          </section>

          <aside className="panel-soft">
            <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-[#475569]">Fila para atendimento ({filaPendente.length})</h3>
            <ul className="mt-2 space-y-2">
              {filaPendente.map((p) => (
                <li
                  key={p.pacienteId}
                  className={`cursor-pointer rounded-xl border p-2.5 text-sm transition ${String(p.pacienteId) === String(atual.pacienteId)
                    ? "border-[#BBF7D0] bg-[#F0FDF4]"
                    : "border-[#E2E8F0] bg-white hover:border-[#cbd5e1]"}`}
                  onClick={() => setSelectedId(String(p.pacienteId))}
                >
                  <p className="font-semibold text-[#0F172A]">{p.nomePaciente}</p>
                  <div className="mt-1 flex items-center justify-between gap-2">
                    <p className="text-xs text-[#64748B]">{p.status}</p>
                    <RiskBadge risk={p.corRisco} />
                  </div>
                </li>
              ))}
              {filaPendente.length === 0 && <li className="rounded-xl border border-[#E2E8F0] bg-white p-2.5 text-sm text-[#64748B]">Nenhum paciente aguardando atendimento.</li>}
            </ul>
          </aside>
        </div>
      )}
    </div>
  );
}
