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
import UsuariosPage from "../pages/UsuariosPage";
import PacienteCadastroPage from "../pages/PacienteCadastroPage";
import PacienteDetalhesPage from "../pages/PacienteDetalhesPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/index.html" element={<Navigate to="/" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/autoatendimento" element={<AutoAtendimentoPage />} />
        <Route path="/acompanhar/:protocolo" element={<AcompanhamentoPublicoPage />} />

        <Route path="/app" element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
          <Route index element={<Navigate to="/app/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="fila" element={<FilaPage />} />
          <Route path="pacientes/novo" element={<PacienteCadastroPage />} />
          <Route path="pacientes/:pacienteId" element={<PacienteDetalhesPage />} />
          <Route path="triagem" element={<TriagemPage />} />
          <Route path="medico" element={<PainelMedicoPage />} />
          <Route path="relatorios" element={<ProtectedRoute roles={["Profissional", "Admin"]}><RelatoriosPage /></ProtectedRoute>} />
          <Route path="usuarios" element={<ProtectedRoute roles={["Admin"]}><UsuariosPage /></ProtectedRoute>} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

