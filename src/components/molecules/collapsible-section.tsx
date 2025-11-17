"use client"

import * as React from "react"
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"
import { ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export interface CollapsibleSectionItem {
  name: string
  level: number
  description?: string
}

export interface CollapsibleSectionProps {
  title: string
  items: CollapsibleSectionItem[]
  defaultOpen?: boolean
  className?: string
}

export function CollapsibleSection({
  title,
  items,
  defaultOpen = false,
  className,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen)

  return (
    <CollapsiblePrimitive.Root
      open={isOpen}
      onOpenChange={setIsOpen}
      className={cn("", className)}
    >
      <CollapsiblePrimitive.Trigger
        className={cn(
          "flex w-full items-center justify-between rounded-lg bg-secondary/50 px-3 py-2 text-left font-bold uppercase tracking-wide text-muted-foreground transition-colors hover:bg-secondary/70",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        )}
      >
        <span className="text-xs">
          {title} ({items.length})
        </span>
        <ChevronDownIcon
          className={cn(
            "h-4 w-4 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </CollapsiblePrimitive.Trigger>

      <CollapsiblePrimitive.Content
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0"
        )}
      >
        <div className="mt-1 space-y-1 px-2 py-1">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-md bg-gray-900 px-2 py-1.5 text-xs border border-gray-800"
            >
              <span className="font-medium text-foreground">{item.name}</span>
              <span className="text-muted-foreground">Lv {item.level}</span>
            </div>
          ))}
        </div>
      </CollapsiblePrimitive.Content>
    </CollapsiblePrimitive.Root>
  )
}

