export default function Loading() {
  return (
    <div className="w-full max-w-[1280px] animate-pulse px-6 py-10 md:px-10">
      <div className="mb-4 h-3 w-40 bg-white/5" />
      <div className="mb-10 h-10 w-72 bg-white/5" />
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.3fr_1fr]">
        <div className="glass grid place-items-center p-6">
          <div className="aspect-square w-full max-w-[520px] rounded-full border border-[var(--gold)]/10 bg-white/[0.02]" />
        </div>
        <div className="space-y-6">
          <div className="glass h-72 p-6" />
          <div className="glass h-52 p-6" />
        </div>
      </div>
    </div>
  );
}
