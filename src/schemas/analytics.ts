import { z } from 'zod';

export const deviceTypeSchema = z.enum(['mobile', 'tablet', 'desktop']);

export const interactionTypeSchema = z.enum([
  'click',
  'scroll',
  'section_view',
  'form_submit',
  'button_click',
]);

export const engagementLevelSchema = z.enum(['low', 'medium', 'high']);

export const pageInteractionSchema = z.object({
  type: interactionTypeSchema,
  target: z.string(),
  timestamp: z.string(),
  metadata: z.record(z.any()).optional(),
});

export const deviceInfoSchema = z.object({
  type: deviceTypeSchema,
  browser: z.string(),
  os: z.string(),
});

export const screenInfoSchema = z.object({
  resolution: z.string(),
  viewport: z.string(),
});

export const createPageVisitSchema = z.object({
  page: z.string(),
  referrer: z.string().nullable(),
  userAgent: z.string(),
  deviceInfo: deviceInfoSchema,
  screenInfo: screenInfoSchema,
  language: z.string(),
});

export const updatePageSessionSchema = z.object({
  sessionId: z.string(),
  exitTime: z.string(),
  duration: z.number().min(0),
  scrollDepth: z.number().min(0).max(100),
  sectionsViewed: z.array(z.string()),
  interactions: z.array(pageInteractionSchema),
});

export const analyticsEventSchema = z.object({
  sessionId: z.string(),
  eventType: z.string(),
  eventData: z.record(z.any()),
  timestamp: z.string(),
  page: z.string(),
});

export type CreatePageVisitInput = z.infer<typeof createPageVisitSchema>;
export type UpdatePageSessionInput = z.infer<typeof updatePageSessionSchema>;
export type AnalyticsEventInput = z.infer<typeof analyticsEventSchema>;

