const OpenAI = require('openai')

const PROVIDERS = {
  openrouter: {
    baseURL: 'https://openrouter.ai/api/v1',
    envKey: 'OPENROUTER_API_KEY',
    fallbackEnvKey: 'XAI_API_KEY',
    supportsPenalties: true,
  },
  groq: {
    baseURL: 'https://api.groq.com/openai/v1',
    envKey: 'GROQ_API_KEY',
    supportsPenalties: true,
  },
  gemini: {
    baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
    envKey: 'GEMINI_API_KEY',
    supportsPenalties: false,
  },
  cerebras: {
    baseURL: 'https://api.cerebras.ai/v1',
    envKey: 'CEREBRAS_API_KEY',
    supportsPenalties: true,
  },
  mistral: {
    baseURL: 'https://api.mistral.ai/v1',
    envKey: 'MISTRAL_API_KEY',
    envKey2: 'MISTRAL_API_KEY_2',
    supportsPenalties: true,
  },
}

const clients = {}

function apiKeysFor(providerName) {
  const p = PROVIDERS[providerName]
  if (!p) return []
  const keys = [process.env[p.envKey]]
  if (p.envKey2) keys.push(process.env[p.envKey2])
  return keys.filter(Boolean)
}

function getClients(providerName) {
  const p = PROVIDERS[providerName]
  if (!p) return []
  const apiKeys = apiKeysFor(providerName)
  return apiKeys.map((apiKey) => {
    const cacheKey = `${providerName}:${apiKey.slice(-6)}`
    if (!clients[cacheKey]) {
      clients[cacheKey] = new OpenAI({
        apiKey,
        baseURL: p.baseURL,
        timeout: 60000,
        maxRetries: 0,
      })
    }
    return clients[cacheKey]
  })
}

function supportsPenalty(providerName) {
  return !!PROVIDERS[providerName]?.supportsPenalties
}

module.exports = { getClients, supportsPenalty, PROVIDERS }
