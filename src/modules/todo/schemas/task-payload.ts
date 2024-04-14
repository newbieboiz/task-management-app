import { z } from 'zod';
import { TaskSchema } from './task';

export const TaskPayloadSchema = TaskSchema.omit({
  id: true,
  createdAt: true,
  modifiedAt: true,
}).partial({
  completed: true,
});

export type TaskPayload = z.infer<typeof TaskPayloadSchema>;
