import { z } from 'zod';

const TaskTypeSchema = z.enum([
  'urgent&important',
  'urgent&not_important',
  'not_urgent&important',
  'not_urgent&not_important',
]);

export const TaskSchema = z.object({
  id: z.number(),
  createdAt: z.string(),
  modifiedAt: z.string(),
  title: z.string().min(2),
  type: TaskTypeSchema,
  completed: z.boolean(),
  rank: z.string(),
});

export type Task = z.infer<typeof TaskSchema>;
export type TaskType = z.infer<typeof TaskTypeSchema>;
