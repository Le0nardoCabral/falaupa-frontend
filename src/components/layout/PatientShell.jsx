import { NavLink, Outlet } from "react-router-dom";
import { ClipboardList, House, LogOut, UserRound, Waves } from "lucide-react";
import { useAuthStore } from "../../store/authStore";

const items = [
  { to: "/paciente", end: true, label: "Inicio", icon: House },
  { to: "/paciente/cadastro", label: "Cadastro", icon: UserRound },
  { to: "/paciente/triagem", label: "Iniciar pre-triagem", icon: ClipboardList },
  { to: "/paciente/fila", label: "Acompanhar fila", icon: Waves }
];

export default function PatientShell() {
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="mx-auto flex w-full max-w-6xl gap-4">
        <aside className="hidden w-[260px] shrink-0 rounded-2xl border border-[#E2E8F0] bg-white p-3 md:block">
          <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3">
            <p className="text-sm font-bold text-[#0F172A]">{user?.nome || "Paciente"}</p>
            <p className="text-xs uppercase tracking-wide text-[#64748B]">Area do paciente</p>
          </div>
          <nav className="mt-3 space-y-1.5">
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) => `flex items-center gap-2 rounded-xl border px-3 py-2 text-sm ${isActive ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-transparent text-[#334155] hover:border-[#E2E8F0] hover:bg-[#F8FAFC]"}`}
                >
                  <Icon size={16} /> {item.label}
                </NavLink>
              );
            })}
          </nav>
          <button className="btn btn-neutral mt-3 w-full" onClick={logout} type="button"><LogOut size={14} />Sair</button>
        </aside>

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}