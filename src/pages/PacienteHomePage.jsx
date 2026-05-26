import { Link } from "react-router-dom";

export default function PacienteHomePage() {
  return (
    <div className="space-y-4">
      <header className="panel">
        <h1 className="text-2xl font-extrabold text-[#0F172A]">Painel do paciente</h1>
        <p className="text-sm text-[#475569]">Seu cadastro ja esta vinculado. Siga para pre-triagem ou acompanhamento da fila.</p>
      </header>

      <section className="grid gap-3 md:grid-cols-2">
        <Link className="panel-soft transition hover:-translate-y-0.5" to="/app/paciente/triagem">
          <h3 className="font-bold text-[#0F172A]">Iniciar pre-triagem</h3>
          <p className="mt-1 text-sm text-[#475569]">Informe UPA e sintomas para entrar na fila.</p>
        </Link>
        <Link className="panel-soft transition hover:-translate-y-0.5" to="/app/paciente/fila">
          <h3 className="font-bold text-[#0F172A]">Acompanhar fila</h3>
          <p className="mt-1 text-sm text-[#475569]">Consulte posicao, tempo estimado e status em tempo real.</p>
        </Link>
      </section>
    </div>
  );
}
