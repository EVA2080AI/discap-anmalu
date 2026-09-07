"use client";

import { useCallback, useEffect, useState } from "react";
import { Send } from "lucide-react";
import { TIPOS_IDEA, ESTADOS_IDEA, type TipoIdea, type EstadoIdea } from "@/lib/datos";
import { prefs } from "@/lib/preferencias";
import { sonidoExito } from "@/lib/sonido";
import { cn } from "@/lib/utils";

export type IdeaPublica = { id: string; tipo: TipoIdea; nombre: string; mensaje: string; estado: EstadoIdea; respuesta: string | null; creadoEn: string };

export function BuzonIdeas() {
  const [tipo, setTipo] = useState<TipoIdea>("idea");
  const [nombre, setNombre] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState<{ ok: boolean; texto: string } | null>(null);
  const [ideas, setIdeas] = useState<IdeaPublica[] | null>(null);
  const [mias, setMias] = useState<string[]>([]);

  const cargar = useCallback(async () => {
    try { setIdeas(await (await fetch("/api/ideas", { cache: "no-store" })).json()); } catch { setIdeas([]); }
  }, []);
  useEffect(() => { const t = setTimeout(() => { setMias(prefs.misIdeas()); cargar(); }, 0); return () => clearTimeout(t); }, [cargar]);

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true); setResultado(null);
    try {
      const r = await fetch("/api/ideas", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ tipo, nombre, mensaje }) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "No se pudo enviar");
      setResultado({ ok: true, texto: "🎉 ¡Gracias! Tu idea ya está en el buzón." });
      setMensaje("");
      if (d.id) { prefs.agregarIdea(d.id); setMias(m => [...m, d.id]); }
      sonidoExito();
      cargar();
    } catch (ex) {
      setResultado({ ok: false, texto: "😕 " + (ex as Error).message });
    } finally { setEnviando(false); }
  };

  return (
    <div className="aparecer">
      <h1 className="mb-1 text-3xl font-extrabold text-navy">Buzón de ideas</h1>
      <p className="mb-5 text-mist">Tu idea llega directo a Ana Lucía, Antonella y María Paula. Cuando la hagan, aquí aparece ✅.</p>

      <form onSubmit={enviar} className="grid gap-3">
        <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="¿Qué quieres contarnos?">
          {(Object.keys(TIPOS_IDEA) as TipoIdea[]).map(t => (
            <button key={t} type="button" role="radio" aria-checked={tipo === t} onClick={() => setTipo(t)} className="ficha sol text-[13px]">
              <span className="text-3xl" aria-hidden="true">{TIPOS_IDEA[t].emoji}</span>
              {TIPOS_IDEA[t].texto}
            </button>
          ))}
        </div>
        <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Tu nombre (o déjalo vacío)" maxLength={40} autoComplete="name" className="rounded-2xl border-2 border-line bg-white px-4 py-3 text-lg outline-none focus:border-navy" />
        <textarea value={mensaje} onChange={e => setMensaje(e.target.value)} rows={3} maxLength={400} required placeholder="Escribe aquí… por ejemplo: «quiero los números en señas»" className="rounded-2xl border-2 border-line bg-white px-4 py-3 text-lg outline-none focus:border-navy" />
        <button type="submit" disabled={enviando || mensaje.trim().length < 3} className="btn-principal">
          Enviar <Send className="size-5" aria-hidden="true" />
        </button>
        {resultado && (
          <p role="status" className={cn("celebrar rounded-2xl p-3 text-center font-extrabold", resultado.ok ? "bg-lime-soft text-[#2e6b12]" : "bg-coral-soft text-coral")}>
            {resultado.texto}
          </p>
        )}
      </form>

      <section className="mt-8">
        <h2 className="mb-3 text-lg font-bold text-navy-deep">Ideas de todos</h2>
        {ideas === null ? (
          <p className="text-mist">Cargando…</p>
        ) : ideas.length === 0 ? (
          <p className="text-mist">Sé la primera persona en dejar una idea. 🌱</p>
        ) : (
          <ul className="grid gap-3">
            {[...ideas].sort((a, b) => Number(mias.includes(b.id)) - Number(mias.includes(a.id))).map(i => <TarjetaIdea key={i.id} idea={i} mia={mias.includes(i.id)} />)}
          </ul>
        )}
      </section>
    </div>
  );
}

export function TarjetaIdea({ idea, mia, children }: { idea: IdeaPublica; mia?: boolean; children?: React.ReactNode }) {
  return (
    <li className={cn("tarjeta grid gap-1.5 p-4", mia && "border-[3px] border-sun")}>
      <div className="flex flex-wrap items-center gap-2">
        {mia && <span className="rounded-full bg-sun px-2 py-0.5 text-xs font-extrabold text-navy-deep">Tu idea</span>}
        <span className="text-2xl" aria-hidden="true">{TIPOS_IDEA[idea.tipo]?.emoji ?? "💬"}</span>
        <span className="font-extrabold text-navy-deep">{idea.nombre}</span>
        <span className={cn("ml-auto rounded-full px-2.5 py-1 text-xs font-extrabold", idea.estado === "lista" ? "bg-lime-soft text-[#2e6b12]" : idea.estado === "en-proceso" ? "bg-navy-soft text-navy" : "bg-sun-soft text-[#8a6d00]")}>
          {ESTADOS_IDEA[idea.estado] ?? idea.estado}
        </span>
      </div>
      <p>{idea.mensaje}</p>
      {idea.respuesta && <p className="rounded-lg border-l-4 border-lime bg-lime-soft px-3 py-2 text-sm">💬 {idea.respuesta}</p>}
      {children}
    </li>
  );
}
