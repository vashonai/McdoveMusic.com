import type { Metadata } from "next";
import { Archivo, JetBrains_Mono, Manrope } from "next/font/google";
import Dock from "@/components/Dock";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import "./globals.css";

/* Three jobs: Archivo displays, Manrope reads, JetBrains Mono is for data —
   BPM, keys, prices, timecodes. Mono on data is what makes the metadata
   read like a DAW display instead of body copy. */
const archivo = Archivo({ subsets: ["latin"], weight: ["500", "600", "700", "800", "900"], variable: "--font-archivo", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-manrope", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-jetbrains", display: "swap" });

export const metadata: Metadata = {
  title: "McDoveMusic — Find your sound",
  description: "Premium riddims and instrumentals for artists ready to make their next record. Every one built by McDove.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${manrope.variable} ${jetbrains.variable}`}>
      <body>
        <Nav />
        <main>{children}</main>
        <Footer />
        {/* The transport sits outside the route tree so navigation never
            interrupts playback. */}
        <Dock />
      </body>
    </html>
  );
}
