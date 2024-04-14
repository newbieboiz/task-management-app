import { cn } from '@/lib/utils';

interface TodoListProps {
  children?: React.ReactNode;
  className?: string;
}

const TodoList = ({ children, className }: TodoListProps) => {
  return (
    <ul className={cn('flex-1 overflow-auto no-scrollbar', className)}>
      {children}
    </ul>
  );
};

export default TodoList;
