export default function StatCard({ title, value, hint, critical = false }) {
  return (
    <article className={`panel-soft relative overflow-hidden ${critical ? "!border-red-400/40" : ""}`}>
      <div className={`absolute left-0 top-0 h-full w-1 ${critical ? "bg-red-400" : "bg-emerald-400"}`} />
      <p className="pl-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[#7e9b93]">{title}</p>
      <p className={`pl-2 pt-1 text-3xl font-extrabold tracking-tight ${critical ? "text-red-300" : "text-[#e7f4ef]"}`}>{value}</p>
      {hint && <p className="pl-2 pt-1 text-xs text-[#98b0a9]">{hint}</p>}
    </article>
  );
}

