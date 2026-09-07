"use client";

import { useState } from "react";
import { ImageDown } from "lucide-react";
import { senaFormal, type AvatarId } from "@/lib/datos";
import type { PasoTira } from "@/components/tira-letras";

/** Genera una imagen con la palabra en señas (fotos por letra) para compartir o guardar. */
export function BotonTarjeta({ pasos, texto, fotoDe }: { pasos: PasoTira[]; texto: string; fotoDe: (a: AvatarId, l: string) => string | null }) {
  const [ocupado, setOcupado] = useState(false);
  const letras = pasos.filter(p => p.letra !== " " && !p.video);
  if (!letras.length) return null;

  const generar = async () => {
    setOcupado(true);
    try {
      const cargar = (src: string) => new Promise<HTMLImageElement>((res, rej) => { const i = new Image(); i.crossOrigin = "anonymous"; i.onload = () => res(i); i.onerror = rej; i.src = src; });
      const imgs = await Promise.all(letras.map(p => cargar(fotoDe(p.avatar, p.letra) ?? senaFormal(p.letra))));
      const porFila = Math.min(6, letras.length), filas = Math.ceil(letras.length / porFila);
      const w = 240, h = 320, m = 16, top = 150, bottom = 90;
      const c = document.createElement("canvas");
      c.width = porFila * (w + m) + m; c.height = top + filas * (h + m) + bottom;
      const ctx = c.getContext("2d")!;
      ctx.fillStyle = "#1c3f8f"; ctx.fillRect(0, 0, c.width, c.height);
      ctx.fillStyle = "#ffffff"; ctx.font = "800 64px 'Baloo 2', 'Nunito', sans-serif"; ctx.textAlign = "center";
      ctx.fillText(texto.trim(), c.width / 2, 92);
      ctx.font = "700 26px 'Nunito', sans-serif"; ctx.fillStyle = "#f5c400"; ctx.fillText("en Lengua de Señas Colombiana", c.width / 2, 130);
      imgs.forEach((img, i) => {
        const x = m + (i % porFila) * (w + m), y = top + Math.floor(i / porFila) * (h + m);
        ctx.save(); ctx.beginPath(); ctx.roundRect(x, y, w, h, 20); ctx.clip();
        const esc = Math.max(w / img.width, h / img.height); const iw = img.width * esc, ih = img.height * esc;
        ctx.drawImage(img, x + (w - iw) / 2, y, iw, ih);
        ctx.fillStyle = "rgba(255,255,255,.88)"; ctx.fillRect(x, y + h - 56, w, 56);
        ctx.fillStyle = "#1c3f8f"; ctx.font = "800 44px 'Baloo 2', 'Nunito', sans-serif"; ctx.fillText(letras[i].letra, x + w / 2, y + h - 12);
        ctx.restore();
      });
      ctx.fillStyle = "#8dc63f"; ctx.font = "800 28px 'Nunito', sans-serif"; ctx.fillText("🤟 DISCAP ANMALU · discap-anmalu.vercel.app", c.width / 2, c.height - 34);
      const blob = await new Promise<Blob | null>(res => c.toBlob(res, "image/png"));
      if (!blob) return;
      const archivo = new File([blob], `${texto.trim().replace(/\s+/g, "-")}-en-senas.png`, { type: "image/png" });
      if (navigator.canShare?.({ files: [archivo] })) {
        await navigator.share({ files: [archivo], title: "DISCAP ANMALU", text: `${texto.trim()} en Lengua de Señas Colombiana 🤟` }).catch(() => {});
      } else {
        const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = archivo.name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
      }
    } finally { setOcupado(false); }
  };

  return (
    <button type="button" onClick={generar} disabled={ocupado} className="flex min-h-11 items-center gap-1.5 rounded-full bg-white px-4 text-sm font-extrabold text-navy shadow-soft disabled:opacity-50">
      <ImageDown className="size-4" aria-hidden="true" /> {ocupado ? "Creando…" : "Tarjeta"}
    </button>
  );
}
