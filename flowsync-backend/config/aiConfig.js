const OpenAI = require('openai')

const getAI = () => {
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.XAI_API_KEY
  if (!apiKey) throw new Error('AI API key not set. Set OPENROUTER_API_KEY in .env')
  return new OpenAI({
    apiKey,
    baseURL: 'https://openrouter.ai/api/v1',
    timeout: 25000,
    maxRetries: 1,
  })
}

module.exports = { getAI }
