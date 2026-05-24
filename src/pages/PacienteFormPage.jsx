import { useState } from "react";
import { api } from "../api/client";

export default function PacienteFormPage() {
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [cpf, setCpf] = useState("");

  async function salvar(e) {
    e.preventDefault();
    await api.post("/pacientes", { nomeCompleto, cpf, dataNascimento: "1990-01-01", sexo: "F", telefone: "", endereco: "", nomeResponsavel: null });
    alert("Paciente cadastrado");
  }

  return <form className="card" onSubmit={salvar}><h2>Cadastro de Paciente</h2><input placeholder="Nome completo" value={nomeCompleto} onChange={(e)=>setNomeCompleto(e.target.value)} /><input placeholder="CPF" value={cpf} onChange={(e)=>setCpf(e.target.value)} /><button>Salvar</button></form>;
}

