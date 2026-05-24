import { Clock3, HeartPulse, ShieldAlert, Users2 } from "lucide-react";
import { Link } from "react-router-dom";
import PageHeader from "../components/ui/PageHeader";
import StatCard from "../components/ui/StatCard";

export default function DashboardPage() {
  return (
    <div className="page-wrap space-y-4">
      <PageHeader title="Centro operacional da UPA" subtitle="Visão consolidada de fluxo, risco e tempo de espera em tempo real" />

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Pacientes aguardando" value="27" hint="Fila ativa da unidade" />
        <StatCard title="Chamados ativos" value="8" hint="Atendimentos em curso" />
        <StatCard title="Tempo médio" value="42 min" hint="Média da última hora" />
        <StatCard title="Risco crítico" value="3" hint="Vermelho e laranja" critical />
      </section>

      <section className="grid gap-3 xl:grid-cols-3">
        <Link to="/app/fila" className="panel-soft block transition hover:-translate-y-0.5">
          <div className="mb-2 inline-flex rounded-lg border border-emerald-400/35 bg-emerald-900/25 p-2 text-emerald-200"><Users2 size={16} /></div>
          <h3 className="font-bold text-[#ecf6f2]">Fila inteligente</h3>
          <p className="text-sm text-[#95aca6]">Leitura densa com prioridade clínica e tempo de espera por paciente.</p>
        </Link>
        <Link to="/app/triagem" className="panel-soft block transition hover:-translate-y-0.5">
          <div className="mb-2 inline-flex rounded-lg border border-amber-400/35 bg-amber-900/25 p-2 text-amber-200"><Clock3 size={16} /></div>
          <h3 className="font-bold text-[#ecf6f2]">Triagem assistida</h3>
          <p className="text-sm text-[#95aca6]">Coleta rápida e estruturada para reduzir atrito na enfermagem.</p>
        </Link>
        <Link to="/app/medico" className="panel-soft block transition hover:-translate-y-0.5">
          <div className="mb-2 inline-flex rounded-lg border border-red-400/35 bg-red-900/25 p-2 text-red-200"><HeartPulse size={16} /></div>
          <h3 className="font-bold text-[#ecf6f2]">Painel profissional</h3>
          <p className="text-sm text-[#95aca6]">Contexto clínico imediato para conduta e evolução.</p>
        </Link>
      </section>

      <section className="panel-soft">
        <div className="flex items-start gap-3">
          <div className="mt-1 rounded-lg border border-red-400/35 bg-red-900/25 p-2 text-red-200"><ShieldAlert size={15} /></div>
          <div>
            <p className="text-sm font-semibold text-[#e8f4f0]">Monitoramento contínuo de SLA</p>
            <p className="text-sm text-[#94aba5]">Pacientes com espera acima do previsto devem ser reavaliados para evitar agravamento clínico.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

