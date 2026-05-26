import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";

export function LoadingState({ label = "Carregando dados..." }) {
  return (
    <div className="panel-soft">
      <div className="flex items-center gap-2 text-sm text-[#6b7280]">
        <span className="pulse-realtime inline-flex h-2.5 w-2.5 rounded-full bg-[#22c55e]" />
        {label}
      </div>
    </div>
  );
}

export function EmptyState({ label = "Nenhum registro encontrado." }) {
  return <div className="panel-soft text-sm text-[#6b7280]">{label}</div>;
}

export function ErrorState({ label = "Erro ao carregar dados." }) {
  return <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{label}</div>;
}

export function OfflineState() {
  return <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-bold uppercase tracking-[0.1em] text-amber-700">Conexao instavel na atualizacao em tempo real</div>;
}

export function SkeletonRows() {
  return (
    <div className="panel-soft space-y-2">
      {Array.from({ length: 5 }).map((_, idx) => <div key={idx} className="h-10 animate-pulse rounded-lg bg-slate-100" />)}
    </div>
  );
}

export default function AlertBanner({ tone = "info", children }) {
  const styles = {
    info: "border-sky-200 bg-sky-50 text-sky-700",
    warning: "border-amber-200 bg-amber-50 text-amber-700",
    danger: "border-red-200 bg-red-50 text-red-700",
    success: "border-emerald-200 bg-emerald-50 text-emerald-700"
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

