import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const statBoxVariants = cva(
  "flex flex-col items-center justify-center rounded-lg border",
  {
    variants: {
      size: {
        default: "bg-secondary/50 border-border p-0.5 min-w-[36px]",
        big: "p-1 min-w-[44px] rounded-xl",
      },
      variant: {
        default: "bg-secondary/50 border-border",
        primary: "bg-blue-950/30 border-blue-800",
        muted: "bg-secondary/50 border-border",
        red: "bg-red-950/30 border-red-800",
        blue: "bg-blue-950/30 border-blue-800",
        green: "bg-green-950/30 border-green-800",
        yellow: "bg-yellow-950/30 border-yellow-800",
        orange: "bg-orange-950/30 border-orange-800",
        purple: "bg-purple-950/30 border-purple-800",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  }
)

const valueVariants = cva(
  "font-bold",
  {
    variants: {
      size: {
        default: "text-base",
        big: "text-lg",
      },
      variant: {
        default: "text-destructive",
        primary: "text-blue-400",
        muted: "text-muted-foreground",
        red: "text-red-400",
        blue: "text-blue-400",
        green: "text-green-400",
        yellow: "text-yellow-400",
        orange: "text-orange-400",
        purple: "text-purple-400",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  }
)

const labelVariants = cva(
  "text-muted-foreground uppercase tracking-wide font-bold",
  {
    variants: {
      size: {
        default: "text-[9px]",
        big: "text-[10px]",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

export interface StatBoxProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statBoxVariants> {
  label: string
  value: string | number
}

const StatBox = React.forwardRef<HTMLDivElement, StatBoxProps>(
  ({ className, label, value, variant, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(statBoxVariants({ variant, size, className }))}
        {...props}
      >
        <span className={cn(labelVariants({ size }))}>
          {label}
        </span>
        <span className={cn(valueVariants({ variant, size }))}>
          {value}
        </span>
      </div>
    )
  }
)
StatBox.displayName = "StatBox"

export { StatBox, statBoxVariants }

