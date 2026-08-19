import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Freespin — платформа розыгрышей",
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
        className={`${inter.variable} ${robotoMono.variable} font-sans antialiased bg-base-950 bg-grid-glow min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
