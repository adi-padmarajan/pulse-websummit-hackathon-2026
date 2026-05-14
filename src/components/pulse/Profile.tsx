import { motion, AnimatePresence } from "framer-motion";
import { X, Linkedin, Plus } from "lucide-react";
import type { Viewer } from "@/lib/pulse-data";

interface Props {
  viewer: Viewer | null;
  open: boolean;
  onClose: () => void;
  onNewQuest?: () => void;
}

interface Conversation {
  id: string;
  title: string;
  subtext: string;
  quote: string;
  avatars: { initial: string; color: string }[];
  links: { name: string; url: string }[];
}

const CONVERSATIONS: Conversation[] = [
  {
    id: "c1",
    title: "Maya & Tara",
    subtext: "Coffee at Espresso Bar · Today, 11:47 AM",
    quote:
      "Wanted to keep chewing on what Pip said about AI in the design process...",
    avatars: [
      { initial: "M", color: "var(--cyan)" },
      { initial: "T", color: "var(--cyan)" },
    ],
    links: [
      { name: "Maya", url: "https://linkedin.com/in/maya-chen-design" },
      { name: "Tara", url: "https://linkedin.com/in/tara-okafor" },
    ],
  },
  {
    id: "c2",
    title: "James",
    subtext: "Lunch at the Food Court · Yesterday, 1:15 PM",
    quote: "Wanted a vegan lunch buddy with no particular agenda...",
    avatars: [{ initial: "J", color: "var(--cyan)" }],
    links: [{ name: "James", url: "https://linkedin.com/in/james-rivera" }],
  },
  {
    id: "c3",
    title: "Sarah",
    subtext: "Coffee at the Investor Lounge · Yesterday, 4:30 PM",
    quote:
      "Wanted to meet an angel investor who would actually have a real conversation, not a pitch...",
    avatars: [{ initial: "S", color: "var(--cyan)" }],
    links: [
      { name: "Sarah", url: "https://linkedin.com/in/sarah-patel-angel" },
    ],
  },
];

const PAST_QUESTS = [
  { text: "Coffee at Espresso Bar · Met Maya & Tara · Today", done: true },
  { text: "Lunch at Food Court · Met James · Yesterday", done: true },
  { text: "Coffee at Investor Lounge · Met Sarah · Yesterday", done: true },
  { text: "Drinks at Rooftop Bar · Quest expired", done: false },
];

export function Profile({ viewer, open, onClose, onNewQuest }: Props) {
  return (
    <AnimatePresence>
      {open && viewer && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 36 }}
            className="fixed inset-0 z-50 overflow-y-auto"
            style={{
              background:
                "linear-gradient(180deg, oklch(0.13 0.018 280) 0%, oklch(0.10 0.012 280) 100%)",
              backgroundImage: "var(--gradient-radial-warm)",
              backgroundAttachment: "fixed",
            }}
          >
            <div className="mx-auto w-full max-w-2xl px-6 pb-12 pt-6">
              <div className="flex items-center justify-between">
                <button
                  onClick={onClose}
                  className="rounded-full p-2 text-[color:var(--ink-dim)] transition-colors hover:bg-white/5 hover:text-ink"
                  aria-label="Close profile"
                >
                  <X size={20} />
                </button>
                {onNewQuest && (
                  <button
                    onClick={onNewQuest}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[var(--coral)] px-3.5 py-1.5 text-[12px] font-semibold text-white shadow-[0_8px_30px_-10px_var(--coral)] transition-all hover:shadow-[0_12px_40px_-10px_var(--coral)]"
                  >
                    <Plus size={14} />
                    New quest
                  </button>
                )}
              </div>

              {/* Avatar */}
              <div className="mt-6 flex flex-col items-center">
                <div className="relative">
                  <div
                    className="absolute inset-0 rounded-full blur-2xl"
                    style={{
                      background: "var(--coral)",
                      opacity: 0.45,
                      transform: "scale(1.4)",
                    }}
                  />
                  <motion.div
                    initial={{ scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 220,
                      damping: 18,
                      delay: 0.1,
                    }}
                    className="relative flex h-28 w-28 items-center justify-center rounded-full text-[44px] font-semibold text-white"
                    style={{
                      background:
                        "linear-gradient(150deg, var(--coral), oklch(0.55 0.22 18))",
                      boxShadow:
                        "0 0 60px -10px var(--coral), inset 0 1px 0 0 oklch(1 0 0 / 25%)",
                    }}
                  >
                    {viewer.initial}
                  </motion.div>
                </div>

                <h1 className="mt-6 text-[34px] font-semibold tracking-tightest text-ink">
                  {viewer.name}
                </h1>
                <p className="mt-1 text-center text-[14px] text-[color:var(--ink-dim)]">
                  {viewer.role} · {viewer.company}
                </p>
              </div>

              {/* My current quest */}
              <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18 }}
                className="glass mt-8 rounded-2xl p-5"
              >
                <p className="mb-3 text-[11px] uppercase tracking-[0.18em] text-[color:var(--ink-dim)]">
                  My current quest
                </p>
                <p className="text-[15px] leading-relaxed text-ink">
                  "{viewer.questText}"
                </p>
                <div className="mt-4 flex justify-end">
                  <button className="rounded-full border border-white/12 px-4 py-1.5 text-[12px] font-medium text-[color:var(--ink-dim)] transition-colors hover:border-white/25 hover:text-ink">
                    Edit quest
                  </button>
                </div>
              </motion.section>

              {/* Bio */}
              <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.24 }}
                className="glass mt-4 rounded-2xl p-5"
              >
                <p className="mb-3 text-[11px] uppercase tracking-[0.18em] text-[color:var(--ink-dim)]">
                  Bio
                </p>
                <p className="text-[14px] leading-relaxed text-[color:oklch(0.85_0.005_280)]">
                  {viewer.bio}
                </p>
              </motion.section>

              {/* Interests */}
              <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass mt-4 rounded-2xl p-5"
              >
                <p className="mb-3 text-[11px] uppercase tracking-[0.18em] text-[color:var(--ink-dim)]">
                  Interests
                </p>
                <div className="flex flex-wrap gap-2">
                  {viewer.interests.map((tag, i) => (
                    <motion.button
                      key={tag}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.32 + i * 0.04 }}
                      whileHover={{ y: -2 }}
                      className="rounded-full border px-3 py-1.5 text-[14px] transition-colors"
                      style={{
                        borderColor: "var(--cyan)",
                        color: "var(--cyan)",
                        background: "oklch(0.18 0.012 280 / 60%)",
                      }}
                    >
                      {tag}
                    </motion.button>
                  ))}
                </div>
              </motion.section>

              {/* Today's activity */}
              <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.36 }}
                className="glass mt-4 rounded-2xl p-5"
              >
                <p className="mb-3 text-[11px] uppercase tracking-[0.18em] text-[color:var(--ink-dim)]">
                  Today's activity
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Quests dropped", value: 3 },
                    { label: "People matched", value: 6 },
                    { label: "Waves sent", value: 2 },
                  ].map((s) => (
                    <div key={s.label} className="text-left">
                      <p className="text-[28px] font-semibold tracking-tightest text-ink tabular-nums">
                        {s.value}
                      </p>
                      <p className="mt-0.5 text-[11px] uppercase tracking-[0.14em] text-[color:var(--ink-dim)]">
                        {s.label}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.section>

              {/* Conversations */}
              <section
                id="conversations"
                className="mt-10"
              >
                <h2 className="text-[24px] font-semibold tracking-tightest text-ink">
                  Conversations
                </h2>
                <p className="mt-1 text-[13px] text-[color:var(--ink-dim)]">
                  Three conversations from Web Summit so far.
                </p>

                <div className="mt-5 flex flex-col gap-4">
                  {CONVERSATIONS.map((c, i) => (
                    <motion.div
                      key={c.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + i * 0.06 }}
                      className="glass rounded-2xl border border-white/10 p-5"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                          {c.avatars.map((a, idx) => (
                            <div
                              key={idx}
                              className="flex h-9 w-9 items-center justify-center rounded-full border-2 text-[13px] font-semibold text-white"
                              style={{
                                background: a.color,
                                borderColor: "oklch(0.13 0.018 280)",
                              }}
                            >
                              {a.initial}
                            </div>
                          ))}
                        </div>
                        <p className="text-[15px] font-semibold text-ink">
                          {c.title}
                        </p>
                      </div>

                      <p className="mt-3 text-[12px] text-[color:var(--ink-dim)]">
                        {c.subtext}
                      </p>

                      <p className="mt-2 text-[14px] italic leading-relaxed text-ink">
                        "{c.quote}"
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {c.links.map((l) => (
                          <a
                            key={l.url}
                            href={l.url}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-[12px] font-semibold text-white transition-opacity hover:opacity-90"
                            style={{ background: "#0A66C2" }}
                          >
                            <Linkedin size={14} />
                            {l.name} on LinkedIn
                          </a>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* Past Quests */}
              <section className="mt-10">
                <h2 className="text-[20px] font-semibold tracking-tightest text-ink">
                  Past quests
                </h2>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {PAST_QUESTS.map((q, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 text-[13px] text-[color:oklch(0.85_0.005_280)]"
                    >
                      <span
                        className="inline-block h-2 w-2 shrink-0 rounded-full"
                        style={{
                          background: q.done
                            ? "var(--coral)"
                            : "oklch(0.5 0.005 280)",
                        }}
                      />
                      <span className={q.done ? "" : "text-[color:var(--ink-dim)]"}>
                        {q.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
