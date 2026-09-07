"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Maximize2, Hand } from "lucide-react";
import { AVATARES, AVATAR_IDS, fotoOriginal, normalizar, senaFormal, type AvatarId } from "@/lib/datos";
import { prefs } from "@/lib/preferencias";
import { TiraLetras, type PasoTira } from "@/components/tira-letras";

const PALABRAS = ["hola", "gracias", "amor", "familia", "Colombia", "amigo", "feliz", "paz", "gracias", "manos"];
const RITMO = 1100;

export function Feria({ qr, url }: { qr: string; url: string }) {
  const router = useRouter();
  const [nPalabra, setNPalabra] = useState(0);
  const [indice, setIndice] = useState(0);

  const pasos = useMemo<PasoTira[]>(() => {
    const avatar = AVATAR_IDS[nPalabra % AVATAR_IDS.length];
    return normalizar(PALABRAS[nPalabra % PALABRAS.length]).split("").map(letra => ({ letra, avatar }));
  }, [nPalabra]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (indice >= pasos.length - 1) { setIndice(0); setNPalabra(n => n + 1); }
      else setIndice(i => i + 1);
    }, indice === 0 ? RITMO * 1.4 : RITMO);
    return () => clearTimeout(t);
  }, [indice, pasos.length]);

  useEffect(() => { prefs.setModoFeria(true); }, []);

  const paso = pasos[indice];
  const foto = paso ? fotoOriginal(paso.avatar as AvatarId, paso.letra) : null;

  const probar = () => { prefs.setModoFeria(true); router.push("/traductor?feria=1"); };
  const pantallaCompleta = () => { void document.documentElement.requestFullscreen?.().catch(() => {}); };
  const salir = () => { prefs.setModoFeria(false); if (document.fullscreenElement) void document.exitFullscreen().catch(() => {}); router.push("/"); };

  return (
    <div className="fixed inset-0 flex flex-col bg-navy text-white" onClick={probar} role="button" tabIndex={0} aria-label="Tocar para probar el traductor">
      <header className="flex items-center justify-between px-6 py-4">
        <span className="flex items-center gap-3 font-display text-3xl font-extrabold tracking-wide">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icons/logo-mark.svg" alt="" width={44} height={44} className="size-11" /> DISCAP <b className="text-lime">ANMALU</b>
        </span>
        <button type="button" onClick={e => { e.stopPropagation(); pantallaCompleta(); }} className="grid size-11 place-items-center rounded-full bg-white/15" aria-label="Pantalla completa"><Maximize2 className="size-5" /></button>
      </header>

      <div className="grid flex-1 grid-cols-1 items-center gap-6 px-6 pb-6 md:grid-cols-[1fr_auto]">
        <div className="mx-auto flex w-full max-w-md flex-col items-center gap-4">
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[2rem] bg-white shadow-lift">
            {foto && paso && (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img key={foto} src={foto} alt="" className="aparecer size-full object-cover" />
                <div className="absolute right-3 top-3 w-[34%] overflow-hidden rounded-xl border-[3px] border-white bg-white shadow-lift">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={senaFormal(paso.letra)} alt="" className="aspect-[3/4] size-full object-cover" />
                </div>
                <span className="absolute bottom-3 left-3 rounded-full bg-navy/85 px-3 py-1.5 text-sm font-bold">{AVATARES[paso.avatar as AvatarId].nombre}</span>
              </>
            )}
          </div>
          <TiraLetras pasos={pasos} actual={indice} tamano="sm" />
          <p className="font-display text-4xl font-extrabold">{PALABRAS[nPalabra % PALABRAS.length]}</p>
        </div>

        <aside className="flex flex-col items-center gap-3 text-center md:w-72">
          <p className="font-display text-2xl leading-tight">Escanea y llévate la app</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qr} alt={`Código QR de ${url}`} className="w-52 rounded-2xl bg-white p-2 shadow-lift md:w-60" />
          <p className="text-sm text-white/80">{url}</p>
          <div className="mt-4 flex animate-pulse items-center gap-2 rounded-full bg-sun px-5 py-3 font-display text-xl text-navy-deep">
            <Hand className="size-6" aria-hidden="true" /> Toca la pantalla para probar
          </div>
        </aside>
      </div>

      <button type="button" onClick={e => { e.stopPropagation(); salir(); }} className="absolute bottom-2 right-3 text-xs text-white/40">salir del modo feria</button>
    </div>
  );
}

/** En modo feria, si nadie toca la pantalla en 60 s, vuelve a la demo. Va en el layout. */
export function VigilanteFeria({ ruta }: { ruta: string }) {
  const router = useRouter();
  useEffect(() => {
    if (ruta === "/feria" || !prefs.modoFeria()) return;
    let t = setTimeout(() => router.push("/feria"), 60_000);
    const reiniciar = () => { clearTimeout(t); t = setTimeout(() => router.push("/feria"), 60_000); };
    const eventos = ["pointerdown", "keydown", "scroll", "touchstart"] as const;
    eventos.forEach(e => window.addEventListener(e, reiniciar, { passive: true }));
    return () => { clearTimeout(t); eventos.forEach(e => window.removeEventListener(e, reiniciar)); };
  }, [ruta, router]);
  return null;
}
