import { z } from "zod";

// API Request/Response schemas
export const aiDetectorRequestSchema = z.object({
  text: z.string().min(1, "Text is required").max(50000, "Text too long (max 50000 characters)"),
});

export const aiDetectorResponseSchema = z.object({
  ai_probability: z.number().min(0).max(100),
  confidence: z.enum(["Very confident", "Maybe", "Not confident"]),
  reasoning: z.string(),
});

export const humanizerRequestSchema = z.object({
  text: z.string().min(1, "Text is required").max(50000, "Text too long (max 50000 characters)"),
});

export const humanizerResponseSchema = z.object({
  rewrittenText: z.string(),
  originalText: z.string(),
  meta: z.object({
    originalWordCount: z.number(),
    rewrittenWordCount: z.number(),
  }),
});

// Type exports
export type AIDetectorRequest = z.infer<typeof aiDetectorRequestSchema>;
export type AIDetectorResponse = z.infer<typeof aiDetectorResponseSchema>;
export type HumanizerRequest = z.infer<typeof humanizerRequestSchema>;
export type HumanizerResponse = z.infer<typeof humanizerResponseSchema>;
