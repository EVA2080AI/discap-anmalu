# 🤟 DISCAP ANMALU · Traductor de Lengua de Señas Colombiana

App web (se instala como app en el celular) que traduce palabras a **Lengua de Señas Colombiana (LSC)** letra por letra, con las fotos de **Ana Lucía, Antonella y María Paula** y la seña formal al lado. Tiene **Expresiones** en video (saludos, familia, colores…), un **Buzón de ideas** para el público y una **Zona de subidas** para que las alumnas agreguen fotos y videos desde el celular.

Proyecto escolar para la **Feria Inspírate 2026**.

**🌐 App en línea:** https://discap-anmalu.vercel.app

---

## ¿Qué hace?

| Pantalla | Qué hace |
|---|---|
| **Inicio** | Menú: Traductor, Expresiones y Buzón de ideas. |
| **Traductor** | Eliges avatar (Ana Lucía, Antonella, María Paula o Aleatorio), escribes una palabra y la app la muestra letra por letra: foto de la niña + recuadro con la seña formal (se amplía al tocarlo). Play/pausa sobre la foto, anterior/siguiente, velocidad. Abecedario completo. Funciona sin internet. |
| **Expresiones** | Categorías con videos. Buscador. Se reproducen solos al tocar. |
| **Buzón de ideas** | Cualquiera (niños incluidos) deja una idea, un error o un "me gustó". Lista pública con estado 🌱 🛠️ ✅ y respuesta del equipo. |
| **Aprender** (`/lecciones`) | Una lección por categoría: ver, practicar (¿qué seña es?) y listo. Progreso en el dispositivo. |
| **Practicar** | Adivina la letra entre cuatro. Las letras falladas vuelven a salir hasta dominarlas. |
| **Modo feria** (`/feria`) | Demo automática, QR grande, pantalla completa, vuelve sola tras 60 s. |
| **Docentes** (`/docente`) | Proyectar, retos, lecciones, tarjetas del abecedario para imprimir, plan de clase. |
| **Qué es** (`/sobre`) | Qué es la app, cómo se usa, expresión facial y gramática de la LSC, revisión de las señas, fuentes. |
| **Privacidad** (`/privacidad`) | Política en palabras sencillas y formato de autorización de imagen (`/consentimiento`). |
| **Zona de subidas** (`/admin`) | Con clave. Alumna: sube foto de letra o video y queda **pendiente**. Admin: publica directo, aprueba o rechaza lo pendiente, responde ideas. |

Ajustes (engranaje en la cabecera): alto contraste, texto grande, sin animaciones, sonidos. Se guardan en el dispositivo.

Textos que el equipo edita a mano en `src/lib/contenido.ts`: versión y novedades, quién revisó las señas, fuentes y frases pendientes de grabar.

## Instalar como app en el celular

1. Abre https://discap-anmalu.vercel.app en Chrome (Android) o Safari (iPhone).
2. Android: menú ⋮ → **Instalar app**. iPhone: compartir → **Agregar a inicio**.

## Cómo está hecha

Misma base que Faro Emergency: **Next.js 16 + React 19 + TypeScript + Tailwind 4**, **Prisma** con **PostgreSQL en Neon** (integración de Vercel), archivos subidos en **Vercel Blob**, sesión con JWT en cookie (`jose`), validación con `zod`, íconos `lucide-react`.

```
src/app/                 ← rutas (App Router)
  page.tsx               ← inicio
  traductor/             ← traductor (lee fotos nuevas de la BD)
  expresiones/           ← categorías y videos (BD)
  ideas/                 ← buzón de ideas
  admin/                 ← zona de subidas: subir, subir/video, aprobar, ideas
  api/                   ← sesion, subir-token, publicar, revisar, ideas
src/components/          ← componentes React (cliente)
src/lib/                 ← prisma.ts, auth.ts, datos.ts (letras, avatares, normalizar)
prisma/schema.prisma     ← Categoria, Expresion, FotoLetra, Idea
prisma/seed.mjs          ← carga los 24 videos originales
public/img/senas         ← seña formal de cada letra (la Ñ es ENIE.jpg)
public/img/avatares      ← fotos originales por letra (ana/, antonella/, mariapaula/)
public/video             ← videos originales (540p) con póster .jpg
public/sw.js             ← service worker: fotos en caché para usar sin internet
tests/smoke.spec.ts      ← prueba de humo con Playwright
```

### Desarrollo local

```bash
npm install
vercel env pull .env.local      # trae DATABASE_URL, BLOB_READ_WRITE_TOKEN, claves…
npx prisma db push              # crea/actualiza las tablas
npm run db:seed                 # carga los videos originales (idempotente)
npm run dev                     # http://localhost:3000
```

Pruebas de humo contra producción (o `BASE_URL=http://localhost:3000`):

```bash
npx playwright install chromium
npm run test:e2e
```

### Variables de entorno (Vercel)

| Variable | Para qué |
|---|---|
| `DATABASE_URL`, `DATABASE_URL_UNPOOLED` | Postgres en Neon (las pone la integración) |
| `BLOB_READ_WRITE_TOKEN` | Almacén de fotos y videos subidos (Vercel Blob, público) |
| `AUTH_SECRET` | Firma de la cookie de sesión |
| `ADMIN_CLAVE`, `ALUMNA_CLAVE` | Claves de la zona de subidas |

### Datos

- **Categoria** → **Expresion** (video): `estado` = pendiente · publicada · rechazada · reemplazada.
- **FotoLetra**: fotos subidas que agregan (Ñ) o reemplazan una original. Misma máquina de estados.
- **Idea**: buzón. `tipo` = idea · error · gusto; `estado` = nueva · en-proceso · lista.

Las fotos y videos originales no están en la base de datos: viven en `public/` y se sirven como estáticos.

## Subir fotos y videos

👉 https://discap-anmalu.vercel.app/admin

| Clave | Quién | Qué pasa al subir |
|---|---|---|
| **Alumna** | Ana Lucía, Antonella, María Paula y compañeras | Queda **pendiente**; un admin la revisa en *Por aprobar*. |
| **Admin** | Las creadoras, profes | Se **publica al instante**. También crea categorías nuevas. |

La foto se reduce sola a 800 px antes de subir. Los videos: verticales, 1 a 3 segundos, máximo 25 MB. La clave nunca se guarda en el celular: se cambia por un pase que caduca a las 12 horas.

## Créditos

- Señas y fotos: Ana Lucía, Antonella y María Paula.
- Idea y creación: Ana Lucía, Antonella y María Paula.
- Contacto: discap.amalu@gmail.com
- Señas formales: material "Inclusión al día".
- Desarrollo: Juan Sebastián Másmela.

Licencia: ver [LICENSE.md](LICENSE.md). Las fotos y videos de las niñas son de uso exclusivo de esta app.
