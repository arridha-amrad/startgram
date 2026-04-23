import * as React from "react"

export function Empty({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col items-center justify-center p-8 text-center">{children}</div>
}

export function EmptyHeader({ children }: { children: React.ReactNode }) {
  return <div className="space-y-4">{children}</div>
}

export function EmptyMedia({ children, variant }: { children: React.ReactNode, variant?: string }) {
  return <div className="flex justify-center">{children}</div>
}

export function EmptyTitle({ children, className }: { children: React.ReactNode, className?: string }) {
  return <h3 className={className}>{children}</h3>
}

export function EmptyDescription({ children }: { children: React.ReactNode }) {
  return <p className="text-muted-foreground">{children}</p>
}
