const { z } = require('zod')

const validate = (schema, source = 'body') => (req, res, next) => {
  const result = schema.safeParse(req[source])
  if (!result.success) {
    const message = result.error.issues[0]?.message || 'Invalid request'
    return res.status(400).json({ code: 'VALIDATION_ERROR', message, issues: result.error.issues })
  }
  if (source === 'body') req.body = result.data
  else req[source] = result.data
  next()
}

const PRIORITY = z.enum(['low', 'medium', 'high'])
const TASK_STATUS = z.enum(['todo', 'in_progress', 'done'])
const AI_QUALITY = z.enum(['low', 'medium', 'high']).optional()
const ISO_DATE = z.string().refine(v => !Number.isNaN(new Date(v).getTime()), 'Invalid date')

const authSchemas = {
  signup: z.object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters').max(80),
    email: z.string().trim().email('Invalid email format').max(120),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain an uppercase letter')
      .regex(/[0-9]/, 'Password must contain a number'),
  }),
  login: z.object({
    email: z.string().trim().email('Invalid email format'),
    password: z.string().min(1, 'Password is required'),
  }),
}

const taskSchemas = {
  create: z.object({
    title: z.string().trim().min(1, 'Title is required').max(200),
    description: z.string().trim().max(2000).optional().default(''),
    priority: PRIORITY.optional(),
    status: TASK_STATUS.optional(),
    deadline: ISO_DATE.optional().nullable(),
    estimatedTime: z.number().min(0).max(100000).optional(),
    tags: z.array(z.string().trim().min(1).max(40)).max(20).optional(),
  }),
  update: z.object({
    title: z.string().trim().min(1, 'Title is required').max(200).optional(),
    description: z.string().trim().max(2000).optional(),
    priority: PRIORITY.optional(),
    status: TASK_STATUS.optional(),
    deadline: ISO_DATE.optional().nullable(),
    estimatedTime: z.number().min(0).max(100000).optional(),
    tags: z.array(z.string().trim().min(1).max(40)).max(20).optional(),
  }),
}

const aiSchemas = {
  plan: z.object({ prompt: z.string().trim().min(1, 'Prompt required').max(2000), quality: AI_QUALITY }),
  chat: z.object({
    message: z.string().trim().min(1, 'Message required').max(2000),
    sessionId: z.string().trim().max(100).optional(),
    mode: z.string().trim().max(50).optional(),
    quality: AI_QUALITY,
  }),
  suggestTask: z.object({
    title: z.string().trim().min(1, 'Title required').max(200),
    description: z.string().trim().max(2000).optional(),
    quality: AI_QUALITY,
  }),
  focusSuggest: z.object({
    taskId: z.string().trim().min(1).optional(),
    quality: AI_QUALITY,
  }),
  organizeNotifications: z.object({
    notifications: z.array(z.object({}).passthrough()).max(100).default([]),
    quality: AI_QUALITY,
  }),
}

module.exports = { validate, authSchemas, taskSchemas, aiSchemas }
