export const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

const IST = "Asia/Kolkata";
export const fmtDate = (iso: string, opts: Intl.DateTimeFormatOptions = { weekday: "short", day: "numeric", month: "short", year: "numeric" }) =>
  new Intl.DateTimeFormat("en-IN", { timeZone: IST, ...opts }).format(new Date(iso));
export const fmtTime = (iso: string) =>
  new Intl.DateTimeFormat("en-IN", { timeZone: IST, hour: "numeric", minute: "2-digit" }).format(new Date(iso));

export const isPlaceholder = (s?: string | null) => !!s && s.includes("[PLACEHOLDER]");
