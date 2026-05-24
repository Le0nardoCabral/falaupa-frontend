export default function ConfirmModal({ open, title, message, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl border border-[#29423c] bg-[#101f1c] p-4">
        <h3 className="text-lg font-bold text-[#ecf6f2]">{title}</h3>
        <p className="mt-2 text-sm text-[#9db5ae]">{message}</p>
        <div className="mt-4 flex justify-end gap-2">
          <button className="btn btn-neutral" onClick={onCancel}>Cancelar</button>
          <button className="btn btn-danger" onClick={onConfirm}>Confirmar</button>
        </div>
      </div>
    </div>
  );
}

