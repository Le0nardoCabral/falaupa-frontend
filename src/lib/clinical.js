export const riskConfig = {
  Vermelho: { label: "Emergencia", className: "bg-red-700 text-white border-red-800" },
  Laranja: { label: "Muito urgente", className: "bg-orange-600 text-white border-orange-700" },
  Amarelo: { label: "Urgente", className: "bg-amber-400 text-amber-950 border-amber-500" },
  Verde: { label: "Pouco urgente", className: "bg-green-700 text-white border-green-800" },
  Azul: { label: "Nao urgente", className: "bg-blue-700 text-white border-blue-800" }
};

export function getRiskStyle(risk) {
  return riskConfig[risk] || { label: risk || "Sem classificacao", className: "bg-slate-200 text-slate-800 border-slate-300" };
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
