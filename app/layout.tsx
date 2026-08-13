import type { Metadata, Viewport } from "next";
import {
  Archivo,
  Instrument_Serif,
  Jost,
  Playfair_Display,
} from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-grotesk",
  display: "swap",
});

/* The hero statement's face. The reference sets that headline in a monoline
   geometric sans — circular O, zero stroke contrast — which the site's
   neo-grotesque cannot imitate. Jost is the closest freely-licensed
   geometric of that class. */
const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400"],
  variable: "--font-geo",
  display: "swap",
});

/* The closing wordmark's face. The reference (normalisboring.es) sets its
   giant footer word in an ultra-bold high-contrast serif whose R has a
   straight splayed leg on a flat foot serif — Playfair Display at 900 is the
   closest freely-licensed cut of that drawing. (Bodoni Moda's R curls into a
   footless tail, which is wrong for the mark and reads badly elongated.) */
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["900"],
  variable: "--font-brand",
  display: "swap",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-edit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Orkay Tiles — From Walls to Beyond",
  description:
    "Since 1996, Orkay Tiles has manufactured ceramic wall tiles, digital porcelain tiles, glazed vitrified tiles and porcelain slabs in Morbi, Gujarat, India.",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${instrument.variable} ${jost.variable} ${playfair.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
