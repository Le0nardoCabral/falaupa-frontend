export default function PageHeader({ title, subtitle, actions }) {
  return (
    <header className="panel page-wrap !p-4 md:!p-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#7f9b93]">FalaUPA Operations</p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-[#edf7f3]">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-[#9cb4ad]">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
}

