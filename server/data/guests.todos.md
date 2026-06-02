# Aclaraciones pendientes para `guests.json`

Generado desde `invitados.xlsx`. Repasa estos puntos con la novia. Los números de fila se refieren al xlsx.

## Identidad indeterminada — renombrar slug

- **Fila 9 y 10** — "Mamá y papá" (2 personas cada uno). Slugs actuales: `padres-1`, `padres-2`. Hay que decidir cuál es de la novia y cuál del novio. Sugerencia: renombrar a `padres-angela` y `padres-paco` (también cambiar `displayName`, `names` y `greeting`).
- **Fila 60** — "Chicano, Yis y la hija de Yis" (3 personas). Slug: `chicano-yis-y-la-hija-de-yis`. Falta el nombre real de la hija — actualmente `"Hija de Yis"`.
- **Fila 98** — "Juan Pedro Hurtado y esposa" (2 personas). Slug: `juan-pedro-hurtado-y-esposa`. Falta el nombre de la esposa — actualmente `"Esposa"`.

## Posibles duplicados

- **Fila 19** "María y Antonio" → slug `maria-y-antonio` vs **Fila 27** "Maria y Antonio" (sin tilde) → slug `maria-y-antonio-2`. Confirmar si son la misma pareja repetida por error o dos parejas distintas. Si son la misma, eliminar una.
- **Múltiples "Fernando y X"** — confirmados como distintos por la otra mitad del nombre, pero conviene revisar:
  - Fila 65 "Fernando y Cristina" → `fernando-y-cristina`
  - Fila 66 "Fernando y Luisa" → `fernando-y-luisa`
  - Fila 73 "Fernando y Eva" → `fernando-y-eva`
- **Múltiples Fernandos individuales**:
  - Fila 93 "Fernando Perals" → `fernando-perals`
  - Fila 95 "Fernando Vera" → `fernando-vera`

## Singles con nombre común (verificar que no chocan mentalmente con otro invitado del listado)

| Fila | displayName | Slug |
|------|-------------|------|
| 11 | Manuel | `manuel` |
| 14 | Javier | `javier` |
| 15 | Jesús | `jesus` |
| 16 | Carmen | `carmen` |
| 18 | Andrea | `andrea` |
| 20 | Pamela | `pamela` |
| 21 | Yolanda | `yolanda` |
| 31 | Pepe | `pepe` |
| 34 | Gema | `gema` |
| 35 | María | `maria` |
| 36 | Stefano | `stefano` |
| 38 | Celia | `celia` |
| 41 | Mari Carmen | `mari-carmen` |
| 42 | Almudena | `almudena` |
| 53 | Ángel | `angel` |
| 54 | Jaime | `jaime` |
| 55 | Emmanuel | `emmanuel` |
| 63 | Pablo | `pablo` |
| 68 | Aldrin | `aldrin` |
| 79 | Irene | `irene` |

En particular **fila 35 "María"** puede confundirse con las múltiples parejas "María y X" (filas 19, 27, 56, 75). Confirmar.

## Decisiones aplicadas (informativo, no requiere acción)

- **Fila 8 "Paco y Ángela"** → excluida (son los novios).
- **Fila 90 "Dioni "** → espacio final eliminado, slug `dioni`.
- Honoríficos (Tito, Tita, Madrina, Padrino, Prima, Primo, Chacha, Chacho) mantenidos tanto en `displayName` como en el array `names`.
- `message` queda vacío en todas las entradas (el sobre tiene texto fijo desde el último cambio).
- `tableNumber` queda `null` en todas — asignar cuando se cierre el seating chart.

## Saludo (Querido/Querida) — verificar inferencias de género

El saludo de los singles se generó asumiendo género por el nombre. Repasa estos casos dudosos:

- **`andrea`** (fila 18) → asumido **femenino** ("Querida Andrea"). En España "Andrea" es nombre de mujer pero en Italia es de hombre. Si es hombre, cambiar a "Querido".
- **`dioni`** (fila 90) → asumido **masculino** (short para Dionisio). Si es mujer (Dionisia), cambiar a "Querida".
- **`aldrin`** (fila 68) → asumido **masculino**. Confirmar.
- **`zeta-guillen`** (fila 96) → asumido **masculino**. Apodo poco común, confirmar.
- **`emmanuel`** (fila 55) → asumido **masculino**. Confirmar (puede ser variante de "Manuela" en mujeres).

## Resumen

- **105 entradas** generadas (sobres).
- **172 personas** totales (`allowedGuests` sumado), que coincide con 174 del xlsx − 2 de los novios.
