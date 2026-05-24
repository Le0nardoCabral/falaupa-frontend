import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

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
    if (!data) return setError("Credenciais inválidas ou serviço indisponível.");

    setAuth({ token: data.token, user: { id: data.usuarioId, nome: data.nome, perfil: data.perfil } });
    navigate("/app/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#060e0c] p-4">
      <form className="panel w-full max-w-md" onSubmit={login}>
        <div className="mb-4 flex items-center gap-3">
          <img src="/falaupa-icon.svg" alt="FalaUPA" className="h-10 w-10 rounded-xl border border-emerald-400/40 bg-[#10211d] p-1" />
          <div>
            <h1 className="text-xl font-bold text-[#ebf6f2]">FalaUPA Profissional</h1>
            <p className="text-xs text-[#8ea9a1]">Acesso seguro ao centro operacional</p>
          </div>
        </div>
        <label className="label">E-mail institucional</label>
        <input className="field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <label className="label mt-3">Senha</label>
        <input type="password" className="field" value={form.senha} onChange={(e) => setForm({ ...form, senha: e.target.value })} required />
        {error && <p className="mt-3 rounded-md border border-red-400/40 bg-red-950/25 p-2 text-sm text-red-200">{error}</p>}
        <button className="btn btn-primary mt-4 w-full">Entrar no sistema</button>
        <Link to="/autoatendimento" className="btn btn-neutral mt-2 w-full">Sou paciente e quero me cadastrar</Link>
      </form>
    </div>
  );
}

