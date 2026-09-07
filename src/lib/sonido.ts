"use client";

import { prefs } from "@/lib/preferencias";

/* Sonidos cortos generados con WebAudio (sin archivos). Respetan el interruptor de silencio. */
let ctx: AudioContext | null = null;

function nota(freq: number, inicio: number, dur: number, tipo: OscillatorType = "sine", vol = 0.12) {
  if (!ctx) return;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = tipo;
  o.frequency.value = freq;
  g.gain.setValueAtTime(0, ctx.currentTime + inicio);
  g.gain.linearRampToValueAtTime(vol, ctx.currentTime + inicio + 0.02);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + inicio + dur);
  o.connect(g).connect(ctx.destination);
  o.start(ctx.currentTime + inicio);
  o.stop(ctx.currentTime + inicio + dur + 0.05);
}

function preparar() {
  if (prefs.silencio()) return false;
  try {
    ctx ??= new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    if (ctx.state === "suspended") ctx.resume();
    return true;
  } catch { return false; }
}

/** Palabra terminada / idea enviada: tres notas ascendentes. */
export function sonidoExito() {
  if (!preparar()) return;
  nota(523, 0, 0.18); nota(659, 0.12, 0.18); nota(784, 0.24, 0.3);
}

/** Acierto en Practicar: dos notas cortas. */
export function sonidoAcierto() {
  if (!preparar()) return;
  nota(660, 0, 0.12, "triangle"); nota(880, 0.1, 0.2, "triangle");
}

/** Error suave en Practicar: una nota grave. */
export function sonidoError() {
  if (!preparar()) return;
  nota(220, 0, 0.25, "triangle", 0.08);
}

/** Toque de tecla: muy corto. */
export function sonidoToque() {
  if (!preparar()) return;
  nota(440, 0, 0.05, "square", 0.03);
}
