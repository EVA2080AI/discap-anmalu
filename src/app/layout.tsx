import type { Metadata, Viewport } from "next";
import { Baloo_2, Nunito } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Navegacion } from "@/components/navegacion";
import { RegistrarSW } from "@/components/registrar-sw";
import "./globals.css";

const baloo = Baloo_2({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-baloo", display: "swap" });
const nunito = Nunito({ subsets: ["latin"], weight: ["400", "600", "700", "800"], variable: "--font-nunito", display: "swap" });

const URL_APP = "https://discap-anmalu.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(URL_APP),
  title: { default: "DISCAP ANMALU · Traductor LSC", template: "%s · DISCAP ANMALU" },
  description: "Traductor de Lengua de Señas Colombiana con Ana Lucía, Antonella y María Paula. Saludos, familia y colores en video.",
  applicationName: "ANMALU",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/icons/icon-192.png", apple: "/icons/icon-192.png" },
  appleWebApp: { capable: true, title: "ANMALU", statusBarStyle: "black-translucent" },
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: URL_APP,
    title: "DISCAP ANMALU · Traductor de Lengua de Señas Colombiana",
    description: "Escribe una palabra y mírala en señas con Ana Lucía, Antonella y María Paula.",
    images: [{ url: "/img/og.jpg", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#1c3f8f",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${baloo.variable} ${nunito.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <Navegacion />
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-28 pt-5 md:px-6 md:pb-12">{children}</main>
        <footer className="mx-auto hidden w-full max-w-3xl items-center justify-between px-6 py-5 text-sm text-mist md:flex">
          <span>DISCAP ANMALU © 2026 · Feria Inspírate</span>
          <a href="/admin" className="font-bold text-navy hover:underline">Subir fotos y videos</a>
        </footer>
        <RegistrarSW />
        <Analytics />
      </body>
    </html>
  );
}
