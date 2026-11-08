import type { Faq as F } from "@/lib/types";

/** Native <details> accordion: keyboard + screen-reader friendly out of the box. */
export default function Faq({ items }: { items: F[] }) {
  return (
    <div className="divide-y divide-line rounded-[var(--radius)] border border-line">
      {items.map((f) => (
        <details key={f._id} className="group p-5 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold">
            {f.question}
            <span aria-hidden className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line text-gold transition group-open:rotate-45">+</span>
          </summary>
          <p className="mt-3 text-muted">{f.answer}</p>
        </details>
      ))}
    </div>
  );
}
