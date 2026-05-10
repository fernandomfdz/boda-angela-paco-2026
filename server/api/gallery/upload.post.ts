export default defineEventHandler(async (event) => {
  try {
    const env = event.context.cloudflare?.env
    if (!env || !env.GALLERY_BUCKET) {
      throw createError({
        statusCode: 500,
        statusMessage: 'R2 bucket not configured (GALLERY_BUCKET missing).',
      })
    }

    const files = await readMultipartFormData(event)
    if (!files || files.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No files uploaded.',
      })
    }

    const uploadedKeys: string[] = []

    for (const file of files) {
      // En multipart form data, files tienen un filename
      if (file.name === 'files' && file.filename) {
        // Validar que sea imagen o video
        const mimeType = file.type || ''
        if (!mimeType.startsWith('image/') && !mimeType.startsWith('video/')) {
          continue // Ignorar archivos no permitidos
        }

        // Generar un key único que permita ordenar cronológicamente
        // Formato: timestamp_hash.extension
        const timestamp = Date.now()
        const randomStr = Math.random().toString(36).substring(2, 8)
        
        // Extraer extensión de archivo original
        const extension = file.filename.split('.').pop()?.toLowerCase() || 'jpg'
        const key = `${timestamp}_${randomStr}.${extension}`

        // Subir a R2
        await env.GALLERY_BUCKET.put(key, file.data, {
          httpMetadata: {
            contentType: mimeType,
          },
        })

        uploadedKeys.push(key)
      }
    }

    return {
      success: true,
      uploaded: uploadedKeys.length,
      keys: uploadedKeys
    }
  } catch (error: any) {
    console.error('Error uploading to R2:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal Server Error',
    })
  }
})
