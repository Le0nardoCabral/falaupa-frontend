import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";

export function LoadingState({ label = "Carregando dados..." }) {
  return (
    <div className="panel-soft">
      <div className="flex items-center gap-2 text-sm text-[#9db4ad]">
        <span className="pulse-realtime inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
        {label}
      </div>
    </div>
  );
}

export function EmptyState({ label = "Nenhum registro encontrado." }) {
  return <div className="panel-soft text-sm text-[#9db5ae]">{label}</div>;
}

export function ErrorState({ label = "Erro ao carregar dados." }) {
  return <div className="rounded-xl border border-red-500/40 bg-red-950/30 px-4 py-3 text-sm text-red-200">{label}</div>;
}

export function OfflineState() {
  return <div className="rounded-xl border border-amber-400/40 bg-amber-900/25 px-3 py-2 text-xs font-bold uppercase tracking-[0.1em] text-amber-200">Conexão instável na atualização em tempo real</div>;
}

export function SkeletonRows() {
  return (
    <div className="panel-soft space-y-2">
      {Array.from({ length: 5 }).map((_, idx) => <div key={idx} className="h-10 animate-pulse rounded-lg bg-[#1c2f2a]" />)}
    </div>
  );
}

export default function AlertBanner({ tone = "info", children }) {
  const styles = {
    info: "border-sky-400/45 bg-sky-950/25 text-sky-200",
    warning: "border-amber-400/45 bg-amber-950/25 text-amber-200",
    danger: "border-red-400/45 bg-red-950/25 text-red-200",
    success: "border-emerald-400/45 bg-emerald-950/30 text-emerald-200"
  };
  const icons = {
    info: Info,
    warning: AlertTriangle,
    danger: XCircle,
    success: CheckCircle2
  };
  const Icon = icons[tone];

  return <div className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm ${styles[tone]}`}><Icon size={16} />{children}</div>;
}

