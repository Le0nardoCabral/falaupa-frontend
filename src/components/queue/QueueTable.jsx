import RiskBadge from "../ui/RiskBadge";
import StatusBadge from "../ui/StatusBadge";
import { formatWait, getWaitLevel } from "../../lib/clinical";

export default function QueueTable({ patients = [], onCall, onStart, onRiskChange, onDetails }) {
  return (
    <div className="panel overflow-auto">
      <table className="data-table min-w-[980px]">
        <thead>
          <tr>
            <th>Paciente</th>
            <th>Idade</th>
            <th>Classificação</th>
            <th>Tempo de espera</th>
            <th>Status</th>
            <th>Chegada</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p) => (
            <tr key={p.pacienteId}>
              <td>
                <p className="font-semibold text-[#eaf5f1]">{p.nomePaciente}</p>
                <p className="text-xs text-[#88a39c]">{p.protocoloPublico || "Protocolo não informado"}</p>
              </td>
              <td>{p.idade ?? "-"}</td>
              <td><RiskBadge risk={p.corRisco} /></td>
              <td className={getWaitLevel(p.minutosEspera)}>{formatWait(p.minutosEspera)}</td>
              <td><StatusBadge tone={p.status === "EmAtendimento" ? "success" : "info"}>{p.status}</StatusBadge></td>
              <td>{p.horarioChegada ? new Date(p.horarioChegada).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) : "-"}</td>
              <td>
                <div className="flex flex-wrap gap-1.5">
                  <button className="btn btn-neutral !px-2.5 !py-1.5 !text-xs" onClick={() => onCall?.(p)}>Chamar</button>
                  <button className="btn btn-neutral !px-2.5 !py-1.5 !text-xs" onClick={() => onStart?.(p)}>Iniciar</button>
                  <button className="btn !border-amber-400/40 !bg-amber-950/30 !px-2.5 !py-1.5 !text-xs !text-amber-200" onClick={() => onRiskChange?.(p)}>Prioridade</button>
                  <button className="btn !border-emerald-400/40 !bg-emerald-950/30 !px-2.5 !py-1.5 !text-xs !text-emerald-200" onClick={() => onDetails?.(p)}>Detalhes</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

