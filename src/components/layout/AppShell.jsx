import { useMemo, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  Activity,
  ClipboardList,
  HeartPulse,
  LayoutDashboard,
  LogOut,
  Menu,
  Users,
  Waves,
  X
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";

const menu = [
  { to: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/app/fila", label: "Fila em tempo real", icon: Activity },
  { to: "/app/triagem", label: "Triagem", icon: ClipboardList },
  { to: "/app/medico", label: "Painel profissional", icon: HeartPulse },
  { to: "/app/relatorios", label: "Indicadores", icon: Waves },
  { to: "/app/usuarios", label: "Acessos", icon: Users }
];

export default function AppShell() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const pageTitle = useMemo(() => menu.find((x) => location.pathname.startsWith(x.to))?.label || "Operação", [location.pathname]);

  return (
    <div className="clinical-grid min-h-screen">
      <div className="mx-auto flex max-w-[1920px]">
        <aside className={`${open ? "fixed inset-y-0 left-0 z-50 w-[88%] max-w-[330px]" : "hidden"} border-r border-[#243a35] bg-[#0a1513]/98 md:sticky md:top-0 md:block md:h-screen md:w-[280px]`}>
          <div className="flex h-full flex-col">
            <div className="border-b border-[#223732] px-5 py-4">
              <div className="flex items-center gap-3">
                <img src="/falaupa-icon.svg" alt="FalaUPA" className="h-9 w-9 rounded-xl border border-emerald-400/40 bg-[#0f1f1b] p-1" />
                <div>
                  <h1 className="text-base font-bold text-[#e6f2ee]">FalaUPA</h1>
                  <p className="text-[11px] uppercase tracking-[0.12em] text-[#7ea096]">Hospital Flow Platform</p>
                </div>
              </div>
              <div className="mt-4 rounded-xl border border-[#2b453f] bg-[#12231f]/80 px-3 py-2">
                <p className="truncate text-sm font-semibold text-[#def0ea]">{user?.nome || "Profissional"}</p>
                <p className="text-xs uppercase tracking-wide text-[#89a59d]">{user?.perfil || "Sem perfil"}</p>
              </div>
            </div>

            <nav className="flex-1 space-y-1.5 overflow-y-auto px-3 py-3">
              {menu.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) => `flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${isActive ? "border-emerald-400/40 bg-emerald-400/14 text-emerald-100" : "border-transparent text-[#c4d9d2] hover:border-[#355049] hover:bg-[#162925]"}`}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>

            <div className="border-t border-[#223732] p-3">
              <button type="button" onClick={logout} className="btn btn-neutral w-full">
                <LogOut size={15} /> Encerrar sessão
              </button>
            </div>
          </div>
        </aside>

        {open && <button className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setOpen(false)} aria-label="Fechar menu" />}

        <main className="min-w-0 flex-1 p-3 md:p-5">
          <header className="mb-4 rounded-2xl border border-[#253f38] bg-[#101f1c]/92 px-4 py-3 md:hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-[#7e9b93]">FalaUPA</p>
                <p className="text-sm font-bold text-[#e6f2ee]">{pageTitle}</p>
              </div>
              <button type="button" className="btn btn-neutral px-3 py-2" onClick={() => setOpen((v) => !v)}>
                {open ? <X size={15} /> : <Menu size={15} />} Menu
              </button>
            </div>
          </header>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
