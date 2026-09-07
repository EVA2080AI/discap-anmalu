"use client";

import { Printer } from "lucide-react";

export function BotonImprimir({ texto = "Imprimir" }: { texto?: string }) {
  return (
    <button type="button" onClick={() => window.print()} className="flex min-h-11 items-center gap-2 rounded-full bg-navy px-4 font-extrabold text-white shadow-soft print:hidden">
      <Printer className="size-5" aria-hidden="true" /> {texto}
    </button>
  );
}
