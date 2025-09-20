import { TextToSpeechClient } from '@google-cloud/text-to-speech'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { text, voice = 'hi-IN-Wavenet-A', languageCode = 'hi-IN', ssmlGender = 'FEMALE' } = body

    if (!text) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Text is required'
      })
    }

    // Initialize the Text-to-Speech client (supports multiple credential strategies)
    // Priority:
    // 1) GOOGLE_APPLICATION_CREDENTIALS (path to key file)
    // 2) Inline credentials via GOOGLE_CLOUD_CLIENT_EMAIL / GOOGLE_CLOUD_PRIVATE_KEY
    // 3) Application Default Credentials (gcloud auth application-default login)
    const keyFilename = process.env.GOOGLE_APPLICATION_CREDENTIALS
    const clientEmail = process.env.GOOGLE_CLOUD_CLIENT_EMAIL
    const rawPrivateKey = process.env.GOOGLE_CLOUD_PRIVATE_KEY
    const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID

    const client = keyFilename
      ? new TextToSpeechClient({ keyFilename })
      : (clientEmail && rawPrivateKey)
        ? new TextToSpeechClient({
            projectId,
            credentials: {
              client_email: clientEmail,
              private_key: rawPrivateKey.replace(/\\n/g, '\n'),
            },
          })
        : new TextToSpeechClient()

    // Construct the request
    const request = {
      input: { text },
      voice: {
        languageCode,
        name: voice,
        ssmlGender,
      },
      audioConfig: {
        audioEncoding: 'MP3' as const,
        speakingRate: 1.0,
        pitch: 0.0,
        volumeGainDb: 0.0,
      },
    }

    // Perform the text-to-speech request
    const [response] = await client.synthesizeSpeech(request)

    if (!response.audioContent) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to generate audio'
      })
    }

    // Return the audio content as base64
    const audioBase64 = Buffer.from(response.audioContent).toString('base64')
    
    return {
      success: true,
      audio: audioBase64,
      contentType: 'audio/mpeg'
    }

  } catch (error) {
    console.error('TTS Error:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: error instanceof Error ? error.message : 'TTS synthesis failed'
    })
  }
})
