import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Clock, DoorOpen, MapPin, MessageCircle } from "lucide-react";
import { Wordmark } from "./Wordmark";
import type { ContextType } from "@/lib/pulse-data";

const SESSIONS = [
  "AI Design Systems at Scale — Metalabs Masterclass",
  "The Future of Developer Tools — Panel",
  "Pricing AI Products — Workshop",
  "Founder Therapy — Fireside",
  "From Seed to Series A — Keynote",
  "Building in Public — Panel",
] as const;

const SITUATION_CHIPS = [
  "Heading to lunch",
  "Wandering the expo",
  "In the founders' lounge",
  "Free for an hour",
  "Just want company",
] as const;

const WINDOWS = [
  { value: 15, label: "15 min", sub: "Quick chat" },
  { value: 30, label: "30 min", sub: "A coffee" },
  { value: 45, label: "45 min", sub: "A real conversation" },
  { value: 60, label: "60 min", sub: "A walk around the floor" },
  { value: 480, label: "End of day", sub: "No rush" },
] as const;

const QUEST_EXAMPLES = [
  "Argue with someone who disagrees with what I just heard.",
  "Find someone two steps ahead of me to ask dumb questions.",
  "Trade real numbers, not theory.",
  "Just want coffee with a stranger working on something interesting.",
] as const;

type Mode = "session" | "topic" | "situation";

export interface ComposerSubmit {
  quest: string;
  windowMin: number;
  contextType: ContextType;
  justAttended: string | null;
  currentSituation: string | null;
  topic: string | null;
}

interface Props {
  onSubmit: (payload: ComposerSubmit) => void;
}

const EASE = [0.22, 1, 0.36, 1] as const;

// ────────────────────────────────────────────────────────────────────────────
// Shell: progress bar + wordmark + step counter, shared by all 4 screens.
// ────────────────────────────────────────────────────────────────────────────

function StepShell({
  step,
  children,
}: {
  step: 1 | 2 | 3 | 4;
  children: React.ReactNode;
}) {
  const pct = step * 25;
  return (
    <div className="relative flex min-h-screen w-full flex-col">
      {/* Progress bar */}
      <div className="fixed inset-x-0 top-0 z-30 h-[2px] w-full bg-white/[0.08]">
        <motion.div
          className="h-full bg-[var(--coral)]"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          style={{ boxShadow: "0 0 12px var(--coral)" }}
        />
      </div>

      {/* Top header */}
      <header className="mx-auto flex w-full max-w-3xl items-center justify-between px-6 pt-7">
        <Wordmark />
        <span className="text-[10px] uppercase tracking-[0.22em] text-[color:var(--ink-dim)]">
          Step {step} of 4
        </span>
      </header>

      {children}
    </div>
  );
}

// Slide+fade transition wrapper. Direction: 1 = forward, -1 = back.
function Slide({
  k,
  direction,
  children,
}: {
  k: string;
  direction: 1 | -1;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      key={k}
      initial={{ opacity: 0, x: 20 * direction }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 * direction }}
      transition={{ duration: 0.4, ease: EASE }}
      className="absolute inset-0"
    >
      {children}
    </motion.div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Reusable selectable card
// ────────────────────────────────────────────────────────────────────────────

function SelectCard({
  selected,
  onClick,
  children,
  className = "",
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2, ease: EASE }}
      className={
        "glass relative w-full overflow-hidden rounded-2xl p-6 text-left transition-shadow duration-200 " +
        (selected
          ? "shadow-[0_0_0_1.5px_var(--coral)_inset,0_10px_40px_-12px_var(--coral)]"
          : "hover:shadow-[0_0_0_1px_oklch(1_0_0_/_20%)_inset]") +
        " " +
        className
      }
    >
      {selected && (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2, ease: EASE }}
          className="absolute right-3 top-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--coral)] text-white"
        >
          <Check size={14} strokeWidth={3} />
        </motion.span>
      )}
      {children}
    </motion.button>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Bottom CTA row (Back link + Next button)
// ────────────────────────────────────────────────────────────────────────────

function CtaRow({
  onBack,
  onNext,
  nextLabel = "Next",
  nextDisabled,
  loading,
  emphasize,
}: {
  onBack?: () => void;
  onNext: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  loading?: boolean;
  emphasize?: boolean;
}) {
  return (
    <div className="mx-auto flex w-full max-w-[480px] flex-col items-center gap-5">
      <button
        onClick={onNext}
        disabled={nextDisabled || loading}
        className={
          "group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-[var(--coral)] font-semibold text-white transition-all duration-300 disabled:opacity-30 disabled:shadow-none " +
          (emphasize
            ? "h-[60px] text-[16px] shadow-[0_14px_60px_-10px_var(--coral)] hover:shadow-[0_18px_80px_-10px_var(--coral)]"
            : "h-[52px] text-[15px] shadow-[0_10px_40px_-12px_var(--coral)] hover:shadow-[0_14px_60px_-12px_var(--coral)]")
        }
      >
        <span
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(120% 120% at 50% 0%, oklch(1 0 0 / 25%), transparent 60%)",
          }}
        />
        {loading ? (
          <motion.span
            className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
          />
        ) : (
          <>
            <span className="relative">{nextLabel}</span>
            <ArrowRight size={16} className="relative" />
          </>
        )}
      </button>
      {onBack && (
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-[12px] text-[color:var(--ink-dim)] transition-colors hover:text-ink"
        >
          <ArrowLeft size={12} />
          Back
        </button>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Main component
// ────────────────────────────────────────────────────────────────────────────

export function QuestComposer({ onSubmit }: Props) {
  // Demo: pre-filled state per spec.
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [direction, setDirection] = useState<1 | -1>(1);

  const [mode, setMode] = useState<Mode | null>("session");
  const [sessionPick, setSessionPick] = useState<string>(SESSIONS[0]);
  const [topicValue, setTopicValue] = useState("");
  const [situationValue, setSituationValue] = useState("");

  const [windowMin, setWindowMin] = useState<number>(30);
  const [goal, setGoal] = useState(
    "Grabbing coffee at the espresso bar by Hall C in 10 min. Want to keep chewing on what Pip said about AI in the design process. Room for two.",
  );

  const [loading, setLoading] = useState(false);

  const goNext = () => {
    setDirection(1);
    setStep((s) => (s < 4 ? ((s + 1) as 1 | 2 | 3 | 4) : s));
  };
  const goBack = (target?: 1 | 2 | 3 | 4) => {
    setDirection(-1);
    setStep((s) => target ?? ((Math.max(1, s - 1)) as 1 | 2 | 3 | 4));
  };

  const step1Valid = useMemo(() => {
    if (!mode) return false;
    if (mode === "session") return !!sessionPick;
    if (mode === "topic") return topicValue.trim().length > 0;
    if (mode === "situation") return situationValue.trim().length > 0;
    return false;
  }, [mode, sessionPick, topicValue, situationValue]);

  const submit = () => {
    if (loading) return;
    setLoading(true);

    const contextType: ContextType =
      mode === "session" ? "session" : mode === "situation" ? "situation" : "topic";
    const payload: ComposerSubmit = {
      quest: goal.trim(),
      windowMin,
      contextType,
      justAttended: mode === "session" ? sessionPick : null,
      currentSituation: mode === "situation" ? situationValue.trim() : null,
      topic: mode === "topic" ? topicValue.trim() : null,
    };
    setTimeout(() => onSubmit(payload), 500);
  };

  return (
    <StepShell step={step}>
      {/* Background warm radial */}
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 35%, oklch(0.68 0.22 18 / 8%), transparent 70%)",
        }}
      />

      <div className="relative mx-auto flex w-full max-w-3xl flex-1 px-6">
        <AnimatePresence initial={false} mode="popLayout" custom={direction}>
          {step === 1 && (
            <Slide k="s1" direction={direction}>
              <Step1
                mode={mode}
                setMode={setMode}
                sessionPick={sessionPick}
                setSessionPick={setSessionPick}
                topicValue={topicValue}
                setTopicValue={setTopicValue}
                situationValue={situationValue}
                setSituationValue={setSituationValue}
                onNext={goNext}
                canNext={step1Valid}
              />
            </Slide>
          )}

          {step === 2 && (
            <Slide k="s2" direction={direction}>
              <Step2
                windowMin={windowMin}
                setWindowMin={setWindowMin}
                onBack={() => goBack(1)}
                onNext={goNext}
              />
            </Slide>
          )}

          {step === 3 && (
            <Slide k="s3" direction={direction}>
              <Step3
                goal={goal}
                setGoal={setGoal}
                onBack={() => goBack(2)}
                onNext={goNext}
                canNext={goal.trim().length > 0}
              />
            </Slide>
          )}

          {step === 4 && (
            <Slide k="s4" direction={direction}>
              <Step4
                mode={mode}
                sessionPick={sessionPick}
                topicValue={topicValue}
                situationValue={situationValue}
                windowMin={windowMin}
                goal={goal}
                onBack={() => goBack(3)}
                onEdit={(target) => goBack(target)}
                onSubmit={submit}
                loading={loading}
              />
            </Slide>
          )}
        </AnimatePresence>
      </div>
    </StepShell>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Step 1 — mode picker
// ────────────────────────────────────────────────────────────────────────────

function Step1({
  mode,
  setMode,
  sessionPick,
  setSessionPick,
  topicValue,
  setTopicValue,
  situationValue,
  setSituationValue,
  onNext,
  canNext,
}: {
  mode: Mode | null;
  setMode: (m: Mode) => void;
  sessionPick: string;
  setSessionPick: (s: string) => void;
  topicValue: string;
  setTopicValue: (s: string) => void;
  situationValue: string;
  setSituationValue: (s: string) => void;
  onNext: () => void;
  canNext: boolean;
}) {
  const cards: { id: Mode; title: string; sub: string; Icon: typeof DoorOpen }[] = [
    {
      id: "session",
      title: "Just attended a session",
      sub: "For the moments right after a talk that hit different.",
      Icon: DoorOpen,
    },
    {
      id: "topic",
      title: "Want to talk about a topic",
      sub: "For when you have a specific idea on your mind.",
      Icon: MessageCircle,
    },
    {
      id: "situation",
      title: "Just in a moment",
      sub: "For lunch, free time, or the in-between hours.",
      Icon: MapPin,
    },
  ];

  return (
    <section className="flex min-h-[calc(100vh-80px)] flex-col justify-center pb-16 pt-10">
      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="text-balance text-center text-3xl font-semibold tracking-tightest text-ink sm:text-[44px] sm:leading-[1.05]"
      >
        Where's your <span className="text-[var(--coral)]">head</span> right now?
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.5, ease: EASE }}
        className="mx-auto mt-4 max-w-md text-center text-[14px] text-[color:var(--ink-dim)]"
      >
        Pick the kind of moment you're in.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.16, duration: 0.5, ease: EASE }}
        className="mx-auto mt-12 grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3"
      >
        {cards.map(({ id, title, sub, Icon }) => (
          <SelectCard
            key={id}
            selected={mode === id}
            onClick={() => setMode(id)}
            className="min-h-[180px]"
          >
            <Icon size={22} className="text-[var(--coral)]" />
            <div className="mt-5 text-[18px] font-semibold leading-snug text-ink">
              {title}
            </div>
            <div className="mt-2 text-[13px] leading-snug text-[color:var(--ink-dim)]">
              {sub}
            </div>
          </SelectCard>
        ))}
      </motion.div>

      <AnimatePresence mode="wait">
        {mode === "session" && (
          <motion.div
            key="sub-session"
            initial={{ opacity: 0, y: 12, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="mx-auto mt-6 w-full max-w-3xl overflow-hidden"
          >
            <select
              value={sessionPick}
              onChange={(e) => setSessionPick(e.target.value)}
              className="glass w-full rounded-2xl bg-transparent px-5 py-4 text-[15px] text-ink focus:outline-none"
            >
              <option value="" className="bg-[oklch(0.13_0.018_280)]">
                Pick the session you just left…
              </option>
              {SESSIONS.map((s) => (
                <option key={s} value={s} className="bg-[oklch(0.13_0.018_280)]">
                  {s}
                </option>
              ))}
            </select>
          </motion.div>
        )}

        {mode === "topic" && (
          <motion.div
            key="sub-topic"
            initial={{ opacity: 0, y: 12, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="mx-auto mt-6 w-full max-w-3xl overflow-hidden"
          >
            <input
              value={topicValue}
              onChange={(e) => setTopicValue(e.target.value)}
              placeholder="What do you want to talk about?"
              className="glass w-full rounded-2xl bg-transparent px-5 py-4 text-[15px] text-ink placeholder:text-[color:var(--ink-dim)] focus:outline-none"
            />
          </motion.div>
        )}

        {mode === "situation" && (
          <motion.div
            key="sub-situation"
            initial={{ opacity: 0, y: 12, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="mx-auto mt-6 w-full max-w-3xl overflow-hidden"
          >
            <div className="flex flex-wrap justify-center gap-2">
              {SITUATION_CHIPS.map((c) => (
                <button
                  key={c}
                  onClick={() => setSituationValue(c)}
                  className={
                    "glass rounded-full px-4 py-2 text-[13px] transition-colors " +
                    (situationValue === c
                      ? "text-ink shadow-[0_0_0_1px_var(--coral)_inset]"
                      : "text-[color:var(--ink-dim)] hover:text-ink")
                  }
                >
                  {c}
                </button>
              ))}
            </div>
            <input
              value={
                SITUATION_CHIPS.includes(
                  situationValue as (typeof SITUATION_CHIPS)[number],
                )
                  ? ""
                  : situationValue
              }
              onChange={(e) => setSituationValue(e.target.value)}
              placeholder="Something else…"
              className="glass mt-3 w-full rounded-2xl bg-transparent px-5 py-3 text-[14px] text-ink placeholder:text-[color:var(--ink-dim)] focus:outline-none"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-12">
        <CtaRow onNext={onNext} nextDisabled={!canNext} />
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Step 2 — time window
// ────────────────────────────────────────────────────────────────────────────

function Step2({
  windowMin,
  setWindowMin,
  onBack,
  onNext,
}: {
  windowMin: number;
  setWindowMin: (n: number) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <section className="flex min-h-[calc(100vh-80px)] flex-col justify-center pb-16 pt-10">
      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="text-balance text-center text-3xl font-semibold tracking-tightest text-ink sm:text-[44px] sm:leading-[1.05]"
      >
        How long are you free?
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.5, ease: EASE }}
        className="mx-auto mt-4 max-w-md text-center text-[14px] text-[color:var(--ink-dim)]"
      >
        Pulse only shows matches who are also free in the same window.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.16, duration: 0.5, ease: EASE }}
        className="mx-auto mt-12 grid w-full max-w-4xl grid-cols-1 gap-3 sm:grid-cols-5"
      >
        {WINDOWS.map((w) => (
          <SelectCard
            key={w.value}
            selected={windowMin === w.value}
            onClick={() => setWindowMin(w.value)}
            className="min-h-[120px]"
          >
            <div className="text-[20px] font-semibold tracking-tightest text-ink">
              {w.label}
            </div>
            <div className="mt-1.5 text-[12px] text-[color:var(--ink-dim)]">
              {w.sub}
            </div>
          </SelectCard>
        ))}
      </motion.div>

      <div className="mt-12">
        <CtaRow onBack={onBack} onNext={onNext} />
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Step 3 — quest text
// ────────────────────────────────────────────────────────────────────────────

function Step3({
  goal,
  setGoal,
  onBack,
  onNext,
  canNext,
}: {
  goal: string;
  setGoal: (s: string) => void;
  onBack: () => void;
  onNext: () => void;
  canNext: boolean;
}) {
  return (
    <section className="flex min-h-[calc(100vh-80px)] flex-col justify-center pb-16 pt-10">
      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="text-balance text-center text-3xl font-semibold tracking-tightest text-ink sm:text-[44px] sm:leading-[1.05]"
      >
        What would make this time count?
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.5, ease: EASE }}
        className="mx-auto mt-4 max-w-lg text-center text-[14px] text-[color:var(--ink-dim)]"
      >
        Be specific. The more you say, the better Pulse can find your people.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.16, duration: 0.5, ease: EASE }}
        className="mx-auto mt-10 w-full max-w-[640px]"
      >
        <div className="glass rounded-3xl p-1.5">
          <textarea
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            rows={5}
            className="w-full resize-none rounded-[1.25rem] bg-transparent px-6 py-5 text-[18px] leading-[1.5] text-ink placeholder:text-[color:var(--ink-dim)] focus:outline-none"
            placeholder="Tell Pulse what you actually want from the next chunk of time."
          />
        </div>

        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {QUEST_EXAMPLES.map((ex) => (
            <button
              key={ex}
              onClick={() => setGoal(ex)}
              className="glass max-w-full truncate rounded-full px-3.5 py-1.5 text-[12px] italic text-[color:var(--ink-dim)] transition-colors hover:text-ink"
            >
              "{ex}"
            </button>
          ))}
        </div>
      </motion.div>

      <div className="mt-12">
        <CtaRow onBack={onBack} onNext={onNext} nextDisabled={!canNext} />
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Step 4 — review
// ────────────────────────────────────────────────────────────────────────────

function Step4({
  mode,
  sessionPick,
  topicValue,
  situationValue,
  windowMin,
  goal,
  onBack,
  onEdit,
  onSubmit,
  loading,
}: {
  mode: Mode | null;
  sessionPick: string;
  topicValue: string;
  situationValue: string;
  windowMin: number;
  goal: string;
  onBack: () => void;
  onEdit: (target: 1 | 2 | 3) => void;
  onSubmit: () => void;
  loading: boolean;
}) {
  const contextLabel =
    mode === "session"
      ? sessionPick.split("—")[0].trim()
      : mode === "topic"
        ? topicValue || "Topic"
        : situationValue || "Just in a moment";
  const minsLabel =
    windowMin >= 240 ? "Free until end of day" : `${windowMin} minutes free`;

  // Edge fade-out on submit
  const [fadingOut, setFadingOut] = useState(false);
  useEffect(() => {
    if (loading) setFadingOut(true);
  }, [loading]);

  return (
    <section className="relative flex min-h-[calc(100vh-80px)] flex-col justify-center pb-16 pt-10">
      <AnimatePresence>
        {fadingOut && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="pointer-events-none fixed inset-0 z-20"
            style={{
              background:
                "radial-gradient(60% 60% at 50% 50%, transparent 30%, oklch(0 0 0) 95%)",
            }}
          />
        )}
      </AnimatePresence>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="text-center text-[10px] uppercase tracking-[0.28em] text-[color:var(--ink-dim)]"
      >
        Your quest
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{
          opacity: fadingOut ? 0 : 1,
          y: 0,
          scale: fadingOut ? 0.98 : 1,
        }}
        transition={{ delay: 0.08, duration: 0.55, ease: EASE }}
        className="mx-auto mt-5 w-full max-w-2xl"
      >
        <div
          className="glass-strong relative rounded-3xl p-8"
          style={{
            boxShadow:
              "0 24px 80px -20px oklch(0 0 0 / 60%), 0 0 60px -20px var(--coral)",
          }}
        >
          {/* Context tags */}
          <div className="flex flex-wrap gap-2">
            <ContextTag Icon={MapPin}>{contextLabel}</ContextTag>
            <ContextTag Icon={Clock}>{minsLabel}</ContextTag>
          </div>

          <div className="my-6 h-px w-full bg-white/[0.08]" />

          <p className="text-[22px] font-medium leading-[1.45] text-ink sm:text-[24px]">
            "{goal}"
          </p>

          <p className="mt-5 text-[13px] italic text-[color:var(--ink-dim)]">
            — Adi, you
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-[color:var(--ink-dim)]">
            <button
              onClick={() => onEdit(1)}
              className="underline-offset-4 transition-colors hover:text-ink hover:underline"
            >
              Edit mode
            </button>
            <span>·</span>
            <button
              onClick={() => onEdit(2)}
              className="underline-offset-4 transition-colors hover:text-ink hover:underline"
            >
              Edit time
            </button>
            <span>·</span>
            <button
              onClick={() => onEdit(3)}
              className="underline-offset-4 transition-colors hover:text-ink hover:underline"
            >
              Edit quest text
            </button>
          </div>
        </div>
      </motion.div>

      <div className="mt-12">
        <CtaRow
          onBack={onBack}
          onNext={onSubmit}
          nextLabel="Drop into the radar"
          loading={loading}
          emphasize
        />
      </div>
    </section>
  );
}

function ContextTag({
  Icon,
  children,
}: {
  Icon: typeof Clock;
  children: React.ReactNode;
}) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] text-ink"
      style={{
        border: "1px solid var(--cyan-soft)",
        background: "oklch(0.85 0.16 210 / 6%)",
      }}
    >
      <Icon size={12} className="text-[var(--coral)]" />
      {children}
    </span>
  );
}
