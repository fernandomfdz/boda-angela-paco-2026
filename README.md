# Ángela & Paco - Boda Oficial (2026)

Web oficial para la boda de Ángela y Paco (19 de Septiembre, 2026). 
Una experiencia inmersiva _Single Page_ diseñada con una estética **Refined Nighttime Editorial** (100% Dark Mode), pensada priorizando su uso en dispositivos móviles y con una identidad nocturna elegante.

## Características Técnicas

- **Framework Front-End:** [Nuxt 4](https://nuxt.com/) (Vue 3, Composition API / `<script setup>`).
- **Estilos:** [Tailwind CSS v4](https://tailwindcss.com/) nativo combinado con utilidades de *glassmorphism* hechas a medida.
- **Animaciones Cinematográficas:** [GSAP](https://gsap.com/) + ScrollTrigger. Permite parallax, scrubbing (sincronizar movimiento con el scroll) y stagger (entradas escalonadas).
- **Gráficos Interactivos:** Canvas HTML5 con `requestAnimationFrame` (`BackgroundCanvas.vue`), simulando chispas, fuegos artificiales abstractos y luces sobre el fondo del evento.
- **Tipografía y Colores:** Familia tipo con serifa de alto contraste (*Cormorant Garamond*) para encabezados majestuosos, y *Outfit* para lectura de párrafo. Uso de tonos Champagne (`#D4AF37`) y destellos cálidos sobre fondos oscuros.
- **Almacenamiento (Backend):** Preparado arquitectónicamente para capturar registros de invitados con una base de datos local SQLite, guardando estado de asistencia, alergias, niños, música o autobuses.

---

## Secciones y Funcionalidades Principales

1. **Inicio:** Hero section envolvente. Presenta el título principal, un contador regresivo real hasta el momento del evento y llamadas a la acción (*Scroll* y *Confirmar Asistencia*).
2. **Nuestra Historia:** Línea de tiempo que se colorea dinámicamente y expone fotografías con textos que se revelan conforme el usuario avanza.
3. **Ubicación (`Dónde y Cuándo`):** Transiciones de fundido suaves (Fade-In) hacia las tarjetas informativas de la Parroquia de San Nicolás y la Celebración en Finca El Teular.
4. **La Fiesta:** Diseñado en *Bento Grid* asimétrico para fragmentar la información de Transporte, Alojamiento, Dress Code y Playlist de forma que sea atractivo y escalonado y evitando abrumar de texto al usuario.
5. **La Galería (Fotos):** Mosaico (Masonry Grid) en el que diferentes columnas se desplazan a diferentes velocidades originando un auténtico efecto 3D *parallax*.
6. **Registro (RSVP):** Formulario encapsulado en glassmorphism robusto con confirmaciones reactivas. Manejo inteligente de visualizaciones (por ejemplo, si "Asistes", oculta o despliega el bloque de cantidad de adultos, menú infantil, autobús y canciones).

---

## Puesta en marcha (Desarrollo Local)

Asegúrate de tener instalado **Node.js** (v18+).

1. **Instalar dependencias necesarias:**
   ```bash
   npm install
   ```

2. **Ejecutar servidor de desarrollo con Hot-Module-Replacement:**
   La aplicación levantará un servidor local automáticamente (normalmente en `http://localhost:3000`).
   ```bash
   npm run dev
   ```

## Construcción para Producción

Para compilar el proyecto y generar los archivos optimizados (estáticos, o pre-renderizados para SSR):
```bash
npm run build
```

Una vez construido, puedes simular una previsualización del comportamiento puramente de producción corriendo:
```bash
npm run preview
```

---
*Para mayor detalle técnico específico o estructura del UI/Backend durante fases de desarrollo tempranas, revisa también `PLAN.md`.*
