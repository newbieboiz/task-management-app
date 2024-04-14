import db from '@/lib/db';
import { TaskPayload } from '../schemas/task-payload';
import { Task } from '../schemas/task';

export default async function createTask(payload: TaskPayload) {
  try {
    const now = new Date().toISOString();
    const newTask = {
      createdAt: now,
      modifiedAt: now,
      title: payload.title,
      type: payload.type,
      completed: false,
      rank: payload.rank,
    } as Task;

    const taskId = await db.todoList.add(newTask);
    newTask.id = taskId;

    return newTask;
  } catch (error) {
    console.log('🚀 ~ createTask ~ error:', error);
    throw error;
  }
}
