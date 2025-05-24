import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import { CircuitProvider } from "@/context/CircuitContext";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Novus",
  description: "An electrical app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} antialiased`}>
        <CircuitProvider>{children}</CircuitProvider>
      </body>
    </html>
  );
}
