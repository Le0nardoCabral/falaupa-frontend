import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
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

  // Fallback para qualquer status em PascalCase/CamelCase.
  const humanized = normalized
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ")
    .trim();

  return humanized || "Aguardando";
}

export default function AcompanhamentoPublicoPage() {
  const { protocolo } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    const { data: payload } = await api.get(`/publico/acompanhar/${protocolo}`).catch((err) => {
      setError(err?.response?.data || "Não foi possível carregar seu acompanhamento.");
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
    const id = setInterval(load, 15000);
    return () => clearInterval(id);
  }, [protocolo]);

  return (
    <div className="min-h-screen bg-[#070d0c]">
      <div className="mx-auto max-w-4xl p-4 md:p-6">
        <header className="panel mb-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#8aa69e]">Acompanhamento público</p>
          <h1 className="mt-1 text-2xl font-extrabold text-[#ecf7f3]">Protocolo {protocolo}</h1>
          <p className="text-sm text-[#9bb4ad]">Atualização automática a cada 15 segundos.</p>
        </header>

        {loading && <div className="panel-soft text-sm text-[#a1b9b2]">Carregando dados da sua fila...</div>}
        {!loading && error && <div className="rounded-xl border border-red-400/40 bg-red-950/30 px-4 py-3 text-sm text-red-200">{error}</div>}

        {!loading && !error && data && (
          <div className="space-y-4">
            <section className="panel">
              <h2 className="text-lg font-bold text-[#eaf5f1]">{data.nomeCompleto}</h2>
              <p className="text-sm text-[#96afa8]">{data.unidadeUpa} · {data.cidade}</p>
              <div className="mt-2 inline-flex rounded-md border border-emerald-400/40 bg-emerald-950/30 px-2.5 py-1 text-xs font-bold uppercase tracking-[0.08em] text-emerald-200">
                {statusLabel(data.status)}
              </div>
            </section>

            <section className="grid gap-3 md:grid-cols-3">
              <article className="panel-soft">
                <p className="text-[11px] uppercase tracking-[0.1em] text-[#87a29a]">Posição na fila</p>
                <p className="mt-1 text-3xl font-extrabold text-[#ecf7f3]">{data.posicaoFila}</p>
              </article>
              <article className="panel-soft">
                <p className="text-[11px] uppercase tracking-[0.1em] text-[#87a29a]">Pessoas à frente</p>
                <p className="mt-1 text-3xl font-extrabold text-[#ecf7f3]">{data.pessoasNaFrente}</p>
              </article>
              <article className="panel-soft">
                <p className="text-[11px] uppercase tracking-[0.1em] text-[#87a29a]">Estimativa</p>
                <p className="mt-1 text-3xl font-extrabold text-[#ecf7f3]">{data.estimativaMinutos} min</p>
              </article>
            </section>

            <section className="panel-soft">
              <p className="text-sm text-[#bdd2cc]">Total de pacientes aguardando no momento: <strong>{data.totalAguardando}</strong></p>
              <p className="mt-1 text-xs text-[#8da8a0]">Última atualização: {new Date(data.atualizadoEm).toLocaleString("pt-BR")}</p>
            </section>

            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={load} className="btn btn-primary">Atualizar agora</button>
              <Link to="/autoatendimento" className="btn btn-neutral">Novo cadastro</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
