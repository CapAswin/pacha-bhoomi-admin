
'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface SelectContextValue {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedValue: string | null;
  setSelectedValue: (value: string, label: string) => void;
  selectedLabel: string | null;
}

const SelectContext = React.createContext<SelectContextValue | null>(null);

const useSelect = () => {
  const context = React.useContext(SelectContext);
  if (!context) {
    throw new Error('useSelect must be used within a Select provider');
  }
  return context;
};

const Select = ({ children, onValueChange, defaultValue }: { children: React.ReactNode, onValueChange?: (value: string) => void, defaultValue?: string }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedValue, _setSelectedValue] = React.useState<string | null>(defaultValue || null);
  const [selectedLabel, setSelectedLabel] = React.useState<string | null>('Select an option');
  const selectRef = React.useRef<HTMLDivElement>(null);

  const setSelectedValue = (value: string, label: string) => {
    _setSelectedValue(value);
    setSelectedLabel(label);
    onValueChange?.(value);
    setIsOpen(false);
  };

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <SelectContext.Provider value={{ isOpen, setIsOpen, selectedValue, setSelectedValue, selectedLabel }}>
      <div ref={selectRef} className="relative">
        {children}
      </div>
    </SelectContext.Provider>
  );
};

const SelectTrigger = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<'button'>>(({ className, children, ...props }, ref) => {
  const { setIsOpen } = useSelect();
  return (
    <button
      ref={ref}
      onClick={() => setIsOpen(prev => !prev)}
      className={cn('flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', className)}
      {...props}
    >
      {children}
    </button>
  );
});
SelectTrigger.displayName = 'SelectTrigger';

const SelectValue = ({ placeholder }: { placeholder?: string }) => {
  const { selectedLabel, selectedValue } = useSelect();
  return <>{selectedValue ? selectedLabel : placeholder}</>;
};

const SelectContent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>(({ className, children, ...props }, ref) => {
  const { isOpen } = useSelect();
  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      className={cn('absolute z-50 w-full mt-1 bg-popover text-popover-foreground shadow-md rounded-md border', className)}
      {...props}
    >
      {children}
    </div>
  );
});
SelectContent.displayName = 'SelectContent';

const SelectItem = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<'div'> & { value: string, children: React.ReactNode }>(({ className, value, children, ...props }, ref) => {
  const { setSelectedValue } = useSelect();
  return (
    <div
      ref={ref}
      onClick={() => setSelectedValue(value, children as string)}
      className={cn('px-3 py-2 text-sm cursor-pointer hover:bg-accent', className)}
      {...props}
    >
      {children}
    </div>
  );
});
SelectItem.displayName = 'SelectItem';

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };
