import { useEffect, useMemo, useState } from "react";
import PageHeader from "../components/ui/PageHeader";
import StatCard from "../components/ui/StatCard";
import { api } from "../api/client";

export default function RelatoriosPage() {
  const [data, setData] = useState(null);

  useEffect(() => { api.get("/relatorios/resumo").then((r) => setData(r.data)).catch(() => setData({ porRisco: [] })); }, []);

  const max = useMemo(() => Math.max(...(data?.porRisco || []).map((x) => x.quantidade), 1), [data]);

  return (
    <div className="page-wrap space-y-4">
      <PageHeader title="Indicadores operacionais" subtitle="KPIs de tempo, classificação e desempenho da unidade" />
      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Atendimentos no dia" value={data?.atendimentosDia ?? "-"} />
        <StatCard title="Finalizados" value={data?.finalizados ?? "-"} />
        <StatCard title="Encaminhados" value={data?.encaminhados ?? "-"} />
        <StatCard title="Acima do SLA" value={data?.acimaSla ?? "-"} critical />
      </section>
      <section className="panel-soft">
        <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-[#8ea8a1]">Distribuição por classificação</h2>
        <div className="space-y-2">
          {(data?.porRisco || []).map((item) => (
            <div key={item.cor}>
              <div className="mb-1 flex items-center justify-between text-sm text-[#d3e5de]"><span>{item.cor}</span><span>{item.quantidade}</span></div>
              <div className="h-2.5 rounded bg-[#1b302b]"><div className="h-2.5 rounded bg-emerald-400" style={{ width: `${(item.quantidade / max) * 100}%` }} /></div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

