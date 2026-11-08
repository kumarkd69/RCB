import type { Metadata, Viewport } from "next";
import { Anton, Inter, Noto_Sans_Kannada } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { site } from "@/lib/config";

const anton = Anton({ subsets: ["latin"], weight: "400", variable: "--font-anton", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const kannada = Noto_Sans_Kannada({ subsets: ["kannada"], weight: ["400", "700"], variable: "--font-kannada", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — RCB Fan Club`, template: `%s | ${site.shortName}` },
  description: site.description,
  openGraph: { type: "website", siteName: site.name, locale: "en_IN" },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#0A0A0A", colorScheme: "dark" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" suppressHydrationWarning className={`${anton.variable} ${inter.variable} ${kannada.variable}`}>
      <head>
        {/* Hide the intro loader before first paint on repeat visits */}
        <script dangerouslySetInnerHTML={{ __html: `try{if(sessionStorage.getItem("nrh-intro"))document.documentElement.classList.add("intro-seen")}catch(e){}` }} />
        <noscript><style>{`.intro-loader,.page-curtain{display:none!important}`}</style></noscript>
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
