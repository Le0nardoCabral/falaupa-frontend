export function DSButton({ variant = "primary", className = "", children, ...props }) {
  return (
    <button className={`ds-button ds-button--${variant} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}
