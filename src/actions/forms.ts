"use server";
import { Resend } from "resend";

export type FormState = { ok: boolean; message: string; errors?: Record<string, string> } | null;

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const PHONE = /^[+\d][\d\s-]{8,14}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function read(fd: FormData, keys: string[]) {
  return Object.fromEntries(keys.map((k) => [k, String(fd.get(k) ?? "").trim().slice(0, 2000)])) as Record<string, string>;
}

async function send(subject: string, data: Record<string, string>, replyTo?: string) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.FORMS_TO_EMAIL;
  const from = process.env.FORMS_FROM_EMAIL || "Namma RCB HQ <onboarding@resend.dev>";
  const html = `<h2>${esc(subject)}</h2><table cellpadding="6">${Object.entries(data).map(([k, v]) => `<tr><td><b>${esc(k)}</b></td><td>${esc(v)}</td></tr>`).join("")}</table>`;
  if (!key || !to) {
    console.warn("[forms] RESEND_API_KEY / FORMS_TO_EMAIL not set. Submission:", subject, data);
    return process.env.NODE_ENV !== "production"; // succeed in dev so the flow can be tested
  }
  const { error } = await new Resend(key).emails.send({ from, to: to.split(",").map((s) => s.trim()), subject, html, replyTo });
  if (error) { console.error("[forms] resend error", error); return false; }
  return true;
}

const fail = (errors: Record<string, string>): FormState => ({ ok: false, message: "Please fix the highlighted fields.", errors });

export async function submitMembership(_: FormState, fd: FormData): Promise<FormState> {
  if (fd.get("company")) return { ok: true, message: "Thanks!" }; // honeypot
  const d = read(fd, ["name", "phone", "email", "city", "chapter", "instagram"]);
  const errors: Record<string, string> = {};
  if (d.name.length < 2) errors.name = "Please enter your name.";
  if (!PHONE.test(d.phone)) errors.phone = "Enter a valid phone number.";
  if (!EMAIL.test(d.email)) errors.email = "Enter a valid email.";
  if (!d.city) errors.city = "Which city are you in?";
  if (!d.chapter) errors.chapter = "Pick a chapter.";
  if (Object.keys(errors).length) return fail(errors);
  const ok = await send(`New member: ${d.name} (${d.chapter})`, d, d.email);
  return ok ? { ok: true, message: `Welcome to the army, ${d.name.split(" ")[0]}! Your chapter lead will reach out on WhatsApp soon.` } : { ok: false, message: "Something went wrong. Please try again or DM us on Instagram." };
}

export async function submitContact(_: FormState, fd: FormData): Promise<FormState> {
  if (fd.get("company")) return { ok: true, message: "Thanks!" };
  const d = read(fd, ["type", "name", "email", "phone", "message"]);
  const errors: Record<string, string> = {};
  if (!["general", "sponsorship", "media", "collaboration"].includes(d.type)) errors.type = "Pick a topic.";
  if (d.name.length < 2) errors.name = "Please enter your name.";
  if (!EMAIL.test(d.email)) errors.email = "Enter a valid email.";
  if (d.message.length < 10) errors.message = "Tell us a little more (10+ characters).";
  if (Object.keys(errors).length) return fail(errors);
  const ok = await send(`[${d.type}] message from ${d.name}`, d, d.email);
  return ok ? { ok: true, message: "Message sent. We usually reply within 2 days." } : { ok: false, message: "Something went wrong. Please try again." };
}

export async function submitChapter(_: FormState, fd: FormData): Promise<FormState> {
  if (fd.get("company")) return { ok: true, message: "Thanks!" };
  const d = read(fd, ["name", "phone", "email", "city", "why"]);
  const errors: Record<string, string> = {};
  if (d.name.length < 2) errors.name = "Please enter your name.";
  if (!PHONE.test(d.phone)) errors.phone = "Enter a valid phone number.";
  if (!EMAIL.test(d.email)) errors.email = "Enter a valid email.";
  if (!d.city) errors.city = "Which city?";
  if (Object.keys(errors).length) return fail(errors);
  const ok = await send(`New chapter request: ${d.city}`, d, d.email);
  return ok ? { ok: true, message: `Love it! We'll call you about starting a ${d.city} chapter.` } : { ok: false, message: "Something went wrong. Please try again." };
}
