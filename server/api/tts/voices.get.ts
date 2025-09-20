import { TextToSpeechClient } from '@google-cloud/text-to-speech'

export default defineEventHandler(async (event) => {
  try {
    // Initialize the Text-to-Speech client (supports multiple credential strategies)
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

    // Get list of available voices
    const [response] = await client.listVoices({})

    // Filter and format voices for our use case
    const voices = response.voices?.map(voice => ({
      name: voice.name,
      languageCode: voice.languageCodes?.[0],
      ssmlGender: voice.ssmlGender,
      naturalSampleRateHertz: voice.naturalSampleRateHertz,
      displayName: `${voice.name} (${voice.languageCodes?.[0]}) - ${voice.ssmlGender}`
    })) || []

    // Prioritize Hindi and English voices
    const hindiVoices = voices.filter(v => v.languageCode?.startsWith('hi'))
    const englishVoices = voices.filter(v => v.languageCode?.startsWith('en'))
    const otherVoices = voices.filter(v => !v.languageCode?.startsWith('hi') && !v.languageCode?.startsWith('en'))

    return {
      success: true,
      voices: {
        hindi: hindiVoices,
        english: englishVoices,
        others: otherVoices,
        all: voices
      },
      recommended: {
        hindi: hindiVoices.find(v => v.name?.includes('Wavenet')) || hindiVoices[0],
        english: englishVoices.find(v => v.name?.includes('Wavenet') && v.languageCode === 'en-US') || englishVoices[0]
      }
    }

  } catch (error) {
    console.error('Voice listing error:', error)
    
    // Return fallback voices if API fails
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch voices',
      voices: {
        hindi: [
          { name: 'hi-IN-Wavenet-A', languageCode: 'hi-IN', ssmlGender: 'FEMALE', displayName: 'Hindi Female (Wavenet)' },
          { name: 'hi-IN-Wavenet-B', languageCode: 'hi-IN', ssmlGender: 'MALE', displayName: 'Hindi Male (Wavenet)' }
        ],
        english: [
          { name: 'en-US-Wavenet-F', languageCode: 'en-US', ssmlGender: 'FEMALE', displayName: 'English US Female (Wavenet)' },
          { name: 'en-US-Wavenet-D', languageCode: 'en-US', ssmlGender: 'MALE', displayName: 'English US Male (Wavenet)' }
        ],
        others: [],
        all: []
      },
      recommended: {
        hindi: { name: 'hi-IN-Wavenet-A', languageCode: 'hi-IN', ssmlGender: 'FEMALE', displayName: 'Hindi Female (Wavenet)' },
        english: { name: 'en-US-Wavenet-F', languageCode: 'en-US', ssmlGender: 'FEMALE', displayName: 'English US Female (Wavenet)' }
      }
    }
  }
})
