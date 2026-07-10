import type { Metadata } from "next";
import { bethEllen, testType02, ppMono } from "@/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gulim Askar",
  description: "Gulim Askar — multimedia artist and illustrator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bethEllen.variable} ${testType02.variable} ${ppMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
