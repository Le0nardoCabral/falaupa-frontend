import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "../api/client";
import { useAuthStore } from "../store/authStore";

export default function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [form, setForm] = useState({ email: "admin@admin.com", senha: "admin123" });
  const [error, setError] = useState("");

  async function login(e) {
    e.preventDefault();
    setError("");
    const { data } = await api.post("/auth/login", form).catch(() => ({ data: null }));
    if (!data) return setError("Credenciais invalidas ou servico indisponivel.");

    setAuth({ token: data.token, user: { id: data.usuarioId, nome: data.nome, perfil: data.perfil } });
    navigate("/app/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <motion.form initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="panel w-full max-w-md" onSubmit={login}>
        <div className="mb-4 flex items-center gap-3">
          <img src="/falaupa-icon.svg" alt="FalaUPA" className="h-10 w-10 rounded-xl border border-[#e8edf2] bg-white p-1" />
          <div>
            <h1 className="text-xl font-bold text-[#111827]">FalaUPA Profissional</h1>
            <p className="text-xs text-[#6b7280]">Acesso seguro ao centro operacional</p>
          </div>
        </div>
        <label className="label">E-mail institucional</label>
        <input className="field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <label className="label mt-3">Senha</label>
        <input type="password" className="field" value={form.senha} onChange={(e) => setForm({ ...form, senha: e.target.value })} required />
        {error && <p className="mt-3 rounded-md border border-red-200 bg-red-50 p-2 text-sm text-red-700">{error}</p>}
        <button className="btn btn-primary mt-4 w-full">Entrar no sistema</button>
        <Link to="/paciente/login" className="btn btn-neutral mt-2 w-full">Sou paciente</Link>
      </motion.form>
    </div>
  );
}


