import { getRiskStyle } from "../../lib/clinical";

export default function RiskBadge({ risk }) {
  const style = getRiskStyle(risk);
  return <span className={`inline-flex rounded-md border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] ${style.className}`}>{risk || "Sem risco"}</span>;
}

