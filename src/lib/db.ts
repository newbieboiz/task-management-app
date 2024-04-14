import { Task } from '@/modules/todo/schemas/task';
import Dexie, { Table } from 'dexie';

export class MyDexie extends Dexie {
  // 'todoList' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  todoList!: Table<Task>;

  constructor() {
    super('myDatabase');
    this.version(1).stores({
      todoList: '++id, type, rank', // Primary key and indexed props
    });
  }
}

declare global {
  var dexie: MyDexie | undefined;
}

const db = globalThis.dexie || new MyDexie();

if (process.env.NODE_ENV !== 'production') {
  globalThis.dexie = db;
}

export default db;
