import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Adds the elevated glass shadow (figma GlassCard `glow`). */
  glow?: boolean;
}

/**
 * Glassmorphism card with gold corner ornaments — ported from figma GlassCard.
 */
export function Card({
  glow = false,
  className = "",
  children,
  ...props
}: CardProps) {
  return (
    <div className={cn("glass relative", glow && "glass-glow", className)} {...props}>
      {/* corner ornaments */}
      <span className="pointer-events-none absolute left-0 top-0 h-3 w-3 border-l border-t border-[var(--gold)]/40" />
      <span className="pointer-events-none absolute right-0 top-0 h-3 w-3 border-r border-t border-[var(--gold)]/40" />
      <span className="pointer-events-none absolute bottom-0 left-0 h-3 w-3 border-b border-l border-[var(--gold)]/40" />
      <span className="pointer-events-none absolute bottom-0 right-0 h-3 w-3 border-b border-r border-[var(--gold)]/40" />
      {children}
    </div>
  );
}
