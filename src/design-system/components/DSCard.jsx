export function DSCard({ className = "", children }) {
  return <div className={`ds-card ${className}`.trim()}>{children}</div>;
}
