import { Activity, ArrowRight, Clock3, LayoutDashboard, ShieldCheck, Sparkles, Stethoscope } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  { icon: Stethoscope, title: "Triagem Inteligente", text: "Coleta clinica estruturada com recomendacao inicial de prioridade." },
  { icon: Activity, title: "Fila em Tempo Real", text: "Ordem operacional orientada por risco e criticidade assistencial." },
  { icon: Clock3, title: "SLA Assistencial", text: "Tempo de espera monitorado continuamente com alertas preventivos." },
  { icon: LayoutDashboard, title: "Painel Profissional", text: "Visao tatica para decisao clinica rapida e segura." }
];

const metrics = [
  { label: "Pacientes aguardando", value: "27", hint: "+3 nos ultimos 10min", tone: "text-[#0F172A]", dot: "bg-emerald-500" },
  { label: "Casos criticos", value: "3", hint: "Manchester vermelho/laranja", tone: "text-[#DC2626]", dot: "bg-red-500" },
  { label: "Tempo medio", value: "42 min", hint: "-12% em relacao a ontem", tone: "text-[#0F172A]", dot: "bg-sky-500" },
  { label: "Atendimento ativo", value: "8", hint: "Equipe em operacao", tone: "text-[#166534]", dot: "bg-emerald-500" }
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-28 top-[-150px] h-[420px] w-[420px] rounded-full bg-emerald-200/50 blur-3xl" />
          <div className="absolute right-[-140px] top-[120px] h-[360px] w-[360px] rounded-full bg-emerald-100/60 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(34,197,94,0.10),transparent_35%),linear-gradient(180deg,#FFFFFF_0%,#F8FAFC_100%)]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-5 pb-10 pt-6 md:px-8">
          <header className="rounded-2xl border border-[#E2E8F0] bg-white/90 px-4 py-3 shadow-[0_12px_30px_rgba(15,23,42,0.08)] backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <img src="/falaupa-icon.svg" alt="FalaUPA" className="h-8 w-8 rounded-lg border border-[#E2E8F0] bg-white p-1" />
                <div>
                  <p className="text-sm font-bold text-[#0F172A]">FalaUPA</p>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#475569]">HEALTH-TECH OPERACIONAL</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Link to="/paciente/login" className="btn btn-neutral">Area do paciente</Link>
                <Link to="/login" className="btn btn-primary">Acesso profissional</Link>
              </div>
            </div>
          </header>

          <section className="mt-6 flex min-h-[82vh] items-center">
            <div className="grid w-full items-center gap-8 xl:grid-cols-[1fr_0.9fr]">
              <div className="max-w-[620px]">
                <p className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-[#BBF7D0] bg-[#DCFCE7] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[#166534]">
                  <ShieldCheck size={13} /> Centro operacional para UPAs
                </p>

                <h1 className="text-[clamp(3.2rem,5.2vw,5.5rem)] font-extrabold leading-[0.94] tracking-[-0.03em] text-[#0F172A]">
                  Menos caos na fila.
                  <br />
                  Mais precisao no atendimento.
                </h1>

                <p className="mt-5 max-w-[560px] text-base leading-relaxed text-[#475569]">
                  Plataforma inteligente para triagem, classificacao Manchester e monitoramento operacional em tempo real, com foco em velocidade, seguranca clinica e previsibilidade assistencial.
                </p>

                <div className="mt-7 flex flex-wrap gap-2.5">
                  <Link to="/login" className="btn btn-primary px-5 py-3">Entrar no sistema <ArrowRight size={15} /></Link>
                  <Link to="/paciente/login" className="btn border border-[#D1D5DB] bg-white px-5 py-3 text-[#0F172A] transition duration-200 hover:bg-[#F8FAFC]">
                    Entrar como paciente
                  </Link>
                </div>
              </div>

              <article className="rounded-[22px] border border-[#E2E8F0] bg-white p-5 shadow-[0_18px_42px_rgba(15,23,42,0.09)]">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-[#64748B]">Painel operacional realtime</p>
                    <p className="text-sm font-semibold text-[#0F172A]">UPA Centro - Fluxo assistencial</p>
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#BBF7D0] bg-[#DCFCE7] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[#166534]">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" /> Online
                  </span>
                </div>

                <div className="grid gap-2.5 sm:grid-cols-2">
                  {metrics.map((metric) => (
                    <div key={metric.label} className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                      <p className="text-[10px] uppercase tracking-[0.1em] text-[#64748B]">{metric.label}</p>
                      <p className={`mt-1 text-2xl font-extrabold ${metric.tone}`}>{metric.value}</p>
                      <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-[#475569]"><span className={`h-1.5 w-1.5 rounded-full ${metric.dot} animate-pulse`} />{metric.hint}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <p className="font-semibold text-[#334155]">Fluxo da ultima hora</p>
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#DCFCE7] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] text-[#166534]"><Sparkles size={11} /> IA ativa</span>
                  </div>
                  <div className="flex items-end gap-1.5">
                    {[38, 52, 46, 64, 72, 58, 68, 74, 66, 81].map((h, i) => (
                      <span key={i} className="w-full rounded-sm bg-[linear-gradient(180deg,#22C55E,#86EFAC)]" style={{ height: `${h}px` }} />
                    ))}
                  </div>
                </div>
              </article>
            </div>
          </section>
        </div>
      </div>

      <section className="bg-[#F8FAFC] pb-12">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {features.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 shadow-[0_8px_20px_rgba(15,23,42,0.05)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(15,23,42,0.08)]">
                  <div className="mb-2 inline-flex rounded-lg border border-[#BBF7D0] bg-[#DCFCE7] p-1.5 text-[#16A34A]"><Icon size={14} /></div>
                  <h3 className="text-sm font-bold text-[#0F172A]">{item.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-[#475569]">{item.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}