export default function RiskBadge({ color, label }) {
  return <span className={`risk-badge ${color}`}>{label}</span>;
}
