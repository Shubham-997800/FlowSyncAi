const { z } = require('zod')

const planResponseSchema = z.object({
  priority: z.array(z.object({
    taskId: z.string().optional(),
    title: z.string().trim().min(1).max(200),
    reason: z.string().trim().max(500).optional(),
    score: z.number().min(0).max(100).optional(),
  })).max(20).optional(),
  schedule: z.array(z.object({
    startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format'),
    endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format'),
    taskId: z.string().optional(),
    title: z.string().trim().max(200).optional(),
    type: z.enum(['work', 'break', 'buffer']).optional(),
  })).max(20).optional(),
  suggestions: z.array(z.string().trim().max(300)).max(10).optional(),
  confidence: z.number().min(0).max(100).optional(),
})

const prioritizeResponseSchema = z.object({
  rankings: z.array(z.object({
    taskId: z.string().min(1),
    title: z.string().trim().max(200).optional(),
    priorityScore: z.number().min(0).max(100),
    riskScore: z.number().min(0).max(100),
    reason: z.string().trim().max(500).optional(),
  })).max(100).optional(),
  suggestedOrder: z.array(z.string()).max(100).optional(),
  summary: z.string().trim().max(1000).optional(),
})

const rescueResponseSchema = z.object({
  criticalTasks: z.array(z.object({
    taskId: z.string().min(1),
    title: z.string().trim().max(200),
    reason: z.string().trim().max(500).optional(),
  })).max(20).optional(),
  compressedSchedule: z.array(z.object({
    startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
    endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
    taskId: z.string().min(1),
    title: z.string().trim().max(200).optional(),
  })).max(20).optional(),
  dropRecommendations: z.array(z.string().trim().max(200)).max(10).optional(),
  timeCompressionStrategy: z.string().trim().max(500).optional(),
  estimatedRecoveryHours: z.number().min(0).max(168).optional(),
})

const taskSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(2000).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  deadline: z.string().refine(v => !Number.isNaN(new Date(v).getTime()), 'Invalid date').nullable().optional(),
})

const actionSchema = z.object({
  taskId: z.string().min(1),
  action: z.enum(['complete', 'in_progress', 'pending', 'update', 'delete']),
  title: z.string().trim().max(200).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  deadline: z.string().refine(v => !Number.isNaN(new Date(v).getTime()), 'Invalid date').nullable().optional(),
})

const chatResponseSchema = z.object({
  reply: z.string().trim().max(5000).optional(),
  tasks: z.array(taskSchema).max(10).optional(),
  actions: z.array(actionSchema).max(10).optional(),
  suggestions: z.array(z.string().trim().max(300)).max(5).optional(),
  createdTasks: z.array(z.object({
    _id: z.string(),
    title: z.string(),
    priority: z.string(),
    deadline: z.string().nullable().optional(),
    status: z.string(),
  })).max(10).optional(),
})

const suggestTaskSchema = z.object({
  suggestedPriority: z.enum(['low', 'medium', 'high']),
  suggestedEstimatedTime: z.number().min(0).max(10000).optional(),
  suggestedTags: z.array(z.string().trim().max(40)).max(20).optional(),
  reason: z.string().trim().max(500).optional(),
})

const analyticsInsightsSchema = z.object({
  strengths: z.array(z.string().trim().max(300)).max(10).optional(),
  weaknesses: z.array(z.string().trim().max(300)).max(10).optional(),
  recommendations: z.array(z.string().trim().max(300)).max(10).optional(),
  predictedCompletionRate: z.number().min(0).max(100).optional(),
  focusRecommendation: z.string().trim().max(500).optional(),
  productivityScore: z.number().min(0).max(100).optional(),
})

const habitInsightsSchema = z.object({
  focusHabit: z.string().trim().max(200).optional(),
  focusReason: z.string().trim().max(500).optional(),
  streakMessage: z.string().trim().max(500).optional(),
  optimalTime: z.string().trim().max(100).optional(),
  pattern: z.string().trim().max(500).optional(),
  tip: z.string().trim().max(500).optional(),
})

const focusSuggestionSchema = z.object({
  title: z.string().trim().max(200).optional(),
  desc: z.string().trim().max(1000).optional(),
  breakSuggestion: z.string().trim().max(500).optional(),
  focusTime: z.number().min(1).max(120).optional(),
  energyRequired: z.enum(['low', 'medium', 'high']).optional(),
  reason: z.string().trim().max(500).optional(),
})

const profileInsightsSchema = z.object({
  productivityScore: z.number().min(0).max(100).optional(),
  totalTasks: z.number().min(0).optional(),
  completedTasks: z.number().min(0).optional(),
  completionRate: z.number().min(0).max(100).optional(),
  streakDays: z.number().min(0).optional(),
  focusHours: z.number().min(0).optional(),
  topStrength: z.string().trim().max(300).optional(),
  topWeakness: z.string().trim().max(300).optional(),
  personalizedTip: z.string().trim().max(500).optional(),
  dailyGoalRecommendation: z.string().trim().max(300).optional(),
  peakProductivityTime: z.enum(['morning', 'afternoon', 'evening']).optional(),
  motivationalMessage: z.string().trim().max(300).optional(),
})

const organizeNotificationsSchema = z.object({
  groups: z.array(z.object({
    name: z.string().trim().max(100),
    priority: z.number().min(1).max(10),
    notificationIds: z.array(z.number().int().min(0)).max(100),
    reason: z.string().trim().max(500).optional(),
  })).max(20).optional(),
  prioritizedIds: z.array(z.number().int().min(0)).max(100).optional(),
  summary: z.string().trim().max(500).optional(),
})

function validateAIResponse(schema, data, fallback) {
  const result = schema.safeParse(data)
  if (result.success) return result.data
  console.warn('[AI] Validation failed:', result.error.issues.map(i => i.message).join(', '))
  return fallback
}

module.exports = {
  planResponseSchema,
  prioritizeResponseSchema,
  rescueResponseSchema,
  chatResponseSchema,
  suggestTaskSchema,
  analyticsInsightsSchema,
  habitInsightsSchema,
  focusSuggestionSchema,
  profileInsightsSchema,
  organizeNotificationsSchema,
  validateAIResponse,
}