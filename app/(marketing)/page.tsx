export default function Home() {
  return (
    <main className="min-h-screen grid place-items-center px-6">
      <div className="text-center max-w-md">
        <p className="label-caps text-[var(--gold)]/80">Vol. XIV · Equinox Edition</p>
        <h1 className="font-display text-7xl mt-4 gold-text leading-none">Cosmos</h1>
        <p className="mt-6 text-[var(--text-secondary-color)] text-sm tracking-wide">
          Scaffold ready. Landing page lands in Prompt 3.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3 text-[var(--gold)]/60 text-xs">
          <span className="h-px w-12 bg-[var(--gold)]/30" />
          ✦
          <span className="h-px w-12 bg-[var(--gold)]/30" />
        </div>
      </div>
    </main>
  );
}
