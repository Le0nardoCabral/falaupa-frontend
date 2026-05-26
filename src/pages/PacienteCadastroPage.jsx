import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/ui/PageHeader";
import { api } from "../api/client";

const UPA_OPTIONS = ["UPA Unidade 1", "UPA Unidade 2", "UPA Unidade 3", "UPA Centro"];

function formatCpf(value) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export default function PacienteCadastroPage() {
  const [showDetails, setShowDetails] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [pacienteCriadoId, setPacienteCriadoId] = useState("");
  const [form, setForm] = useState({
    nomeCompleto: "",
    cpf: "",
    dataNascimento: "",
    unidadeUpa: "UPA Unidade 1",
    sexo: "",
    telefone: "",
    endereco: "",
    cidade: "",
    uf: "SP",
    nomeResponsavel: ""
  });

  const payload = useMemo(() => ({
    nomeCompleto: form.nomeCompleto.trim(),
    cpf: form.cpf.trim(),
    dataNascimento: form.dataNascimento || "1990-01-01",
    sexo: form.sexo || "NaoQueroIdentificar",
    telefone: form.telefone.trim() || "Nao informado",
    endereco: form.endereco.trim() || "Nao informado",
    cidade: form.cidade.trim() || "Sao Paulo",
    uf: form.uf.trim() || "SP",
    unidadeUpa: form.unidadeUpa,
    nomeResponsavel: form.nomeResponsavel.trim() || null
  }), [form]);

  async function submit(e) {
    e.preventDefault();
    setMsg("");
    setError("");
    setPacienteCriadoId("");

    const { data } = await api.post("/pacientes", payload).catch((err) => {
      const message = err?.response?.data;
      setError(typeof message === "string" ? message : "Nao foi possivel cadastrar o paciente.");
      return { data: null };
    });

    if (!data) return;

    setPacienteCriadoId(String(data));
    localStorage.setItem("triagem_prefill_paciente_id", String(data));
    setMsg("Paciente registrado com sucesso. Siga para Triagem para classificar e entrar no fluxo assistencial.");

    setForm((prev) => ({
      ...prev,
      nomeCompleto: "",
      cpf: "",
      dataNascimento: "",
      nomeResponsavel: "",
      telefone: "",
      endereco: ""
    }));
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Entrada rapida de paciente" subtitle="Recepcao registra o paciente em poucos campos e encaminha direto para triagem" />

      <form className="panel space-y-4" onSubmit={submit}>
        <section>
          <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-[#475569]">Campos obrigatorios</h3>
          <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <div className="xl:col-span-2">
              <label className="label">Nome completo</label>
              <input className="field" value={form.nomeCompleto} onChange={(e) => setForm({ ...form, nomeCompleto: e.target.value })} required />
            </div>
            <div>
              <label className="label">CPF</label>
              <input className="field" value={form.cpf} onChange={(e) => setForm({ ...form, cpf: formatCpf(e.target.value) })} required />
            </div>
            <div>
              <label className="label">Data de nascimento</label>
              <input className="field" type="date" value={form.dataNascimento} onChange={(e) => setForm({ ...form, dataNascimento: e.target.value })} />
            </div>
            <div className="xl:col-span-2">
              <label className="label">Unidade UPA</label>
              <select className="field" value={form.unidadeUpa} onChange={(e) => setForm({ ...form, unidadeUpa: e.target.value })}>
                {UPA_OPTIONS.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3">
          <button type="button" className="text-sm font-semibold text-[#334155]" onClick={() => setShowDetails((v) => !v)}>
            {showDetails ? "Ocultar dados adicionais" : "Mostrar dados adicionais (opcional)"}
          </button>

          {showDetails && (
            <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              <div>
                <label className="label">Sexo</label>
                <select className="field" value={form.sexo} onChange={(e) => setForm({ ...form, sexo: e.target.value })}>
                  <option value="">Selecione</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                  <option value="NaoQueroIdentificar">Nao quero identificar</option>
                </select>
              </div>
              <div>
                <label className="label">Telefone</label>
                <input className="field" value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} />
              </div>
              <div>
                <label className="label">Responsavel</label>
                <input className="field" value={form.nomeResponsavel} onChange={(e) => setForm({ ...form, nomeResponsavel: e.target.value })} />
              </div>
              <div className="md:col-span-2 xl:col-span-3">
                <label className="label">Endereco</label>
                <input className="field" value={form.endereco} onChange={(e) => setForm({ ...form, endereco: e.target.value })} />
              </div>
              <div>
                <label className="label">Cidade</label>
                <input className="field" value={form.cidade} onChange={(e) => setForm({ ...form, cidade: e.target.value })} placeholder="Sao Paulo" />
              </div>
              <div>
                <label className="label">UF</label>
                <input className="field" value={form.uf} onChange={(e) => setForm({ ...form, uf: e.target.value })} />
              </div>
            </div>
          )}
        </section>

        {msg && <p className="rounded-md border border-emerald-200 bg-emerald-50 p-2 text-sm text-emerald-700">{msg}</p>}
        {error && <p className="rounded-md border border-red-200 bg-red-50 p-2 text-sm text-red-700">{error}</p>}

        <div className="flex flex-wrap items-center gap-2 border-t border-[#E2E8F0] pt-4">
          <button className="btn btn-primary">Registrar na fila</button>
          <Link to="/app/triagem" className="btn btn-neutral">Ir para triagem</Link>
          {pacienteCriadoId && <span className="text-xs text-[#64748B]">Paciente ID: {pacienteCriadoId}</span>}
        </div>
      </form>
    </div>
  );
}
