import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "../api/client";

function statusLabel(status) {
  const normalized = String(status || "").trim();
  const map = {
    AguardandoTriagem: "Aguardando triagem",
    EmTriagem: "Em triagem",
    AguardandoAtendimento: "Aguardando atendimento",
    EmAtendimento: "Em atendimento",
    Encaminhado: "Encaminhado",
    Finalizado: "Finalizado",
    Cancelado: "Cancelado"
  };

  if (map[normalized]) return map[normalized];
  return normalized.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/_/g, " ").trim() || "Aguardando";
}

export default function AcompanhamentoPublicoPage() {
  const { protocolo } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    const { data: payload } = await api.get(`/publico/acompanhar/${protocolo}`).catch((err) => {
      setError(err?.response?.data || "Nao foi possivel carregar seu acompanhamento.");
      return { data: null };
    });

    if (payload) {
      setData(payload);
      setError("");
    }

    setLoading(false);
  }

  useEffect(() => {
    load();
    const id = setInterval(load, 5000);
    return () => clearInterval(id);
  }, [protocolo]);

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-4xl p-4 md:p-6">
        <header className="panel mb-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#6b7280]">Acompanhamento em tempo real</p>
          <h1 className="mt-1 text-2xl font-extrabold text-[#111827]">Protocolo {protocolo}</h1>
          <p className="text-sm text-[#6b7280]">Atualizacao automatica a cada 5 segundos.</p>
        </header>

        {loading && <div className="panel-soft text-sm text-[#6b7280]">Carregando dados da sua fila...</div>}
        {!loading && error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        {!loading && !error && data && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="space-y-4">
            <section className="panel">
              <h2 className="text-lg font-bold text-[#111827]">{data.nomeCompleto}</h2>
              <p className="text-sm text-[#6b7280]">{data.unidadeUpa} · {data.cidade}</p>
              <div className="mt-2 inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-bold uppercase tracking-[0.08em] text-emerald-700">
                {statusLabel(data.status)}
              </div>
            </section>

            <section className="grid gap-3 md:grid-cols-3">
              <article className="panel-soft"><p className="text-[11px] uppercase tracking-[0.1em] text-[#6b7280]">Posicao na fila</p><p className="mt-1 text-3xl font-extrabold text-[#111827]">{data.posicaoFila}</p></article>
              <article className="panel-soft"><p className="text-[11px] uppercase tracking-[0.1em] text-[#6b7280]">Pessoas a frente</p><p className="mt-1 text-3xl font-extrabold text-[#111827]">{data.pessoasNaFrente}</p></article>
              <article className="panel-soft"><p className="text-[11px] uppercase tracking-[0.1em] text-[#6b7280]">Estimativa</p><p className="mt-1 text-3xl font-extrabold text-[#111827]">{data.estimativaMinutos} min</p></article>
            </section>

            <section className="panel-soft">
              <p className="text-sm text-[#374151]">Total de pacientes aguardando no momento: <strong>{data.totalAguardando}</strong></p>
              <p className="mt-1 text-xs text-[#6b7280]">Ultima atualizacao: {new Date(data.atualizadoEm).toLocaleString("pt-BR")}</p>
            </section>

            <div className="grid gap-2 md:grid-cols-1">
              <Link to="/app/paciente/triagem" className="btn btn-neutral">Nova pre-triagem</Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

