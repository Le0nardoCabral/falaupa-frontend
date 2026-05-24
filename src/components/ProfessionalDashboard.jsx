import { useMemo } from "react";
import QueueTable from "./QueueTable";

export default function ProfessionalDashboard({ rows }) {
  const stats = useMemo(() => {
    return {
      aguardando: rows.length,
      mediaEspera: "14 min"
    };
  }, [rows]);

  return (
    <main id="professional-view" className="view-container" aria-label="Visão profissional">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>
            Fala<span className="highlight">UPA</span>
          </h2>
          <span className="badge">Painel Profissional</span>
        </div>

        <nav className="sidebar-nav" aria-label="Navegação lateral">
          <ul>
            <li className="active"><i className="fa-solid fa-list-ul" /> Fila de Triagem</li>
            <li><i className="fa-solid fa-chart-line" /> Relatórios</li>
            <li><i className="fa-solid fa-users" /> Pacientes Registrados</li>
            <li><i className="fa-solid fa-gear" /> Configurações do Sistema</li>
          </ul>
        </nav>

        <div className="user-profile">
          <div className="avatar"><i className="fa-solid fa-user-doctor" /></div>
          <div className="info">
            <strong>Enf. Wesley</strong>
            <span>Triagem - Plantão Noturno</span>
          </div>
        </div>
      </aside>

      <section className="dashboard-content">
        <header className="dashboard-header">
          <div>
            <h1>Fila de Pacientes em Tempo Real</h1>
            <p>Classificação assistida por IA baseada no Protocolo de Manchester</p>
          </div>

          <div className="stats">
            <div className="stat-card">
              <span>Aguardando Avaliação</span>
              <strong>{stats.aguardando}</strong>
            </div>
            <div className="stat-card">
              <span>Tempo Médio de Espera</span>
              <strong>{stats.mediaEspera}</strong>
            </div>
          </div>
        </header>

        <QueueTable rows={rows} />
      </section>
    </main>
  );
}
