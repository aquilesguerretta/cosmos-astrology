import { getDict } from "@/lib/i18n";
import { LibraryClient } from "@/components/library/LibraryClient";

export const metadata = { title: "Library" };

export default async function LibraryPage() {
  const { dict } = await getDict();

  return (
    <div className="w-full max-w-[1100px] px-4 py-10 sm:px-6 md:px-10">
      <header className="mb-8">
        <p className="label-caps text-[var(--gold)]/80">{dict.library.label}</p>
        <h1 className="font-display mt-2 text-4xl md:text-5xl">
          {dict.library.title1}{" "}
          <em className="font-italic-display text-[var(--gold-light)]">{dict.library.title2}</em>
        </h1>
        <p className="mt-2 max-w-xl text-sm tracking-wide text-[var(--text-secondary-color)]">
          {dict.library.sub}
        </p>
      </header>
      <LibraryClient />
    </div>
  );
}
