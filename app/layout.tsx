import { Anton, Manrope, Syne, Dancing_Script } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { srLatn } from "@/lib/clerk-localization";
import { hasClerkKeys } from "@/lib/clerk-config";
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
  const body = (
    <html
      lang="sr-Latn"
      suppressHydrationWarning
      className={`${anton.variable} ${manrope.variable} ${syne.variable} ${dancingScript.variable} h-full`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body className="min-h-full bg-background text-on-background font-body-md overflow-x-hidden">
        {children}
      </body>
    </html>
  );

  if (hasClerkKeys()) {
    return <ClerkProvider localization={srLatn}>{body}</ClerkProvider>;
  }

  return body;
}
