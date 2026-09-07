import type { Metadata } from "next";
import { BotonImprimir } from "@/components/boton-imprimir";

export const metadata: Metadata = { title: "Autorización de uso de imagen", robots: { index: false } };

/** Formato para imprimir y firmar. Se guarda firmado por la familia y el colegio. */
export default function Consentimiento() {
  const linea = "________________________________";
  return (
    <article className="aparecer mx-auto max-w-2xl print:max-w-none">
      <div className="mb-4 flex items-center justify-between print:hidden">
        <h1 className="text-2xl font-extrabold text-navy">Autorización de uso de imagen</h1>
        <BotonImprimir />
      </div>

      <div className="tarjeta p-6 text-[15px] leading-relaxed print:shadow-none">
        <p className="text-center font-display text-xl text-navy-deep">AUTORIZACIÓN DE USO DE IMAGEN DE MENOR DE EDAD<br /><span className="text-base font-sans text-mist">Proyecto DISCAP ANMALU · Traductor de Lengua de Señas Colombiana · Feria Inspírate 2026</span></p>

        <p className="mt-6">Yo, {linea}, identificado(a) con documento {linea}, en calidad de acudiente de {linea}, autorizo que su imagen (fotografías y videos haciendo señas de la Lengua de Señas Colombiana) se use en la aplicación <b>DISCAP ANMALU</b>, publicada en <b>discap-anmalu.vercel.app</b>, con estas condiciones:</p>

        <ol className="mt-3 grid list-decimal gap-2 pl-5">
          <li>El uso es <b>educativo y sin ánimo de lucro</b>, dentro del proyecto escolar y su presentación en la Feria Inspírate 2026.</li>
          <li>Las imágenes se muestran junto al nombre de pila del menor y no se acompañan de otros datos personales.</li>
          <li>No se permite copiarlas, editarlas, venderlas ni usarlas para entrenar programas de inteligencia artificial. La app pide a los buscadores no indexarlas.</li>
          <li>Puedo pedir en cualquier momento que se retiren, escribiendo al responsable del proyecto, y se retirarán en un plazo máximo de cinco días hábiles.</li>
          <li>Esta autorización se otorga en los términos de la Ley 1581 de 2012 (protección de datos personales) y el Código de la Infancia y la Adolescencia de Colombia.</li>
        </ol>

        <div className="mt-8 grid gap-8 sm:grid-cols-2">
          <div><p>{linea}</p><p className="text-sm text-mist">Firma del acudiente</p><p className="mt-1 text-sm">Nombre: {linea}</p><p className="text-sm">Teléfono: {linea}</p></div>
          <div><p>{linea}</p><p className="text-sm text-mist">Firma del menor (si desea)</p><p className="mt-1 text-sm">Nombre: {linea}</p></div>
          <div><p>{linea}</p><p className="text-sm text-mist">Visto bueno de la institución educativa</p><p className="mt-1 text-sm">Nombre y cargo: {linea}</p></div>
          <div><p>Fecha: {linea}</p><p className="text-sm text-mist">Ciudad: {linea}</p></div>
        </div>

        <p className="mt-6 text-xs text-mist">Responsables del proyecto: Ana Lucía, Antonella y María Paula. Contacto: discap.amalu@gmail.com · Política de privacidad: discap-anmalu.vercel.app/privacidad</p>
      </div>
    </article>
  );
}
