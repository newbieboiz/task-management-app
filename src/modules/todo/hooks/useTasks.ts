'use client';

import { useEffect, useMemo, useState } from 'react';
import { Task } from '../schemas/task';
import getTask from '../services/get-tasks';
import { categorizeTasks } from '../utils';

const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const categorizedTasks = useMemo(() => categorizeTasks(tasks), [tasks]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const taskList = await getTask();

      if (!taskList) {
        throw Error('Something went wrong');
      }

      setTasks(taskList);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { isLoading, tasks, categorizedTasks, setTasks };
};

export default useTasks;
