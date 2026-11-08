import { cn } from "@/lib/utils";

type Base = { name: string; label: string; error?: string; required?: boolean; hint?: string; className?: string };

const input = "w-full rounded-xl border border-line bg-white/5 px-4 py-3 text-text placeholder:text-muted/60 transition focus:border-gold focus:bg-white/10 focus:outline-none aria-[invalid=true]:border-red";

export function Field({ name, label, error, required, hint, className, type = "text", ...rest }: Base & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = `f-${name}`;
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-sm font-medium">{label}{required && <span className="text-red"> *</span>}</label>
      <input id={id} name={name} type={type} required={required} aria-invalid={!!error} aria-describedby={error ? `${id}-e` : hint ? `${id}-h` : undefined} className={input} {...rest} />
      {hint && !error && <p id={`${id}-h`} className="text-xs text-muted">{hint}</p>}
      {error && <p id={`${id}-e`} className="text-xs text-red" role="alert">{error}</p>}
    </div>
  );
}

export function SelectField({ name, label, error, required, options, className, defaultValue }: Base & { options: [string, string][]; defaultValue?: string }) {
  const id = `f-${name}`;
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-sm font-medium">{label}{required && <span className="text-red"> *</span>}</label>
      <select id={id} name={name} required={required} defaultValue={defaultValue ?? ""} aria-invalid={!!error} aria-describedby={error ? `${id}-e` : undefined} className={input}>
        <option value="" disabled>Select…</option>
        {options.map(([v, l]) => <option key={v} value={v} className="bg-ink">{l}</option>)}
      </select>
      {error && <p id={`${id}-e`} className="text-xs text-red" role="alert">{error}</p>}
    </div>
  );
}

export function TextArea({ name, label, error, required, className, ...rest }: Base & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = `f-${name}`;
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-sm font-medium">{label}{required && <span className="text-red"> *</span>}</label>
      <textarea id={id} name={name} required={required} rows={5} aria-invalid={!!error} aria-describedby={error ? `${id}-e` : undefined} className={input} {...rest} />
      {error && <p id={`${id}-e`} className="text-xs text-red" role="alert">{error}</p>}
    </div>
  );
}

/** Hidden honeypot for bots */
export const Honeypot = () => (
  <div aria-hidden className="absolute left-[-9999px]"><label>Company<input name="company" tabIndex={-1} autoComplete="off" /></label></div>
);

export function FormStatus({ state }: { state: { ok: boolean; message: string } | null }) {
  if (!state) return null;
  return <p role="status" className={cn("rounded-xl px-4 py-3 text-sm", state.ok ? "bg-gold/15 text-gold-soft" : "bg-red/15 text-red")}>{state.message}</p>;
}
