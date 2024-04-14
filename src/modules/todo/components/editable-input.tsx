import { cn } from '@/lib/utils';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

interface EditableInputProps {
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: React.FocusEventHandler<HTMLElement>;
  onDoubleClick?: React.MouseEventHandler<HTMLElement>;
}

const EditableInput = forwardRef<HTMLElement, EditableInputProps>(
  ({ className, value, onBlur, onChange, onDoubleClick }, outerRef) => {
    const innerRef = useRef<HTMLLabelElement>(null);
    useImperativeHandle(outerRef, () => innerRef.current!);

    useEffect(() => {
      if (!innerRef.current || !value) {
        return;
      }

      if (innerRef.current?.innerHTML !== value) {
        innerRef.current.innerHTML = value;
      }
    });

    return (
      <label
        ref={innerRef}
        className={cn('text-sm py-2 leading-none outline-none', className)}
        suppressContentEditableWarning
        onBlur={onBlur}
        onInput={(e) => {
          e.preventDefault();
          onChange?.(e.currentTarget.innerHTML);
        }}
        onDoubleClick={onDoubleClick}
      />
    );
  },
);
EditableInput.displayName = 'EditableInput';

export default EditableInput;
