const OpenAI = require('openai')

const getAI = () => {
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.XAI_API_KEY
  if (!apiKey) throw new Error('AI API key not set. Set OPENROUTER_API_KEY in .env')
  const useXAI = !process.env.OPENROUTER_API_KEY && !!process.env.XAI_API_KEY
  const baseURL = useXAI
    ? 'https://api.x.ai/v1'
    : process.env.AI_BASE_URL || 'https://openrouter.ai/api/v1'
  return new OpenAI({
    apiKey,
    baseURL,
    timeout: 60000,
    maxRetries: 0,
  })
}

module.exports = { getAI }
