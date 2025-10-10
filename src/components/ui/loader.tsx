import { cn } from '@/lib/utils';

export function Loader({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-center space-x-2', className)}>
      <div className="h-3 w-3 animate-pulse-fast rounded-full bg-primary" />
      <div
        className="h-3 w-3 animate-pulse-fast rounded-full bg-primary"
        style={{ animationDelay: '0.2s' }}
      />
      <div
        className="h-3 w-3 animate-pulse-fast rounded-full bg-primary"
        style={{ animationDelay: '0.4s' }}
      />
    </div>
  );
}
