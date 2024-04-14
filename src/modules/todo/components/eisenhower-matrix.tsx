'use client';

import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  MouseSensor,
  PointerActivationConstraint,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useState } from 'react';
import { Task } from '../schemas/task';
import TodoItem from './todo-item';
import TodoBox from './todo-box';
import { DELEGATING, DO_FIRST, ELIMINATING, SCHEDULING } from '../constants';
import updateTask from '../services/update-task';
import { lexorank } from '../utils';
import { useEisenhower } from '../contexts/todo-context';

const EisenhowerMatrix = () => {
  const {
    categorizedTasks: {
      doFirstTasks,
      schedulingTasks,
      delegatingTasks,
      eliminatingTasks,
    },
    tasks,
    dispatch,
  } = useEisenhower();
  const [activeTodo, setActiveTodo] = useState<Task | null>(null);

  const activationConstraint: PointerActivationConstraint = {
    delay: 0,
    distance: 12,
    tolerance: 5,
  };

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint,
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint,
  });
  const keyboardSensor = useSensor(KeyboardSensor, {
    coordinateGetter: sortableKeyboardCoordinates,
  });
  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

  const onDragStart = (event: DragStartEvent) => {
    if (!event.active.data.current) {
      return;
    }

    const { type, data } = event.active.data.current;
    if (type === 'task' && data) {
      setActiveTodo(data);
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTodo(null);

    if (!over) return;

    const overId = over.id;

    const task = active.data.current?.data as Task;

    const overIndex = tasks.findIndex((t) => t.id === overId);
    const prev = tasks[overIndex - 1];
    const next = tasks[overIndex + 1];
    const newRank = lexorank.insert(prev?.rank, next?.rank);

    if (!newRank) {
      return;
    }

    updateTask(task.id, {
      title: task.title,
      type: task.type,
      completed: task.completed,
      rank: newRank,
    });
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === 'task';
    const isOverTask = over.data.current?.type === 'task';

    if (!isActiveTask) return;

    // dropping a task over another task
    if (isActiveTask && isOverTask) {
      dispatch({
        type: 'sort',
        payload: {
          type: 'task',
          activeId,
          overId,
        },
      });
    }

    // dropping a task over another board
    const isOverBoard = over.data.current?.type === 'board';
    if (isActiveTask && isOverBoard) {
      dispatch({
        type: 'sort',
        payload: {
          type: 'board',
          activeId,
          overId,
        },
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
    >
      <div className='relative w-fit mx-auto grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 gap-1'>
        <TodoBox
          title='Do First'
          subtitle='Urgent and important'
          type={DO_FIRST}
          hint='Things with clear deadlines and consequences for not taking immediate action'
          data={doFirstTasks}
        />
        <TodoBox
          title='Schedule'
          subtitle='Less urgent, but important'
          type={SCHEDULING}
          hint='Activities with our set deadline that bring you closer to your goals easy to procrastinate on'
          data={schedulingTasks}
        />
        <TodoBox
          title='Delegate'
          subtitle='Urgent, but less important'
          type={DELEGATING}
          hint="Things that need to be done but, don't require your specific skills"
          data={delegatingTasks}
        />
        <TodoBox
          title='Eliminate'
          subtitle='Neither urgent nor important'
          type={ELIMINATING}
          hint='Distractions that make you feel worse afterward. Can be okay but only in moderation'
          data={eliminatingTasks}
        />
      </div>
      <DragOverlay>
        {activeTodo ? <TodoItem data={activeTodo} isGrabbing /> : null}
      </DragOverlay>
    </DndContext>
  );
};

export default EisenhowerMatrix;
