import { useEffect, useMemo, useState } from "react";
import { Clock3, HeartPulse, ShieldAlert, Users2 } from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import PageHeader from "../components/ui/PageHeader";
import StatCard from "../components/ui/StatCard";

export default function DashboardPage() {
  const [fila, setFila] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadFila() {
    const { data } = await api.get("/fila").catch(() => ({ data: [] }));
    const list = Array.isArray(data) ? data : Array.isArray(data?.value) ? data.value : [];
    setFila(list);
    setLoading(false);
  }

  useEffect(() => {
    loadFila();
    const timer = setInterval(loadFila, 15000);
    return () => clearInterval(timer);
  }, []);

  const stats = useMemo(() => {
    const ativos = fila.filter((p) => p.status !== "Finalizado" && p.status !== "Encaminhado");
    const aguardando = ativos.filter((p) => p.status === "AguardandoTriagem" || p.status === "AguardandoAtendimento");
    const emAtendimento = ativos.filter((p) => p.status === "EmAtendimento");
    const criticos = ativos.filter((p) => p.corRisco === "Vermelho" || p.corRisco === "Laranja");
    const tempoMedio = aguardando.length
      ? Math.round(aguardando.reduce((acc, p) => acc + (Number(p.minutosEspera) || 0), 0) / aguardando.length)
      : 0;

    return {
      aguardando: aguardando.length,
      emAtendimento: emAtendimento.length,
      tempoMedio,
      criticos: criticos.length
    };
  }, [fila]);

  const value = (v, suffix = "") => (loading ? "--" : `${v}${suffix}`);

  return (
    <div className="page-wrap space-y-4">
      <PageHeader title="Centro Operacional da UPA" subtitle="Visao consolidada de fila, risco e tempo de espera em tempo real" />

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Pacientes aguardando" value={value(stats.aguardando)} hint="Fila ativa da unidade" />
        <StatCard title="Chamados ativos" value={value(stats.emAtendimento)} hint="Atendimentos em curso" />
        <StatCard title="Tempo medio" value={value(stats.tempoMedio, " min")} hint="Media atual da fila" />
        <StatCard title="Risco critico" value={value(stats.criticos)} hint="Vermelho e laranja" critical />
      </section>

      <section className="grid gap-3 xl:grid-cols-3">
        <Link to="/app/fila" className="panel-soft block transition hover:-translate-y-1 duration-200">
          <div className="mb-2 inline-flex rounded-xl border border-emerald-200 bg-emerald-50 p-2 text-emerald-700"><Users2 size={16} /></div>
          <h3 className="font-bold text-[#111827]">Fila inteligente</h3>
          <p className="text-sm text-[#6b7280]">Leitura instantanea com prioridade clinica e previsao dinamica.</p>
        </Link>
        <Link to="/app/triagem" className="panel-soft block transition hover:-translate-y-1 duration-200">
          <div className="mb-2 inline-flex rounded-xl border border-amber-200 bg-amber-50 p-2 text-amber-700"><Clock3 size={16} /></div>
          <h3 className="font-bold text-[#111827]">Triagem assistida</h3>
          <p className="text-sm text-[#6b7280]">Fluxo estruturado para acelerar decisao da equipe de enfermagem.</p>
        </Link>
        <Link to="/app/medico" className="panel-soft block transition hover:-translate-y-1 duration-200">
          <div className="mb-2 inline-flex rounded-xl border border-red-200 bg-red-50 p-2 text-red-700"><HeartPulse size={16} /></div>
          <h3 className="font-bold text-[#111827]">Painel profissional</h3>
          <p className="text-sm text-[#6b7280]">Contexto clinico completo para conduta medica rapida.</p>
        </Link>
      </section>

      <section className="panel-soft">
        <div className="flex items-start gap-3">
          <div className="mt-1 rounded-lg border border-red-200 bg-red-50 p-2 text-red-700"><ShieldAlert size={15} /></div>
          <div>
            <p className="text-sm font-semibold text-[#111827]">Monitoramento continuo de SLA</p>
            <p className="text-sm text-[#6b7280]">Pacientes acima do tempo previsto devem ser reavaliados para reduzir risco assistencial.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

