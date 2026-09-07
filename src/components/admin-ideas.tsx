"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mailbox, Trash2 } from "lucide-react";
import { TarjetaIdea, type IdeaPublica } from "@/components/buzon-ideas";
import type { EstadoIdea } from "@/lib/datos";

export function AdminIdeas({ ideas, esAdmin }: { ideas: IdeaPublica[]; esAdmin: boolean }) {
  return (
    <div>
      <h1 className="mb-1 flex items-center gap-2 text-2xl font-extrabold text-navy"><Mailbox className="size-7" aria-hidden="true" /> Ideas del buzón</h1>
      <p className="mb-4 text-mist">Lo que la gente escribe en la app. {esAdmin ? "Cambia el estado, responde o borra." : "Los admins responden y cambian el estado."}</p>
      {ideas.length === 0 && <p className="tarjeta p-6 text-center text-mist">Todavía no hay ideas. 🌱</p>}
      <ul className="grid gap-3">
        {ideas.map(i => (
          <TarjetaIdea key={i.id} idea={i}>
            {esAdmin && <Acciones idea={i} />}
          </TarjetaIdea>
        ))}
      </ul>
    </div>
  );
}

function Acciones({ idea }: { idea: IdeaPublica }) {
  const router = useRouter();
  const [estado, setEstado] = useState<EstadoIdea>(idea.estado);
  const [respuesta, setRespuesta] = useState(idea.respuesta ?? "");
  const [ocupado, setOcupado] = useState(false);
  const [error, setError] = useState("");

  const guardar = async () => {
    setOcupado(true); setError("");
    try {
      const r = await fetch("/api/ideas", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: idea.id, estado, respuesta }) });
      if (!r.ok) throw new Error((await r.json()).error || "No se pudo guardar");
      router.refresh();
    } catch (ex) { setError((ex as Error).message); } finally { setOcupado(false); }
  };
  const borrar = async () => {
    if (!confirm("¿Borrar esta idea del buzón?")) return;
    await fetch("/api/ideas", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: idea.id }) });
    router.refresh();
  };

  return (
    <div className="mt-1 flex flex-wrap items-center gap-2">
      <select value={estado} onChange={e => setEstado(e.target.value as EstadoIdea)} aria-label="Estado" className="min-h-10 rounded-xl border-2 border-line bg-white px-2 font-semibold">
        <option value="nueva">Nueva</option>
        <option value="en-proceso">En proceso</option>
        <option value="lista">¡Lista!</option>
      </select>
      <input type="text" value={respuesta} onChange={e => setRespuesta(e.target.value)} placeholder="Responder (opcional)" maxLength={300} className="min-h-10 min-w-40 flex-1 rounded-xl border-2 border-line bg-white px-3 outline-none focus:border-navy" />
      <button type="button" onClick={guardar} disabled={ocupado} className="min-h-10 rounded-xl bg-navy px-4 font-extrabold text-white disabled:opacity-50">Guardar</button>
      <button type="button" onClick={borrar} aria-label="Borrar esta idea" className="grid size-10 place-items-center rounded-xl bg-coral text-white"><Trash2 className="size-4" /></button>
      {error && <p className="w-full text-sm font-bold text-coral">{error}</p>}
    </div>
  );
}
