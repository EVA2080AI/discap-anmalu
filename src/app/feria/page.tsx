import type { Metadata } from "next";
import QRCode from "qrcode";
import { Feria } from "@/components/feria";

export const metadata: Metadata = { title: "Modo feria", robots: { index: false } };

const URL_APP = "https://discap-anmalu.vercel.app";

/** Pantalla para el stand: demo automática, QR grande y reinicio por inactividad. */
export default async function PaginaFeria() {
  const qr = await QRCode.toDataURL(URL_APP, { width: 480, margin: 1, color: { dark: "#12295e", light: "#ffffff" } });
  return <Feria qr={qr} url={URL_APP.replace("https://", "")} />;
}
