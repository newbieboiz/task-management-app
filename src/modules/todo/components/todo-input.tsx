import { cn } from '@/lib/utils';
import { useState } from 'react';

interface TodoInputProps {
  className?: string;
  placeholder?: string;
  onCreate?: (value: string) => void;
}

const TodoInput = ({ className, placeholder, onCreate }: TodoInputProps) => {
  const [value, setValue] = useState('');

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code === 'Enter') {
      onCreate?.(value);
      setValue('');
    }
  };

  return (
    <input
      className={cn(
        'text-sm bg-transparent py-1 focus-visible:outline-none placeholder:font-light',
        className,
      )}
      placeholder={placeholder}
      value={value}
      onChange={(e) => setValue(e.currentTarget.value)}
      onKeyDown={onKeyDown}
    />
  );
};

export default TodoInput;
