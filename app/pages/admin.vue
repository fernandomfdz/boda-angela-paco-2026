<template>
  <main class="min-h-screen bg-wedding-dark text-wedding-light px-4 py-10 md:py-16">
    <!-- Password gate -->
    <div v-if="!authed" class="max-w-sm mx-auto mt-20">
      <div class="glass-dark rounded-2xl p-8 text-center">
        <Icon name="lucide:lock" class="w-10 h-10 text-wedding-accent mx-auto mb-4" />
        <h1 class="text-2xl font-serif text-wedding-accent mb-2">Acceso restringido</h1>
        <p class="opacity-70 text-sm mb-6">Esta zona es solo para los novios.</p>
        <form @submit.prevent="submitPassword" class="flex flex-col gap-4">
          <input
            ref="passwordInput"
            v-model="passwordAttempt"
            type="password"
            placeholder="Contraseña"
            autocomplete="current-password"
            class="w-full glass-light rounded-full px-5 py-3 outline-none focus:ring-2 focus:ring-wedding-accent/40 text-center"
            :disabled="authLoading"
          />
          <button
            type="submit"
            :disabled="authLoading || !passwordAttempt"
            class="px-6 py-3 rounded-full bg-wedding-accent text-wedding-dark uppercase tracking-widest text-xs font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ authLoading ? 'Comprobando…' : 'Entrar' }}
          </button>
          <p v-if="authError" class="text-red-400 text-xs">{{ authError }}</p>
        </form>
      </div>
    </div>

    <div v-else class="max-w-5xl mx-auto">

      <header class="text-center mb-10">
        <p class="text-[10px] md:text-xs font-sans tracking-[0.4em] uppercase opacity-50 mb-3">Solo para los novios</p>
        <h1 class="text-4xl md:text-5xl font-serif text-wedding-accent mb-3">Compartir invitaciones</h1>
        <p class="opacity-70 max-w-xl mx-auto">
          <strong class="text-wedding-accent">{{ sentCount }}</strong> enviados ·
          <strong>{{ total - sentCount }}</strong> pendientes · {{ total }} en total.
        </p>
      </header>

      <details class="glass-dark rounded-2xl p-6 md:p-8 mb-8">
        <summary class="cursor-pointer text-sm uppercase tracking-widest opacity-80 hover:opacity-100 select-none flex items-center gap-2">
          <Icon name="lucide:message-square-text" class="w-4 h-4" />
          Plantilla del mensaje
        </summary>

        <div class="mt-6 flex flex-col gap-6">
          <p class="text-xs opacity-60">
            Placeholders disponibles: <code class="text-wedding-accent">{nombre}</code> (displayName del invitado) ·
            <code class="text-wedding-accent">{url}</code> (enlace personal).
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <label class="flex flex-col gap-2">
              <span class="text-xs uppercase tracking-widest opacity-60">Mensaje singular (1 invitado)</span>
              <textarea
                v-model="templateSingular"
                rows="9"
                class="w-full glass-light rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-wedding-accent/40 text-sm font-sans leading-relaxed resize-y"
              />
            </label>
            <label class="flex flex-col gap-2">
              <span class="text-xs uppercase tracking-widest opacity-60">Mensaje plural (2+ invitados)</span>
              <textarea
                v-model="templatePlural"
                rows="9"
                class="w-full glass-light rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-wedding-accent/40 text-sm font-sans leading-relaxed resize-y"
              />
            </label>
          </div>

          <div class="flex flex-wrap gap-3 justify-end">
            <button
              type="button"
              class="px-4 py-2 rounded-full text-xs uppercase tracking-widest border border-wedding-accent/30 hover:bg-wedding-accent/10 transition cursor-pointer inline-flex items-center gap-2"
              @click="resetTemplate"
            >
              <Icon name="lucide:rotate-ccw" class="w-4 h-4" />
              Restablecer plantilla
            </button>
          </div>
        </div>
      </details>

      <div class="sticky top-2 z-10 mb-8 flex flex-col gap-3">
        <input
          v-model="search"
          type="search"
          placeholder="Buscar invitado..."
          class="w-full glass-dark rounded-full px-6 py-3 outline-none focus:ring-2 focus:ring-wedding-accent/40"
        />
        <div class="flex gap-2 justify-center">
          <button
            v-for="opt in filterOptions"
            :key="opt.value"
            type="button"
            class="px-4 py-1.5 rounded-full text-xs uppercase tracking-widest border transition cursor-pointer"
            :class="filterBy === opt.value
              ? 'bg-wedding-accent text-wedding-dark border-wedding-accent'
              : 'border-wedding-accent/30 hover:bg-wedding-accent/10'"
            @click="filterBy = opt.value"
          >
            {{ opt.label }}
          </button>
        </div>
      </div>

      <div v-if="pending" class="text-center py-12 opacity-60">Cargando invitados…</div>
      <div v-else-if="error" class="text-center py-12 text-red-400">Error al cargar invitados</div>

      <ul v-else class="flex flex-col gap-4">
        <li
          v-for="g in filtered"
          :key="g.slug"
          class="glass-dark rounded-2xl p-6 md:p-8 flex flex-col gap-5 transition-opacity"
          :class="isSent(g.slug) ? 'opacity-60' : ''"
        >
          <div class="flex flex-wrap items-baseline justify-between gap-4">
            <div>
              <div class="flex items-center gap-3 flex-wrap">
                <h2 class="text-xl md:text-2xl font-serif text-wedding-accent">{{ g.displayName }}</h2>
                <span
                  v-if="isSent(g.slug)"
                  class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] uppercase tracking-widest bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/40"
                >
                  <Icon name="lucide:check-check" class="w-3.5 h-3.5" />
                  Enviado
                </span>
              </div>
              <p class="text-xs uppercase tracking-widest opacity-50 mt-1">
                {{ g.allowedGuests }} {{ g.allowedGuests === 1 ? 'persona' : 'personas' }} · slug <code class="opacity-80">{{ g.slug }}</code>
              </p>
            </div>
            <div class="flex flex-wrap gap-2">
              <button
                type="button"
                class="px-4 py-2 rounded-full text-xs uppercase tracking-widest border border-wedding-accent/30 hover:bg-wedding-accent/10 transition cursor-pointer inline-flex items-center gap-2"
                @click="copyLink(g)"
              >
                <Icon :name="copiedSlug === g.slug ? 'lucide:check' : 'lucide:link'" class="w-4 h-4" />
                {{ copiedSlug === g.slug ? 'Copiado' : 'Copiar enlace' }}
              </button>
              <a
                :href="g.slug ? `/${g.slug}` : '/'"
                target="_blank"
                rel="noopener noreferrer"
                class="px-4 py-2 rounded-full text-xs uppercase tracking-widest border border-wedding-accent/30 hover:bg-wedding-accent/10 transition inline-flex items-center gap-2"
              >
                <Icon name="lucide:eye" class="w-4 h-4" />
                Ver
              </a>
              <a
                :href="whatsappLink(g)"
                target="_blank"
                rel="noopener noreferrer"
                class="px-4 py-2 rounded-full text-xs uppercase tracking-widest bg-[#25D366] text-black hover:brightness-110 transition inline-flex items-center gap-2 font-medium cursor-pointer"
                @click="markSent(g.slug)"
              >
                <Icon name="lucide:send" class="w-4 h-4" />
                {{ isSent(g.slug) ? 'Reenviar' : 'Enviar por WhatsApp' }}
              </a>
              <button
                v-if="isSent(g.slug)"
                type="button"
                class="px-4 py-2 rounded-full text-xs uppercase tracking-widest border border-wedding-accent/30 hover:bg-wedding-accent/10 transition cursor-pointer inline-flex items-center gap-2"
                @click="toggleSent(g.slug)"
                title="Marcar como no enviado"
              >
                <Icon name="lucide:undo-2" class="w-4 h-4" />
                Desmarcar
              </button>
            </div>
          </div>

          <details class="border-t border-wedding-accent/10 pt-4">
            <summary class="cursor-pointer text-sm opacity-70 hover:opacity-100 select-none">
              Ver mensajes que verá el invitado
            </summary>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">

              <section class="rounded-xl p-5 md:p-6 border border-wedding-accent/10">
                <p class="text-[10px] uppercase tracking-widest opacity-50 mb-4">Carta del sobre</p>
                <p class="font-serif italic text-xs tracking-[0.3em] uppercase text-wedding-accent text-center mb-4">Ángela &amp; Paco</p>
                <h3 class="font-serif text-xl text-center mb-4">{{ g.greeting }},</h3>
                <div class="font-serif text-sm leading-relaxed text-center space-y-3">
                  <p v-for="(p, i) in letterParagraphs" :key="i">{{ p }}</p>
                </div>
              </section>

              <section class="rounded-xl p-5 md:p-6 border border-wedding-accent/10">
                <p class="text-[10px] uppercase tracking-widest opacity-50 mb-4">Página de bienvenida</p>
                <h3 class="font-serif text-xl text-wedding-accent text-center mb-4">¡Hola {{ g.displayName }}!</h3>
                <div class="text-sm leading-relaxed text-center space-y-3 opacity-90">
                  <p v-for="(p, i) in welcomeParagraphs" :key="i">{{ p }}</p>
                </div>
              </section>

              <section class="md:col-span-2 rounded-xl p-5 md:p-6 border border-wedding-accent/10">
                <p class="text-[10px] uppercase tracking-widest opacity-50 mb-4">Mensaje de WhatsApp</p>
                <pre class="text-sm whitespace-pre-wrap leading-relaxed opacity-90 font-sans">{{ whatsappMessage(g) }}</pre>
              </section>

            </div>
          </details>
        </li>
      </ul>

      <p v-if="!pending && filtered.length === 0" class="text-center py-12 opacity-60">
        No se han encontrado invitados con "{{ search }}".
      </p>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import type { Guest } from '~/types/guest'

definePageMeta({ layout: false })

useHead({
  title: 'Admin · Ángela & Paco',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' },
  ],
})

// Limpia los meta tags sociales que se heredan de `app/app.vue` para que esta
// página no exponga ogImage / Twitter card al pegar la URL en chats.
useSeoMeta({
  ogImage: null,
  ogImageType: null,
  ogImageWidth: null,
  ogImageHeight: null,
  ogTitle: null,
  ogDescription: null,
  ogUrl: null,
  ogSiteName: null,
  ogType: null,
  ogLocale: null,
  twitterCard: null,
  twitterImage: null,
  twitterTitle: null,
  twitterDescription: null,
  twitterCreator: null,
  description: null,
})

const authed = ref(false)
const passwordAttempt = ref('')
const passwordInput = ref<HTMLInputElement | null>(null)
const authError = ref('')
const authLoading = ref(false)

const data = ref<Record<string, Guest> | null>(null)
const pending = ref(false)
const error = ref<unknown>(null)

const loadGuests = async () => {
  pending.value = true
  error.value = null
  try {
    data.value = await $fetch<Record<string, Guest>>('/api/guests')
    authed.value = true
  } catch (e: unknown) {
    const status = (e as { statusCode?: number; status?: number })?.statusCode ?? (e as { status?: number })?.status
    if (status === 401) {
      authed.value = false
      await nextTick()
      passwordInput.value?.focus()
    } else {
      error.value = e
    }
  } finally {
    pending.value = false
  }
}

const submitPassword = async () => {
  if (!passwordAttempt.value) return
  authLoading.value = true
  authError.value = ''
  try {
    await $fetch('/api/auth/admin', {
      method: 'POST',
      body: { password: passwordAttempt.value },
    })
    passwordAttempt.value = ''
    await loadGuests()
  } catch (e: unknown) {
    const status = (e as { statusCode?: number; status?: number })?.statusCode ?? (e as { status?: number })?.status
    authError.value = status === 401 ? 'Contraseña incorrecta' : 'Error al iniciar sesión'
  } finally {
    authLoading.value = false
  }
}

onMounted(loadGuests)

const search = ref('')
const copiedSlug = ref<string | null>(null)

type FilterValue = 'all' | 'pending' | 'sent'
const filterOptions: { value: FilterValue; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'pending', label: 'Pendientes' },
  { value: 'sent', label: 'Enviados' },
]
const filterBy = ref<FilterValue>('all')

const STORAGE_KEY = 'wedding_sent_invitations'
const sentSlugs = ref<Set<string>>(new Set())

onMounted(() => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) sentSlugs.value = new Set(JSON.parse(raw))
  } catch {
    /* noop */
  }
})

const persistSent = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...sentSlugs.value]))
  } catch {
    /* noop */
  }
}

const isSent = (slug: string) => sentSlugs.value.has(slug)
const markSent = (slug: string) => {
  sentSlugs.value.add(slug)
  sentSlugs.value = new Set(sentSlugs.value)
  persistSent()
}
const toggleSent = (slug: string) => {
  if (sentSlugs.value.has(slug)) sentSlugs.value.delete(slug)
  else sentSlugs.value.add(slug)
  sentSlugs.value = new Set(sentSlugs.value)
  persistSent()
}

const sentCount = computed(() => {
  return Object.keys(data.value ?? {}).filter((s) => sentSlugs.value.has(s)).length
})

const total = computed(() => Object.keys(data.value ?? {}).length)

const guests = computed(() => Object.values(data.value ?? {}))

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  let list = guests.value
  if (filterBy.value === 'sent') list = list.filter((g) => sentSlugs.value.has(g.slug))
  else if (filterBy.value === 'pending') list = list.filter((g) => !sentSlugs.value.has(g.slug))
  if (!q) return list
  return list.filter((g) =>
    g.displayName.toLowerCase().includes(q) ||
    g.slug.toLowerCase().includes(q) ||
    g.names.some((n) => n.toLowerCase().includes(q)),
  )
})

const letterParagraphs = [
  '¡Nuestro destino estaba escrito!',
  'Con enorme ilusión, alegría y felicidad, queremos compartir contigo una noticia muy especial ¡nos casamos!',
  'Os damos la bienvenida a uno de los capítulos más importantes de nuestra vida, un día único, junto con la bendición de Dios, que unirá nuestras vidas para siempre, y que deseamos celebrar rodeados de las personas que más queremos.',
  '¡¡Te esperamos!!',
]

const welcomeParagraphs = [
  '¡Bienvenidos a la web de nuestra boda!',
  'Aquí encontraréis un pedacito de nuestra historia y todos los detalles del evento, así como algunas secciones para que puedas compartir fotos con nosotros.',
  'Tu presencia y cariño es muy especial e importante para nosotros y por eso esperamos poder contar contigo y que nos ayudes a que sea un día inolvidable. ¡Confirma tu asistencia!',
]

const baseUrl = () => {
  if (typeof window !== 'undefined') return window.location.origin
  return 'https://boda.pacosarabia.com'
}

const guestUrl = (g: Guest) => `${baseUrl()}/${g.slug}`

const DEFAULT_TEMPLATE_SINGULAR = `¡Hola {nombre}!

Tenemos algo que contarte... 👀

{url}

Con cariño,
Ángela y Paco`

const DEFAULT_TEMPLATE_PLURAL = `¡Hola {nombre}!

Tenemos algo que contaros... 👀

{url}

Con cariño,
Ángela y Paco`

const TEMPLATE_KEY_SINGULAR = 'wedding_whatsapp_template_singular'
const TEMPLATE_KEY_PLURAL = 'wedding_whatsapp_template_plural'

const templateSingular = ref(DEFAULT_TEMPLATE_SINGULAR)
const templatePlural = ref(DEFAULT_TEMPLATE_PLURAL)

onMounted(() => {
  try {
    templateSingular.value = localStorage.getItem(TEMPLATE_KEY_SINGULAR) || DEFAULT_TEMPLATE_SINGULAR
    templatePlural.value = localStorage.getItem(TEMPLATE_KEY_PLURAL) || DEFAULT_TEMPLATE_PLURAL
  } catch {
    /* noop */
  }
})

watch(templateSingular, (val) => {
  try { localStorage.setItem(TEMPLATE_KEY_SINGULAR, val) } catch { /* noop */ }
})
watch(templatePlural, (val) => {
  try { localStorage.setItem(TEMPLATE_KEY_PLURAL, val) } catch { /* noop */ }
})

const resetTemplate = () => {
  templateSingular.value = DEFAULT_TEMPLATE_SINGULAR
  templatePlural.value = DEFAULT_TEMPLATE_PLURAL
}

const whatsappMessage = (g: Guest) => {
  const tpl = g.allowedGuests > 1 ? templatePlural.value : templateSingular.value
  return tpl
    .replaceAll('{nombre}', g.displayName)
    .replaceAll('{url}', guestUrl(g))
}

const whatsappLink = (g: Guest) => `https://wa.me/?text=${encodeURIComponent(whatsappMessage(g))}`

const copyLink = async (g: Guest) => {
  try {
    await navigator.clipboard.writeText(guestUrl(g))
    copiedSlug.value = g.slug
    setTimeout(() => {
      if (copiedSlug.value === g.slug) copiedSlug.value = null
    }, 2000)
  } catch {
    /* noop */
  }
}
</script>
