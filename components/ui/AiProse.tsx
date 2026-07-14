"use client";

import { Fragment, useMemo } from "react";
import { cn } from "@/lib/utils";

interface AiProseProps {
  text: string;
  loading?: boolean;
  className?: string;
}

type Block = { type: "heading" | "paragraph"; text: string };

/** Hide a trailing unclosed ** while the stream is still open. */
function tailSafe(s: string): string {
  const markers = s.match(/\*\*/g)?.length ?? 0;
  if (markers % 2 !== 0) return s.replace(/\*\*([^*]*)$/, "$1");
  return s;
}

function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*\n]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-medium text-[var(--gold-light)]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

function parseBlocks(raw: string): Block[] {
  const safe = tailSafe(raw.trim());
  if (!safe) return [];

  const blocks: Block[] = [];
  for (const chunk of safe.split(/\n{2,}/)) {
    for (const line of chunk.split("\n").map((l) => l.trim()).filter(Boolean)) {
      const heading = line.match(/^#{1,4}\s+(.+)/);
      if (heading) {
        blocks.push({ type: "heading", text: heading[1].trim() });
      } else {
        blocks.push({
          type: "paragraph",
          text: line.replace(/^[-*•]\s+/, ""),
        });
      }
    }
  }
  return blocks;
}

/** Readable, high-contrast renderer for streamed AI copy (handles light markdown). */
export function AiProse({ text, loading, className }: AiProseProps) {
  const blocks = useMemo(() => parseBlocks(text), [text]);

  if (!text && !loading) return null;

  return (
    <div
      className={cn(
        "animate-fade-up space-y-3.5 text-[15px] leading-[1.85] text-[var(--text-primary-color)]",
        className,
      )}
      style={{ fontFamily: "var(--font-body)" }}
    >
      {blocks.map((b, i) =>
        b.type === "heading" ? (
          <p
            key={i}
            className="font-display text-[1.05rem] text-[var(--gold-light)] md:text-lg"
            style={{ fontWeight: 500 }}
          >
            {renderInline(b.text)}
          </p>
        ) : (
          <p key={i} className="text-[var(--text-primary-color)]/92">
            {renderInline(b.text)}
          </p>
        ),
      )}
      {loading && (
        <span className="ml-0.5 inline-block h-4 w-1.5 animate-pulse bg-[var(--gold)]/70 align-middle" />
      )}
    </div>
  );
}
