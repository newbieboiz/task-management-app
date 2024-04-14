import db from '@/lib/db';
import { TaskQuery } from '../schemas/task-query';

export default async function getTask(query?: TaskQuery) {
  try {
    if (!query) {
      return await db.todoList.orderBy('rank').toArray();
    }

    if (query.type && query.completed !== undefined) {
      return await db.todoList
        .where('type')
        .equals(query.type)
        .or('completed')
        .equals(String(query.completed))
        .reverse()
        .sortBy('rank');
    }

    if (!query.type && query.completed !== undefined) {
      return await db.todoList
        .where('completed')
        .equals(String(query.completed))
        .reverse()
        .sortBy('rank');
    }

    if (query.type && query.completed === undefined) {
      return await db.todoList
        .where('type')
        .equals(query.type)
        .reverse()
        .sortBy('rank');
    }

    if (!query.type && query.completed === undefined) {
      return await db.todoList.reverse().sortBy('rank');
    }
  } catch (error) {
    console.log('🚀 ~ getTask ~ error:', error);
    throw error;
  }
}
