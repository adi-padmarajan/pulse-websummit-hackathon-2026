import { useEffect, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Clock, MessageCircle, MapPin } from "lucide-react";
import type { Quest } from "@/lib/pulse-data";

function ContextStrip({ match }: { match: Quest }) {
  const rows: { icon: ReactNode; label: string; value: string }[] = [];

  if (match.contextType === "session" && match.justAttended) {
    rows.push({
      icon: <Calendar size={13} />,
      label: "Just attended",
      value: match.justAttended,
    });
  } else if (match.contextType === "topic") {
    rows.push({
      icon: <MessageCircle size={13} />,
      label: "Wants to talk about",
      value: match.topic ?? match.quest,
    });
  } else if (match.contextType === "situation" && match.currentSituation) {
    rows.push({
      icon: <MapPin size={13} />,
      label: "Right now",
      value: match.currentSituation,
    });
  }

  if (match.freeUntil) {
    rows.push({
      icon: <Clock size={13} />,
      label: "Free until",
      value: match.freeUntil,
    });
  }

  if (match.conversationGoal) {
    rows.push({
      icon: <MessageCircle size={13} />,
      label: "Wants to",
      value: match.conversationGoal,
    });
  }

  if (rows.length === 0) return null;

  return (
    <div className="glass mt-6 space-y-2.5 rounded-2xl p-4">
      {rows.map((r) => (
        <div key={r.label} className="flex items-start gap-3">
          <span className="mt-[3px] text-[var(--cyan)]">{r.icon}</span>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] uppercase tracking-[0.18em] text-[color:var(--ink-dim)]">
              {r.label}
            </p>
            <p className="text-[13px] leading-snug text-ink">{r.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

interface Props {
  match: Quest | null;
  onClose: () => void;
  onWave: (q: Quest) => void;
}

function CountUp({ to }: { to: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const dur = 800;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(eased * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return <>{n}</>;
}

export function MatchSheet({ match, onClose, onWave }: Props) {
  return (
    <AnimatePresence>
      {match && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 36 }}
            className="glass-strong fixed inset-x-0 bottom-0 z-50 mx-auto max-h-[78vh] w-full max-w-2xl overflow-y-auto rounded-t-[28px] px-6 pb-8 pt-5"
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/15" />

            <button
              onClick={onClose}
              className="absolute right-5 top-5 rounded-full p-2 text-[color:var(--ink-dim)] transition-colors hover:bg-white/5 hover:text-ink"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-4">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-full text-[20px] font-semibold text-[var(--cyan)]"
                style={{
                  background: "var(--cyan-soft)",
                  boxShadow: "0 0 24px -4px var(--cyan)",
                }}
              >
                {match.initial}
              </div>
              <div className="flex-1">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--ink-dim)]">
                  {match.ring} ring
                </p>
                <p className="text-[20px] font-semibold tracking-tightest text-ink">
                  {match.name}
                </p>
              </div>
              <p className="text-[34px] font-semibold tracking-tightest text-[var(--coral)] tabular-nums">
                <CountUp to={match.match} />%
                <span className="ml-0.5 text-[14px] font-normal text-[color:var(--ink-dim)]">
                  match
                </span>
              </p>
            </div>

            <div className="mt-6 border-l-2 border-[var(--coral)] pl-4">
              <p className="text-[15px] leading-relaxed text-ink">
                "{match.quest}"
              </p>
            </div>

            <ContextStrip match={match} />

            <div className="mt-6">
              <p className="mb-2 text-[11px] uppercase tracking-[0.18em] text-[color:var(--ink-dim)]">
                Why you'll click
              </p>
              <p className="text-[14px] leading-relaxed text-[color:oklch(0.85_0.005_280)]">
                {match.why}
              </p>
            </div>

            <div className="glass mt-6 rounded-2xl p-4">
              <p className="mb-2 text-[11px] uppercase tracking-[0.18em] text-[color:var(--ink-dim)]">
                Suggested opener
              </p>
              <p className="text-[14px] leading-relaxed text-ink">
                {match.opener}
              </p>
            </div>

            <div className="mt-7 grid grid-cols-2 gap-3">
              <button
                onClick={onClose}
                className="rounded-2xl border border-white/10 py-3.5 text-[14px] font-medium text-[color:var(--ink-dim)] transition-colors hover:text-ink"
              >
                Pass
              </button>
              <button
                onClick={() => onWave(match)}
                className="relative overflow-hidden rounded-2xl bg-[var(--coral)] py-3.5 text-[14px] font-semibold text-white shadow-[0_10px_40px_-10px_var(--coral)] transition-all hover:shadow-[0_14px_50px_-10px_var(--coral)]"
              >
                Wave
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
