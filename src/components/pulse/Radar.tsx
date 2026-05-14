import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, MapPin, Pencil } from "lucide-react";
import { Wordmark } from "./Wordmark";
import {
  rowToViewer,
  type Quest,
  type QuestRow,
  type Ring,
  type Viewer,
} from "@/lib/pulse-data";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  waveBurstFrom: { x: number; y: number } | null;
  onSelect: (q: Quest, origin: { x: number; y: number }) => void;
  onEndDay: () => void;
  onOpenProfile: () => void;
  viewer: Viewer | null;
  onViewerLoaded: (v: Viewer) => void;
}

const SIZE = 560;
const CENTER = SIZE / 2;
const RING_R: Record<Ring, number> = { inner: 110, middle: 180, outer: 250 };

interface Dot {
  id: string;
  name: string;
  initial: string;
  ring: Ring;
  angle: number; // clockwise from top, degrees
  match: number;
  quest: string;
  why: string;
  opener: string;
  contextType: "session" | "topic" | "situation";
  justAttended: string | null;
  freeUntil: string | null;
  conversationGoal: string | null;
}

// Hardcoded radar population per spec. Positions are designer-specified
// to make the "fresh shared context" cluster read at a glance.
const DOTS: Dot[] = [
  {
    id: "maya",
    name: "Maya",
    initial: "M",
    ring: "inner",
    angle: 45,
    match: 94,
    quest:
      "Coming out of the Metalabs masterclass — want to compare notes on Pip's AI-in-design-process bit before the next session.",
    why: "Maya just left the same room as you. Her quest cites Pip's framing on AI in the design process — exactly what you wanted to keep chewing on.",
    opener: "Hey Maya — you were at the Metalabs talk too, right? What did you make of Pip's bit on AI in the loop?",
    contextType: "session",
    justAttended: "AI Design Systems at Scale — Metalabs Masterclass",
    freeUntil: "Free for the next 30 minutes",
    conversationGoal: "Trade takes on Pip's AI-in-design framing",
  },
  {
    id: "tara",
    name: "Tara",
    initial: "T",
    ring: "inner",
    angle: 75,
    match: 92,
    quest:
      "Just left Metalabs. Looking for one good coffee chat about AI tooling in real design teams before the 3pm.",
    why: "Same masterclass, same 30-min window. Tara explicitly wants a coffee chat about AI tooling in design teams.",
    opener: "Tara — caught your quest on the radar. Coffee at the Hall C bar in 10?",
    contextType: "session",
    justAttended: "AI Design Systems at Scale — Metalabs Masterclass",
    freeUntil: "Free until 3:00pm",
    conversationGoal: "Coffee chat about AI tooling in design teams",
  },
  {
    id: "omar",
    name: "Omar",
    initial: "O",
    ring: "inner",
    angle: 110,
    match: 89,
    quest:
      "Fresh out of Metalabs. Curious how others are wiring AI into their design system pipelines.",
    why: "Walked out of the same room minutes ago. Wants to dig into AI in design system pipelines — adjacent to your espresso-bar plan.",
    opener: "Omar — same room as me a minute ago. Want to grab a coffee and unpack it?",
    contextType: "session",
    justAttended: "AI Design Systems at Scale — Metalabs Masterclass",
    freeUntil: "Free for the next 25 minutes",
    conversationGoal: "Compare AI design-system pipelines",
  },
  {
    id: "sarah",
    name: "Sarah",
    initial: "S",
    ring: "middle",
    angle: 200,
    match: 91,
    quest:
      "Want to talk to someone hands-on with AI in production design workflows. 30 min of brain candy.",
    why: "Strong topical overlap with your post-masterclass thread. Sarah's intent reads like a continuation of the room you just left.",
    opener: "Sarah — your quest landed right next to mine. Coffee at Hall C?",
    contextType: "topic",
    justAttended: null,
    freeUntil: "Free for 30 minutes",
    conversationGoal: "Brain candy on AI in production design workflows",
  },
  {
    id: "priya",
    name: "Priya",
    initial: "P",
    ring: "middle",
    angle: 240,
    match: 84,
    quest:
      "Free until 2:45. Down to nerd out on design tokens, AI variant generation, anything spicy.",
    why: "Topical adjacency on AI variant generation. Window aligns with your espresso-bar window.",
    opener: "Priya — radar says we overlap. Espresso bar in 10?",
    contextType: "topic",
    justAttended: null,
    freeUntil: "Free until 2:45pm",
    conversationGoal: "Talk AI variant generation and design tokens",
  },
  {
    id: "raj",
    name: "Raj",
    initial: "R",
    ring: "middle",
    angle: 290,
    match: 86,
    quest:
      "Wandering Hall C looking for one substantive convo about AI-assisted design ops before the next keynote.",
    why: "Situationally co-located in Hall C with a window that matches yours. Wants substance, not small talk.",
    opener: "Raj — I'm heading to the espresso bar in Hall C. Join?",
    contextType: "situation",
    justAttended: null,
    freeUntil: "Free until 3:10pm",
    conversationGoal: "One substantive AI design ops conversation",
  },
  {
    id: "kenji",
    name: "Kenji",
    initial: "K",
    ring: "outer",
    angle: 30,
    match: 78,
    quest: "Open to chat on early-stage design hiring. 20 min window.",
    why: "Lower direct overlap, but adjacent thinking on team-building.",
    opener: "Kenji — short window but radar paired us. Worth a quick hello?",
    contextType: "topic",
    justAttended: null,
    freeUntil: "Free for 20 minutes",
    conversationGoal: "Talk early-stage design hiring",
  },
  {
    id: "marcus",
    name: "Marcus",
    initial: "M",
    ring: "outer",
    angle: 130,
    match: 71,
    quest: "Looking for a founder doing weird things with AI infra.",
    why: "Tangential overlap on AI tooling — could be a fun left-turn conversation.",
    opener: "Marcus — different angle, but our radar pinged. Coffee?",
    contextType: "topic",
    justAttended: null,
    freeUntil: "Free until 3:00pm",
    conversationGoal: "Find a weird AI infra founder",
  },
  {
    id: "sasha",
    name: "Sasha",
    initial: "S",
    ring: "outer",
    angle: 220,
    match: 65,
    quest: "Just want a quiet table and someone interesting for 15 min.",
    why: "Soft overlap. Open to whatever — a low-pressure hello if it's on your way.",
    opener: "Sasha — saw your quest. I'm grabbing a coffee in 10, want to swing by?",
    contextType: "situation",
    justAttended: null,
    freeUntil: "Free for 15 minutes",
    conversationGoal: "A quiet, interesting 15 minutes",
  },
  {
    id: "lin",
    name: "Lin",
    initial: "L",
    ring: "outer",
    angle: 320,
    match: 68,
    quest: "Want to meet a design eng who has shipped AI features end-to-end.",
    why: "Lower priority, but a clean topic match on shipping AI features.",
    opener: "Lin — your quest pinged my radar. Espresso bar in Hall C in 10?",
    contextType: "topic",
    justAttended: null,
    freeUntil: "Free until 3:30pm",
    conversationGoal: "Find a design eng who shipped AI features",
  },
];

function dotToQuest(d: Dot): Quest {
  return {
    id: d.id,
    name: d.name,
    initial: d.initial,
    quest: d.quest,
    ring: d.ring,
    tier: d.match >= 80 ? "high" : "medium",
    match: d.match,
    angle: d.angle,
    why: d.why,
    opener: d.opener,
    contextType: d.contextType,
    justAttended: d.justAttended,
    currentSituation: null,
    freeUntil: d.freeUntil,
    conversationGoal: d.conversationGoal,
    topic: null,
  };
}

function polar(angleDeg: number, r: number) {
  // 0° = top, clockwise
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: CENTER + r * Math.cos(rad), y: CENTER + r * Math.sin(rad) };
}

export function Radar({
  waveBurstFrom,
  onSelect,
  onEndDay,
  onOpenProfile,
  viewer,
  onViewerLoaded,
}: Props) {
  const [now, setNow] = useState(() => Date.now());
  const [burstKey, setBurstKey] = useState(0);
  const [activeCount, setActiveCount] = useState(23);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const expiresAtRef = useRef<number>(Date.now() + 30 * 60_000);

  // Pull viewer from Supabase (don't break the data wiring), but fall back
  // to a fixture so the page always demos.
  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase
        .from("quests")
        .select("*")
        .eq("is_viewer", true)
        .limit(1)
        .maybeSingle();
      if (!active) return;
      if (data) {
        const v = rowToViewer(data as QuestRow);
        onViewerLoaded(v);
        const exp = new Date(v.expiresAt).getTime();
        if (!Number.isNaN(exp) && exp > Date.now()) expiresAtRef.current = exp;
      }
    })();
    return () => {
      active = false;
    };
  }, [onViewerLoaded]);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  // Counter ticks up by 1 every few seconds, sometimes pausing.
  useEffect(() => {
    let cancelled = false;
    const schedule = () => {
      const delay = 2200 + Math.random() * 4200; // 2.2s – 6.4s
      setTimeout(() => {
        if (cancelled) return;
        // Sometimes pause (skip a tick)
        if (Math.random() > 0.25) setActiveCount((c) => c + 1);
        schedule();
      }, delay);
    };
    schedule();
    return () => {
      cancelled = true;
    };
  }, []);

  // The killer detail: tooltip over Maya, then fades.
  useEffect(() => {
    const inT = setTimeout(() => setTooltipVisible(true), 1400);
    const outT = setTimeout(() => setTooltipVisible(false), 1400 + 2500);
    return () => {
      clearTimeout(inT);
      clearTimeout(outT);
    };
  }, []);

  useEffect(() => {
    if (waveBurstFrom) setBurstKey((k) => k + 1);
  }, [waveBurstFrom]);

  const seconds = useMemo(() => {
    return Math.max(0, Math.floor((expiresAtRef.current - now) / 1000));
  }, [now]);
  const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");
  const minsLeft = Math.max(0, Math.ceil(seconds / 60));

  const justAttended =
    viewer && viewer.questText
      ? "AI Design Systems · Metalabs Masterclass"
      : "AI Design Systems · Metalabs Masterclass";

  const questText =
    "Grabbing coffee at the espresso bar by Hall C in 10 min. Want to keep chewing on what Pip said about AI in the design process. Room for two.";

  const ringOrderDelay = (r: Ring) =>
    r === "inner" ? 0 : r === "middle" ? 0.45 : 0.9;

  const mayaPos = polar(45, RING_R.inner);

  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-2xl flex-col px-6 pt-7">
      {/* Top bar */}
      <header className="flex items-center justify-between">
        <Wordmark />
        <button
          onClick={onOpenProfile}
          aria-label="Open profile"
          className="flex h-9 w-9 items-center justify-center rounded-full text-[13px] font-semibold text-white transition-transform hover:scale-105"
          style={{
            background:
              "linear-gradient(150deg, var(--coral), oklch(0.55 0.22 18))",
            boxShadow:
              "0 0 18px -4px var(--coral), inset 0 1px 0 0 oklch(1 0 0 / 25%)",
          }}
        >
          {viewer?.initial ?? "A"}
        </button>
      </header>

      {/* Context strip */}
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2"
      >
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.22em] text-[color:var(--ink-dim)]">
            Fresh from
          </span>
          <span className="text-[12px] text-ink/85">{justAttended}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.22em] text-[color:var(--ink-dim)]">
            Free for
          </span>
          <span className="inline-flex items-center gap-1.5 text-[12px] text-ink/85">
            <Clock size={12} className="text-[var(--coral)]" />
            <span className="tabular-nums">{minsLeft} min</span>
          </span>
        </div>
      </motion.div>

      {/* Radar */}
      <div
        className="relative mx-auto mt-4"
        style={{ width: "min(100%, 560px, 58vh)" }}
      >
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="block w-full"
          style={{ aspectRatio: "1 / 1", overflow: "hidden" }}
        >
          <defs>
            <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--coral)" stopOpacity="0.20" />
              <stop offset="60%" stopColor="var(--coral)" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="sweep" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--coral)" stopOpacity="0" />
              <stop offset="100%" stopColor="var(--coral)" stopOpacity="0.55" />
            </linearGradient>
            <filter id="cyanGlow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="3.5" />
            </filter>
          </defs>

          {/* Center warm glow */}
          <circle cx={CENTER} cy={CENTER} r={RING_R.outer} fill="url(#centerGlow)" />

          {/* Rings */}
          {([
            { r: "outer", op: 0.15 },
            { r: "middle", op: 0.25 },
            { r: "inner", op: 0.4 },
          ] as const).map(({ r, op }) => (
            <circle
              key={r}
              cx={CENTER}
              cy={CENTER}
              r={RING_R[r as Ring]}
              fill="none"
              stroke="var(--coral)"
              strokeOpacity={op}
              strokeWidth={1}
            />
          ))}

          {/* Scanning sweep — native SVG rotation around the exact same
              CENTER used by the rings and dots. Avoid CSS transform-origin
              drift between browsers. */}
          <path
            d={`M ${CENTER} ${CENTER} L ${CENTER} ${CENTER - RING_R.outer} A ${RING_R.outer} ${RING_R.outer} 0 0 1 ${CENTER + RING_R.outer * Math.sin(Math.PI / 3)} ${CENTER - RING_R.outer * Math.cos(Math.PI / 3)} Z`}
            fill="url(#sweep)"
            opacity={0.08}
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from={`0 ${CENTER} ${CENTER}`}
              to={`360 ${CENTER} ${CENTER}`}
              dur="6s"
              repeatCount="indefinite"
            />
          </path>

          {/* Center heartbeat halos */}
          <motion.circle
            cx={CENTER}
            cy={CENTER}
            r={16}
            fill="var(--coral)"
            animate={{ r: [16, 29], opacity: [0.6, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
          />
          <motion.circle
            cx={CENTER}
            cy={CENTER}
            r={16}
            fill="var(--coral)"
            animate={{ r: [16, 29], opacity: [0.4, 0] }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              ease: "easeOut",
              delay: 0.45,
            }}
          />

          {/* Adi center dot */}
          <g>
            <circle
              cx={CENTER}
              cy={CENTER}
              r={16}
              fill="var(--coral)"
              style={{ filter: "drop-shadow(0 0 14px var(--coral))" }}
            />
            <text
              x={CENTER}
              y={CENTER + 4}
              fill="white"
              fontSize="12"
              fontWeight={600}
              textAnchor="middle"
              fontFamily="Inter, sans-serif"
            >
              {viewer?.initial ?? "A"}
            </text>
          </g>

          {/* Wave burst from a tapped dot */}
          <AnimatePresence>
            {waveBurstFrom && (
              <motion.circle
                key={burstKey}
                cx={waveBurstFrom.x}
                cy={waveBurstFrom.y}
                r={10}
                fill="none"
                stroke="var(--coral)"
                strokeWidth={1.5}
                initial={{ r: 10, opacity: 0.9 }}
                animate={{ r: 320, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            )}
          </AnimatePresence>

          {/* Dots */}
          {DOTS.map((d, i) => {
            const { x, y } = polar(d.angle, RING_R[d.ring]);
            const high = d.match >= 80;
            const radius = high ? 7 : 5;
            const baseDelay =
              ringOrderDelay(d.ring) + (i % 4) * 0.06 + 0.4;
            return (
              <motion.g
                key={d.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  delay: baseDelay,
                  duration: 0.35,
                  ease: "easeOut",
                }}
                style={{
                  cursor: "pointer",
                }}
                onClick={() => onSelect(dotToQuest(d), { x, y })}
              >
                {high && (
                  <>
                    {/* outer soft glow */}
                    <circle
                      cx={x}
                      cy={y}
                      r={radius + 8}
                      fill="var(--cyan)"
                      opacity={0.18}
                      filter="url(#cyanGlow)"
                    />
                    <motion.circle
                      cx={x}
                      cy={y}
                      r={radius + 4}
                      fill="none"
                      stroke="var(--cyan)"
                      strokeOpacity={0.35}
                      animate={{
                        r: [radius + 4, radius + 6, radius + 4],
                        opacity: [0.45, 0.15, 0.45],
                      }}
                      transition={{
                        duration: 1.6,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: (i * 0.21) % 1.6,
                      }}
                    />
                  </>
                )}
                <motion.circle
                  cx={x}
                  cy={y}
                  r={radius}
                  fill={high ? "var(--cyan)" : "oklch(0.97 0.005 280 / 0.6)"}
                  animate={
                    high
                      ? { r: [radius, radius + 1.5, radius] }
                      : { opacity: [0.55, 0.7, 0.55] }
                  }
                  transition={{
                    duration: 1.6 + (i % 5) * 0.18,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: (i * 0.27) % 1.6,
                  }}
                  style={{
                    filter: high ? "drop-shadow(0 0 6px var(--cyan))" : undefined,
                  }}
                />
                <text
                  x={x}
                  y={y + (high ? 3 : 3)}
                  fill={high ? "oklch(0.15 0.02 220)" : "oklch(0.15 0.01 280)"}
                  fontSize={high ? 8 : 7}
                  fontWeight={700}
                  textAnchor="middle"
                  fontFamily="Inter, sans-serif"
                  style={{ pointerEvents: "none" }}
                >
                  {d.initial}
                </text>
              </motion.g>
            );
          })}

          {/* Ring labels — anchored to the bottom of each ring on the
              south axis so each label clearly belongs to its own ring. */}
          {(
            [
              { r: "inner" as Ring, label: "ROOM" },
              { r: "middle" as Ring, label: "HALL" },
              { r: "outer" as Ring, label: "VENUE" },
            ]
          ).map(({ r, label }) => (
            <text
              key={label}
              x={CENTER}
              y={CENTER - RING_R[r] - 8}
              fill="var(--ink-dim)"
              fontSize="9"
              letterSpacing="0.22em"
              textAnchor="middle"
              fontFamily="Inter, sans-serif"
              opacity={0.7}
            >
              {label}
            </text>
          ))}
        </svg>

        {/* "Killer detail" tooltip — anchored over Maya in HTML space so we
            get smooth backdrop blur + soft text rendering. */}
        <AnimatePresence>
          {tooltipVisible && (
            <motion.div
              key="maya-tip"
              initial={{ opacity: 0, y: 4, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -2, scale: 0.98 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-none absolute z-10"
              style={{
                left: `${(mayaPos.x / SIZE) * 100}%`,
                top: `${(mayaPos.y / SIZE) * 100}%`,
                transform: "translate(-50%, calc(-100% - 16px))",
              }}
            >
              <div
                className="glass-strong relative rounded-xl px-3 py-2 text-[12px] text-ink"
                style={{
                  borderLeft: "2px solid var(--coral)",
                  whiteSpace: "nowrap",
                  boxShadow:
                    "0 12px 30px -10px oklch(0 0 0 / 60%), 0 0 24px -8px var(--coral)",
                }}
              >
                Maya just left the same room as you.
                <span
                  className="absolute left-1/2 -translate-x-1/2"
                  style={{
                    bottom: -5,
                    width: 10,
                    height: 10,
                    background: "oklch(0.16 0.012 280 / 92%)",
                    borderRight: "1px solid oklch(1 0 0 / 8%)",
                    borderBottom: "1px solid oklch(1 0 0 / 8%)",
                    transform: "translate(-50%, 0) rotate(45deg)",
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Status line */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-1 text-center text-[10px] uppercase tracking-[0.22em] text-[color:var(--ink-dim)]"
      >
        <motion.span
          key={activeCount}
          initial={{ opacity: 0, y: -2 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="font-semibold text-ink/90 tabular-nums"
        >
          {activeCount}
        </motion.span>{" "}
        active quests in the venue ·{" "}
        <span className="font-semibold text-ink/90">7</span> in your context
        window
      </motion.p>

      {/* Quest card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="glass relative mx-auto mb-8 mt-5 w-full rounded-2xl p-5"
      >
        <div className="flex items-start justify-between gap-4">
          <p className="text-[10px] uppercase tracking-[0.22em] text-[color:var(--ink-dim)]">
            Your quest
          </p>
          <p className="font-mono text-[14px] tabular-nums text-[var(--coral)]">
            {mins}
            <motion.span
              animate={{ opacity: [1, 0.25, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              :
            </motion.span>
            {secs}
          </p>
        </div>

        <p className="mt-2 text-[14px] leading-relaxed text-ink">{questText}</p>

        <div className="my-4 h-px w-full bg-white/8" />

        <div className="flex items-center justify-between gap-4 text-[12px] text-[color:var(--ink-dim)]">
          <span className="inline-flex items-center gap-1.5">
            <MapPin size={12} className="text-[var(--coral)]" />
            Espresso Bar, Hall C
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock size={12} />
            In 10 min
          </span>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-[color:var(--ink-dim)] transition-colors hover:border-white/20 hover:text-ink"
          >
            <Pencil size={11} />
            Edit
          </button>
        </div>
      </motion.div>

      {/* Hidden util to satisfy onEndDay binding without taking visual space */}
      <button
        onClick={onEndDay}
        className="sr-only"
        aria-hidden="true"
        tabIndex={-1}
      >
        end day
      </button>
    </main>
  );
}
