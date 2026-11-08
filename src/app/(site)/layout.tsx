import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import MotionProvider from "@/components/layout/MotionProvider";
import Cursor from "@/components/layout/Cursor";
import { getChapters, getSettings } from "@/lib/data";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, chapters] = await Promise.all([getSettings(), getChapters()]);
  return (
    <MotionProvider>
      <div className="grain">
        <a href="#main" className="skip-link">Skip to content</a>
        <Nav logo={settings.logo} />
        <main id="main" tabIndex={-1} className="outline-none">{children}</main>
        <Footer settings={settings} chapters={chapters} />
        <Cursor />
      </div>
    </MotionProvider>
  );
}
