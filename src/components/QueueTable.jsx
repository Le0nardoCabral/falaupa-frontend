import RiskBadge from "./RiskBadge";

function ActionButton({ type, icon, label }) {
  if (type === "ambulance") {
    return (
      <button className="btn-ambulance" type="button">
        <i className={`fa-solid ${icon}`} /> {label}
      </button>
    );
  }

  const className = type === "outline" ? "btn-action btn-outline" : "btn-action";
  return (
    <button className={className} type="button">
      <i className={`fa-solid ${icon}`} /> {label}
    </button>
  );
}

export default function QueueTable({ rows }) {
  return (
    <div className="table-container">
      <table className="patient-table">
        <thead>
          <tr>
            <th>Paciente</th>
            <th>Sintomas Relatados via IA</th>
            <th>Envio</th>
            <th>Aguardando</th>
            <th>Classificação Sugerida</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className={row.rowClass}>
              <td>
                <strong>{row.nome}</strong>
                <span>{row.contexto}</span>
              </td>
              <td>{`"${row.sintomas}"`}</td>
              <td>{row.envio}</td>
              <td>
                <span className={row.esperaCritica ? "wait-critical" : undefined}>{row.espera}</span>
              </td>
              <td>
                <RiskBadge color={row.riscoCor} label={row.risco} />
              </td>
              <td>
                <ActionButton type={row.acaoTipo} icon={row.acaoIcone} label={row.acao} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
