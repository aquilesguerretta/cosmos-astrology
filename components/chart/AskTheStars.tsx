"use client";

import { useState } from "react";
import { Sparkles, Send } from "lucide-react";
import { useI18n } from "@/components/i18n/I18nProvider";
import { AiProse } from "@/components/ui";

export function AskTheStars({ context }: { context: string }) {
  const { dict } = useI18n();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  async function ask(e: React.FormEvent) {
    e.preventDefault();
    const q = question.trim();
    if (!q || loading) return;
    setLoading(true);
    setAnswer("");
    try {
      const res = await fetch("/api/ai/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, context }),
      });
      if (!res.body) return;
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        setAnswer((t) => t + dec.decode(value, { stream: true }));
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mt-10">
      <div className="mb-4 flex items-center gap-3">
        <Sparkles size={14} className="text-[var(--gold)]" />
        <p className="label-caps">{dict.chart.askTitle}</p>
      </div>
      <form
        onSubmit={ask}
        className="flex items-center gap-3 border border-[var(--gold)]/15 bg-white/[0.025] px-5 py-4 transition focus-within:border-[var(--gold)]/50"
      >
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={dict.chart.askPlaceholder}
          className="flex-1 bg-transparent text-[15px] italic text-[var(--text-primary-color)] outline-none placeholder:text-[var(--text-muted-color)]"
          style={{ fontFamily: "var(--font-display)" }}
        />
        <button
          type="submit"
          disabled={loading}
          className="grid h-9 w-9 place-items-center bg-gradient-to-br from-[var(--gold-light)] to-[var(--gold-dark)] text-[#0A0A0F] transition hover:opacity-90 disabled:opacity-50"
          aria-label={dict.chart.askTitle}
        >
          <Send size={14} />
        </button>
      </form>
      {(answer || loading) && (
        <div className="mt-5 border-t border-[var(--border-subtle)] pt-5">
          <AiProse text={answer} loading={loading} />
        </div>
      )}
    </section>
  );
}
