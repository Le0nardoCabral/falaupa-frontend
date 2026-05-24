import { CheckCircle2, XCircle } from "lucide-react";

export default function Toast({ message, tone = "info" }) {
  if (!message) return null;
  const danger = tone === "error";
  const Icon = danger ? XCircle : CheckCircle2;
  return (
    <div className={`toast fixed bottom-4 right-4 z-50 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold ${danger ? "!border-red-400/50 !text-red-200" : "!border-emerald-400/45 !text-emerald-100"}`}>
      <Icon size={15} />
      {message}
    </div>
  );
}

