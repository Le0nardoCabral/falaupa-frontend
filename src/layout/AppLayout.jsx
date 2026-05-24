import { Link, Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h1>Triagem Inteligente UPA</h1>
        <nav>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/pacientes/novo">Cadastro Paciente</Link>
          <Link to="/triagem">Triagem</Link>
          <Link to="/fila">Fila</Link>
          <Link to="/medico">Painel Médico</Link>
          <Link to="/relatorios">Relatórios</Link>
          <Link to="/usuarios">Usuários</Link>
        </nav>
      </aside>
      <main className="content"><Outlet /></main>
    </div>
  );
}

