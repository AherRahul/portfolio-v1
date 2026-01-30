"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const sdk_1 = __importDefault(require("@anthropic-ai/sdk"));
const handler = async (event, context) => {
    try {
        const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
        if (!anthropicApiKey) {
            return {
                statusCode: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ message: 'Anthropic API key not configured' })
            };
        }
        // console.log('Testing Anthropic API connection...');
        const anthropic = new sdk_1.default({
            apiKey: anthropicApiKey,
        });
        // Simple test message
        const message = await anthropic.messages.create({
            model: 'claude-3-haiku-20240307',
            max_tokens: 100,
            temperature: 0.1,
            messages: [{
                    role: 'user',
                    content: 'Say "Hello, Netlify!" and nothing else.'
                }]
        });
        const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                success: true,
                message: 'Anthropic API connection successful',
                response: responseText,
                apiKeyPresent: true,
                timestamp: new Date().toISOString()
            })
        };
    }
    catch (error) {
        console.error('Anthropic test error:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            name: error.name,
            status: error.status,
            statusCode: error.statusCode
        });
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                success: false,
                message: 'Anthropic API test failed',
                error: error.message,
                errorType: error.name,
                anthropicStatus: error.status || 'unknown',
                hasApiKey: !!process.env.ANTHROPIC_API_KEY
            })
        };
    }
};
exports.handler = handler;
