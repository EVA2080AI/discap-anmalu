"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Check, X } from "lucide-react";

export type Pendiente = { tipo: "foto" | "video"; id: string; titulo: string; autor: string; fecha: string; url: string };

export function Aprobar({ pendientes }: { pendientes: Pendiente[] }) {
  const router = useRouter();
  const [ocupado, setOcupado] = useState<string | null>(null);
  const [mensajes, setMensajes] = useState<Record<string, string>>({});

  const revisar = async (p: Pendiente, accion: "aprobar" | "rechazar") => {
    setOcupado(p.id);
    try {
      const r = await fetch("/api/revisar", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ tipo: p.tipo, id: p.id, accion }) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "No se pudo");
      setMensajes(m => ({ ...m, [p.id]: d.mensaje }));
      setTimeout(() => router.refresh(), 1200);
    } catch (ex) { setMensajes(m => ({ ...m, [p.id]: "😕 " + (ex as Error).message })); }
    finally { setOcupado(null); }
  };

  return (
    <div>
      <h1 className="mb-1 flex items-center gap-2 text-2xl font-extrabold text-navy"><CheckCircle2 className="size-7" aria-hidden="true" /> Por aprobar</h1>
      <p className="mb-4 text-mist">Fotos y videos que subieron las alumnas. Al aprobar, se publican en la app al instante.</p>
      {pendientes.length === 0 && <p className="tarjeta p-6 text-center text-mist">Nada pendiente. ✨</p>}
      <ul className="grid gap-3">
        {pendientes.map(p => (
          <li key={p.id} className="tarjeta grid gap-3 p-4 sm:grid-cols-[120px_1fr] sm:items-center">
            {p.tipo === "foto" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.url} alt="" className="h-40 w-30 rounded-xl object-cover" />
            ) : (
              <video src={p.url} playsInline muted controls className="h-40 w-30 rounded-xl bg-black object-cover" />
            )}
            <div>
              <p className="font-extrabold text-navy-deep">{p.titulo}</p>
              <p className="text-sm text-mist">Subido por {p.autor} · {new Date(p.fecha).toLocaleDateString("es-CO")}</p>
              {mensajes[p.id] ? (
                <p className="mt-3 rounded-xl bg-lime-soft p-3 font-extrabold text-[#2e6b12]">{mensajes[p.id]}</p>
              ) : (
                <div className="mt-3 flex gap-2">
                  <button type="button" disabled={ocupado === p.id} onClick={() => revisar(p, "aprobar")} className="flex min-h-11 items-center gap-1.5 rounded-xl bg-[#3aa655] px-4 font-extrabold text-white disabled:opacity-50"><Check className="size-5" aria-hidden="true" /> Aprobar</button>
                  <button type="button" disabled={ocupado === p.id} onClick={() => revisar(p, "rechazar")} className="flex min-h-11 items-center gap-1.5 rounded-xl bg-coral px-4 font-extrabold text-white disabled:opacity-50"><X className="size-5" aria-hidden="true" /> Rechazar</button>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
