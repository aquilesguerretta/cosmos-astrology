"use client";

export default function DashboardError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="grid min-h-[60vh] w-full place-items-center px-6">
      <div className="max-w-md text-center">
        <p className="label-caps text-[var(--gold)]/80">A clouded sky</p>
        <h2 className="font-display mt-2 text-3xl">Something obscured the stars</h2>
        <p className="mt-3 text-sm text-[var(--text-secondary-color)]">
          {error.message || "An unexpected error occurred while reading the heavens."}
        </p>
        <button
          onClick={reset}
          className="btn-gold mt-7 inline-flex items-center gap-2 px-7 py-3 font-sans text-[0.8rem] uppercase tracking-[0.08em]"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
