import { z } from 'zod';

export const healthSchema = z.object({
  status: z.string(),
  uptime: z.number(),
});

export const skillSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  version: z.string().optional(),
  emoji: z.string().optional(),
});

const cronScheduleSchema = z.object({
  kind: z.string(),
  timezone: z.string().optional(),
  expr: z.string().optional(),
});

export const cronJobSchema = z.object({
  id: z.string(),
  agentId: z.string().optional(),
  name: z.string(),
  enabled: z.boolean(),
  schedule: cronScheduleSchema.optional(),
  sessionTarget: z.string().optional(),
  wakeMode: z.string().optional(),
  createdAtMs: z.number().optional(),
  updatedAtMs: z.number().optional(),
  lastRunAtMs: z.number().optional(),
  nextRunAtMs: z.number().optional(),
});

export const cronResponseSchema = z.object({
  jobs: z.array(cronJobSchema),
});

export const systemInfoSchema = z.object({
  hostname: z.string(),
  platform: z.string(),
  arch: z.string(),
  cpus: z.number(),
  loadAvg: z.object({
    '1m': z.number(),
    '5m': z.number(),
    '15m': z.number(),
  }),
  memory: z
    .object({
      total: z.number(),
      free: z.number(),
      used: z.number(),
      usePct: z.string().optional(),
    })
    .optional(),
  disk: z
    .object({
      total: z.string(),
      used: z.string(),
      available: z.string(),
      usePct: z.string(),
    })
    .optional(),
  nodeVersion: z.string().optional(),
});

export const metricsSchema = z.object({
  timestamp: z.string(),
  hostname: z.string(),
  cpu: z.object({
    overall: z.number(),
    count: z.number(),
    model: z.string(),
  }),
  memory: z.object({
    pct: z.number(),
    usedHuman: z.string(),
    totalHuman: z.string(),
    used: z.number(),
    total: z.number(),
  }),
});

export const sessionSchema = z.object({
  key: z.string(),
  displayName: z.string().optional(),
  channel: z.string().optional(),
  model: z.string().optional(),
  thinkingLevel: z.string().optional(),
  status: z.string().optional(),
  updatedAt: z.number().optional(),
});

export const sessionsResponseSchema = z.object({
  sessions: z.array(sessionSchema),
});

export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  status: z.string(),
  priority: z.string().optional(),
  createdAt: z.string().optional(),
});

export type Health = z.infer<typeof healthSchema>;
export type Skill = z.infer<typeof skillSchema>;
export type CronJob = z.infer<typeof cronJobSchema>;
export type SystemInfo = z.infer<typeof systemInfoSchema>;
export type Metrics = z.infer<typeof metricsSchema>;
export type Session = z.infer<typeof sessionSchema>;
export type Task = z.infer<typeof taskSchema>;
