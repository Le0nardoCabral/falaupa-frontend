import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useAuthStore } from "../store/authStore";

export default function PacienteLoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [form, setForm] = useState({ email: "wesley@gmail.com", senha: "wesley123" });
  const [error, setError] = useState("");

  async function login(e) {
    e.preventDefault();
    setError("");
    const { data } = await api.post("/auth/login", form).catch(() => ({ data: null }));
    if (!data) return setError("Credenciais invalidas.");
    if (data.perfil !== "Paciente") return setError("Esta area e exclusiva para pacientes.");

    setAuth({ token: data.token, user: { id: data.usuarioId, nome: data.nome, perfil: data.perfil } });
    navigate("/app/paciente/triagem");
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <form className="panel w-full max-w-md" onSubmit={login}>
        <h1 className="text-xl font-bold text-[#111827]">Acesso do Paciente</h1>
        <p className="mt-1 text-sm text-[#6b7280]">Entre para iniciar sua pre-triagem e acompanhar a fila.</p>
        <label className="label mt-4">E-mail</label>
        <input className="field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <label className="label mt-3">Senha</label>
        <input type="password" className="field" value={form.senha} onChange={(e) => setForm({ ...form, senha: e.target.value })} required />
        {error && <p className="mt-3 rounded-md border border-red-200 bg-red-50 p-2 text-sm text-red-700">{error}</p>}
        <button className="btn btn-primary mt-4 w-full">Entrar</button>
        <Link to="/login" className="btn btn-neutral mt-2 w-full">Sou profissional</Link>
      </form>
    </div>
  );
}


