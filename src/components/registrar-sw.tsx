"use client";

import { useEffect } from "react";

/** Registra el service worker (public/sw.js) para que la app abra sin internet. */
export function RegistrarSW() {
  useEffect(() => {
    if (!("serviceWorker" in navigator) || process.env.NODE_ENV !== "production") return;
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);
  return null;
}
