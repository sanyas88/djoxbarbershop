import { Anton, Manrope, Syne, Dancing_Script } from "next/font/google";
import "./globals.css";

const anton = Anton({
  weight: "400",
  subsets: ["latin", "latin-ext"],
  variable: "--font-anton",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  variable: "--font-manrope",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin", "latin-ext"],
  variable: "--font-syne",
  display: "swap",
});

const dancingScript = Dancing_Script({
  subsets: ["latin", "latin-ext"],
  variable: "--font-dancing",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="sr-Latn"
      suppressHydrationWarning
      className={`${anton.variable} ${manrope.variable} ${syne.variable} ${dancingScript.variable} h-full`}
    >
      <body className="min-h-full bg-background text-on-background font-body-md overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
