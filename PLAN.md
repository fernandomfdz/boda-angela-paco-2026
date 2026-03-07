# Plan de Desarrollo: Web Boda Ángela y Paco 2026

## 1. Dirección de Arte y Estética (Frontend Design)
- **Estética Principal:** *Refined Nighttime Editorial* (Elegancia Nocturna Editorial). 
- **Modo:** **100% Dark Mode**. No habrá soporte ni toggle para modo claro, garantizando que el diseño se mantenga inmersivo.
- **Paleta de Colores (Tokens en Tailwind v4):**
  - Fondo base: Tonos oscuros profundos (ej. `#0a0a0a` o un azul noche casi negro si la imagen lo requiere).
  - Texto principal: Blanco roto / Crema (`#FDFBF7`) para reducir la fatiga visual.
  - Acentos: Dorados o Champaña suaves para destacar botones, input focus, y divisores.
- **Tipografía:**
  - *Títulos (Display):* Tipografía Serif con alto contraste (ej. *Cormorant Garamond* o *Playfair Display*).
  - *Cuerpo (Sans):* Tipografía limpia y legible (ej. *Inter* o *Outfit*).
- **Elemento Ancla (Wow Factor):** El canvas interactivo de fondo. Se cargará `background.png` y, mediante JavaScript (`requestAnimationFrame`), se añadirán sutiles partículas de luz o variaciones de opacidad en zonas específicas para que las **guirnaldas parpadeen** orgánicamente.
- **Dispositivos:** Prioridad estricta **Mobile-First**. La interfaz se optimizará para celular, con controles accesibles a una mano y tipografías legibles.

## 2. Arquitectura Técnica (Nuxt 4 + Tailwind v4)
- **Framework:** Nuxt 4 con Vue 3 (Composition API y `<script setup>`).
- **Estilos:** Tailwind CSS v4 configurado de forma nativa en `app/assets/css/main.css` usando la directiva `@theme`.
- **Estructura de Componentes:** 
  - `BackgroundCanvas.vue`: Componente fijo en el layout raíz (`z-index: -10`) que renderiza la imagen y anima las luces.
  - Componentes de sección separados (ej. `HeroSection.vue`, `HistoryTimeline.vue`, `LocationMap.vue`, etc.) auto-importados por Nuxt.
- **Iconos:** `@nuxt/icon`
- **Imágenes:** `@nuxt/image` para optimización.

## 3. Estrategia de Animación al Scroll (Scroll-driven Experience)
- **Librería de Animación:** GSAP + ScrollTrigger (para control granular y experiencia cinematográfica). Se integrará suavemente en el ciclo de vida de Vue.
- **Principios Clave (Mobile-First y Performance):**
  - **Sin Scroll Hijacking:** El usuario siempre mantiene el control nativo del scroll. Las animaciones reaccionarán al avance del usuario (`scrub: true`) o se dispararán al entrar en vista.
  - **Parallax Storytelling:** Uso de distintas capas visuales a diferentes profundidades simulando velocidad relativa (y paralaje) para crear inmersión.
  - **Rendimiento Seguro:** Animación restringida a `transform` y `opacity` para garantizar 60fps constantes en móviles.

## 4. Animación, Estructura y Contenido de Secciones

### Inicio (Hero Section) - *El Elemento Hook*
- **Contenido:** Gran título tipográfico "Ángela & Paco". Subtítulo con la fecha, contador minimalista y botón RSVP.
- **Scroll Experience:**
  - Mientras se hace scroll de bajada, la capa del contenido principal avanza más rápido (`y: -50%`) que el fondo que se queda un poco más estático (`y: -20%`). Esta técnica crea profundidad focal, dando paso dramático a la siguiente sección.

### Nuestra Historia - *Contexto y Viaje*
- **Contenido:** Hitos importantes en formato vertical fluido.
- **Scroll Experience:**
  - **Timeline Evolutivo:** A medida que se dibuja la historia en el scroll, una línea vertical se va coloreando dinámicamente según la profundidad (`scrub`).
  - **Story Beats (Reveal):** Cada hito / foto va apareciendo suavemente mediante un `fade-in-up` y una ligera expansión en tamaño, con un pequeño delay entre imagen y texto.

### Ubicación - *Revelación Fluida*
- **Contenido:** Detalles de la ceremonia y convite. Mapa y direcciones.
- **Scroll Experience:**
  - **Fade Suave:** La tarjeta monocromática elegante se irá revelando desde una opacidad inicial usando el Timeline CSS o GSAP, garantizando que atrape la vista solo cuando la sección está bien encuadrada superior o centralmente en el dispositivo.

### La Fiesta - *El Clímax Modular*
- **Contenido:** Dress code, recomendaciones de hotel, itinerario, y playlist.
- **Scroll Experience:**
  - **Bento Grid Stagger:** Al aproximarse a esta cuadrícula (*Bento Grid*), las diferentes opciones entrarán a la pantalla escalonadas (rebote sutil de abajo a arriba), organizando la visualización rítmicamente sin sobrecargar.

### Registro (RSVP) y Colección de Invitados - *Resolución CTA*
- **Contenido:** Formulario limpio de confirmación conectado a una base de datos local SQLite (via Drizzle ORM o Nuxt Server API) para gestionar la asistencia.
- **Scroll Experience:**
  - El contenedor principal del registro se revela "pegajoso" ("Sticky") desde debajo de la cuadrícula de fotos como si fuera una base estática o una caja que se abre, y los campos se iluminan paso a paso (*focus-within* iluminaciones estéticas).

#### 🗄️ Estructura de Datos Propuesta (SQLite)
Para tener el control total de los invitados e incidencias en el catering, recopilaremos los siguientes campos en la tabla `guests`:

1.  **Nombre y Apellidos** (Texto, requerido): Del invitado principal que rellena el formulario.
2.  **Email o Teléfono** (Texto, requerido): Para el envío de recordatorios o contactar si hay problemas con su transporte/hotel.
3.  **¿Asistirás?** (Booleano): True (Sí), False (Lamentablemente no).
4.  **Alergias o Intolerancias Alimentarias** (Texto, opcional): Ej. "Celíaco", "Alérgico al marisco", "Vegano".
5.  **Acompañantes** (Entero): Número de adultos adicionales.
6.  **Niños** (Entero): Número de niños que requieren menú infantil.
7.  **Servicio de Autobús** (Booleano): Si requieren transporte desde el punto de encuentro hasta la finca (muy útil de cara a organizar plazas).
8.  **Petición Musical** (Texto, opcional): "¿Qué canción te haría saltar a la pista de baile?".
9.  **Mensaje para los novios** (Texto, opcional): Un espacio para felicitaciones o comentarios extra.
10. **Timestamp:** Fecha en la que rellenó el RSVP.

## 5. Fases de Desarrollo Actualizado

1. **Configuración Base:** Instalar Tailwind CSS v4, Vue 3, e integrar fuentes y GSAP (ScrollTrigger).
2. **Configuración Backend (DB):** Instalar módulo de DB local (SQLite + DrizzleORM/Nuxt DB) y generar tabla `guests`. Escribir el endpoint API `/api/rsvp`.
3. **Componente Visual 'Wow':**  Desarrollar el `BackgroundCanvas.vue` con la lógica animada nativa, asegurando que degrade bien en dispositivos antiguos (Mobile-Safe).
4. **Sección Inicio y Skeleton Base:** Maquetar el Hero con botones, parallax (`scrub`) en el título contra el background.
5. **Layouts de Scroll Cinematográfico:** Construir módulo por módulo asegurándose de aplicar el _scrub_ o el *stagger * en cada uno de ellos según se ingresa en el *Viewport*. Integrar formulario de RSVP con backend en el módulo final.
6. **Pulido Cinematográfico & Tuning UX:** Ajustar los _timings_ exactos, revisar colapsos de "z-index", usar _prefers-reduced-motion_ en CSS si es detectado, y confirmar accesibilidad táctil para el mapa y RSVP.
