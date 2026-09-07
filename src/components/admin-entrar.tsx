"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole } from "lucide-react";

export function AdminEntrar() {
  const router = useRouter();
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const entrar = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true); setError("");
    try {
      const r = await fetch("/api/sesion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ clave }) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "No se pudo entrar");
      setClave("");
      router.refresh();
    } catch (ex) { setError((ex as Error).message); } finally { setCargando(false); }
  };

  return (
    <div className="tarjeta aparecer mx-auto mt-6 max-w-md p-7 text-center">
      <span className="mx-auto grid size-16 place-items-center rounded-full bg-sun-soft text-navy"><LockKeyhole className="size-8" aria-hidden="true" /></span>
      <h1 className="mt-3 text-3xl font-extrabold text-navy">Zona de subidas</h1>
      <p className="mt-2 text-mist">Aquí las alumnas y los profes suben fotos de letras, videos de expresiones y responden las ideas del buzón.</p>
      <form onSubmit={entrar} className="mt-5 grid gap-3">
        <input type="password" value={clave} onChange={e => setClave(e.target.value)} placeholder="Escribe la clave" autoComplete="current-password" aria-label="Clave" className="rounded-2xl border-2 border-line px-4 py-3.5 text-center text-xl tracking-widest outline-none focus:border-navy" />
        <button type="submit" disabled={cargando || !clave} className="btn-principal">Entrar</button>
      </form>
      {error && <p role="alert" className="mt-3 font-bold text-coral">{error}</p>}
      <p className="mt-4 text-sm text-mist">¿No tienes clave? Pídesela a tu profe o a Guido.</p>
    </div>
  );
}
