"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Play, Pause, SkipBack, SkipForward, Turtle, Rabbit } from "lucide-react";
import { AVATARES, AVATAR_IDS, LETRAS, fotoOriginal, normalizar, senaFormal, type AvatarId } from "@/lib/datos";
import { cn } from "@/lib/utils";

type Elegido = AvatarId | "aleatorio";
type Paso = { letra: string; avatar: AvatarId };

const EJEMPLOS = ["hola", "mamá", "amor", "Colombia"];

function elegirAleatorio<T>(lista: readonly T[]) {
  return lista[Math.floor(Math.random() * lista.length)];
}

/** Traductor: texto → letra por letra, con la foto de la niña y la seña formal. */
export function Traductor({ fotosExtra }: { fotosExtra: Record<string, string> }) {
  const [avatar, setAvatar] = useState<Elegido>("ana");
  const [texto, setTexto] = useState("");
  const [secuencia, setSecuencia] = useState<Paso[]>([]);
  const [indice, setIndice] = useState(0);
  const [reproduciendo, setReproduciendo] = useState(false);
  const [velocidad, setVelocidad] = useState(1700); // 400 (lento) … 2500 (rápido)
  const [ampliada, setAmpliada] = useState(false);
  const [fotoRota, setFotoRota] = useState<string | null>(null); // src de la foto que falló
  const escenario = useRef<HTMLDivElement>(null);

  const fotoDe = useCallback(
    (a: AvatarId, letra: string) => fotosExtra[`${a}/${letra}`] ?? fotoOriginal(a, letra),
    [fotosExtra],
  );

  const armar = useCallback(
    (entrada: string) => {
      const limpio = normalizar(entrada);
      if (!limpio) return;
      const pasos = limpio.split("").map(ch => ({
        letra: ch,
        avatar: avatar === "aleatorio" ? elegirAleatorio(AVATAR_IDS) : avatar,
      }));
      // precargar todas las fotos para que no parpadee
      pasos.forEach(p => {
        if (p.letra === " ") return;
        new Image().src = senaFormal(p.letra);
        const f = fotoDe(p.avatar, p.letra);
        if (f) new Image().src = f;
      });
      setSecuencia(pasos);
      setIndice(0);
      setReproduciendo(true);
      setTimeout(() => escenario.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    },
    [avatar, fotoDe],
  );

  // reproducción automática: cada paso programa el siguiente; al llegar al final se detiene
  useEffect(() => {
    if (!reproduciendo) return;
    const t = setTimeout(() => {
      if (indice >= secuencia.length - 1) setReproduciendo(false);
      else setIndice(i => i + 1);
    }, 2900 - velocidad);
    return () => clearTimeout(t);
  }, [reproduciendo, indice, secuencia.length, velocidad]);

  const paso = secuencia[indice];
  const esEspacio = paso?.letra === " ";
  const foto = paso && !esEspacio ? fotoDe(paso.avatar, paso.letra) : null;
  const soloFormal = !!paso && !esEspacio && (!foto || fotoRota === foto);

  const alFinal = indice >= secuencia.length - 1;
  const ir = (i: number) => { setReproduciendo(false); setIndice(Math.max(0, Math.min(i, secuencia.length - 1))); };
  const play = () => {
    if (reproduciendo) { setReproduciendo(false); return; }
    if (alFinal) setIndice(0);
    setReproduciendo(true);
  };

  const elegirAvatar = (a: Elegido) => {
    setAvatar(a);
    if (secuencia.length) {
      setSecuencia(s => s.map(p => ({ ...p, avatar: a === "aleatorio" ? elegirAleatorio(AVATAR_IDS) : a })));
    }
  };

  const nombreAvatar = useMemo(() => (paso ? AVATARES[paso.avatar].nombre : ""), [paso]);

  return (
    <div className="aparecer md:grid md:grid-cols-[1fr_minmax(300px,380px)] md:items-start md:gap-8">
      <div>
        <h1 className="mb-4 text-3xl font-extrabold text-navy">Traductor</h1>

        {/* 1. Avatar */}
        <section className="mb-6">
          <h2 className="mb-2 text-lg font-bold text-navy-deep">1. Elige quién hace las señas</h2>
          <div className="grid grid-cols-4 gap-2" role="radiogroup" aria-label="Avatar">
            {AVATAR_IDS.map(id => (
              <button key={id} type="button" role="radio" aria-checked={avatar === id} className="ficha" onClick={() => elegirAvatar(id)}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={fotoOriginal(id, "A") ?? ""} alt="" className="size-14 rounded-full object-cover object-top" />
                <span className="text-center leading-tight">{AVATARES[id].nombre}</span>
              </button>
            ))}
            <button type="button" role="radio" aria-checked={avatar === "aleatorio"} className="ficha" onClick={() => elegirAvatar("aleatorio")}>
              <span className="grid size-14 place-items-center rounded-full bg-sun-soft text-3xl" aria-hidden="true">🎲</span>
              <span>Aleatorio</span>
            </button>
          </div>
        </section>

        {/* 2. Texto */}
        <section className="mb-6">
          <h2 className="mb-2 text-lg font-bold text-navy-deep">2. Escribe lo que quieres decir</h2>
          <form className="flex gap-2" onSubmit={e => { e.preventDefault(); armar(texto); }}>
            <input
              type="text"
              value={texto}
              onChange={e => setTexto(e.target.value)}
              placeholder="Ej: hola mamá"
              maxLength={60}
              autoComplete="off"
              aria-label="Texto a traducir"
              className="min-w-0 flex-1 rounded-2xl border-2 border-line bg-white px-4 py-3 text-lg outline-none focus:border-navy"
            />
            <button type="submit" className="btn-principal px-5 text-base">Traducir</button>
          </form>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-mist">
            <span>Prueba:</span>
            {EJEMPLOS.map(ej => (
              <button key={ej} type="button" onClick={() => { setTexto(ej); armar(ej); }} className="min-h-11 rounded-full bg-white px-4 font-bold text-navy shadow-soft">
                {ej}
              </button>
            ))}
          </div>
        </section>

        {/* Abecedario */}
        <section className="hidden md:block">
          <h2 className="mb-1 text-lg font-bold text-navy-deep">Abecedario LSC</h2>
          <p className="mb-3 text-sm text-mist">Toca una letra para verla.</p>
          <Abecedario onLetra={l => { setTexto(l); armar(l); }} />
        </section>
      </div>

      {/* 3. Escenario */}
      <div ref={escenario} className="scroll-mt-20 md:sticky md:top-20">
        {paso ? (
          <section aria-live="polite">
            <div className={cn("tarjeta relative mx-auto aspect-[3/4] max-h-[62vh] w-full overflow-hidden", ampliada && "ampliada")}>
              {esEspacio ? (
                <div className="flex h-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-sun-soft to-cream font-display text-2xl text-navy">
                  <span className="text-8xl leading-none" aria-hidden="true">🤲</span>
                  siguiente palabra
                </div>
              ) : (
                <>
                  {!soloFormal && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={foto!} alt={`${nombreAvatar} haciendo la letra ${paso.letra}`} className="size-full object-cover" onError={() => setFotoRota(foto)} />
                  )}
                  <button
                    type="button"
                    onClick={() => !soloFormal && setAmpliada(a => !a)}
                    aria-label={ampliada ? "Reducir la seña formal" : "Ampliar la seña formal"}
                    className={cn(
                      "absolute overflow-hidden rounded-xl border-[3px] border-white bg-white shadow-lift transition-all",
                      soloFormal ? "inset-0 rounded-none border-0 shadow-none" : ampliada ? "inset-2.5 cursor-zoom-out" : "right-2.5 top-2.5 w-[34%] cursor-zoom-in",
                    )}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={senaFormal(paso.letra)} alt={`Seña formal de la letra ${paso.letra}`} className="aspect-[3/4] size-full object-cover" />
                    {soloFormal && <span className="absolute bottom-4 right-5 font-display text-7xl font-extrabold text-navy drop-shadow">{paso.letra}</span>}
                  </button>
                  <span className="absolute bottom-3 left-3 rounded-full bg-navy/85 px-3 py-1.5 text-sm font-bold text-white">
                    {soloFormal ? `Seña formal (sin foto de ${nombreAvatar} para la ${paso.letra})` : nombreAvatar}
                  </span>
                </>
              )}

              {/* Controles sobre la foto */}
              <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
                <button type="button" onClick={() => ir(indice - 1)} aria-label="Letra anterior" className="grid size-11 place-items-center rounded-full bg-white/90 text-navy shadow-soft"><SkipBack className="size-5" /></button>
                <button type="button" onClick={play} aria-label={reproduciendo ? "Pausar" : "Reproducir"} className="grid size-14 place-items-center rounded-full bg-navy text-white shadow-lift">{reproduciendo ? <Pause className="size-7" /> : <Play className="ml-0.5 size-7" />}</button>
                <button type="button" onClick={() => ir(indice + 1)} aria-label="Letra siguiente" className="grid size-11 place-items-center rounded-full bg-white/90 text-navy shadow-soft"><SkipForward className="size-5" /></button>
              </div>
            </div>

            {/* Palabra */}
            <div className="mt-3 flex flex-wrap justify-center gap-1.5">
              {secuencia.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => ir(i)}
                  className={cn(
                    "min-w-11 rounded-xl border-2 border-line bg-white px-2 py-2 font-display text-xl transition-transform",
                    p.letra === " " && "border-dashed text-mist",
                    i === indice && "scale-110 border-sun bg-sun text-navy-deep",
                  )}
                  aria-label={p.letra === " " ? "espacio" : `letra ${p.letra}`}
                >
                  {p.letra === " " ? "·" : p.letra}
                </button>
              ))}
            </div>

            <label className="mt-3 flex items-center justify-center gap-2 text-xs font-bold text-mist">
              <Turtle className="size-5" aria-hidden="true" /> lento
              <input type="range" className="velocidad" min={400} max={2500} step={100} value={velocidad} onChange={e => setVelocidad(Number(e.target.value))} aria-label="Velocidad: a la derecha más rápido" />
              rápido <Rabbit className="size-5" aria-hidden="true" />
            </label>
          </section>
        ) : (
          <div className="tarjeta hidden aspect-[3/4] items-center justify-center p-8 text-center text-mist md:flex">
            Escribe una palabra y aparecerá aquí, letra por letra.
          </div>
        )}

        <section className="mt-8 md:hidden">
          <h2 className="mb-1 text-lg font-bold text-navy-deep">Abecedario LSC</h2>
          <p className="mb-3 text-sm text-mist">Toca una letra para verla.</p>
          <Abecedario onLetra={l => { setTexto(l); armar(l); }} />
        </section>
      </div>
    </div>
  );
}

function Abecedario({ onLetra }: { onLetra: (l: string) => void }) {
  return (
    <div className="grid grid-cols-6 gap-2 sm:grid-cols-7">
      {LETRAS.map(l => (
        <button key={l} type="button" className="tecla" onClick={() => onLetra(l)} aria-label={`Ver la letra ${l}`}>
          {l}
        </button>
      ))}
    </div>
  );
}
