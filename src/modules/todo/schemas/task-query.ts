import { z } from 'zod';
import { TaskSchema } from './task';

export const TaskQuerySchema = TaskSchema.pick({
  id: true,
  type: true,
  completed: true,
}).partial();

export type TaskQuery = z.infer<typeof TaskQuerySchema>;
