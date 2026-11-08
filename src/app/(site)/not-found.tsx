import MagneticButton from "@/components/ui/MagneticButton";

export default function NotFound() {
  return (
    <section className="container-x flex min-h-[80svh] flex-col items-center justify-center text-center">
      <p className="display text-[10rem] leading-none text-red drop-shadow-[0_0_40px_rgba(215,25,32,.6)]">404</p>
      <h1 className="display text-4xl">Edged behind. Page not found.</h1>
      <p className="mt-3 text-muted">This page went for a quick single and never came back.</p>
      <div className="mt-8"><MagneticButton href="/">Back to home</MagneticButton></div>
    </section>
  );
}
