import { useEffect, useState } from "react";
import { api } from "../api/client";
import PageHeader from "../components/ui/PageHeader";

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);

  async function carregar() {
    const { data } = await api.get("/auth/usuarios").catch(() => ({ data: [] }));
    setUsuarios(data);
  }

  useEffect(() => { carregar(); }, []);

  return (
    <div className="page-wrap space-y-4">
      <PageHeader title="Acessos do sistema" subtitle="Contas controladas por seed e administracao central" />

      <section className="panel-soft">
        <p className="text-sm font-semibold text-[#0F172A]">Acesso medico padrao</p>
        <p className="mt-1 text-sm text-[#475569]">Login: <strong>medico@medico.com</strong> | Senha: <strong>medico123</strong></p>
      </section>

      <div className="panel overflow-auto">
        <table className="data-table min-w-[700px]">
          <thead>
            <tr><th>Nome</th><th>Email</th><th>Perfil</th><th>Ativo</th></tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id}>
                <td>{u.nome}</td>
                <td>{u.email}</td>
                <td>{u.perfil}</td>
                <td>{u.ativo ? "Sim" : "Nao"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
