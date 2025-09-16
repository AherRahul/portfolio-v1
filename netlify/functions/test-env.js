"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const handler = async (event, context) => {
    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            message: 'Environment test',
            hasAnthropicKey: !!process.env.ANTHROPIC_API_KEY,
            keyLength: process.env.ANTHROPIC_API_KEY?.length || 0,
            keyPrefix: process.env.ANTHROPIC_API_KEY?.substring(0, 10) || 'none',
            nodeVersion: process.version,
            timestamp: new Date().toISOString()
        })
    };
};
exports.handler = handler;
