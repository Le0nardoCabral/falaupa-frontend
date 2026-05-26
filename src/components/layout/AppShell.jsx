import { useMemo, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  Activity,
  BarChart3,
  BrainCircuit,
  ClipboardList,
  HeartPulse,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Users,
  Waves,
  X
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from "../../store/authStore";

const professionalMenu = [
  { to: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/app/triagem", label: "Triagem", icon: ClipboardList },
  { to: "/app/fila", label: "Fila em Tempo Real", icon: Activity },
  { to: "/app/pacientes/novo", label: "Pacientes", icon: Users },
  { to: "/app/medico", label: "Atendimento", icon: HeartPulse },
  { to: "/app/insights", label: "IA / Insights", icon: BrainCircuit },
  { to: "/app/relatorios", label: "Relatorios", icon: BarChart3 }
];

const patientMenu = [
  { to: "/app/paciente/triagem", label: "Iniciar pre-triagem", icon: ClipboardList },
  { to: "/app/paciente/fila", label: "Fila do paciente", icon: Waves }
];

const itemClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-2xl border px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
    isActive
      ? "border-[#ccefd8] bg-[#f4fdf7] text-[#166534] shadow-sm"
      : "border-transparent text-[#4b5563] hover:border-[#e4ebf3] hover:bg-[#f8fafc]"
  }`;

export default function AppShell() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const menu = useMemo(() => {
    if (user?.perfil === "Paciente") return patientMenu;
    if (user?.perfil === "Admin") return [...professionalMenu, { to: "/app/usuarios", label: "Configuracoes", icon: Settings }];
    return professionalMenu;
  }, [user?.perfil]);
  const pageTitle = useMemo(() => menu.find((x) => location.pathname.startsWith(x.to))?.label || "Operacao", [location.pathname, menu]);

  return (
    <div className="clinical-grid min-h-screen">
      <div className="mx-auto flex w-full max-w-[1920px]">
        <aside className={`${open ? "fixed inset-y-0 left-0 z-50 w-[88%] max-w-[330px]" : "hidden"} border-r border-[#e8edf2] bg-white/95 backdrop-blur md:sticky md:top-0 md:block md:h-screen md:w-[280px]`}>
          <div className="flex h-full flex-col p-4">
            <div className="rounded-2xl border border-[#e8edf2] bg-[#fbfcfe] p-3">
              <div className="flex items-center gap-3">
                <img src="/falaupa-icon.svg" alt="FalaUPA" className="h-10 w-10 rounded-xl border border-[#e8edf2] bg-white p-1" />
                <div>
                  <h1 className="text-base font-bold text-[#111827]">FalaUPA</h1>
                  <p className="text-[11px] uppercase tracking-[0.12em] text-[#6b7280]">HealthTech Operations</p>
                </div>
              </div>
              <div className="mt-3 rounded-xl border border-[#e8edf2] bg-white px-3 py-2">
                <p className="truncate text-sm font-semibold text-[#111827]">{user?.nome || "Usuario"}</p>
                <p className="text-xs uppercase tracking-wide text-[#6b7280]">{user?.perfil || "Sem perfil"}</p>
              </div>
            </div>

            <nav className="mt-4 flex-1 space-y-1.5 overflow-y-auto">
              {menu.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={`${item.to}-${i}`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.18, delay: i * 0.02 }}
                  >
                    <NavLink to={item.to} onClick={() => setOpen(false)} className={itemClass}>
                      <Icon size={16} />
                      <span>{item.label}</span>
                    </NavLink>
                  </motion.div>
                );
              })}
            </nav>

            <button type="button" onClick={logout} className="btn btn-neutral w-full">
              <LogOut size={15} /> Encerrar sessao
            </button>
          </div>
        </aside>

        {open && <button className="fixed inset-0 z-40 bg-[#111827]/30 md:hidden" onClick={() => setOpen(false)} aria-label="Fechar menu" />}

        <main className="min-w-0 flex-1 p-3 md:p-6">
          <header className="mb-4 rounded-2xl border border-[#e8edf2] bg-white px-4 py-3 md:hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-[#6b7280]">FalaUPA</p>
                <p className="text-sm font-bold text-[#111827]">{pageTitle}</p>
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
