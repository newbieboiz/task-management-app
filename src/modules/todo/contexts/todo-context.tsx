'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import { Task } from '../schemas/task';
import { arrayMove } from '@dnd-kit/sortable';
import { categorizeTasks } from '../utils';
import getTask from '../services/get-tasks';

type Action = {
  type: 'init' | 'create' | 'update' | 'delete' | 'sort';
  payload: any;
};

type ContextValue = {
  isLoading?: boolean;
  categorizedTasks: Record<
    'doFirstTasks' | 'schedulingTasks' | 'delegatingTasks' | 'eliminatingTasks',
    Task[]
  >;
  tasks: Task[];
  dispatch: (action: Action) => void;
};

const EisenhowerContext = createContext<ContextValue>({} as ContextValue);

export const useEisenhower = () => useContext(EisenhowerContext);

const reducer = (state, { type, payload }: Action) => {
  const cpState = [...state];

  switch (type) {
    case 'init':
      return payload;

    case 'create':
      cpState.push(payload);
      return cpState;

    case 'update':
      const index = cpState.findIndex(({ id }) => id === payload.id);
      if (index !== -1) {
        cpState[index] = payload;
      }
      return cpState;

    case 'delete':
      return cpState.filter(({ id }) => id !== payload.id);

    case 'sort':
      const activeIndex = cpState.findIndex(
        ({ id }) => id === payload.activeId,
      );
      const overIndex = cpState.findIndex(({ id }) => id === payload.overId);

      if (payload.type === 'task') {
        if (cpState[activeIndex].type !== cpState[overIndex].type) {
          cpState[activeIndex].type = cpState[overIndex].type;
          return arrayMove(cpState, activeIndex, overIndex - 1);
        }

        return arrayMove(cpState, activeIndex, overIndex);
      }

      if (payload.type === 'board') {
        // update type of task
        cpState[activeIndex].type = payload.overId as Task['type'];
        return arrayMove(cpState, activeIndex, activeIndex);
      }

      return state;

    default:
      return state;
  }
};

interface EisenhowerContainerProps {
  children?: React.ReactNode;
}

const EisenhowerContainer = ({ children }: EisenhowerContainerProps) => {
  const [tasks, dispatch] = useReducer(reducer, []);
  const [isLoading, setIsLoading] = useState(false);
  const categorizedTasks = useMemo(() => categorizeTasks(tasks), [tasks]);

  const contextValue = useMemo(
    () => ({
      isLoading,
      tasks,
      categorizedTasks,
      dispatch,
    }),
    [isLoading, tasks, categorizedTasks, dispatch],
  );

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const taskList = await getTask();

      if (!taskList) {
        throw Error('Something went wrong');
      }

      dispatch({ type: 'init', payload: taskList });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <EisenhowerContext.Provider value={contextValue}>
      {children}
    </EisenhowerContext.Provider>
  );
};

export default EisenhowerContainer;
