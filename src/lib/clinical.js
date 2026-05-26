export const riskConfig = {
  Vermelho: { label: "Emergencia", className: "bg-red-50 text-red-700 border-red-200" },
  Laranja: { label: "Muito urgente", className: "bg-orange-50 text-orange-700 border-orange-200" },
  Amarelo: { label: "Urgente", className: "bg-amber-50 text-amber-700 border-amber-200" },
  Verde: { label: "Pouco urgente", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  Azul: { label: "Nao urgente", className: "bg-blue-50 text-blue-700 border-blue-200" }
};

export function getRiskStyle(risk) {
  return riskConfig[risk] || { label: risk || "Sem classificacao", className: "bg-slate-100 text-slate-700 border-slate-200" };
}

export function formatWait(minutes) {
  if (typeof minutes !== "number") return "-";
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}

export function getWaitLevel(minutes) {
  if (minutes >= 120) return "text-red-700 font-bold";
  if (minutes >= 60) return "text-orange-700 font-semibold";
  return "text-slate-700";
}

