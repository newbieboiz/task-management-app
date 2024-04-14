import { cn } from '@/lib/utils';
import { forwardRef } from 'react';
import { TaskType } from '../schemas/task';

interface TodoContainer extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
  title: string;
  subtitle: string;
  type?: TaskType;
  hint?: string;
}

const TodoContainer = forwardRef<HTMLDivElement, TodoContainer>(
  ({ children, className, title, subtitle, type, hint, ...props }, ref) => {
    return (
      <div
        ref={ref}
        id={type}
        className={cn('w-96 h-80', className)}
        {...props}
      >
        <div
          className={cn('flex flex-col h-full py-5', {
            'bg-red-100': type === 'urgent&important',
            'bg-green-100': type === 'urgent&not_important',
            'bg-orange-100': type === 'not_urgent&important',
            'bg-yellow-100': type === 'not_urgent&not_important',
          })}
        >
          <div className='mb-2 px-5'>
            <h3
              className={cn('text-lg font-medium', {
                'text-red-500': type === 'urgent&important',
                'text-green-500': type === 'urgent&not_important',
                'text-orange-500': type === 'not_urgent&important',
                'text-yellow-500': type === 'not_urgent&not_important',
              })}
              title={hint}
            >
              {title}
            </h3>
            <h5 className='text-xs text-gray-500'>{subtitle}</h5>
          </div>

          {children}
        </div>
      </div>
    );
  },
);
TodoContainer.displayName = 'TodoContainer';

export default TodoContainer;
