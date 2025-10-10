import { cn } from '@/lib/utils';

export function Loader({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'relative h-24 w-24 animate-[land-and-rotate_1.5s_ease-out_infinite]',
        className
      )}
      style={{ animationIterationCount: 'infinite' }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
      >
        <path
          d="M5 12H19L17 21H7L5 12Z"
          className="fill-primary/80"
          stroke="hsl(var(--primary))"
          strokeWidth="1"
        />
        <path
          d="M4 10H20V12H4V10Z"
          className="fill-primary"
          stroke="hsl(var(--primary))"
          strokeWidth="1"
        />
        <path
          d="M12 2C9.23858 2 7 4.23858 7 7V10H17V7C17 4.23858 14.7614 2 12 2Z"
          className="fill-green-500/80"
          stroke="hsl(var(--chart-2))"
          strokeWidth="1"
        />
        <path
          d="M12 6C13.6569 6 15 4.65685 15 3"
          stroke="hsl(var(--chart-2))"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
