export default defineEventHandler(async (event) => {
  const key = getRouterParam(event, 'key')
  if (!key) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing image key.',
    })
  }

  const env = event.context.cloudflare?.env
  if (!env || !env.GALLERY_BUCKET) {
    throw createError({
      statusCode: 500,
      statusMessage: 'R2 bucket not configured (GALLERY_BUCKET missing).',
    })
  }

  try {
    const object = await env.GALLERY_BUCKET.get(key)

    if (!object) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Image not found in R2.',
      })
    }

    // Configurar cabeceras (Cache, Content-Type, etc.)
    const headers: Record<string, string> = {
      'Cache-Control': 'public, max-age=31536000, immutable', // Cachear por 1 año
    }

    if (object.httpMetadata?.contentType) {
      headers['Content-Type'] = object.httpMetadata.contentType
    }

    setResponseHeaders(event, headers)

    // Devolver el stream del body del objeto R2
    return object.body
  } catch (error: any) {
    console.error(`Error fetching R2 object ${key}:`, error)
    if (error.statusCode) throw error
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    })
  }
})
