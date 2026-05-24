import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageHeader from "../components/ui/PageHeader";
import RiskBadge from "../components/ui/RiskBadge";
import { api } from "../api/client";

export default function PacienteDetalhesPage() {
  const { pacienteId } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    api.get("/fila").then((r) => {
      const found = (r.data || []).find((p) => String(p.pacienteId) === String(pacienteId));
      setItem(found || null);
    }).catch(() => setItem(null));
  }, [pacienteId]);

  return (
    <div className="space-y-4">
      <PageHeader title="Detalhes do paciente" subtitle="Historico, triagem, status e linha do tempo" />
      {!item && <div className="panel text-sm text-slate-600">Paciente nao encontrado na fila atual.</div>}
      {item && (
        <>
          <section className="panel">
            <h2 className="text-lg font-bold">{item.nomePaciente}</h2>
            <div className="mt-2 flex items-center gap-2"><RiskBadge risk={item.corRisco} /><span className="text-sm text-slate-600">Status: {item.status}</span></div>
            <p className="mt-3 text-sm text-slate-700">Queixa principal: {item.queixaPrincipal || "Nao informada"}</p>
          </section>
          <section className="grid gap-3 xl:grid-cols-2">
            <article className="panel"><h3 className="font-bold">Triagem e atendimento</h3><p className="mt-2 text-sm text-slate-700">Sem detalhes adicionais expostos por este endpoint. Integrar endpoint dedicado para historico completo.</p></article>
            <article className="panel"><h3 className="font-bold">Linha do tempo</h3><ul className="mt-2 space-y-2 text-sm text-slate-700"><li className="rounded border border-slate-200 p-2">Chegada registrada</li><li className="rounded border border-slate-200 p-2">Aguardando triagem</li><li className="rounded border border-slate-200 p-2">Aguardando atendimento medico</li></ul></article>
          </section>
        </>
      )}
    </div>
  );
}
