# Google Cloud Text-to-Speech Setup

This document explains how to set up Google Cloud Text-to-Speech for consistent voice quality across all devices.

## Benefits of Google Cloud TTS

- **Consistent Quality**: Same voices on desktop, mobile, and all browsers
- **Better Pronunciation**: More natural speech synthesis
- **Language Support**: Better Hindi and multilingual support
- **Reliability**: No browser compatibility issues

## Setup Instructions

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the [Text-to-Speech API](https://console.cloud.google.com/apis/library/texttospeech.googleapis.com)

### 2. Create Service Account

1. Go to [IAM & Admin > Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts)
2. Click "Create Service Account"
3. Give it a name like "tts-service"
4. Grant "Text-to-Speech User" role
5. Create and download the JSON key file

### 3. Configure Authentication

**Option A: Environment Variable (Recommended)**
```bash
export GOOGLE_APPLICATION_CREDENTIALS="path/to/your/service-account-key.json"
```

**Option B: Application Default Credentials (Development)**
```bash
gcloud auth application-default login
```

**Option C: Direct JSON Configuration**
Add to your `.env` file:
```env
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_CLOUD_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### 4. Test the Setup

1. Start your development server: `npm run dev`
2. Open any content page with the ContentReader
3. Check browser console for "Google Cloud TTS is available and enabled"
4. Toggle "Use Google TTS" in the reader controls

## Available Voices

### Hindi Voices
- `hi-IN-Wavenet-A` - Female (Recommended)
- `hi-IN-Wavenet-B` - Male
- `hi-IN-Wavenet-C` - Female
- `hi-IN-Wavenet-D` - Male

### English Voices
- `en-US-Wavenet-F` - Female (Recommended)
- `en-US-Wavenet-D` - Male
- `en-US-Wavenet-C` - Female
- `en-US-Wavenet-B` - Male

## Fallback Behavior

If Google Cloud TTS is not available or fails:
1. Automatically falls back to browser TTS
2. Shows "Browser TTS" in the status indicator
3. Continues working with platform-specific voices

## Cost Considerations

- Google Cloud TTS charges per character
- Current pricing: ~$4 per 1 million characters
- Audio is cached to minimize API calls
- Consider implementing usage limits for production

## Troubleshooting

### "Google TTS not available" in console
- Check your service account credentials
- Verify Text-to-Speech API is enabled
- Check network connectivity

### Audio generation fails
- Verify your Google Cloud project has billing enabled
- Check API quotas and limits
- Review server logs for detailed error messages

### Slow audio generation
- Implement sentence-level caching
- Consider pre-generating audio for static content
- Use shorter text chunks for better responsiveness
