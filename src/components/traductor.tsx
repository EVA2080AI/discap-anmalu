"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Play, Pause, SkipBack, SkipForward, Turtle, Rabbit, Repeat, FlipHorizontal2, Delete, Volume2, VolumeX, Space } from "lucide-react";
import { AVATARES, AVATAR_IDS, LETRAS, fotoOriginal, normalizar, senaFormal, type AvatarId } from "@/lib/datos";
import { prefs } from "@/lib/preferencias";
import { sonidoExito, sonidoToque } from "@/lib/sonido";
import { TiraLetras, type PasoTira } from "@/components/tira-letras";
import { cn } from "@/lib/utils";

type Elegido = AvatarId | "aleatorio";

const EJEMPLOS = ["hola", "mamá", "amor", "Colombia"];

function elegirAleatorio<T>(lista: readonly T[]) {
  return lista[Math.floor(Math.random() * lista.length)];
}

/** Traductor: texto → letra por letra, con la foto de la niña y la seña formal. */
export function Traductor({ fotosExtra }: { fotosExtra: Record<string, string> }) {
  const params = useSearchParams();
  const [avatar, setAvatar] = useState<Elegido>("ana");
  const [texto, setTexto] = useState("");
  const [placeholder, setPlaceholder] = useState("Ej: hola mamá");
  const [secuencia, setSecuencia] = useState<PasoTira[]>([]);
  const [indice, setIndice] = useState(0);
  const [reproduciendo, setReproduciendo] = useState(false);
  const [velocidad, setVelocidad] = useState(1700); // 400 (lento) … 2500 (rápido)
  const [bucle, setBucle] = useState(false);
  const [espejo, setEspejo] = useState(false);
  const [silencio, setSilencio] = useState(false);
  const [ampliada, setAmpliada] = useState(false);
  const [fotoRota, setFotoRota] = useState<string | null>(null);
  const escenario = useRef<HTMLDivElement>(null);
  const campo = useRef<HTMLInputElement>(null);

  const fotoDe = useCallback(
    (a: AvatarId, letra: string) => fotosExtra[`${a}/${letra}`] ?? fotoOriginal(a, letra),
    [fotosExtra],
  );

  const armar = useCallback(
    (entrada: string, avatarElegido: Elegido = avatar) => {
      const limpio = normalizar(entrada);
      if (!limpio) { campo.current?.focus(); return; }
      const pasos = limpio.split("").map(ch => ({
        letra: ch,
        avatar: avatarElegido === "aleatorio" ? elegirAleatorio(AVATAR_IDS) : avatarElegido,
      }));
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

  // ?texto=hola (enlaces compartidos y modo feria) y preferencias del dispositivo
  useEffect(() => {
    const t = setTimeout(() => {
      setSilencio(prefs.silencio());
      const inicial = params.get("texto");
      if (inicial) { setTexto(inicial); armar(inicial); }
    }, 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // reproducción automática; al final: bucle, o se detiene con un sonido de logro
  useEffect(() => {
    if (!reproduciendo) return;
    const t = setTimeout(() => {
      if (indice >= secuencia.length - 1) {
        if (bucle) setIndice(0);
        else { setReproduciendo(false); sonidoExito(); }
      } else setIndice(i => i + 1);
    }, 2900 - velocidad);
    return () => clearTimeout(t);
  }, [reproduciendo, indice, secuencia.length, velocidad, bucle]);

  const paso = secuencia[indice];
  const esEspacio = paso?.letra === " ";
  const foto = paso && !esEspacio ? fotoDe(paso.avatar, paso.letra) : null;
  const soloFormal = !!paso && !esEspacio && (!foto || fotoRota === foto);

  const ir = (i: number) => { setReproduciendo(false); setIndice(Math.max(0, Math.min(i, secuencia.length - 1))); };
  const play = () => {
    if (reproduciendo) { setReproduciendo(false); return; }
    if (indice >= secuencia.length - 1) setIndice(0);
    setReproduciendo(true);
  };

  const elegirAvatar = (a: Elegido) => {
    setAvatar(a);
    if (secuencia.length) setSecuencia(s => s.map(p => ({ ...p, avatar: a === "aleatorio" ? elegirAleatorio(AVATAR_IDS) : a })));
  };

  const escribirLetra = (l: string) => {
    sonidoToque();
    setTexto(t => (t + l).slice(0, 60));
    campo.current?.focus({ preventScroll: true });
  };
  const borrarLetra = () => setTexto(t => t.slice(0, -1));

  const alternarSilencio = () => { const v = !silencio; setSilencio(v); prefs.setSilencio(v); };

  const nombreAvatar = useMemo(() => (paso ? AVATARES[paso.avatar].nombre : ""), [paso]);

  return (
    <div className="aparecer md:grid md:grid-cols-[1fr_minmax(300px,380px)] md:items-start md:gap-8">
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-3xl font-extrabold text-navy">Traductor</h1>
          <button type="button" onClick={alternarSilencio} aria-pressed={silencio} aria-label={silencio ? "Activar sonidos" : "Silenciar sonidos"} className="grid size-11 place-items-center rounded-full bg-white text-navy shadow-soft">
            {silencio ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
          </button>
        </div>

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
              ref={campo}
              type="text"
              value={texto}
              onChange={e => setTexto(e.target.value)}
              placeholder={placeholder}
              maxLength={60}
              autoComplete="off"
              aria-label="Texto a traducir"
              className="min-w-0 flex-1 rounded-2xl border-2 border-line bg-white px-4 py-3 text-lg outline-none focus:border-navy"
            />
            <button type="submit" className="btn-principal px-5 text-base">Traducir</button>
          </form>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-mist">
            <span>Prueba:</span>
            <button type="button" onClick={() => { setTexto(""); setPlaceholder("Escribe tu nombre…"); campo.current?.focus(); }} className="min-h-11 rounded-full bg-sun px-4 font-bold text-navy-deep shadow-soft">
              ✨ tu nombre
            </button>
            {EJEMPLOS.map(ej => (
              <button key={ej} type="button" onClick={() => { setTexto(ej); armar(ej); }} className="min-h-11 rounded-full bg-white px-4 font-bold text-navy shadow-soft">
                {ej}
              </button>
            ))}
          </div>
        </section>

        {/* Abecedario que escribe */}
        <section className="hidden md:block">
          <h2 className="mb-1 text-lg font-bold text-navy-deep">Abecedario LSC</h2>
          <p className="mb-3 text-sm text-mist">Toca las letras para escribir sin teclado.</p>
          <Abecedario onLetra={escribirLetra} onBorrar={borrarLetra} onEspacio={() => escribirLetra(" ")} />
        </section>
      </div>

      {/* 3. Escenario */}
      <div ref={escenario} className="scroll-mt-20 md:sticky md:top-20">
        {paso ? (
          <section aria-live="polite">
            <div className="tarjeta relative mx-auto aspect-[3/4] max-h-[62vh] w-full overflow-hidden">
              {esEspacio ? (
                <div className="flex h-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-sun-soft to-cream font-display text-2xl text-navy">
                  <span className="text-8xl leading-none" aria-hidden="true">🤲</span>
                  siguiente palabra
                </div>
              ) : (
                <>
                  {!soloFormal && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={foto!} alt={`${nombreAvatar} haciendo la letra ${paso.letra}`} className={cn("size-full object-cover transition-transform", espejo && "-scale-x-100")} onError={() => setFotoRota(foto)} />
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
                    <img src={senaFormal(paso.letra)} alt={`Seña formal de la letra ${paso.letra}`} className={cn("aspect-[3/4] size-full object-cover", espejo && "-scale-x-100")} />
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

            {/* La palabra entera de un vistazo */}
            <div className="mt-3">
              <TiraLetras pasos={secuencia} actual={indice} onElegir={ir} fotoDe={fotoDe} />
            </div>

            {/* Opciones */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
              <button type="button" onClick={() => setBucle(b => !b)} aria-pressed={bucle} className={cn("flex min-h-11 items-center gap-1.5 rounded-full bg-white px-4 text-sm font-extrabold text-navy shadow-soft", bucle && "bg-sun text-navy-deep")}>
                <Repeat className="size-4" aria-hidden="true" /> Repetir
              </button>
              <button type="button" onClick={() => setEspejo(e => !e)} aria-pressed={espejo} className={cn("flex min-h-11 items-center gap-1.5 rounded-full bg-white px-4 text-sm font-extrabold text-navy shadow-soft", espejo && "bg-sun text-navy-deep")}>
                <FlipHorizontal2 className="size-4" aria-hidden="true" /> Espejo
              </button>
              <label className="flex items-center gap-2 text-xs font-bold text-mist">
                <Turtle className="size-5" aria-hidden="true" />
                <input type="range" className="velocidad" min={400} max={2500} step={100} value={velocidad} onChange={e => setVelocidad(Number(e.target.value))} aria-label="Velocidad: a la derecha más rápido" />
                <Rabbit className="size-5" aria-hidden="true" />
              </label>
            </div>
            {espejo && <p className="mt-2 text-center text-xs text-mist">Espejo: así ves la seña como si la hicieras tú.</p>}
          </section>
        ) : (
          <div className="tarjeta hidden aspect-[3/4] flex-col items-center justify-center gap-2 p-8 text-center text-mist md:flex">
            <span className="text-5xl" aria-hidden="true">👋</span>
            Escribe una palabra y aparecerá aquí, letra por letra.
          </div>
        )}

        <section className="mt-8 md:hidden">
          <h2 className="mb-1 text-lg font-bold text-navy-deep">Abecedario LSC</h2>
          <p className="mb-3 text-sm text-mist">Toca las letras para escribir sin teclado.</p>
          <Abecedario onLetra={escribirLetra} onBorrar={borrarLetra} onEspacio={() => escribirLetra(" ")} />
        </section>
      </div>
    </div>
  );
}

function Abecedario({ onLetra, onBorrar, onEspacio }: { onLetra: (l: string) => void; onBorrar: () => void; onEspacio: () => void }) {
  return (
    <div className="grid grid-cols-6 gap-2 sm:grid-cols-7">
      {LETRAS.map(l => (
        <button key={l} type="button" className="tecla" onClick={() => onLetra(l)} aria-label={`Escribir la letra ${l}`}>
          {l}
        </button>
      ))}
      <button type="button" className="tecla col-span-2 aspect-auto flex items-center justify-center gap-1 text-base" onClick={onEspacio} aria-label="Espacio"><Space className="size-5" /> espacio</button>
      <button type="button" className="tecla aspect-auto flex items-center justify-center text-coral" onClick={onBorrar} aria-label="Borrar la última letra"><Delete className="size-6" /></button>
    </div>
  );
}
