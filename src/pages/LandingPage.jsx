import { Activity, ArrowRight, Clock3, HeartPulse, LayoutDashboard, ShieldCheck, Stethoscope } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  { icon: Stethoscope, title: "Triagem Inteligente", text: "Coleta clínica estruturada com recomendação de prioridade em segundos." },
  { icon: Activity, title: "Fila em Tempo Real", text: "Ordem operacional orientada por risco, SLA e criticidade clínica." },
  { icon: Clock3, title: "Monitoramento Operacional", text: "Métricas compactas para reduzir espera e redistribuir equipe." },
  { icon: LayoutDashboard, title: "Painel Profissional", text: "Contexto assistencial direto para decisões rápidas e seguras." }
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#070d0c] text-[#e6f2ee]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-28 top-[-120px] h-[420px] w-[420px] rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute -right-24 top-[180px] h-[380px] w-[380px] rounded-full bg-cyan-300/5 blur-3xl" />
        <div className="absolute bottom-[-180px] left-1/2 h-[440px] w-[640px] -translate-x-1/2 rounded-full bg-emerald-300/6 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(143,170,161,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(143,170,161,0.05)_1px,transparent_1px)] bg-[size:34px_34px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(55,140,115,0.25),transparent_42%),linear-gradient(165deg,#070d0c_0%,#0b1412_55%,#08100e_100%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-5 py-6 md:px-8">
        <header className="panel !py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <img src="/falaupa-icon.svg" alt="FalaUPA" className="h-8 w-8 rounded-lg border border-emerald-400/35 bg-[#0d1e1a] p-1" />
              <div>
                <p className="text-sm font-bold">FalaUPA</p>
                <p className="text-[10px] uppercase tracking-[0.12em] text-[#89a49d]">Health-tech operacional</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link to="/autoatendimento" className="btn btn-neutral">Autoatendimento</Link>
              <Link to="/login" className="btn btn-primary">Acesso profissional</Link>
            </div>
          </div>
        </header>

        <section className="grid items-center gap-6 py-10 lg:grid-cols-2">
          <div>
            <p className="mb-3 inline-flex items-center gap-1 rounded-full border border-emerald-400/35 bg-emerald-900/25 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-emerald-200"><ShieldCheck size={13} /> Centro operacional para UPAs</p>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">Menos caos na fila. Mais precisão no atendimento.</h1>
            <p className="mt-4 max-w-xl text-sm text-[#97ada7]">FalaUPA unifica triagem inteligente, classificação de risco e monitoramento em tempo real em uma plataforma desenhada para ritmo hospitalar real.</p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link to="/login" className="btn btn-primary">Entrar no sistema <ArrowRight size={14} /></Link>
              <Link to="/autoatendimento" className="btn btn-neutral">Simular jornada do paciente</Link>
            </div>
          </div>

          <div className="panel">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#7f9b93]">Visão operacional em tempo real</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {[
                ["Pacientes aguardando", "27", "text-[#e8f5f1]"],
                ["Críticos aguardando", "3", "text-red-300"],
                ["Tempo médio", "42 min", "text-[#e8f5f1]"],
                ["Atendimentos ativos", "8", "text-emerald-300"]
              ].map(([label, value, cls]) => (
                <article key={label} className="rounded-xl border border-[#2a433d] bg-[#11211e] p-3">
                  <p className="text-[11px] uppercase tracking-[0.1em] text-[#89a59d]">{label}</p>
                  <p className={`mt-1 text-2xl font-extrabold ${cls}`}>{value}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {features.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="panel-soft">
                <Icon size={17} className="text-emerald-300" />
                <h3 className="mt-2 text-sm font-bold text-[#e8f5f1]">{item.title}</h3>
                <p className="mt-1 text-sm text-[#90aaa3]">{item.text}</p>
              </article>
            );
          })}
        </section>

        <section className="panel mt-6">
          <h2 className="text-2xl font-extrabold">Uma central hospitalar moderna e inteligente</h2>
          <p className="mt-2 text-sm text-[#98b0a9]">Organize fluxo de pacientes, acelere triagem e aumente previsibilidade da unidade com uma experiência operacional premium.</p>
        </section>

        <footer className="mt-8 border-t border-[#233a35] py-5 text-sm text-[#89a29b]">FalaUPA · Plataforma de gestão operacional para atendimento de urgência</footer>
      </div>
    </div>
  );
}

