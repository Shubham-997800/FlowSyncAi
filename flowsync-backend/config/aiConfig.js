const OpenAI = require('openai')

const getAI = () => {
  const apiKey = process.env.XAI_API_KEY
  if (!apiKey) throw new Error('XAI_API_KEY not set')
  return new OpenAI({
    apiKey,
    baseURL: 'https://api.x.ai/v1',
  })
}

module.exports = { getAI }
