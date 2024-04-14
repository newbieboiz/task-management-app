import { Task } from './schemas/task';

export const categorizeTasks = (tasks: Task[]) => {
  const doFirstTasks: Task[] = [];
  const schedulingTasks: Task[] = [];
  const delegatingTasks: Task[] = [];
  const eliminatingTasks: Task[] = [];
  tasks.forEach((task) => {
    if (task.type === 'urgent&important') {
      doFirstTasks.push(task);
    } else if (task.type === 'not_urgent&important') {
      schedulingTasks.push(task);
    } else if (task.type === 'urgent&not_important') {
      delegatingTasks.push(task);
    } else {
      eliminatingTasks.push(task);
    }
  });

  return { doFirstTasks, schedulingTasks, delegatingTasks, eliminatingTasks };
};

class Lexorank {
  MIN_CHAR = 0;
  MAX_CHAR = 0;

  constructor() {
    this.MIN_CHAR = this.byte('0');
    this.MAX_CHAR = this.byte('z');
  }

  insert(prev?: string, next?: string): string | null {
    if (!prev) {
      prev = this.string(this.MIN_CHAR);
    }
    if (!next) {
      next = this.string(this.MAX_CHAR);
    }

    let rank = '';
    let i = 0;

    while (true) {
      let prevChar = this.getChar(prev, i, this.MIN_CHAR);
      let nextChar = this.getChar(next, i, this.MAX_CHAR);

      if (prevChar === nextChar) {
        rank += this.string(prevChar);
        i++;
        continue;
      }

      let midChar = this.mid(prevChar, nextChar);
      if (midChar === prevChar || midChar === nextChar) {
        rank += this.string(prevChar);
        i++;
        continue;
      }

      rank += this.string(midChar);
      break;
    }

    if (rank >= next) {
      return null;
    }
    return rank;
  }

  mid(prev: number, next: number) {
    // TODO: consider to use 8 steps each jump
    return Math.floor((prev + next) / 2);
  }

  getChar(str: string, i: number, defaultChar: number) {
    if (i >= str.length) {
      return defaultChar;
    }
    return this.byte(str.charAt(i));
  }

  byte(char: string) {
    return char.charCodeAt(0);
  }

  string(byte: number) {
    return String.fromCharCode(byte);
  }
}

export const lexorank = new Lexorank();
