import { motion } from "framer-motion";

export default function StatCard({ title, value, hint, critical = false }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`panel-soft relative overflow-hidden ${critical ? "!border-red-200" : ""}`}
    >
      <div className={`absolute left-0 top-0 h-full w-1 ${critical ? "bg-red-500" : "bg-[#22c55e]"}`} />
      <p className="pl-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[#6b7280]">{title}</p>
      <p className={`pl-2 pt-1 text-3xl font-extrabold tracking-tight ${critical ? "text-red-600" : "text-[#111827]"}`}>{value}</p>
      {hint && <p className="pl-2 pt-1 text-xs text-[#6b7280]">{hint}</p>}
    </motion.article>
  );
}

