import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import ProtectedRoute from "./ProtectedRoute";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import AutoAtendimentoPage from "../pages/AutoAtendimentoPage";
import AcompanhamentoPublicoPage from "../pages/AcompanhamentoPublicoPage";
import DashboardPage from "../pages/DashboardPage";
import TriagemPage from "../pages/TriagemPage";
import FilaPage from "../pages/FilaPage";
import PainelMedicoPage from "../pages/PainelMedicoPage";
import RelatoriosPage from "../pages/RelatoriosPage";
import InsightsPage from "../pages/InsightsPage";
import UsuariosPage from "../pages/UsuariosPage";
import PacienteCadastroPage from "../pages/PacienteCadastroPage";
import PacienteDetalhesPage from "../pages/PacienteDetalhesPage";
import PacienteLoginPage from "../pages/PacienteLoginPage";
import PacienteHomePage from "../pages/PacienteHomePage";
import PacienteFilaPage from "../pages/PacienteFilaPage";

function AppIndexRedirect() {
  const rawUser = localStorage.getItem("user");
  const user = rawUser ? JSON.parse(rawUser) : null;
  if (user?.perfil === "Paciente") return <Navigate to="/app/paciente/triagem" replace />;
  return <Navigate to="/app/dashboard" replace />;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/index.html" element={<Navigate to="/" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/paciente/login" element={<PacienteLoginPage />} />
        <Route path="/acompanhar/:protocolo" element={<AcompanhamentoPublicoPage />} />

        <Route path="/paciente/*" element={<Navigate to="/app/paciente/triagem" replace />} />

        <Route path="/app" element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
          <Route index element={<AppIndexRedirect />} />

          <Route path="paciente" element={<ProtectedRoute roles={["Paciente"]}><PacienteHomePage /></ProtectedRoute>} />
          <Route path="paciente/cadastro" element={<Navigate to="/app/paciente/triagem" replace />} />
          <Route path="paciente/triagem" element={<ProtectedRoute roles={["Paciente"]}><AutoAtendimentoPage /></ProtectedRoute>} />
          <Route path="paciente/fila" element={<ProtectedRoute roles={["Paciente"]}><PacienteFilaPage /></ProtectedRoute>} />

          <Route path="dashboard" element={<ProtectedRoute roles={["Profissional", "Admin"]}><DashboardPage /></ProtectedRoute>} />
          <Route path="fila" element={<ProtectedRoute roles={["Profissional", "Admin"]}><FilaPage /></ProtectedRoute>} />
          <Route path="pacientes/novo" element={<ProtectedRoute roles={["Profissional", "Admin"]}><PacienteCadastroPage /></ProtectedRoute>} />
          <Route path="pacientes/:pacienteId" element={<ProtectedRoute roles={["Profissional", "Admin"]}><PacienteDetalhesPage /></ProtectedRoute>} />
          <Route path="triagem" element={<ProtectedRoute roles={["Profissional", "Admin"]}><TriagemPage /></ProtectedRoute>} />
          <Route path="medico" element={<ProtectedRoute roles={["Profissional", "Admin"]}><PainelMedicoPage /></ProtectedRoute>} />
          <Route path="insights" element={<ProtectedRoute roles={["Profissional", "Admin"]}><InsightsPage /></ProtectedRoute>} />
          <Route path="relatorios" element={<ProtectedRoute roles={["Profissional", "Admin"]}><RelatoriosPage /></ProtectedRoute>} />
          <Route path="usuarios" element={<ProtectedRoute roles={["Admin"]}><UsuariosPage /></ProtectedRoute>} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
