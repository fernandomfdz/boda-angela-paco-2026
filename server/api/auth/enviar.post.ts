export default defineEventHandler(async (event) => {
  const body = await readBody<{ password?: string }>(event)
  const config = useRuntimeConfig(event)
  const expected = config.enviarPassword

  if (!expected) {
    throw createError({ statusCode: 500, message: 'ENVIAR_PASSWORD no configurado en el servidor' })
  }
  if (!body?.password || body.password !== expected) {
    throw createError({ statusCode: 401, message: 'Contraseña incorrecta' })
  }

  setCookie(event, 'enviar_auth', body.password, {
    httpOnly: true,
    sameSite: 'lax',
    secure: !import.meta.dev,
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  })

  return { ok: true }
})
