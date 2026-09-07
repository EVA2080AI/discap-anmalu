import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export const metadata: Metadata = { title: "Privacidad" };

export default function Privacidad() {
  return (
    <article className="aparecer mx-auto max-w-2xl">
      <h1 className="flex items-center gap-2 text-3xl font-extrabold text-navy"><ShieldCheck className="size-8" aria-hidden="true" /> Privacidad</h1>
      <p className="mt-2 text-mist">Escrita en palabras sencillas, porque la usan niños. Última actualización: 7 de septiembre de 2026.</p>

      <section className="tarjeta mt-6 p-5">
        <h2 className="mb-2 text-xl font-extrabold text-navy-deep">Qué guardamos de ti</h2>
        <ul className="grid gap-2 text-[15px]">
          <li><b>Nada para usar la app.</b> No hay cuentas, no pedimos correo ni teléfono y no hay cookies de rastreo ni analítica.</li>
          <li><b>En tu propio celular</b> se guardan tus favoritos, tu racha, tus ajustes y las ideas que enviaste. Nunca salen de ahí.</li>
          <li><b>Si escribes en el Buzón de ideas</b>, guardamos el nombre que pongas (puede ser inventado o vacío) y tu mensaje. Aparecen en la lista pública. Un admin puede borrarlos si lo pides.</li>
          <li><b>Si entras a la zona de subidas</b>, guardamos una cookie de sesión por 12 horas que no contiene la clave.</li>
        </ul>
      </section>

      <section className="tarjeta mt-4 p-5">
        <h2 className="mb-2 text-xl font-extrabold text-navy-deep">Las fotos y los videos</h2>
        <p className="text-[15px]">Las fotos y los videos son de Ana Lucía, Antonella y María Paula, que son menores de edad. Se publican con la <b>autorización de sus familias</b> y solo para esta app. No se pueden copiar, editar ni usar para entrenar programas de inteligencia artificial. Pedimos a los buscadores que no las indexen.</p>
        <p className="mt-2 text-[15px]">Si una alumna sube una foto o un video nuevo, un adulto responsable lo aprueba antes de que se publique.</p>
        <p className="mt-2 text-[15px]">Formato de autorización para imprimir y firmar: <Link href="/consentimiento" className="font-bold text-navy underline">autorización de uso de imagen</Link>.</p>
      </section>

      <section className="tarjeta mt-4 p-5">
        <h2 className="mb-2 text-xl font-extrabold text-navy-deep">Dónde vive la información</h2>
        <p className="text-[15px]">La app está publicada en Vercel y la base de datos en Neon (servidores en Estados Unidos). Los archivos subidos se guardan en Vercel Blob. Solo el equipo del proyecto tiene acceso administrativo.</p>
      </section>

      <section className="tarjeta mt-4 p-5">
        <h2 className="mb-2 text-xl font-extrabold text-navy-deep">Tus derechos</h2>
        <p className="text-[15px]">Puedes pedir que borremos una idea que escribiste o una foto en la que apareces. Escríbelo en el <Link href="/ideas" className="font-bold text-navy underline">Buzón de ideas</Link> con el tipo «Algo no funciona» o escribe a <b>discap.amalu@gmail.com</b>.</p>
      </section>
    </article>
  );
}
