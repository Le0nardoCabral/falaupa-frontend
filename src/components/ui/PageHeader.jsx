import { motion } from "framer-motion";

export default function PageHeader({ title, subtitle, actions }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="panel page-wrap"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#6b7280]">FalaUPA Operations</p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-[#111827]">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-[#6b7280]">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </motion.header>
  );
}

