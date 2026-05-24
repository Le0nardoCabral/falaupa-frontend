import clsx from "clsx";

export default function StatusBadge({ children, tone = "neutral" }) {
  const tones = {
    neutral: "bg-slate-900/40 border-slate-500/35 text-slate-200",
    success: "bg-emerald-950/30 border-emerald-400/40 text-emerald-200",
    warning: "bg-amber-950/30 border-amber-400/40 text-amber-200",
    danger: "bg-red-950/30 border-red-400/40 text-red-200",
    info: "bg-sky-950/30 border-sky-400/40 text-sky-200"
  };

  return <span className={clsx("inline-flex items-center rounded-md border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em]", tones[tone])}>{children}</span>;
}

