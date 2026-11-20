import type { ReactNode } from 'react'

// Marks content that has not been provided yet, so it cannot pass for real copy.
export function Pending({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-sm border border-dashed border-control px-4 py-3 text-sm text-muted">
      Pending: {children}
    </p>
  )
}
