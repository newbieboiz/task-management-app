import TodoList from './todo-list';
import TodoItem from './todo-item';
import { Task, TaskType } from '../schemas/task';
import TodoContainer from './todo-container';
import TodoInput from './todo-input';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/atoms/separator';
import createTask from '../services/create-task';
import { toast } from 'sonner';
import { TaskPayload } from '../schemas/task-payload';
import updateTask from '../services/update-task';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { lexorank } from '../utils';
import removeTask from '../services/remove-task';
import { useEisenhower } from '../contexts/todo-context';

interface TodoBox {
  className?: string;
  title: string;
  subtitle: string;
  type: TaskType;
  hint?: string;
  data?: Task[];
}

const TodoBox = ({
  className,
  title,
  subtitle,
  type,
  hint,
  data = [],
}: TodoBox) => {
  const { isOver, setNodeRef, listeners } = useSortable({
    id: type,
    data: {
      type: 'board',
      data,
    },
    disabled: true,
  });

  const { dispatch } = useEisenhower();

  const onCreate = async (title: string) => {
    try {
      const firstTask = data[0];
      const newRank = lexorank.insert('', firstTask?.rank);

      if (!newRank) {
        throw new Error();
      }

      const payload: TaskPayload = {
        title,
        type: type,
        rank: newRank,
      };

      const createdTask = await createTask(payload);

      dispatch({
        type: 'create',
        payload: createdTask,
      });
    } catch {
      toast.error('Can not add the new task!');
    }
  };

  const onUpdate = async (task: Task) => {
    await updateTask(task.id, {
      title: task.title,
      type: task.type,
      completed: task.completed,
      rank: task.rank,
    });

    dispatch({ type: 'update', payload: task });
  };

  const onRemove = async (taskId: number) => {
    await removeTask(taskId);
    dispatch({ type: 'delete', payload: { id: taskId } });
  };

  return (
    <TodoContainer
      ref={setNodeRef}
      className={cn({ 'opacity-80': isOver }, className)}
      type={type}
      title={title}
      subtitle={subtitle}
      hint={hint}
      {...listeners}
    >
      <div className='px-5'>
        <TodoInput placeholder='Create new task...' onCreate={onCreate} />

        <Separator
          className={cn('mb-2', {
            'bg-red-200': type === 'urgent&important',
            'bg-green-200': type === 'urgent&not_important',
            'bg-orange-200': type === 'not_urgent&important',
            'bg-yellow-200': type === 'not_urgent&not_important',
          })}
        />
      </div>
      <SortableContext items={data}>
        <TodoList>
          {data.map((todo) => (
            <TodoItem
              key={todo.id}
              data={todo}
              onUpdate={onUpdate}
              onRemove={onRemove}
            />
          ))}
        </TodoList>
      </SortableContext>
    </TodoContainer>
  );
};

export default TodoBox;
