"use client";
import { useActionState } from "react";
import { submitChapter, submitContact, submitMembership, type FormState } from "@/actions/forms";
import { Field, FormStatus, Honeypot, SelectField, TextArea } from "./Field";
import MagneticButton from "../ui/MagneticButton";

type Opt = [string, string][];

export function MembershipForm({ chapters }: { chapters: Opt }) {
  const [state, action, pending] = useActionState<FormState, FormData>(submitMembership, null);
  if (state?.ok) return <FormStatus state={state} />;
  const e = state?.errors ?? {};
  return (
    <form action={action} className="relative grid gap-4 md:grid-cols-2" noValidate>
      <Honeypot />
      <Field name="name" label="Full name" autoComplete="name" required error={e.name} />
      <Field name="phone" label="Phone (WhatsApp)" type="tel" autoComplete="tel" inputMode="tel" placeholder="+91" required error={e.phone} />
      <Field name="email" label="Email" type="email" autoComplete="email" required error={e.email} />
      <Field name="city" label="City" autoComplete="address-level2" required error={e.city} />
      <SelectField name="chapter" label="Chapter" required error={e.chapter} options={[...chapters, ["hq", "HQ / Bengaluru"], ["none", "No chapter near me"]]} />
      <Field name="instagram" label="Instagram handle" placeholder="@yourhandle" />
      <div className="md:col-span-2 flex flex-col gap-3">
        <FormStatus state={state} />
        <MagneticButton type="submit" size="lg" disabled={pending}>{pending ? "Sending…" : "Join the Army"}</MagneticButton>
      </div>
    </form>
  );
}

export function ContactForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(submitContact, null);
  if (state?.ok) return <FormStatus state={state} />;
  const e = state?.errors ?? {};
  return (
    <form action={action} className="relative grid gap-4 md:grid-cols-2" noValidate>
      <Honeypot />
      <SelectField name="type" label="Topic" required error={e.type} defaultValue="general" options={[["general", "General"], ["sponsorship", "Sponsorship"], ["media", "Media"], ["collaboration", "Collaboration"]]} />
      <Field name="name" label="Name" autoComplete="name" required error={e.name} />
      <Field name="email" label="Email" type="email" autoComplete="email" required error={e.email} />
      <Field name="phone" label="Phone (optional)" type="tel" autoComplete="tel" />
      <TextArea name="message" label="Message" required error={e.message} className="md:col-span-2" />
      <div className="md:col-span-2 flex flex-col gap-3">
        <FormStatus state={state} />
        <MagneticButton type="submit" variant="gold" disabled={pending}>{pending ? "Sending…" : "Send message"}</MagneticButton>
      </div>
    </form>
  );
}

export function ChapterForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(submitChapter, null);
  if (state?.ok) return <FormStatus state={state} />;
  const e = state?.errors ?? {};
  return (
    <form action={action} className="relative grid gap-4 md:grid-cols-2" noValidate>
      <Honeypot />
      <Field name="name" label="Your name" autoComplete="name" required error={e.name} />
      <Field name="city" label="City / town" required error={e.city} />
      <Field name="phone" label="Phone (WhatsApp)" type="tel" autoComplete="tel" required error={e.phone} />
      <Field name="email" label="Email" type="email" autoComplete="email" required error={e.email} />
      <TextArea name="why" label="How many fans could you bring together?" className="md:col-span-2" />
      <div className="md:col-span-2 flex flex-col gap-3">
        <FormStatus state={state} />
        <MagneticButton type="submit" disabled={pending}>{pending ? "Sending…" : "Start a chapter"}</MagneticButton>
      </div>
    </form>
  );
}
