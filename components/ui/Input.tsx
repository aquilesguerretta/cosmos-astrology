"use client";

import { cn } from "@/lib/utils";

interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  onChange?: (value: string) => void;
}

/**
 * Dark field with gold focus ring — ported from figma DarkInput, plus error state.
 */
export function Input({
  label,
  error,
  icon,
  type = "text",
  className = "",
  value,
  onChange,
  placeholder,
  ...props
}: InputProps) {
  return (
    <label className="block">
      {label && <span className="label-caps mb-2 block">{label}</span>}
      <div
        className={cn(
          "group relative flex items-center gap-3 bg-white/[0.025] px-4 py-3 transition-all duration-300 focus-within:bg-white/[0.04] focus-within:shadow-[0_0_24px_rgba(201,168,76,0.15)]",
          error
            ? "border border-[var(--error)]/60 focus-within:border-[var(--error)]"
            : "border border-[var(--gold)]/15 focus-within:border-[var(--gold)]/50",
          className,
        )}
      >
        {icon && <span className="text-[var(--gold)]/70">{icon}</span>}
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange?.(e.target.value)}
          className="flex-1 bg-transparent text-sm tracking-wide text-[var(--text-primary-color)] outline-none placeholder:text-[var(--text-muted-color)]"
          {...props}
        />
      </div>
      {error && (
        <span className="mt-1.5 block text-[11px] tracking-wide text-[var(--error)]">
          {error}
        </span>
      )}
    </label>
  );
}
