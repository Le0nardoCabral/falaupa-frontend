import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const PROFILE_KEY = "patient_profile";

export default function PacienteCadastroPacientePage() {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    nomeCompleto: "",
    cpf: "",
    dataNascimento: "",
    telefone: "",
    endereco: "",
    convenio: "",
    alergias: "",
    doencasPreExistentes: "",
    medicamentos: "",
    historicoBasico: ""
  });

  useEffect(() => {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      setForm((prev) => ({ ...prev, ...parsed }));
    } catch {
      // ignore invalid local cache
    }
  }, []);

  function onSave(e) {
    e.preventDefault();
    localStorage.setItem(PROFILE_KEY, JSON.stringify(form));
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }

  return (
    <div className="space-y-4">
      <header className="panel">
        <h1 className="mt-1 text-2xl font-extrabold text-[#111827]">Cadastro do Paciente</h1>
        <p className="text-sm text-[#6b7280]">Preencha seus dados primeiro. A pre-triagem por sintomas e a etapa seguinte.</p>
      </header>

      <form className="panel" onSubmit={onSave}>
        <div className="grid gap-3 md:grid-cols-2">
          {Object.entries(form).map(([k, v]) => (
            <div key={k} className={k === "historicoBasico" ? "md:col-span-2" : ""}>
              <label className="label">{k}</label>
              {k === "historicoBasico" ? (
                <textarea className="field" rows={3} value={v} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
              ) : (
                <input className="field" value={v} onChange={(e) => setForm({ ...form, [k]: e.target.value })} type={k === "dataNascimento" ? "date" : "text"} />
              )}
            </div>
          ))}
        </div>

        {saved && <p className="mt-3 rounded-md border border-emerald-200 bg-emerald-50 p-2 text-sm text-emerald-700">Cadastro salvo.</p>}

        <div className="mt-4 grid gap-2 md:grid-cols-2">
          <button className="btn btn-primary" type="submit">Salvar cadastro</button>
          <Link className="btn btn-neutral" to="/app/paciente/triagem">Ir para pre-triagem</Link>
        </div>
      </form>
    </div>
  );
}
