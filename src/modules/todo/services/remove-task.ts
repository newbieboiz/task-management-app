import db from '@/lib/db';

export default async function removeTask(id: number) {
  try {
    return await db.todoList.delete(id);
  } catch (error) {
    console.log('🚀 ~ removeTask ~ error:', error);
    throw error;
  }
}
