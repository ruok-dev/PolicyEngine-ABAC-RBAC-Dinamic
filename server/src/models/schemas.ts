
import { z } from 'zod';

export const RuleSchema = z.object({
  attribute: z.string(),
  operator: z.enum(['equals', 'not_equals', 'greater_than', 'less_than', 'in', 'not_in', 'contains', 'between']),
  value: z.any(),
});

export const PolicySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  effect: z.enum(['allow', 'deny']),
  action: z.union([z.string(), z.array(z.string())]),
  resource: z.union([z.string(), z.array(z.string())]),
  rules: z.array(RuleSchema),
  priority: z.number().default(0),
});

export const EvaluationRequestSchema = z.object({
  user: z.record(z.string(), z.any()),
  resource: z.record(z.string(), z.any()),
  action: z.string(),
});
