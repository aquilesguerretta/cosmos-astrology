import { cn } from "@/lib/utils";

type BadgeVariant = "sign" | "planet" | "aspect";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  label: string;
  variant?: BadgeVariant;
  /** Optional color override (e.g. per-aspect color); applies to text + border. */
  color?: string;
}

const VARIANTS: Record<BadgeVariant, string> = {
  sign: "border border-[var(--gold)]/20 px-2.5 py-1 text-[11px] tracking-wider text-[var(--gold-light)]",
  planet:
    "border border-[var(--gold)]/20 px-2.5 py-1 text-[11px] tracking-wider text-[var(--text-secondary-color)]",
  aspect:
    "border border-[var(--gold)]/30 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-[var(--gold)]",
};

export function Badge({
  label,
  variant = "sign",
  color,
  className = "",
  style,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn("inline-flex items-center", VARIANTS[variant], className)}
      style={color ? { color, borderColor: `${color}55`, ...style } : style}
      {...props}
    >
      {label}
    </span>
  );
}
