import type { Metadata } from "next";
import { Inter, Roboto_Mono, Unbounded } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
  display: "swap",
});

// Логотип Rafflix и брендовые заголовки — см. components/ui/Logo.tsx
const unbounded = Unbounded({
  subsets: ["latin"],
  weight: ["800", "900"],
  variable: "--font-unbounded",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rafflix — платформа розыгрышей",
  description:
    "Создавайте стильные розыгрыши физических и цифровых призов. Бесплатные шаблоны или полный кастомный брендинг.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className="dark">
      <body
        className={`${inter.variable} ${robotoMono.variable} ${unbounded.variable} font-sans antialiased bg-base-950 bg-grid-glow min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
