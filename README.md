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
index.html        ← las tres pantallas
css/style.css     ← colores, botones, tarjetas
js/datos.js       ← AQUÍ se agregan letras, avatares y videos (es solo una lista)
js/app.js         ← la lógica: navegación, traductor, expresiones
img/senas/        ← seña formal de cada letra (A.jpg … Z.jpg; la Ñ es ENIE.jpg)
img/avatares/     ← fotos de cada niña por letra (ana/, antonella/, mariapaula/)
video/            ← videos de expresiones (saludos/, familia/, colores/)
manifest.json     ← para que se instale como app
sw.js             ← para que funcione sin internet
docs/             ← el brief del proyecto y material de referencia
```

### Agregar una expresión nueva (ejemplo: "Gracias")

1. Graba el video y guárdalo como `video/saludos/gracias.mp4` (vertical, corto, menos de 5 MB si se puede).
2. En `js/datos.js`, dentro de `saludos.items`, agrega:
   ```js
   { nombre: "Gracias", archivo: "gracias.mp4" },
   ```
3. Listo. Sube los cambios y Vercel publica solo.

### Agregar una categoría nueva (ejemplo: "Animales")

1. Crea la carpeta `video/animales/` con los videos.
2. En `js/datos.js` agrega un bloque `animales: { titulo: "Animales", emoji: "🐶", items: [...] }`.
3. En `index.html` agrega un botón `<button class="categoria" data-categoria="animales">` junto a los otros.

### Cambiar los colores

Están todos al principio de `css/style.css` en `:root` (`--azul`, `--lima`, `--amarillo`…).

## Cómo proponer mejoras o reportar errores

Usamos los **Issues** de GitHub como tablero de tareas:

👉 https://github.com/EVA2080AI/discap-anmalu/issues

- **🐞 Error**: algo no funciona → botón *New issue* → "Reportar un error".
- **✨ Mejora**: una idea nueva → *New issue* → "Proponer una mejora".
- Si quieres hacer el cambio tú misma, lee [CONTRIBUTING.md](CONTRIBUTING.md).

Las tareas marcadas con la etiqueta **`buena para empezar`** son ideales para el primer aporte.

## Créditos

- Señas y fotos: Ana Lucía, Antonella y María Paula.
- Idea y coordinación: Guido Gamba.
- Señas formales: material "Inclusión al día".
- Desarrollo inicial: Juan Sebastián Másmela.
