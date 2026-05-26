import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useAuthStore } from "../store/authStore";

function normalize(text) {
  return String(text || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export default function PacienteFilaPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [protocolo, setProtocolo] = useState(localStorage.getItem("last_protocol") || "");
  const [protocoloAtivo, setProtocoloAtivo] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadActiveProtocol() {
      setLoading(true);
      const { data } = await api.get("/fila").catch(() => ({ data: [] }));
      const list = Array.isArray(data) ? data : Array.isArray(data?.value) ? data.value : [];
      const ativo = list.find((p) =>
        normalize(p.nomePaciente) === normalize(user?.nome) &&
        !["Finalizado", "Encaminhado", "Cancelado"].includes(String(p.status))
      );

      if (!mounted) return;
      if (ativo?.protocoloPublico) {
        setProtocoloAtivo(ativo.protocoloPublico);
        setProtocolo((prev) => prev || ativo.protocoloPublico);
        localStorage.setItem("last_protocol", ativo.protocoloPublico);
      }
      setLoading(false);
    }

    loadActiveProtocol();
    return () => {
      mounted = false;
    };
  }, [user?.nome]);

  function goToTrack(e) {
    e.preventDefault();
    if (!protocolo.trim()) return;
    localStorage.setItem("last_protocol", protocolo.trim());
    navigate(`/acompanhar/${protocolo.trim()}`);
  }

  return (
    <div className="space-y-4">
      <header className="panel">
        <h1 className="text-2xl font-extrabold text-[#0F172A]">Acompanhar posicao na fila</h1>
        <p className="text-sm text-[#475569]">Seu protocolo ativo e carregado automaticamente quando estiver em fila.</p>
      </header>

      <form onSubmit={goToTrack} className="panel space-y-3">
        {loading && <p className="text-sm text-[#64748B]">Buscando seu protocolo ativo...</p>}
        {!loading && protocoloAtivo && (
          <div className="rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] p-3">
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#166534]">Protocolo ativo</p>
            <p className="mt-1 text-lg font-extrabold text-[#0F172A]">{protocoloAtivo}</p>
          </div>
        )}
        <div>
          <label className="label">Protocolo</label>
          <input className="field" value={protocolo} onChange={(e) => setProtocolo(e.target.value)} placeholder="Ex.: UPA-DEMO-0001" />
        </div>
        <div className="flex gap-2">
          <button className="btn btn-primary" type="submit">Acompanhar agora</button>
          <Link to="/app/paciente/triagem" className="btn btn-neutral">Ainda nao tenho protocolo</Link>
        </div>
      </form>
    </div>
  );
}
