export function Tag({ children }: { children: string }) {
  return (
    <li className="rounded-md border border-line/80 bg-surface/40 px-2.5 py-1 text-xs text-muted transition-all duration-200 hover:border-accent/50 hover:bg-accent/10 hover:text-accent hover:scale-105 cursor-default">
      {children}
    </li>
  )
}
