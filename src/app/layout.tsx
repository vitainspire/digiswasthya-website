import type { Metadata } from "next";
import { DM_Sans, Lora } from "next/font/google";
import { AccessibilityToolbar } from "@/components/features/AccessibilityToolbar";
import { TranslationWidget } from "@/components/ai/TranslationWidget";
import ChatBot from "@/components/chat/ChatBot";
import { MilestoneManager } from "@/components/milestones/MilestoneManager";
import "./globals.css";

import { LanguageProvider } from "@/context/LanguageContext";

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-sans" });
const lora = Lora({ subsets: ["latin"], variable: "--font-serif" });

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://digiswasthya.org";
const defaultTitle = "DigiSwasthya Foundation | Accessible Healthcare";
const defaultDescription =
  "Making healthcare services affordable and accessible for rural communities across India by leveraging technology.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: "%s | DigiSwasthya Foundation",
  },
  description: defaultDescription,
  openGraph: {
    title: defaultTitle,
    description: defaultDescription,
    url: siteUrl,
    siteName: "DigiSwasthya Foundation",
    images: [{ url: "/images/digiswasthya-logo-hero.png", width: 1000, height: 1000, alt: "DigiSwasthya Foundation" }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: ["/images/digiswasthya-logo-hero.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${lora.variable} font-sans`}>
        <LanguageProvider>
          {children}
          <MilestoneManager />
          <AccessibilityToolbar />
          <TranslationWidget />
          <ChatBot />
        </LanguageProvider>
      </body>
    </html>
  );
}
