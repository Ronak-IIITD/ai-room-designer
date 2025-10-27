import { useEffect } from 'react';

interface ShortcutHandlers {
  onUpload?: () => void;
  onGenerate?: () => void;
  onDownload?: () => void;
  onHistory?: () => void;
  onToggleShortcuts?: () => void;
  onEscape?: () => void;
  onToggleTheme?: () => void;
}

export const useKeyboardShortcuts = (handlers: ShortcutHandlers) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        // Allow Escape even in input fields
        if (e.key === 'Escape' && handlers.onEscape) {
          handlers.onEscape();
        }
        return;
      }

      // Ctrl/Cmd shortcuts
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'u':
            e.preventDefault();
            handlers.onUpload?.();
            break;
          case 'enter':
            e.preventDefault();
            handlers.onGenerate?.();
            break;
          case 'd':
            e.preventDefault();
            handlers.onDownload?.();
            break;
          case 'h':
            e.preventDefault();
            handlers.onHistory?.();
            break;
          case 'k':
            e.preventDefault();
            handlers.onToggleShortcuts?.();
            break;
        }
      }
      // Single key shortcuts
      else {
        switch (e.key.toLowerCase()) {
          case 't':
            handlers.onToggleTheme?.();
            break;
          case 'escape':
            handlers.onEscape?.();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlers]);
};
