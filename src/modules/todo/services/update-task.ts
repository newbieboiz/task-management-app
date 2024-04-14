import db from '@/lib/db';
import { TaskPayload } from '../schemas/task-payload';

export default async function updateTask(
  id: number,
  payload: Partial<TaskPayload>,
) {
  try {
    const now = new Date().toISOString();
    return await db.todoList.update(id, {
      modifiedAt: now,
      title: payload.title,
      type: payload.type,
      completed: Boolean(payload.completed),
      rank: payload.rank,
    });
  } catch (error) {
    console.log('🚀 ~ updateTask ~ error:', error);
    throw error;
  }
}
