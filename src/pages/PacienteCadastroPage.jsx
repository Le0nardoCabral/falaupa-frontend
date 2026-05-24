import { useState } from "react";
import PageHeader from "../components/ui/PageHeader";
import { api } from "../api/client";

export default function PacienteCadastroPage() {
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({ nomeCompleto: "", cpf: "", dataNascimento: "", sexo: "", telefone: "", endereco: "", cidade: "Pompeia", uf: "SP", unidadeUpa: "UPA Centro", nomeResponsavel: "" });

  async function submit(e) {
    e.preventDefault();
    setMsg("");
    setError("");
    const payload = { ...form, dataNascimento: form.dataNascimento || "1990-01-01", nomeResponsavel: form.nomeResponsavel || null };
    const { data } = await api.post("/pacientes", payload).catch(() => ({ data: null }));
    if (!data) return setError("Erro ao cadastrar paciente.");
    setMsg(`Paciente cadastrado com ID: ${data}`);
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Cadastro de paciente" subtitle="Fluxo rapido da recepcao" />
      <form className="panel" onSubmit={submit}>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {Object.entries(form).map(([k, v]) => <input key={k} className="field" type={k === "dataNascimento" ? "date" : "text"} placeholder={k} value={v} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />)}
        </div>
        {msg && <p className="mt-3 rounded-md border border-green-300 bg-green-50 p-2 text-sm text-green-700">{msg}</p>}
        {error && <p className="mt-3 rounded-md border border-red-300 bg-red-50 p-2 text-sm text-red-700">{error}</p>}
        <button className="mt-3 rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white">Cadastrar paciente</button>
      </form>
    </div>
  );
}

