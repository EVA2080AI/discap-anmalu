# 🤟 DISCAP ANMALU · Traductor de Lengua de Señas Colombiana

App web (funciona como app en el celular) que traduce palabras a **Lengua de Señas Colombiana (LSC)** letra por letra, con las fotos de **Ana Lucía, Antonella y María Paula** y la seña formal al lado. También tiene **Expresiones** en video: saludos, familia y colores.

Proyecto escolar para la **Feria Inspírate 2026**. Es la evolución de la app Android del año pasado.

**🌐 App en línea:** https://discap-anmalu.vercel.app

---

## ¿Qué hace?

| Pantalla | Qué hace |
|---|---|
| **Inicio** | Dos botones grandes: Traductor y Expresiones. |
| **Traductor** | Eliges avatar (Ana Lucía, Antonella, María Paula o Aleatorio), escribes una palabra y la app la muestra letra por letra: foto de la niña haciendo la seña + recuadro con la seña formal. Tiene play/pausa, anterior/siguiente y velocidad. Abajo está el abecedario completo para tocar cualquier letra. |
| **Expresiones** | Tres categorías (Saludos, Familia, Colores). Tocas una palabra y se reproduce el video. |

## Instalar como app en el celular

1. Abre https://discap-anmalu.vercel.app en Chrome (Android) o Safari (iPhone).
2. Android: menú ⋮ → **"Agregar a pantalla de inicio"** / **"Instalar app"**.
3. iPhone: botón compartir → **"Agregar a inicio"**.

Queda con ícono propio y abre a pantalla completa. Las fotos que ya viste funcionan sin internet.

## Cómo está hecha (para quien quiera mejorarla)

Sin frameworks ni instalación: solo **HTML + CSS + JavaScript**. Se puede abrir `index.html` directo en el navegador o con un servidor local:

```bash
# opción 1 (Python viene en Mac/Linux)
python3 -m http.server 8080
# opción 2 (si tienes Node)
npx serve .
```

y entrar a http://localhost:8080

```
index.html        ← las pantallas: inicio, traductor, expresiones, buzón de ideas
css/style.css     ← colores, botones, tarjetas
js/datos.js       ← letras y avatares
datos/expresiones.json ← los videos por categoría (lo edita la zona de subidas)
api/              ← funciones del servidor: sesión, subidas, buzón de ideas
admin/            ← zona de subidas (fotos, videos, ideas, aprobaciones)
js/app.js         ← la lógica: navegación, traductor, expresiones
img/senas/        ← seña formal de cada letra (A.jpg … Z.jpg; la Ñ es ENIE.jpg)
img/avatares/     ← fotos de cada niña por letra (ana/, antonella/, mariapaula/)
video/            ← videos de expresiones (saludos/, familia/, colores/)
manifest.json     ← para que se instale como app
sw.js             ← para que funcione sin internet
docs/             ← el brief del proyecto y material de referencia
```

### Agregar una expresión nueva (ejemplo: "Gracias")

La forma fácil: entra a `/admin/`, pestaña **Video**, y súbelo desde el celular.

A mano: guarda el video como `video/saludos/gracias.mp4` y agrega en `datos/expresiones.json`, dentro de `saludos.items`:
```json
{ "nombre": "Gracias", "archivo": "gracias.mp4" }
```

### Agregar una categoría nueva (ejemplo: "Animales")

Desde `/admin/` como admin: pestaña **Video** → **＋ Nueva** → nombre y emoji. A mano: un bloque nuevo en `datos/expresiones.json`; los botones de categoría se generan solos.

### Cambiar los colores

Están todos al principio de `css/style.css` en `:root` (`--azul`, `--lima`, `--amarillo`…).

## Subir fotos y videos (zona de subidas)

👉 https://discap-anmalu.vercel.app/admin/

Se entra con una clave. Hay dos:

| Clave | Quién | Qué pasa al subir |
|---|---|---|
| **Alumna** | Ana Lucía, Antonella, María Paula y compañeras | Queda **pendiente de aprobación**; un admin la revisa en la pestaña *Por aprobar*. |
| **Admin** | Guido, profes | Se **publica directo**; en un minuto se ve en la app. |

- **Foto de letra**: eliges la niña, la letra y tomas la foto con el celular. La app la reduce sola a 800 px.
- **Video**: eliges la categoría (o creas una nueva si eres admin), escribes qué dice la seña y grabas o eliges el video. Máximo 3 segundos.
- La clave nunca se guarda en el celular: se cambia por un pase que caduca a las 12 horas.

Por dentro, cada subida es un *commit* (admin) o un *pull request* (alumna) en este repositorio, así que todo queda con historial y Vercel publica solo.

## Buzón de ideas

En la app hay un **💌 Buzón de ideas** para que cualquier persona (niños incluidos) cuente qué le gustó, qué falla o qué le gustaría. No necesita cuenta. Cada idea aparece en la lista pública con su estado (🌱 Nueva · 🛠️ En proceso · ✅ ¡Lista!) y la respuesta del equipo.

Los admins responden y cambian el estado desde la pestaña *Ideas* de la zona de subidas. Cada idea se copia también como issue en este repositorio para el equipo técnico.

## Para desarrolladores

Los issues de GitHub (https://github.com/EVA2080AI/discap-anmalu/issues) son el tablero técnico: mejoras, errores y tareas con estimación. Si quieres hacer un cambio de código, lee [CONTRIBUTING.md](CONTRIBUTING.md). Las tareas con la etiqueta **`buena para empezar`** son ideales para el primer aporte.

### Variables de entorno (Vercel)

| Variable | Para qué |
|---|---|
| `ADMIN_CLAVE`, `ALUMNA_CLAVE` | Claves de la zona de subidas |
| `GITHUB_TOKEN`, `GITHUB_REPO` | Para que las subidas se guarden en este repositorio |
| `BLOB_READ_WRITE_TOKEN` | Almacén temporal de subidas y del buzón de ideas (Vercel Blob) |

## Créditos

- Señas y fotos: Ana Lucía, Antonella y María Paula.
- Idea y coordinación: Guido Gamba.
- Señas formales: material "Inclusión al día".
- Desarrollo inicial: Juan Sebastián Másmela.
