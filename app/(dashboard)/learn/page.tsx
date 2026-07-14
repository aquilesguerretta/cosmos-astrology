import { getDict } from "@/lib/i18n";
import { LearnClient } from "@/components/learn/LearnClient";

export const metadata = { title: "Academy" };

export default async function LearnPage() {
  const { dict } = await getDict();

  return (
    <div className="w-full max-w-[1100px] px-4 py-10 sm:px-6 md:px-10">
      <header className="mb-8">
        <p className="label-caps text-[var(--gold)]/80">{dict.learn.label}</p>
        <h1 className="font-display mt-2 text-4xl md:text-5xl">
          {dict.learn.title1}{" "}
          <em className="font-italic-display text-[var(--gold-light)]">{dict.learn.title2}</em>
        </h1>
        <p className="mt-2 max-w-xl text-sm tracking-wide text-[var(--text-secondary-color)]">
          {dict.learn.sub}
        </p>
      </header>
      <LearnClient />
    </div>
  );
}
