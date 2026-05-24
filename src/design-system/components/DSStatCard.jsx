export function DSStatCard({ label, value }) {
  return (
    <div className="ds-stat-card">
      <span className="ds-stat-card__label">{label}</span>
      <strong className="ds-stat-card__value">{value}</strong>
    </div>
  );
}
