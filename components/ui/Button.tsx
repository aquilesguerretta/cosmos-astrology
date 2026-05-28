"use client";

import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "ghost" | "icon";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
}

const SIZES: Record<ButtonVariant, Record<ButtonSize, string>> = {
  primary: {
    sm: "px-5 py-2.5 text-[0.7rem]",
    md: "px-7 py-3.5 text-[0.8rem]",
    lg: "px-9 py-4 text-[0.85rem]",
  },
  ghost: {
    sm: "px-5 py-2.5 text-[0.7rem]",
    md: "px-6 py-3 text-[0.8rem]",
    lg: "px-8 py-3.5 text-[0.85rem]",
  },
  icon: {
    sm: "h-9 w-9",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  },
};

function Spinner({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-block h-3.5 w-3.5 animate-spin rounded-full border border-current border-r-transparent",
        className,
      )}
    />
  );
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  className = "",
  children,
  disabled,
  type = "button",
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  if (variant === "ghost") {
    return (
      <button
        type={type}
        disabled={isDisabled}
        className={cn(
          "group relative inline-flex items-center justify-center gap-2 border border-[var(--gold)]/40 font-sans uppercase tracking-[0.06em] text-[var(--gold-light)] transition-all duration-300 hover:bg-[var(--gold)]/10 disabled:cursor-not-allowed disabled:opacity-50",
          SIZES.ghost[size],
          className,
        )}
        {...props}
      >
        {loading ? <Spinner /> : children}
      </button>
    );
  }

  if (variant === "icon") {
    return (
      <button
        type={type}
        disabled={isDisabled}
        className={cn(
          "glass grid place-items-center text-[var(--text-secondary-color)] transition hover:border-[var(--gold)]/40 disabled:cursor-not-allowed disabled:opacity-50",
          SIZES.icon[size],
          className,
        )}
        {...props}
      >
        {loading ? <Spinner /> : children}
      </button>
    );
  }

  // primary — gold gradient with shimmer-on-hover (figma GoldButton)
  return (
    <button
      type={type}
      disabled={isDisabled}
      className={cn(
        "btn-gold group relative inline-flex items-center justify-center gap-2 overflow-hidden font-sans uppercase tracking-[0.08em] transition-all duration-500 disabled:cursor-not-allowed disabled:opacity-60",
        SIZES.primary[size],
        className,
      )}
      {...props}
    >
      <span className="btn-shimmer absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <span className="relative flex items-center gap-2">
        {loading && <Spinner className="text-[#0A0A0F]" />}
        {children}
      </span>
    </button>
  );
}
