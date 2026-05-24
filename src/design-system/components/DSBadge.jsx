export function DSBadge({ tone = "blue", children }) {
  return <span className={`ds-badge ds-badge--${tone}`}>{children}</span>;
}
