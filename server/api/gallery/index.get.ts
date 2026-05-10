export default defineEventHandler(async (event) => {
  try {
    const env = event.context.cloudflare?.env
    if (!env || !env.GALLERY_BUCKET) {
      throw createError({
        statusCode: 500,
        statusMessage: 'R2 bucket not configured (GALLERY_BUCKET missing).',
      })
    }

    // Listar objetos en el bucket. Por defecto trae hasta 1000.
    const listed = await env.GALLERY_BUCKET.list({
      limit: 1000
    })

    // Los objetos en R2 vienen ordenados lexicográficamente por la key.
    // Como nuestra key empieza con Date.now(), están ordenados del más antiguo al más nuevo.
    // Los revertimos para mostrar los más recientes primero.
    const keys = listed.objects
      .map((obj: any) => ({
        key: obj.key,
        uploadedAt: obj.uploaded,
        size: obj.size
      }))
      .reverse()

    return {
      success: true,
      photos: keys
    }
  } catch (error: any) {
    console.error('Error listing R2 bucket:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal Server Error',
    })
  }
})
