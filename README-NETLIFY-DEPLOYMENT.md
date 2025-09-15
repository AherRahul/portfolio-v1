# Netlify Deployment Setup for AI Features

## Overview
This guide covers the setup required to deploy the AI quiz and summary generation features on Netlify using Netlify Functions.

## Environment Variables
Make sure to set the following environment variable in your Netlify dashboard:

1. Go to your Netlify site dashboard
2. Navigate to `Site settings` → `Environment variables`
3. Add the following variable:
   - **Key**: `ANTHROPIC_API_KEY`
   - **Value**: Your Anthropic API key (starting with `sk-ant-`)

## Files Added/Modified

### Netlify Functions
- `netlify/functions/quiz-generate.ts` - Handles quiz generation requests
- `netlify/functions/summary-generate.ts` - Handles AI summary generation requests
- `netlify/functions/package.json` - Dependencies for functions
- `netlify/functions/tsconfig.json` - TypeScript configuration for functions

### Configuration
- `netlify.toml` - Updated with function configuration and redirects

### Frontend Updates
- API endpoints remain the same (`/api/quiz/generate` and `/api/summary/generate`)
- Requests are automatically redirected to Netlify Functions via `netlify.toml` redirects

## How It Works

1. **Frontend Request**: Your app makes a request to `/api/quiz/generate`
2. **Netlify Redirect**: Netlify automatically redirects this to `/.netlify/functions/quiz-generate`
3. **Function Execution**: The TypeScript function runs with access to environment variables
4. **Response**: The AI-generated content is returned to the frontend

## Deployment Steps

1. **Push your code** to your repository
2. **Set environment variables** in Netlify dashboard:
   ```
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   ```
3. **Deploy**: Netlify will automatically build and deploy your functions

## Function Endpoints

After deployment, your functions will be available at:
- `https://yourdomain.netlify.app/.netlify/functions/quiz-generate`
- `https://yourdomain.netlify.app/.netlify/functions/summary-generate`

But thanks to redirects, you can still use:
- `https://yourdomain.netlify.app/api/quiz/generate`
- `https://yourdomain.netlify.app/api/summary/generate`

## Testing

After deployment, test the functions by:
1. Opening a course topic with the tab system
2. Clicking on "AI Notes" tab to test summary generation
3. Clicking on "Quiz" tab to test quiz generation
4. Check browser network tab to see successful responses

## Troubleshooting

### Common Issues

1. **404 Errors**: 
   - Ensure `netlify.toml` is in the root directory
   - Check that environment variables are set in Netlify dashboard
   - Verify function files are in `netlify/functions/` directory

2. **Environment Variable Issues**:
   - Double-check the variable name is exactly `ANTHROPIC_API_KEY`
   - Ensure the API key is valid and has sufficient credits

3. **Function Timeout**:
   - Netlify functions have a 10-second timeout on free plans
   - Consider reducing content length if requests are timing out

4. **CORS Issues**:
   - Functions include CORS headers for cross-origin requests
   - Check browser console for any CORS-related errors

## Performance Considerations

- Functions cold start: First request may be slower
- Function bundling: Uses esbuild for fast builds
- Caching: Consider implementing response caching for better performance

## Cost Considerations

- Netlify Functions: Free tier includes 125,000 requests per month
- Anthropic API: Pay per token usage
- Monitor usage in both Netlify and Anthropic dashboards
