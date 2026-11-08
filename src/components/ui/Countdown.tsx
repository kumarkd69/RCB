"use client";
import { useEffect, useState } from "react";

const parts = (ms: number) => {
  const s = Math.max(0, Math.floor(ms / 1000));
  return { Days: Math.floor(s / 86400), Hrs: Math.floor((s % 86400) / 3600), Min: Math.floor((s % 3600) / 60), Sec: s % 60 };
};

export default function Countdown({ to, compact }: { to: string; compact?: boolean }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const p = parts(now === null ? 0 : +new Date(to) - now);
  return (
    <div className="flex gap-2" role="timer" aria-live="off" aria-label={`Starts in ${p.Days} days ${p.Hrs} hours ${p.Min} minutes`}>
      {Object.entries(p).map(([k, v]) => (
        <div key={k} className={compact ? "glass min-w-12 rounded-xl px-2 py-1.5 text-center" : "glass min-w-16 rounded-2xl px-3 py-2 text-center"}>
          <div className={compact ? "display text-xl tabular-nums" : "display text-3xl tabular-nums md:text-4xl"} suppressHydrationWarning>
            {now === null ? "--" : String(v).padStart(2, "0")}
          </div>
          <div className="text-[10px] uppercase tracking-widest text-muted">{k}</div>
        </div>
      ))}
    </div>
  );
}
