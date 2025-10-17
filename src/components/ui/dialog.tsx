'use client'

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { X } from 'lucide-react'

import { cn } from '@/lib/utils'

interface DialogContextType {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const DialogContext = React.createContext<DialogContextType | null>(null)

const useDialog = () => {
  const context = React.useContext(DialogContext)
  if (!context) {
    throw new Error('useDialog must be used within a Dialog')
  }
  return context
}

const Dialog = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  return (
    <DialogContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </DialogContext.Provider>
  )
}
Dialog.displayName = 'Dialog'

const DialogTrigger = ({ children, asChild = false }: { children: React.ReactNode, asChild?: boolean }) => {
  const { setIsOpen } = useDialog()
  const handleClick = () => setIsOpen(true);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: () => {
        if (children.props.onClick) {
          children.props.onClick();
        }
        handleClick();
      },
    })
  }

  return (
    <button onClick={handleClick}>
      {children}
    </button>
  )
}
DialogTrigger.displayName = 'DialogTrigger'

const DialogPortal = ({ children }: { children: React.ReactNode }) => {
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
        return () => setMounted(false)
    }, [])

    return mounted
        ? ReactDOM.createPortal(children, document.body)
        : null
}
DialogPortal.displayName = 'DialogPortal'


const DialogClose = ({ children, asChild = false }: { children: React.ReactNode, asChild?: boolean }) => {
    const { setIsOpen } = useDialog();
    const handleClick = () => setIsOpen(false);

    if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children, {
             onClick: () => {
                if (children.props.onClick) {
                    children.props.onClick();
                }
                handleClick();
            },
        });
    }
    return (
        <button onClick={handleClick}>
            {children}
        </button>
    )
}
DialogClose.displayName = 'DialogClose'

const DialogOverlay = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-black/80 transition-opacity duration-300 ease-in-out',
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = 'DialogOverlay'

const DialogContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { isOpen, setIsOpen } = useDialog()

  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [setIsOpen])

  if (!isOpen) {
    return null
  }

  return (
    <DialogPortal>
      <DialogOverlay onClick={() => setIsOpen(false)} />
      <div
        ref={ref}
        className={cn(
          'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg sm:rounded-lg',
          'transition-all duration-300 ease-in-out',
          isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
          className
        )}
        role="dialog"
        aria-modal="true"
        {...props}
      >
        {children}
        <DialogClose asChild>
          <button className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </DialogClose>
      </div>
    </DialogPortal>
  )
})
DialogContent.displayName = 'DialogContent'

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)}
    {...props}
  />
)
DialogHeader.displayName = 'DialogHeader'

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)}
    {...props}
  />
)
DialogFooter.displayName = 'DialogFooter'

const DialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn('text-lg font-semibold leading-none tracking-tight', className)}
    {...props}
  />
))
DialogTitle.displayName = 'DialogTitle'

const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
))
DialogDescription.displayName = 'DialogDescription'

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogPortal,
  DialogClose,
}
