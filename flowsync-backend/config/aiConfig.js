const { GoogleGenAI } = require('@google/genai')

const getAI = () => {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('GEMINI_API_KEY not set')
  return new GoogleGenAI({ apiKey })
}

module.exports = { getAI }
