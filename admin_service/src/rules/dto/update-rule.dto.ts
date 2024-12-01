import { z } from 'zod';

export const updateRuleSchema = z.object({
  email: z.string().email(),
  baseCurrencyId: z.string().uuid(),
  targetCurrencyId: z.string().uuid(),
  type: z.enum(['INCREASE', 'DECREASE']),
  percentage: z.number().min(0),
  isActive: z.boolean(),
});

export type UpdateRuleDto = z.infer<typeof updateRuleSchema>;