import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, Clock3, Siren, Wifi } from "lucide-react";
import { api } from "../api/client";
import QueueTable from "../components/queue/QueueTable";
import ConfirmModal from "../components/ui/ConfirmModal";
import PageHeader from "../components/ui/PageHeader";
import Toast from "../components/ui/Toast";
import { EmptyState, ErrorState, LoadingState, OfflineState, SkeletonRows } from "../components/ui/ViewStates";
import { useFilaStore } from "../store/filaStore";

export default function FilaPage() {
  const navigate = useNavigate();
  const { fila, loadFila, startRealtime, loading, error, realtimeConnected } = useFilaStore();
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState("");

  useEffect(() => { loadFila(); startRealtime(); }, [loadFila, startRealtime]);
  useEffect(() => { if (!toast) return; const id = setTimeout(() => setToast(""), 2500); return () => clearTimeout(id); }, [toast]);

  const criticalCount = useMemo(() => fila.filter((p) => p.corRisco === "Vermelho" || p.corRisco === "Laranja").length, [fila]);
  const waitingAverage = useMemo(() => {
    const aguardando = fila.filter((p) => p.status !== "Finalizado" && p.status !== "Encaminhado");
    if (!aguardando.length) return 0;
    return Math.round(aguardando.reduce((sum, p) => sum + (p.minutosEspera || 0), 0) / aguardando.length);
  }, [fila]);

  async function startAttendance(p) {
    if (p.status === "Finalizado" || p.status === "Encaminhado" || p.status === "Cancelado") {
      setToast("Esse paciente ja nao esta disponivel para atendimento.");
      setSelected(null);
      return;
    }
    await api.post("/atendimentos/iniciar", p.pacienteId).catch(() => null);
    setToast(`Atendimento iniciado: ${p.nomePaciente}`);
    setSelected(null);
    await loadFila();
  }

  async function callPatient(p) {
    const nextStatus = "EmAtendimento";
    const ok = await api.post(`/fila/${p.pacienteId}/status?status=${nextStatus}`).then(() => true).catch(() => false);
    if (!ok) return setToast("Nao foi possivel atualizar o status do paciente.");
    setToast(`Paciente chamado: ${p.nomePaciente}`);
    await loadFila();
  }

  async function callNext() {
    const ok = await api.post("/fila/proximo/chamar").then(() => true).catch(() => false);
    if (!ok) return setToast("Nao foi possivel chamar o proximo paciente.");
    setToast("Proximo paciente chamado.");
    await loadFila();
  }

  return (
    <div className="page-wrap space-y-3">
      <PageHeader
        title="Fila em Tempo Real"
        subtitle="Prioridade Manchester, SLA e andamento de atendimento em atualizacao continua"
        actions={
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e8edf2] bg-white px-3 py-2 text-xs font-bold text-[#6b7280]"><Wifi size={14} className={realtimeConnected ? "text-emerald-600" : "text-amber-600"} />Realtime {realtimeConnected ? "conectado" : "instavel"}</div>
            <button className="btn btn-primary" onClick={callNext}>Chamar proximo</button>
          </div>
        }
      />

      {!realtimeConnected && <OfflineState />}

      <section className="grid gap-3 md:grid-cols-3">
        <div className="panel-soft"><p className="text-[11px] uppercase tracking-[0.12em] text-[#6b7280]">Pacientes na fila</p><p className="mt-1 text-2xl font-extrabold text-[#111827]">{fila.length}</p></div>
        <div className="panel-soft"><p className="text-[11px] uppercase tracking-[0.12em] text-[#6b7280]">Tempo medio</p><p className="mt-1 text-2xl font-extrabold text-[#111827]">{waitingAverage} min</p></div>
        <div className="panel-soft !border-red-200"><p className="text-[11px] uppercase tracking-[0.12em] text-red-700">Criticos</p><p className="mt-1 text-2xl font-extrabold text-red-700">{criticalCount}</p></div>
      </section>

      <section className="panel-soft">
        <div className="flex flex-wrap gap-2 text-xs font-bold">
          <span className="inline-flex items-center gap-1 rounded-full border border-[#e8edf2] bg-white px-2 py-1 text-[#6b7280]"><Activity size={13} />Fila priorizada por risco</span>
          <span className="inline-flex items-center gap-1 rounded-full border border-[#e8edf2] bg-white px-2 py-1 text-[#6b7280]"><Clock3 size={13} />SLA visivel por tempo</span>
          <span className="inline-flex items-center gap-1 rounded-full border border-[#e8edf2] bg-white px-2 py-1 text-[#6b7280]"><Siren size={13} />Alerta para casos criticos</span>
        </div>
      </section>

      {loading && <LoadingState label="Sincronizando fila..." />}
      {loading && <SkeletonRows />}
      {error && <ErrorState label={error} />}
      {!loading && !error && fila.length === 0 && <EmptyState label="Nenhum paciente em fila neste momento." />}
      {!loading && !error && fila.length > 0 && (
        <QueueTable
          patients={fila}
          onCall={callPatient}
          onStart={(p) => setSelected(p)}
          onDetails={(p) => navigate(`/app/pacientes/${p.pacienteId}`)}
        />
      )}

      <ConfirmModal
        open={!!selected}
        title="Iniciar atendimento"
        message={`Confirmar inicio de atendimento para ${selected?.nomePaciente}?`}
        onConfirm={() => startAttendance(selected)}
        onCancel={() => setSelected(null)}
      />
      <Toast message={toast} />
    </div>
  );
}

