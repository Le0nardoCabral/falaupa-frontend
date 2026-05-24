import { useEffect, useState } from "react";
import { api } from "../api/client";
import PageHeader from "../components/ui/PageHeader";

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({ nome: "", email: "", senha: "", perfil: "Profissional" });

  async function carregar() { const { data } = await api.get("/auth/usuarios").catch(() => ({ data: [] })); setUsuarios(data); }
  useEffect(() => { carregar(); }, []);

  async function submit(e) {
    e.preventDefault();
    setMsg("");
    setError("");
    const { data } = await api.post("/auth/usuarios", form).catch(() => ({ data: null }));
    if (!data) return setError("Erro ao criar usuário.");
    setMsg(`Usuário ${data.nome} criado`);
    setForm({ nome: "", email: "", senha: "", perfil: "Profissional" });
    carregar();
  }

  return (
    <div className="page-wrap space-y-4">
      <PageHeader title="Gestão de acessos" subtitle="Controle administrativo de perfis e credenciais" />
      <form className="panel" onSubmit={submit}>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <input className="field" placeholder="Nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
          <input className="field" placeholder="E-mail" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input className="field" placeholder="Senha" value={form.senha} onChange={(e) => setForm({ ...form, senha: e.target.value })} required />
          <select className="field" value={form.perfil} onChange={(e) => setForm({ ...form, perfil: e.target.value })}><option>Admin</option><option>Profissional</option><option>Paciente</option></select>
        </div>
        {msg && <p className="mt-3 rounded-md border border-emerald-400/40 bg-emerald-950/25 p-2 text-sm text-emerald-200">{msg}</p>}
        {error && <p className="mt-3 rounded-md border border-red-400/40 bg-red-950/25 p-2 text-sm text-red-200">{error}</p>}
        <button className="btn btn-primary mt-3">Criar usuário</button>
      </form>
      <div className="panel overflow-auto">
        <table className="data-table min-w-[700px]"><thead><tr><th>Nome</th><th>Email</th><th>Perfil</th><th>Ativo</th></tr></thead><tbody>{usuarios.map((u) => <tr key={u.id}><td>{u.nome}</td><td>{u.email}</td><td>{u.perfil}</td><td>{u.ativo ? "Sim" : "Não"}</td></tr>)}</tbody></table>
      </div>
    </div>
  );
}

