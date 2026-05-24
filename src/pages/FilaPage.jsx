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
    if (!fila.length) return 0;
    return Math.round(fila.reduce((sum, p) => sum + (p.minutosEspera || 0), 0) / fila.length);
  }, [fila]);

  async function startAttendance(p) {
    await api.post("/atendimentos/iniciar", p.pacienteId).catch(() => null);
    setToast(`Atendimento iniciado: ${p.nomePaciente}`);
    setSelected(null);
    await loadFila();
  }

  async function callPatient(p) {
    setToast(`Paciente chamado: ${p.nomePaciente}`);
  }

  return (
    <div className="page-wrap space-y-3">
      <PageHeader
        title="Fila em tempo real"
        subtitle="Leitura instantânea de prioridade, tempo de espera e estado de atendimento"
        actions={<div className="inline-flex items-center gap-2 rounded-lg border border-[#2d4741] bg-[#132522] px-3 py-2 text-xs font-bold text-[#97b0a9]"><Wifi size={14} className={realtimeConnected ? "text-emerald-300" : "text-amber-300"} />Realtime {realtimeConnected ? "conectado" : "instável"}</div>}
      />

      {!realtimeConnected && <OfflineState />}

      <section className="grid gap-3 md:grid-cols-3">
        <div className="panel-soft"><p className="text-[11px] uppercase tracking-[0.12em] text-[#7f9b93]">Pacientes na fila</p><p className="mt-1 text-2xl font-extrabold text-[#ecf6f2]">{fila.length}</p></div>
        <div className="panel-soft"><p className="text-[11px] uppercase tracking-[0.12em] text-[#7f9b93]">Tempo médio</p><p className="mt-1 text-2xl font-extrabold text-[#ecf6f2]">{waitingAverage} min</p></div>
        <div className="panel-soft !border-red-400/35"><p className="text-[11px] uppercase tracking-[0.12em] text-red-200">Críticos</p><p className="mt-1 text-2xl font-extrabold text-red-300">{criticalCount}</p></div>
      </section>

      <section className="panel-soft">
        <div className="flex flex-wrap gap-2 text-xs font-bold">
          <span className="inline-flex items-center gap-1 rounded-md border border-[#2a433c] bg-[#132421] px-2 py-1 text-[#9ab3ac]"><Activity size={13} />Fila priorizada por risco</span>
          <span className="inline-flex items-center gap-1 rounded-md border border-[#2a433c] bg-[#132421] px-2 py-1 text-[#9ab3ac]"><Clock3 size={13} />SLA visível por tempo</span>
          <span className="inline-flex items-center gap-1 rounded-md border border-[#2a433c] bg-[#132421] px-2 py-1 text-[#9ab3ac]"><Siren size={13} />Alerta para casos críticos</span>
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
          onRiskChange={(p) => setToast(`Ajuste de prioridade solicitado para ${p.nomePaciente}`)}
          onDetails={(p) => navigate(`/app/pacientes/${p.pacienteId}`)}
        />
      )}

      <ConfirmModal
        open={!!selected}
        title="Iniciar atendimento"
        message={`Confirmar início de atendimento para ${selected?.nomePaciente}?`}
        onConfirm={() => startAttendance(selected)}
        onCancel={() => setSelected(null)}
      />
      <Toast message={toast} />
    </div>
  );
}

