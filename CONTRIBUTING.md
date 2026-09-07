# Cómo contribuir a DISCAP ANMALU

¡Gracias por querer mejorar la app! Esta guía está pensada para que cualquiera pueda aportar, aunque sea la primera vez que usa GitHub.

## 1. Elige una tarea

Ve a la pestaña **Issues**: https://github.com/EVA2080AI/discap-anmalu/issues

- Las que tienen la etiqueta **`buena para empezar`** son las más fáciles.
- Escribe un comentario en la tarea diciendo "yo la hago" para que nadie más la tome al mismo tiempo.
- Si tu idea no está en la lista, crea una tarea nueva con el botón **New issue**.

## 2. Haz el cambio

### Opción fácil: editar desde GitHub (sin instalar nada)

1. Abre el archivo que quieres cambiar (por ejemplo `js/datos.js`).
2. Toca el lápiz ✏️ (**Edit this file**).
3. Haz el cambio.
4. Abajo, en **Commit changes**, escribe qué cambiaste (ej. "Agrega la expresión Gracias") y elige **"Create a new branch and start a pull request"**.
5. Toca **Propose changes** y luego **Create pull request**.

### Opción completa: en tu computador

```bash
git clone https://github.com/EVA2080AI/discap-anmalu.git
cd discap-anmalu
git checkout -b mi-mejora
# ... edita los archivos, prueba abriendo index.html ...
git add .
git commit -m "Describe tu cambio"
git push origin mi-mejora
```

Luego en GitHub aparece un botón **Compare & pull request**.

## 3. Prueba antes de enviar

- Abre la app en el celular (o en el navegador con tamaño de celular).
- Revisa que el Traductor y las Expresiones sigan funcionando.
- Si agregaste fotos o videos, que no pesen demasiado (fotos < 300 KB, videos < 5 MB).

## 4. Pull request

Cuando envías un *pull request* (PR), alguien del equipo lo revisa y lo aprueba. Al aprobarlo, **Vercel publica la nueva versión automáticamente** en https://discap-anmalu.vercel.app. No hay que hacer nada más.

## Reglas sencillas

- Todo el código y los comentarios en **español**.
- No borrar fotos ni videos de las demás sin avisar en una tarea.
- Cambios pequeños y claros: un PR por tarea.
- Sé amable en los comentarios. 💙

## ¿Dudas?

Escribe en la tarea (issue) y pregunta. Nadie nace sabiendo GitHub.
