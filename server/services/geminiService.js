const { GoogleGenAI } = require('@google/genai')

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

const callGemini = async (prompt) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    })
    return response.text || ''
  } catch (error) {
    console.error('Gemini API error:', error.message)
    throw new Error('AI service error')
  }
}

const prioritizeTask = async (task) => {
  const prompt = `Given this task: "${task.title}" with description: "${task.description || 'N/A'}", suggest a priority level (high, medium, or low) and explain why in one sentence.`
  return callGemini(prompt)
}

const suggestSchedule = async (task) => {
  const prompt = `Given this task: "${task.title}" with description: "${task.description || 'N/A'}" and estimated duration: ${task.estimatedDuration || 'unknown'} minutes, suggest the best time to schedule this task in a day and explain why in one sentence.`
  return callGemini(prompt)
}

module.exports = { prioritizeTask, suggestSchedule }
