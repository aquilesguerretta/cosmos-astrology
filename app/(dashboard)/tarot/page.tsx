import { getDict } from "@/lib/i18n";
import { Explainer } from "@/components/ui";
import { TarotClient } from "@/components/tarot";

export const metadata = { title: "Tarot" };

export default async function TarotPage() {
  const { dict } = await getDict();

  return (
    <div className="w-full max-w-[1280px] px-4 py-10 sm:px-6 md:px-10">
      <header className="mb-8">
        <p className="label-caps text-[var(--gold)]/80">{dict.tarot.label}</p>
        <h1 className="font-display mt-2 text-4xl md:text-5xl">
          {dict.tarot.title1}{" "}
          <em className="font-italic-display text-[var(--gold-light)]">{dict.tarot.title2}</em>
        </h1>
        <p className="mt-2 max-w-xl text-sm tracking-wide text-[var(--text-secondary-color)]">
          {dict.tarot.sub}
        </p>
      </header>
      <Explainer title={dict.library.numberTheory} body={dict.tarot.methodNote} className="mb-8" />
      <TarotClient />
    </div>
  );
}
