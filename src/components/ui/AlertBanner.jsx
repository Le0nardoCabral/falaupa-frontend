import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";

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

