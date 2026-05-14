import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

const ROTATING_EXAMPLES = [
  "Argue with someone who disagrees with the talk I just heard.",
  "Lunch with someone who recently quit their job too.",
  "Trade real numbers, not theory.",
  "Find someone two steps ahead of me to ask dumb questions to.",
  "Just want a coffee with a stranger working on something interesting.",
] as const;

const WINDOWS = [
  { label: "15 min", value: 15 },
  { label: "30 min", value: 30 },
  { label: "45 min", value: 45 },
  { label: "60 min", value: 60 },
  { label: "End of day", value: 480 },
] as const;

type Anchor = "session" | "topic" | "situation" | null;

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

export function QuestComposer({ onSubmit }: Props) {
  // Demo: composer is pre-filled on load. In production this would be empty
  // and the user would compose their own quest.
  const [anchor, setAnchor] = useState<Anchor>("session");

  // Anchor inputs — pre-filled with demo values
  const [sessionPick, setSessionPick] = useState<string>(SESSIONS[0]);
  const [sessionOther, setSessionOther] = useState("");
  const [topicValue, setTopicValue] = useState("");
  const [situationValue, setSituationValue] = useState("");

  const [goal, setGoal] = useState(
    "Grabbing coffee at the espresso bar by Hall C in 10 min. Want to keep chewing on what Pip said about AI in the design process. Room for two.",
  );
  const [windowMin, setWindowMin] = useState<number>(30);
  const [loading, setLoading] = useState(false);

  // Rotating example placeholder
  const [exampleIndex, setExampleIndex] = useState(0);
  useEffect(() => {
    const t = setInterval(
      () => setExampleIndex((i) => (i + 1) % ROTATING_EXAMPLES.length),
      3200,
    );
    return () => clearInterval(t);
  }, []);

  const submit = () => {
    const g = goal.trim();
    if (!g || loading) return;

    let contextType: ContextType = "topic";
    let justAttended: string | null = null;
    let currentSituation: string | null = null;
    let topic: string | null = null;

    if (anchor === "session") {
      contextType = "session";
      justAttended =
        sessionPick === "__other__"
          ? sessionOther.trim() || null
          : sessionPick || null;
    } else if (anchor === "situation") {
      contextType = "situation";
      currentSituation = situationValue.trim() || null;
    } else if (anchor === "topic") {
      contextType = "topic";
      topic = topicValue.trim() || null;
    }

    setLoading(true);
    setTimeout(
      () =>
        onSubmit({
          quest: g,
          windowMin,
          contextType,
          justAttended,
          currentSituation,
          topic,
        }),
      350,
    );
  };

  const ANCHORS: { id: Exclude<Anchor, null>; label: string }[] = [
    { id: "session", label: "Just attended a session" },
    { id: "topic", label: "Want to talk about a topic" },
    { id: "situation", label: "Just in a moment" },
  ];

  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-2xl flex-col px-6 pt-7">
      <Wordmark />

      <section className="flex flex-1 flex-col justify-center pb-24 pt-12">
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-7 text-balance text-3xl font-semibold tracking-tightest text-ink sm:text-[40px] sm:leading-[1.05]"
        >
          Where's your{" "}
          <span className="text-[var(--coral)]">head</span>{" "}
          right now?
        </motion.h1>

        {/* Anchor pills */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-wrap gap-2"
        >
          {ANCHORS.map((a) => {
            const active = anchor === a.id;
            return (
              <button
                key={a.id}
                onClick={() => setAnchor(active ? null : a.id)}
                className={
                  "glass relative rounded-full px-4 py-2 text-[13px] font-medium transition-all " +
                  (active
                    ? "text-ink shadow-[0_0_0_1px_var(--coral)_inset]"
                    : "text-[color:var(--ink-dim)] hover:text-ink")
                }
              >
                {active && (
                  <motion.span
                    layoutId="anchor-glow"
                    className="absolute inset-0 -z-0 rounded-full"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.65 0.18 25 / 18%), oklch(0.65 0.18 25 / 6%))",
                    }}
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative">{a.label}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Anchor reveals */}
        <AnimatePresence mode="wait">
          {anchor === "session" && (
            <motion.div
              key="session"
              initial={{ opacity: 0, y: -4, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -4, height: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-4 grid gap-2">
                <select
                  value={sessionPick}
                  onChange={(e) => setSessionPick(e.target.value)}
                  className="glass w-full rounded-2xl bg-transparent px-4 py-3 text-[14px] text-ink focus:outline-none"
                >
                  <option value="" className="bg-[oklch(0.13_0.018_280)]">
                    Pick a session…
                  </option>
                  {SESSIONS.map((s) => (
                    <option key={s} value={s} className="bg-[oklch(0.13_0.018_280)]">
                      {s}
                    </option>
                  ))}
                  <option value="__other__" className="bg-[oklch(0.13_0.018_280)]">
                    Something else…
                  </option>
                </select>
                {sessionPick === "__other__" && (
                  <input
                    value={sessionOther}
                    onChange={(e) => setSessionOther(e.target.value)}
                    placeholder="Which session?"
                    className="glass w-full rounded-2xl bg-transparent px-4 py-3 text-[14px] text-ink placeholder:text-[color:var(--ink-dim)] focus:outline-none"
                  />
                )}
              </div>
            </motion.div>
          )}

          {anchor === "topic" && (
            <motion.div
              key="topic"
              initial={{ opacity: 0, y: -4, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -4, height: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <input
                value={topicValue}
                onChange={(e) => setTopicValue(e.target.value)}
                placeholder="e.g. AI product pricing, the future of dev tools, why design is treated as paint."
                className="glass mt-4 w-full rounded-2xl bg-transparent px-4 py-3 text-[14px] text-ink placeholder:text-[color:var(--ink-dim)] focus:outline-none"
              />
            </motion.div>
          )}

          {anchor === "situation" && (
            <motion.div
              key="situation"
              initial={{ opacity: 0, y: -4, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -4, height: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-4 flex flex-wrap gap-2">
                {SITUATION_CHIPS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSituationValue(c)}
                    className={
                      "glass rounded-full px-3.5 py-1.5 text-[13px] transition-colors " +
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
                className="glass mt-2 w-full rounded-2xl bg-transparent px-4 py-3 text-[14px] text-ink placeholder:text-[color:var(--ink-dim)] focus:outline-none"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Time window */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-8"
        >
          <p className="mb-2 text-[11px] uppercase tracking-[0.18em] text-[color:var(--ink-dim)]">
            How long are you free?
          </p>
          <div className="glass inline-flex flex-wrap rounded-full p-1">
            {WINDOWS.map((w) => (
              <button
                key={w.value}
                onClick={() => setWindowMin(w.value)}
                className="relative rounded-full px-3.5 py-1.5 text-[13px] font-medium text-[color:var(--ink-dim)] transition-colors"
              >
                {windowMin === w.value && (
                  <motion.span
                    layoutId="window-pill"
                    className="absolute inset-0 rounded-full bg-white/8"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span
                  className={"relative " + (windowMin === w.value ? "text-ink" : "")}
                >
                  {w.label}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Goal */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.5 }}
          className="mt-6"
        >
          <p className="mb-2 text-[11px] uppercase tracking-[0.18em] text-[color:var(--ink-dim)]">
            What would make this time count?
          </p>
          <div className="glass relative rounded-3xl p-1.5">
            <textarea
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="Decompress with someone who was also there. Argue with someone who disagrees. Find someone two steps ahead. Just want company. Whatever you need."
              rows={3}
              className="w-full resize-none rounded-[1.25rem] bg-transparent px-5 py-4 text-[15px] leading-snug text-ink placeholder:text-[color:var(--ink-dim)] focus:outline-none"
            />
          </div>

          <div className="mt-3 h-5 overflow-hidden text-[12px] text-[color:var(--ink-dim)]">
            <AnimatePresence mode="wait">
              <motion.button
                key={exampleIndex}
                onClick={() => setGoal(ROTATING_EXAMPLES[exampleIndex])}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.4 }}
                className="block text-left italic transition-colors hover:text-ink"
              >
                "{ROTATING_EXAMPLES[exampleIndex]}"
              </motion.button>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-8"
        >
          <button
            onClick={submit}
            disabled={!goal.trim() || loading}
            className="group relative inline-flex h-[52px] w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-[var(--coral)] px-6 py-3.5 text-[15px] font-semibold text-white shadow-[0_10px_40px_-10px_var(--coral)] transition-all duration-300 hover:shadow-[0_14px_60px_-10px_var(--coral)] disabled:opacity-40"
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
              <>Find my people.</>
            )}
          </button>
        </motion.div>
      </section>
    </main>
  );
}
