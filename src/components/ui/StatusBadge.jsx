import clsx from "clsx";

export default function StatusBadge({ children, tone = "neutral" }) {
  const tones = {
    neutral: "bg-slate-100 border-slate-200 text-slate-700",
    success: "bg-emerald-50 border-emerald-200 text-emerald-700",
    warning: "bg-amber-50 border-amber-200 text-amber-700",
    danger: "bg-red-50 border-red-200 text-red-700",
    info: "bg-sky-50 border-sky-200 text-sky-700"
  };

  return <span className={clsx("inline-flex items-center rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em]", tones[tone])}>{children}</span>;
}

