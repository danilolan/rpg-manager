import { Toaster as Sonner } from "sonner"
import type { ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      position="bottom-right"
      expand
      style={{
        "--normal-bg": "var(--popover)",
        "--normal-text": "var(--popover-foreground)",
        "--normal-border": "var(--border)",
        "--font-size": "1rem",
        "--toast-spacing": "1rem",
        "--width": "400px",
        "--viewport-padding": "10.5rem",
      } as React.CSSProperties}
      {...props}
    />
  )
}

export { Toaster }