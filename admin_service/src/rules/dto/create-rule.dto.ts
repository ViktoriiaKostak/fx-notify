import { z } from 'zod';

export const createRuleSchema = z.object({
  email: z.string().email(),
  baseCurrency: z.string(),
  targetCurrency: z.string(),
  type: z.enum(['INCREASE', 'DECREASE']),
  percentage: z.number().min(0),
  isActive: z.boolean(),
});

export type CreateRuleDto = z.infer<typeof createRuleSchema>;