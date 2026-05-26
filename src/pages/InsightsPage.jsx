import { useEffect, useMemo, useState } from "react";
import PageHeader from "../components/ui/PageHeader";
import StatCard from "../components/ui/StatCard";
import { api } from "../api/client";

export default function InsightsPage() {
  const [fila, setFila] = useState([]);

  useEffect(() => {
    api.get("/fila").then((r) => {
      const payload = r?.data;
      const list = Array.isArray(payload) ? payload : Array.isArray(payload?.value) ? payload.value : [];
      setFila(list);
    }).catch(() => setFila([]));
  }, []);

  const aguardando = useMemo(
    () => fila.filter((p) => p.status === "AguardandoAtendimento"),
    [fila]
  );
  const criticos = useMemo(
    () => aguardando.filter((p) => p.corRisco === "Vermelho" || p.corRisco === "Laranja"),
    [aguardando]
  );
  const tempoMedio = useMemo(() => {
    if (!aguardando.length) return 0;
    return Math.round(aguardando.reduce((acc, p) => acc + (Number(p.minutosEspera) || 0), 0) / aguardando.length);
  }, [aguardando]);

  const recomendacoes = useMemo(() => {
    const itens = [];
    if (criticos.length > 0) itens.push(`Priorizar ${criticos.length} caso(s) crítico(s) nas próximas chamadas.`);
    if (tempoMedio > 45) itens.push("Tempo médio elevado: considerar reforço na equipe de triagem/atendimento.");
    if (aguardando.length > 12) itens.push("Fila acima do ideal: revisar fluxo de encaminhamento interno.");
    if (itens.length === 0) itens.push("Operação estável no momento, manter monitoramento contínuo.");
    return itens;
  }, [criticos.length, tempoMedio, aguardando.length]);

  return (
    <div className="page-wrap space-y-4">
      <PageHeader title="IA / Insights" subtitle="Leitura inteligente da fila para apoio operacional em tempo real" />

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Aguardando atendimento" value={aguardando.length} />
        <StatCard title="Casos críticos" value={criticos.length} critical={criticos.length > 0} />
        <StatCard title="Tempo médio de espera" value={`${tempoMedio} min`} />
        <StatCard title="Pacientes monitorados" value={fila.length} />
      </section>

      <section className="panel-soft">
        <h2 className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-[#475569]">Recomendações da IA</h2>
        <div className="space-y-2">
          {recomendacoes.map((item, idx) => (
            <div key={`${idx}-${item}`} className="rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 text-sm text-[#334155]">
              {item}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
