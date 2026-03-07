export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig()

  const scriptUrl = config.googleScriptUrl

  if (!scriptUrl) {
    console.warn('GOOGLE_SCRIPT_URL is not set. Saving to Google Sheets is bypassed.')
    // In dev mode without URL, we return success to not block frontend testing
    return { success: true, message: 'Simulated success (no script URL configured)' }
  }

  try {
    // Send data to Google Apps Script Web App
    const response = await $fetch(scriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: body
    })

    return { success: true, response }
  } catch (error: any) {
    console.error('Error sending to Google Sheets:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error saving RSVP to Google Sheets'
    })
  }
})
