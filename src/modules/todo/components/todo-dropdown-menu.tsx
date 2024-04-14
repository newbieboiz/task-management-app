import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/atoms/dropdown-menu';
import { MoreVertical, Trash } from 'lucide-react';

interface TodoDropdownMenuProps {
  onRemove?: () => void;
}

const TodoDropdownMenu = ({ onRemove }: TodoDropdownMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <MoreVertical className='w-4 h-4 text-gray-500 select-none invisible group-hover:visible hover:cursor-pointer' />
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-32' align='end'>
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={onRemove}>
            <Trash className='mr-2 h-4 w-4' />
            <span>Remove</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TodoDropdownMenu;
