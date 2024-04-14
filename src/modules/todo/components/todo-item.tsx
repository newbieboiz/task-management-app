import { Checkbox } from '@/components/atoms/checkbox';
import { cn } from '@/lib/utils';
import { Task } from '../schemas/task';
import EditableInput from './editable-input';
import TodoDropdownMenu from './todo-dropdown-menu';
import useContentEditable from '../hooks/useContentEditable';
import _debounce from 'lodash/debounce';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface TodoItemProps {
  className?: string;
  isGrabbing?: boolean;
  data: Task;
  onUpdate?: (task: Task) => void;
  onRemove?: (taskId: number) => void;
}

const TodoItem = ({
  className,
  isGrabbing,
  data,
  onUpdate,
  onRemove,
}: TodoItemProps) => {
  const {
    setNodeRef,
    setActivatorNodeRef,
    isDragging,
    attributes,
    listeners,
    transform,
    transition,
  } = useSortable({
    id: data.id,
    data: {
      type: 'task',
      data,
    },
  });
  const { inputRef, enableEditing, disableEditing } = useContentEditable();

  const updateTask = (task: Partial<Omit<Task, 'id'>>) => {
    const updatedTodo = {
      ...data,
      ...task,
    };
    onUpdate?.(updatedTodo);
  };

  if (isDragging) {
    return (
      <li
        ref={setNodeRef}
        className={cn(
          'flex items-stretch space-x-2 group relative pr-5 invisible',
          { 'line-through opacity-80': data.completed },
        )}
        style={{
          transform: CSS.Translate.toString(transform),
          transition,
        }}
      >
        <div className='flex items-center pl-2 gap-2'>
          <button>
            <GripVertical className='w-4 h-4 text-gray-500' />
          </button>
          <Checkbox className='my-2' checked={data.completed} />
        </div>
        <EditableInput
          className='flex-1 select-none peer-data-[state="checked"]:line-through peer-data-[state="checked"]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50'
          value={data.title}
        />
      </li>
    );
  }

  return (
    <li
      ref={setNodeRef}
      style={{
        transform: CSS.Translate.toString(transform),
        transition,
      }}
      className={cn(
        'flex items-stretch space-x-2 group relative pr-5',
        { 'shadow-md': isGrabbing },
        { 'line-through opacity-80': data.completed },
        className,
      )}
    >
      <div className='flex items-center pl-2 gap-2'>
        <button
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
          className={cn('select-none invisible group-hover:visible', {
            'cursor-grabbing': isGrabbing,
            'hover:cursor-grab': !isGrabbing,
          })}
        >
          <GripVertical className='w-4 h-4 text-gray-500' />
        </button>
        <Checkbox
          className='my-2'
          checked={data.completed}
          onCheckedChange={(checked) => updateTask({ completed: !!checked })}
        />
      </div>
      <EditableInput
        ref={inputRef}
        className='flex-1 select-none peer-data-[state="checked"]:line-through peer-data-[state="checked"]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50'
        value={data.title}
        onChange={_debounce((title) => updateTask({ title }), 500)}
        onBlur={disableEditing}
        onDoubleClick={enableEditing}
      />
      <div className='flex items-center'>
        <TodoDropdownMenu onRemove={() => onRemove?.(data.id)} />
      </div>
    </li>
  );
};

export default TodoItem;
