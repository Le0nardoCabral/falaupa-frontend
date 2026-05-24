import { NavLink, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const menu = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/fila", label: "Fila" },
  { to: "/pacientes/novo", label: "Cadastro Paciente" },
  { to: "/triagem", label: "Triagem" },
  { to: "/medico", label: "Painel Médico" },
  { to: "/relatorios", label: "Relatórios" },
  { to: "/usuarios", label: "Usuários" },
  { to: "/autoatendimento", label: "Autoatendimento" }
];

export default function AppShell() {
  const { user, logout } = useAuthStore();

  return (
    <div className="app-shell-layout">
      <aside className="app-sidebar">
        <h2>Triagem UPA</h2>
        <p>{user?.nome || "Profissional"}</p>
        <small>{user?.perfil || "-"}</small>
        <nav>
          {menu.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? "active" : "")}>{item.label}</NavLink>
          ))}
        </nav>
        <button type="button" className="logout-btn" onClick={logout}>Sair</button>
      </aside>
      <main className="app-content">
        <Outlet />
      </main>
    </div>
  );
}
