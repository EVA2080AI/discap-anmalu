"use client";

import { useEffect, useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import { Camera, Clapperboard, Plus } from "lucide-react";
import { AVATARES, AVATAR_IDS, LETRAS, fotoOriginal, type AvatarId } from "@/lib/datos";
import { cn } from "@/lib/utils";

/* Flujo de subida (igual para foto y video):
   navegador → Vercel Blob (directo, con progreso) → /api/publicar → base de datos → app */

function useAutor() {
  const [autor, setAutor] = useState("");
  useEffect(() => {
    // se lee después de montar (en el servidor no hay localStorage); diferido para no re-renderizar en cascada
    const t = setTimeout(() => { try { const v = localStorage.getItem("autor"); if (v) setAutor(v); } catch {} }, 0);
    return () => clearTimeout(t);
  }, []);
  const cambiar = (v: string) => { setAutor(v); try { localStorage.setItem("autor", v); } catch {} };
  return [autor, cambiar] as const;
}

async function subirAlBlob(archivo: Blob, nombre: string, alProgreso: (p: number) => void) {
  const r = await upload(`subidas/${Date.now()}-${nombre}`, archivo, {
    access: "public",
    handleUploadUrl: "/api/subir-token",
    onUploadProgress: ev => alProgreso(ev.percentage),
  });
  return r.url;
}

async function publicar(datos: Record<string, unknown>) {
  const r = await fetch("/api/publicar", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(datos) });
  const d = await r.json();
  if (!r.ok) throw new Error(d.error || "No se pudo publicar");
  return d as { estado: string; mensaje: string };
}

function CampoAutor({ autor, onChange }: { autor: string; onChange: (v: string) => void }) {
  return (
    <label className="mb-5 flex items-center gap-3 font-bold text-navy-deep">
      ¿Cómo te llamas?
      <input type="text" value={autor} onChange={e => onChange(e.target.value)} maxLength={40} placeholder="Tu nombre" className="min-w-0 flex-1 rounded-xl border-2 border-line bg-white px-3 py-2.5 font-semibold outline-none focus:border-navy" />
    </label>
  );
}

function Progreso({ valor, texto }: { valor: number; texto: string }) {
  return (
    <div className="relative mt-3 h-5 overflow-hidden rounded-full bg-white shadow-soft" role="progressbar" aria-valuenow={Math.round(valor)} aria-valuemin={0} aria-valuemax={100}>
      <div className="h-full bg-gradient-to-r from-lime to-sun transition-[width]" style={{ width: `${valor}%` }} />
      <span className="absolute inset-0 grid place-items-center text-xs font-extrabold text-navy-deep">{texto}</span>
    </div>
  );
}

function Resultado({ r }: { r: { ok: boolean; texto: string } | null }) {
  if (!r) return null;
  return <p role="status" className={cn("celebrar mt-3 rounded-2xl p-3.5 text-center font-extrabold", r.ok ? "bg-lime-soft text-[#2e6b12]" : "bg-coral-soft text-coral")}>{r.texto}</p>;
}

// =====================================================================
// FOTO DE LETRA
// =====================================================================
export function SubirFoto({ letrasConFoto, total }: { letrasConFoto?: Record<AvatarId, number>; total?: number }) {
  const [autor, setAutor] = useAutor();
  const [avatar, setAvatar] = useState<AvatarId | "">("");
  const [letra, setLetra] = useState("");
  const [blob, setBlob] = useState<Blob | null>(null);
  const [info, setInfo] = useState("");
  const [progreso, setProgreso] = useState<{ valor: number; texto: string } | null>(null);
  const [resultado, setResultado] = useState<{ ok: boolean; texto: string } | null>(null);
  const lienzo = useRef<HTMLCanvasElement>(null);
  const entrada = useRef<HTMLInputElement>(null);

  const alElegir = async (f: File | undefined) => {
    if (!f) return;
    // Reducimos a 800 px de lado mayor y JPEG al 80 %: de 5 MB pasa a ~50 KB.
    const img = await createImageBitmap(f).catch(() => null);
    if (!img) { setResultado({ ok: false, texto: "No pude leer esa imagen. Prueba con otra." }); return; }
    const escala = Math.min(1, 800 / Math.max(img.width, img.height));
    const c = lienzo.current!;
    c.width = Math.round(img.width * escala); c.height = Math.round(img.height * escala);
    c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
    const b = await new Promise<Blob | null>(res => c.toBlob(res, "image/jpeg", 0.8));
    setBlob(b);
    setInfo(`${c.width}×${c.height} px · ${Math.round((b?.size ?? 0) / 1024)} KB`);
    setResultado(null);
  };

  const subir = async () => {
    if (!avatar || !letra || !blob) return;
    setResultado(null);
    try {
      setProgreso({ valor: 0, texto: "Subiendo…" });
      const url = await subirAlBlob(blob, `${avatar}-${letra === "Ñ" ? "ENIE" : letra}.jpg`, p => setProgreso({ valor: p, texto: `Subiendo… ${Math.round(p)}%` }));
      setProgreso({ valor: 100, texto: "Guardando…" });
      const r = await publicar({ tipo: "foto", url, avatar, letra, autor });
      setResultado({ ok: true, texto: "🎉 " + r.mensaje });
      setBlob(null); setInfo(""); if (entrada.current) entrada.current.value = "";
    } catch (ex) { setResultado({ ok: false, texto: "😕 " + (ex as Error).message }); }
    finally { setProgreso(null); }
  };

  return (
    <div>
      <h1 className="mb-4 flex items-center gap-2 text-2xl font-extrabold text-navy"><Camera className="size-7" aria-hidden="true" /> Foto de letra</h1>
      <CampoAutor autor={autor} onChange={setAutor} />

      <section className="mb-5">
        <h2 className="mb-2 text-lg font-bold text-navy-deep">1. ¿Quién hace la seña?</h2>
        <div className="grid grid-cols-3 gap-2" role="radiogroup">
          {AVATAR_IDS.map(id => (
            <button key={id} type="button" role="radio" aria-checked={avatar === id} className="ficha" onClick={() => setAvatar(id)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={fotoOriginal(id, "A") ?? ""} alt="" className="size-14 rounded-full object-cover object-top" />
              {AVATARES[id].nombre}
              {letrasConFoto && total && (
                <span className="w-full">
                  <span className="block h-1.5 overflow-hidden rounded-full bg-line"><span className="block h-full rounded-full bg-lime" style={{ width: `${Math.round((letrasConFoto[id] / total) * 100)}%` }} /></span>
                  <span className="text-[11px] font-semibold text-mist">{letrasConFoto[id]} de {total} letras</span>
                </span>
              )}
            </button>
          ))}
        </div>
        {letrasConFoto && total && Object.values(letrasConFoto).some(n => n < total) && <p className="mt-2 text-sm text-mist">Falta la <b>Ñ</b>: cuando las tres la tengan, el traductor deja de mostrar solo la seña formal.</p>}
      </section>

      <section className="mb-5">
        <h2 className="mb-2 text-lg font-bold text-navy-deep">2. ¿Qué letra?</h2>
        <div className="grid grid-cols-6 gap-2 sm:grid-cols-9" role="radiogroup">
          {LETRAS.map(l => (
            <button key={l} type="button" role="radio" aria-checked={letra === l} className={cn("tecla", letra === l && "activo")} onClick={() => setLetra(l)}>{l}</button>
          ))}
        </div>
      </section>

      <section className="mb-5">
        <h2 className="mb-2 text-lg font-bold text-navy-deep">3. La foto</h2>
        <label className="flex cursor-pointer flex-col items-center gap-1 rounded-card border-[3px] border-dashed border-line bg-white px-4 py-7 text-center active:border-lime active:bg-lime-soft">
          <input ref={entrada} type="file" accept="image/*" hidden onChange={e => alElegir(e.target.files?.[0])} />
          <span className="text-4xl" aria-hidden="true">📷</span>
          <span className="font-extrabold text-navy">Toca para tomar o elegir la foto</span>
          <span className="text-sm text-mist">Vertical, fondo claro, que se vea bien la mano</span>
        </label>
        <div className={cn("mt-3 text-center", !blob && "hidden")}>
          <canvas ref={lienzo} className="mx-auto w-full max-w-60 rounded-2xl shadow-soft" />
          <p className="mt-1.5 text-sm text-mist">{info}</p>
        </div>
      </section>

      <button type="button" onClick={subir} disabled={!(avatar && letra && blob) || !!progreso} className="btn-principal w-full">Subir foto</button>
      {progreso && <Progreso {...progreso} />}
      <Resultado r={resultado} />
    </div>
  );
}

// =====================================================================
// VIDEO
// =====================================================================
type Cat = { slug: string; titulo: string; emoji: string };

export function SubirVideo({ categorias, esAdmin }: { categorias: Cat[]; esAdmin: boolean }) {
  const [autor, setAutor] = useAutor();
  const [categoria, setCategoria] = useState("");
  const [nuevaTitulo, setNuevaTitulo] = useState("");
  const [nuevaEmoji, setNuevaEmoji] = useState("");
  const [nombre, setNombre] = useState("");
  const [archivo, setArchivo] = useState<File | null>(null);
  const [previa, setPrevia] = useState("");
  const [progreso, setProgreso] = useState<{ valor: number; texto: string } | null>(null);
  const [resultado, setResultado] = useState<{ ok: boolean; texto: string } | null>(null);
  const entrada = useRef<HTMLInputElement>(null);

  const esNueva = categoria === "__nueva__";
  const catFinal = esNueva ? nuevaTitulo.trim() : categoria;
  const mb = archivo ? archivo.size / 1024 / 1024 : 0;
  const listo = !!catFinal && !!nombre.trim() && !!archivo && mb <= 25;

  const alElegir = (f: File | undefined) => {
    if (!f) return;
    setArchivo(f);
    setPrevia(URL.createObjectURL(f));
    setResultado(null);
  };

  const subir = async () => {
    if (!listo || !archivo) return;
    setResultado(null);
    try {
      setProgreso({ valor: 0, texto: "Subiendo…" });
      const url = await subirAlBlob(archivo, archivo.name.replace(/[^a-zA-Z0-9.]+/g, "-"), p => setProgreso({ valor: p, texto: `Subiendo… ${Math.round(p)}%` }));
      setProgreso({ valor: 100, texto: "Guardando…" });
      const r = await publicar({ tipo: "video", url, categoria: catFinal, nombre: nombre.trim(), emoji: esNueva ? nuevaEmoji.trim() || "🎬" : undefined, autor });
      setResultado({ ok: true, texto: "🎉 " + r.mensaje });
      setArchivo(null); setPrevia(""); setNombre(""); if (entrada.current) entrada.current.value = "";
    } catch (ex) { setResultado({ ok: false, texto: "😕 " + (ex as Error).message }); }
    finally { setProgreso(null); }
  };

  return (
    <div>
      <h1 className="mb-4 flex items-center gap-2 text-2xl font-extrabold text-navy"><Clapperboard className="size-7" aria-hidden="true" /> Video de una seña</h1>
      <CampoAutor autor={autor} onChange={setAutor} />

      <section className="mb-5">
        <h2 className="mb-2 text-lg font-bold text-navy-deep">1. ¿En qué categoría va?</h2>
        <div className="flex flex-wrap gap-2" role="radiogroup">
          {categorias.map(c => (
            <button key={c.slug} type="button" role="radio" aria-checked={categoria === c.slug} className="ficha flex-row px-4" onClick={() => setCategoria(c.slug)}>
              <span className="text-xl" aria-hidden="true">{c.emoji}</span>{c.titulo}
            </button>
          ))}
          {esAdmin && (
            <button type="button" role="radio" aria-checked={esNueva} className="ficha flex-row px-4" onClick={() => setCategoria("__nueva__")}><Plus className="size-5" aria-hidden="true" /> Nueva</button>
          )}
        </div>
        {esNueva && (
          <div className="mt-3 flex gap-2">
            <input type="text" value={nuevaTitulo} onChange={e => setNuevaTitulo(e.target.value)} placeholder="Nueva categoría (ej: Números)" maxLength={30} className="min-w-0 flex-1 rounded-xl border-2 border-line bg-white px-3 py-2.5 outline-none focus:border-navy" />
            <input type="text" value={nuevaEmoji} onChange={e => setNuevaEmoji(e.target.value)} placeholder="🔢" maxLength={4} aria-label="Emoji" className="w-18 rounded-xl border-2 border-line bg-white px-2 py-2.5 text-center text-2xl outline-none focus:border-navy" />
          </div>
        )}
      </section>

      <section className="mb-5">
        <h2 className="mb-2 text-lg font-bold text-navy-deep">2. ¿Qué dice la seña?</h2>
        <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Ej: Gracias" maxLength={40} className="w-full rounded-2xl border-2 border-line bg-white px-4 py-3 text-lg outline-none focus:border-navy" />
      </section>

      <section className="mb-5">
        <h2 className="mb-2 text-lg font-bold text-navy-deep">3. El video</h2>
        <label className="flex cursor-pointer flex-col items-center gap-1 rounded-card border-[3px] border-dashed border-line bg-white px-4 py-7 text-center active:border-lime active:bg-lime-soft">
          <input ref={entrada} type="file" accept="video/*" hidden onChange={e => alElegir(e.target.files?.[0])} />
          <span className="text-4xl" aria-hidden="true">🎬</span>
          <span className="font-extrabold text-navy">Toca para grabar o elegir el video</span>
          <span className="text-sm text-mist">Vertical, 1 a 3 segundos, con luz de frente</span>
        </label>
        <ul className="mt-2 grid gap-1 rounded-xl bg-sun-soft p-3 text-xs text-navy-deep">
          <li>• Que se vean <b>la cara y las dos manos</b>: en LSC la expresión de la cara es parte de la seña.</li>
          <li>• Fondo claro y liso, sin contraluz. Cámara a la altura del pecho.</li>
          <li>• Haz la seña una sola vez, despacio y completa. Máximo 3 segundos.</li>
        </ul>
        {previa && (
          <div className="mt-3 text-center">
            <video src={previa} playsInline muted controls className="mx-auto w-full max-w-60 rounded-2xl bg-black shadow-soft" />
            <p className="mt-1.5 text-sm text-mist">{mb.toFixed(1)} MB{mb > 12 && " · Muy pesado: graba máximo 3 segundos"}{mb > 25 && " · Supera el límite de 25 MB"}</p>
          </div>
        )}
      </section>

      <button type="button" onClick={subir} disabled={!listo || !!progreso} className="btn-principal w-full">Subir video</button>
      {progreso && <Progreso {...progreso} />}
      <Resultado r={resultado} />
    </div>
  );
}
