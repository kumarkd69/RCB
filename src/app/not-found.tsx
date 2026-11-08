import Link from "next/link";

export default function RootNotFound() {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", textAlign: "center" }}>
      <div>
        <h1 className="display text-6xl text-red">404</h1>
        <p className="mt-2 text-muted">Page not found.</p>
        <Link href="/" className="mt-6 inline-block text-gold underline">Go home</Link>
      </div>
    </main>
  );
}
