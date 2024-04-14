import { useRef } from 'react';

const useContentEditable = () => {
  const inputRef = useRef<HTMLElement>(null);

  const enableEditing = () => {
    if (!inputRef.current) {
      return;
    }

    if (inputRef.current.contentEditable !== 'true') {
      inputRef.current.contentEditable = 'true';
      inputRef.current.focus();
      moveCursorToEnd(inputRef.current);
    }
  };

  const disableEditing = () => {
    if (!inputRef.current) {
      return;
    }

    inputRef.current.contentEditable = 'false';
  };

  const moveCursorToEnd = (contentEle: HTMLElement) => {
    if (typeof window === undefined) {
      console.error('window is not defined');
      return;
    }

    const range = document.createRange();
    const selection = window.getSelection();
    if (selection) {
      range.setStart(contentEle, contentEle.childNodes.length);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };

  return { inputRef, enableEditing, disableEditing };
};

export default useContentEditable;
