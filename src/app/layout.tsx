import type { Metadata, Viewport } from "next";
import { Baloo_2, Nunito } from "next/font/google";
import { Navegacion } from "@/components/navegacion";
import { RegistrarSW } from "@/components/registrar-sw";
import { AvisoInstalar } from "@/components/aviso-instalar";
import { SCRIPT_ACCESIBILIDAD } from "@/lib/preferencias";
import { VERSION } from "@/lib/contenido";
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
      <head>
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_ACCESIBILIDAD }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <Navegacion />
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-6 pt-5 md:px-6 md:pb-12">{children}</main>
        <footer className="mx-auto w-full max-w-3xl px-6 pb-28 pt-2 text-center text-xs text-mist md:flex md:items-center md:justify-between md:pb-5 md:text-left md:text-sm">
          <span>DISCAP ANMALU © 2026 · <a href="/novedades" className="hover:underline">v{VERSION}</a></span>
          <span className="mt-1 flex flex-wrap justify-center gap-x-4 gap-y-1 md:mt-0">
            <a href="/historia" className="font-bold text-navy hover:underline">Historia</a>
            <a href="/sobre" className="font-bold text-navy hover:underline">Cómo se usa</a>
            <a href="/privacidad" className="font-bold text-navy hover:underline">Privacidad</a>
          </span>
        </footer>
        <RegistrarSW />
        <AvisoInstalar />
      </body>
    </html>
  );
}
