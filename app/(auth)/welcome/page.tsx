import Link from "next/link";
import { LogIn, UserRoundPlus, Sparkles, ArrowRight } from "lucide-react";
import { getDict } from "@/lib/i18n";
import { Card } from "@/components/ui";
import { Enter } from "@/components/motion/Reveal";

export const metadata = { title: "Initiation" };

/** The Initiation — the threshold screen shown before any personal page.
 *  Three ways in: sign in, create an account, or begin as a guest. */
export default async function WelcomePage() {
  const { dict } = await getDict();
  const t = dict.auth;

  const PATHS = [
    { href: "/login", icon: LogIn, title: t.pathLoginT, desc: t.pathLoginD },
    { href: "/register", icon: UserRoundPlus, title: t.pathRegisterT, desc: t.pathRegisterD },
    { href: "/onboarding", icon: Sparkles, title: t.pathGuestT, desc: t.pathGuestD, primary: true },
  ];

  return (
    <div className="w-full max-w-xl">
      <Enter>
        <div className="text-center">
          <p className="label-caps text-[var(--gold)]/80">{t.welcomeLabel}</p>
          <h1 className="font-display mt-3 text-5xl leading-tight md:text-6xl">
            {t.welcomeTitle1}{" "}
            <em className="font-italic-display text-[var(--gold-light)]">{t.welcomeTitle2}</em>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-[var(--text-secondary-color)]">
            {t.welcomeSub}
          </p>
        </div>
      </Enter>

      <div className="mt-10 space-y-3">
        {PATHS.map((p, i) => {
          const Icon = p.icon;
          return (
            <Enter key={p.href} delay={0.15 + i * 0.12}>
              <Link href={p.href} className="block">
                <Card
                  glow={Boolean(p.primary)}
                  className="group flex items-center gap-5 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_48px_rgba(201,168,76,0.16)] sm:p-6"
                >
                  <span
                    className={`grid h-11 w-11 shrink-0 place-items-center border ${
                      p.primary
                        ? "border-[var(--gold)]/70 bg-[var(--gold)]/10 text-[var(--gold)]"
                        : "border-[var(--gold)]/30 text-[var(--gold)]/80"
                    }`}
                  >
                    <Icon size={17} strokeWidth={1.4} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="font-display block text-xl text-[var(--text-primary-color)]">{p.title}</span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-[var(--text-secondary-color)]">
                      {p.desc}
                    </span>
                  </span>
                  <ArrowRight
                    size={15}
                    className="shrink-0 text-[var(--gold)]/50 transition-transform group-hover:translate-x-1 group-hover:text-[var(--gold)]"
                  />
                </Card>
              </Link>
            </Enter>
          );
        })}
      </div>
    </div>
  );
}
