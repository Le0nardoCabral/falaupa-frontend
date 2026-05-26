import { useEffect, useMemo, useState } from "react";
import PageHeader from "../components/ui/PageHeader";
import StatCard from "../components/ui/StatCard";
import { api } from "../api/client";

export default function RelatoriosPage() {
  const [data, setData] = useState(null);
  const [fila, setFila] = useState([]);

  useEffect(() => {
    api.get("/relatorios/resumo").then((r) => setData(r.data)).catch(() => setData({ porRisco: [] }));
    api.get("/fila").then((r) => {
      const payload = r?.data;
      const list = Array.isArray(payload) ? payload : Array.isArray(payload?.value) ? payload.value : [];
      setFila(list);
    }).catch(() => setFila([]));
  }, []);

  const max = useMemo(() => Math.max(...(data?.porRisco || []).map((x) => x.quantidade), 1), [data]);
  const acimaSla = useMemo(() => fila.filter((x) => (Number(x.minutosEspera) || 0) > 60).length, [fila]);

  return (
    <div className="page-wrap space-y-4">
      <PageHeader title="Indicadores operacionais" subtitle="KPIs de tempo, classificacao e desempenho da unidade" />

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Atendimentos no dia" value={data?.atendimentosDia ?? "-"} />
        <StatCard title="Finalizados" value={data?.finalizados ?? "-"} />
        <StatCard title="Encaminhados" value={data?.encaminhados ?? "-"} />
        <StatCard title="Acima do SLA" value={acimaSla} hint="Pacientes com espera > 60 min" critical />
      </section>

      <section className="panel-soft">
        <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-[#475569]">Distribuicao por classificacao</h2>
        <div className="space-y-2">
          {(data?.porRisco || []).map((item) => (
            <div key={item.cor}>
              <div className="mb-1 flex items-center justify-between text-sm text-[#334155]"><span>{item.cor}</span><span>{item.quantidade}</span></div>
              <div className="h-2.5 rounded bg-[#E2E8F0]"><div className="h-2.5 rounded bg-[#22C55E]" style={{ width: `${(item.quantidade / max) * 100}%` }} /></div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

