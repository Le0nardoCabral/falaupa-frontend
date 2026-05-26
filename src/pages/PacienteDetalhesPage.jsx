import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import PageHeader from "../components/ui/PageHeader";
import RiskBadge from "../components/ui/RiskBadge";
import { api } from "../api/client";

export default function PacienteDetalhesPage() {
  const { pacienteId } = useParams();
  const [filaItem, setFilaItem] = useState(null);
  const [paciente, setPaciente] = useState(null);

  useEffect(() => {
    api.get(`/pacientes/${pacienteId}`).then((r) => setPaciente(r.data)).catch(() => setPaciente(null));
    api.get("/fila").then((r) => {
      const list = Array.isArray(r.data) ? r.data : Array.isArray(r.data?.value) ? r.data.value : [];
      const found = list.find((p) => String(p.pacienteId) === String(pacienteId));
      setFilaItem(found || null);
    }).catch(() => setFilaItem(null));
  }, [pacienteId]);

  const entrada = useMemo(() => {
    if (!paciente?.entradaEm) return "-";
    return new Date(paciente.entradaEm).toLocaleString("pt-BR");
  }, [paciente]);

  return (
    <div className="space-y-4">
      <PageHeader title="Detalhes do paciente" subtitle="Dados cadastrais, status atual e contexto clinico" />

      {!paciente && <div className="panel text-sm text-slate-600">Paciente nao encontrado.</div>}

      {paciente && (
        <>
          <section className="panel">
            <h2 className="text-lg font-bold text-[#0F172A]">{paciente.nomeCompleto}</h2>
            <p className="mt-1 text-sm text-[#475569]">Protocolo: {paciente.protocoloPublico} · Entrada: {entrada}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {filaItem ? <RiskBadge risk={filaItem.corRisco} /> : <span className="rounded-full border border-[#E2E8F0] bg-white px-2 py-1 text-xs text-[#64748B]">Sem classificacao</span>}
              <span className="rounded-full border border-[#E2E8F0] bg-white px-2 py-1 text-xs text-[#64748B]">Status: {filaItem?.status || "Fora da fila"}</span>
            </div>
          </section>

          <section className="grid gap-3 xl:grid-cols-2">
            <article className="panel">
              <h3 className="font-bold text-[#0F172A]">Cadastro</h3>
              <div className="mt-2 space-y-1 text-sm text-[#475569]">
                <p>CPF: {paciente.cpf}</p>
                <p>Nascimento: {String(paciente.dataNascimento || "-")}</p>
                <p>Telefone: {paciente.telefone || "-"}</p>
                <p>Cidade/UF: {paciente.cidade} - {paciente.uf}</p>
                <p>UPA: {paciente.unidadeUpa}</p>
              </div>
            </article>

            <article className="panel">
              <h3 className="font-bold text-[#0F172A]">Contexto clinico atual</h3>
              <div className="mt-2 space-y-1 text-sm text-[#475569]">
                <p>Queixa principal: {filaItem?.queixaPrincipal || "Aguardando triagem"}</p>
                <p>Tempo de espera: {filaItem?.minutosEspera ? `${filaItem.minutosEspera} min` : "-"}</p>
                <p>Origem de cadastro: {paciente.origemCadastro || "-"}</p>
              </div>
            </article>
          </section>
        </>
      )}
    </div>
  );
}

