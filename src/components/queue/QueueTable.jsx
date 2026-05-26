import { motion } from "framer-motion";
import RiskBadge from "../ui/RiskBadge";
import StatusBadge from "../ui/StatusBadge";
import { formatWait, getWaitLevel } from "../../lib/clinical";

export default function QueueTable({ patients = [], onCall, onStart, onDetails }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="panel overflow-auto"
    >
      <table className="data-table min-w-[920px]">
        <thead>
          <tr>
            <th>Protocolo</th>
            <th>Paciente</th>
            <th>Classificacao</th>
            <th>Tempo de espera</th>
            <th>Status</th>
            <th>Queixa principal</th>
            <th>Acoes</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p) => (
            <tr key={p.pacienteId}>
              <td>{p.protocoloPublico || "-"}</td>
              <td>
                <p className="font-semibold text-[#111827]">{p.nomePaciente}</p>
                <p className="text-xs text-[#6b7280]">{p.cidade} · {p.unidadeUpa}</p>
              </td>
              <td><RiskBadge risk={p.corRisco} /></td>
              <td className={getWaitLevel(p.minutosEspera)}>{formatWait(p.minutosEspera)}</td>
              <td><StatusBadge tone={p.status === "EmAtendimento" ? "success" : "info"}>{p.status}</StatusBadge></td>
              <td className="max-w-[300px] truncate">{p.queixaPrincipal || "Pre-triagem IA concluida"}</td>
              <td>
                <div className="flex flex-wrap gap-1.5">
                  <button className="btn btn-neutral !px-2.5 !py-1.5 !text-xs" onClick={() => onCall?.(p)}>Chamar</button>
                  <button className="btn btn-neutral !px-2.5 !py-1.5 !text-xs" onClick={() => onStart?.(p)}>Iniciar</button>
                  <button className="btn !border-emerald-200 !bg-emerald-50 !px-2.5 !py-1.5 !text-xs !text-emerald-700" onClick={() => onDetails?.(p)}>Detalhes</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}

