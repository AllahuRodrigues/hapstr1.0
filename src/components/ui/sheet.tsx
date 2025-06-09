import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "./button"
import { X } from "lucide-react"

interface SheetContextType {
  open: boolean
  setOpen: (open: boolean) => void
}

const SheetContext = React.createContext<SheetContextType | null>(null)

interface SheetProps {
  children: React.ReactNode
  onOpenChange?: (open: boolean) => void
}

export function Sheet({ children, onOpenChange }: SheetProps) {
  const [open, setOpen] = React.useState(false)

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    onOpenChange?.(newOpen)
  }

  return (
    <SheetContext.Provider value={{ open, setOpen: handleOpenChange }}>
      {children}
    </SheetContext.Provider>
  )
}

export function SheetTrigger({ 
  children, 
  asChild 
}: { 
  children: React.ReactNode
  asChild?: boolean 
}) {
  const context = React.useContext(SheetContext)
  if (!context) throw new Error("SheetTrigger must be used within a Sheet")

  const handleClick = () => context.setOpen(true)

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...children.props,
      onClick: handleClick
    })
  }

  return (
    <button onClick={handleClick}>
      {children}
    </button>
  )
}

export function SheetContent({ 
  children, 
  className 
}: { 
  children: React.ReactNode
  className?: string 
}) {
  const context = React.useContext(SheetContext)
  if (!context) throw new Error("SheetContent must be used within a Sheet")

  if (!context.open) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50"
        onClick={() => context.setOpen(false)}
      />
      
      {/* Sheet */}
      <div className={cn(
        "fixed right-0 top-0 h-full bg-background border-l shadow-lg z-50 transition-transform",
        className
      )}>
        <div className="flex justify-between items-center p-4 border-b">
          <div />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => context.setOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </>
  )
}

export function SheetHeader({ children }: { children: React.ReactNode }) {
  return <div className="mb-4">{children}</div>
}

export function SheetTitle({ 
  children, 
  className 
}: { 
  children: React.ReactNode
  className?: string 
}) {
  return (
    <h2 className={cn("text-lg font-semibold", className)}>
      {children}
    </h2>
  )
} 