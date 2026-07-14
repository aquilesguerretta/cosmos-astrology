"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, GraduationCap } from "lucide-react";
import { Card, Button } from "@/components/ui";
import { useI18n } from "@/components/i18n/I18nProvider";
import { COURSE, TOTAL_LESSONS, type Lesson, type Module } from "@/lib/learn/course";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "cosmos-learn-progress";

function loadProgress(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-[3px] w-full overflow-hidden bg-white/5">
      <div
        className="h-full bg-gradient-to-r from-[var(--gold-light)] to-[var(--gold-dark)] transition-all duration-500"
        style={{ width: `${Math.round(value * 100)}%` }}
      />
    </div>
  );
}

function LessonView({
  mod,
  lesson,
  done,
  onComplete,
  onBack,
  onNext,
  hasNext,
}: {
  mod: Module;
  lesson: Lesson;
  done: boolean;
  onComplete: () => void;
  onBack: () => void;
  onNext: () => void;
  hasNext: boolean;
}) {
  const { locale, dict } = useI18n();
  const t = dict.learn;
  const [choice, setChoice] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setChoice(null);
    setChecked(false);
  }, [lesson.id]);

  const correct = checked && choice === lesson.quiz.answer;

  return (
    <div className="animate-fade-up">
      <button onClick={onBack} className="label-caps flex items-center gap-2 text-xs text-[var(--text-muted-color)] transition hover:text-[var(--gold-light)]">
        <ArrowLeft size={12} /> {t.backToModules}
      </button>

      <p className="label-caps mt-6 text-[var(--gold)]/80">{mod.title[locale]}</p>
      <h2 className="font-display mt-2 text-3xl md:text-4xl">{lesson.title[locale]}</h2>

      <div className="mt-8 max-w-2xl space-y-6">
        {lesson.paragraphs.map((p, i) => (
          <p key={i} className="leading-[1.85] text-[var(--text-secondary-color)]" style={{ fontFamily: "var(--font-display)", fontWeight: 300, fontSize: "18px" }}>
            {p[locale]}
          </p>
        ))}
      </div>

      <Card className="mt-10 max-w-2xl p-6">
        <p className="label-caps mb-4">{t.keyTakeaways}</p>
        <ul className="space-y-2.5">
          {lesson.takeaways.map((k, i) => (
            <li key={i} className="flex gap-3 text-sm text-[var(--text-primary-color)]">
              <span className="mt-0.5 text-[var(--gold)]">✦</span>
              {k[locale]}
            </li>
          ))}
        </ul>
      </Card>

      <Card glow className="mt-6 max-w-2xl p-6">
        <p className="label-caps mb-4">{t.quiz}</p>
        <p className="font-display text-lg text-[var(--text-primary-color)]">{lesson.quiz.question[locale]}</p>
        <div className="mt-4 space-y-2">
          {lesson.quiz.options.map((opt, i) => {
            const isAnswer = i === lesson.quiz.answer;
            const isChosen = choice === i;
            return (
              <button
                key={i}
                onClick={() => {
                  if (!checked) setChoice(i);
                }}
                className={cn(
                  "block w-full border px-4 py-2.5 text-left text-sm transition",
                  checked && isAnswer && "border-[var(--success)]/70 bg-[var(--success)]/10 text-[var(--text-primary-color)]",
                  checked && isChosen && !isAnswer && "border-[var(--error)]/70 bg-[var(--error)]/10 text-[var(--text-primary-color)]",
                  !checked && isChosen && "border-[var(--gold)] bg-[var(--gold)]/5 text-[var(--text-primary-color)]",
                  !checked && !isChosen && "border-[var(--gold)]/15 text-[var(--text-secondary-color)] hover:border-[var(--gold)]/40",
                  checked && !isChosen && !isAnswer && "border-[var(--gold)]/10 text-[var(--text-muted-color)]",
                )}
              >
                {opt[locale]}
              </button>
            );
          })}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          {!checked ? (
            <Button
              size="sm"
              disabled={choice === null}
              onClick={() => {
                setChecked(true);
                if (choice === lesson.quiz.answer) onComplete();
              }}
            >
              {t.checkAnswer}
            </Button>
          ) : (
            <p className={cn("text-sm", correct ? "text-[var(--success)]" : "text-[var(--warning)]")}>
              {correct ? t.correct : t.incorrect}
            </p>
          )}
          {checked && !correct && (
            <Button size="sm" variant="ghost" onClick={() => { setChecked(false); setChoice(null); }}>
              {dict.common.tryAgain}
            </Button>
          )}
          {!done && (
            <button onClick={onComplete} className="label-caps text-xs text-[var(--text-muted-color)] transition hover:text-[var(--gold-light)]">
              {t.markComplete}
            </button>
          )}
          {done && (
            <span className="flex items-center gap-1.5 text-xs text-[var(--success)]">
              <Check size={13} /> {t.completed}
            </span>
          )}
        </div>
      </Card>

      {hasNext && (
        <div className="mt-8 max-w-2xl">
          <Button variant="ghost" onClick={onNext}>
            {t.nextLesson} <ArrowRight size={13} />
          </Button>
        </div>
      )}
    </div>
  );
}

export function LearnClient() {
  const { locale, dict } = useI18n();
  const t = dict.learn;
  const [done, setDone] = useState<Set<string>>(new Set());
  const [openLesson, setOpenLesson] = useState<{ m: number; l: number } | null>(null);

  useEffect(() => {
    setDone(loadProgress());
  }, []);

  const complete = (id: string) => {
    setDone((cur) => {
      const next = new Set(cur);
      next.add(id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      } catch {
        /* private mode */
      }
      return next;
    });
  };

  const flat = useMemo(
    () => COURSE.flatMap((m, mi) => m.lessons.map((l, li) => ({ m: mi, l: li }))),
    [],
  );

  if (openLesson) {
    const mod = COURSE[openLesson.m];
    const lesson = mod.lessons[openLesson.l];
    const flatIdx = flat.findIndex((f) => f.m === openLesson.m && f.l === openLesson.l);
    const next = flat[flatIdx + 1];
    return (
      <LessonView
        mod={mod}
        lesson={lesson}
        done={done.has(lesson.id)}
        onComplete={() => complete(lesson.id)}
        onBack={() => setOpenLesson(null)}
        onNext={() => next && setOpenLesson(next)}
        hasNext={Boolean(next)}
      />
    );
  }

  const totalDone = [...done].filter((id) => flat.some((f) => COURSE[f.m].lessons[f.l].id === id)).length;

  return (
    <>
      <div className="mb-8 max-w-md">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="label-caps">{t.progress}</span>
          <span className="text-[var(--gold-light)]">{totalDone} / {TOTAL_LESSONS}</span>
        </div>
        <ProgressBar value={TOTAL_LESSONS ? totalDone / TOTAL_LESSONS : 0} />
      </div>

      <div className="space-y-4">
        {COURSE.map((m, mi) => {
          const doneCount = m.lessons.filter((l) => done.has(l.id)).length;
          return (
            <Card key={m.id} className="p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="font-display grid h-9 w-9 shrink-0 place-items-center border border-[var(--gold)]/30 text-base text-[var(--gold-light)]">
                      {mi + 1}
                    </span>
                    <div>
                      <p className="font-display text-xl text-[var(--text-primary-color)]">{m.title[locale]}</p>
                      <p className="mt-0.5 text-xs text-[var(--text-secondary-color)]">{m.blurb[locale]}</p>
                    </div>
                  </div>
                </div>
                <span className="label-caps text-[10px] text-[var(--text-muted-color)]">
                  {doneCount}/{m.lessons.length} · {m.lessons.length} {t.lessons}
                </span>
              </div>

              <div className="mt-5 space-y-2">
                {m.lessons.map((l, li) => {
                  const isDone = done.has(l.id);
                  return (
                    <button
                      key={l.id}
                      onClick={() => setOpenLesson({ m: mi, l: li })}
                      className="group flex w-full items-center gap-3 border border-[var(--gold)]/10 px-4 py-3 text-left transition hover:border-[var(--gold)]/35 hover:bg-white/[0.02]"
                    >
                      <span
                        className={cn(
                          "grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[10px]",
                          isDone ? "border-[var(--success)]/70 text-[var(--success)]" : "border-[var(--gold)]/30 text-transparent",
                        )}
                      >
                        <Check size={11} />
                      </span>
                      <span className="min-w-0 flex-1 truncate text-sm text-[var(--text-primary-color)]">{l.title[locale]}</span>
                      <span className="label-caps flex shrink-0 items-center gap-1.5 text-[10px] text-[var(--gold-light)] opacity-0 transition group-hover:opacity-100">
                        {isDone ? t.continue : t.start} <GraduationCap size={11} />
                      </span>
                    </button>
                  );
                })}
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}
