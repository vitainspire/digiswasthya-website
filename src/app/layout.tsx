import type { Metadata } from "next";
import { DM_Sans, Lora } from "next/font/google";
import { AccessibilityToolbar } from "@/components/features/AccessibilityToolbar";
import { CampaignBar } from "@/components/campaign/CampaignBar";
import ChatBot from "@/components/chat/ChatBot";
import { MotionProvider } from "@/components/layout/MotionProvider";
import { MobileDonateBar } from "@/components/layout/MobileDonateBar";
import { MilestoneManager } from "@/components/milestones/MilestoneManager";
import "./globals.css";

import { LanguageProvider } from "@/context/LanguageContext";
import { ogImages } from "@/lib/seo";
import { websiteConfig } from "@/data/websiteConfig";

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });
const lora = Lora({ subsets: ["latin"], variable: "--font-lora" });

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
    images: ogImages,
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: [ogImages[0].url],
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "NGO",
  name: "DigiSwasthya Foundation",
  url: siteUrl,
  logo: `${siteUrl}/images/digiswasthya-logo-hero.png`,
  description: defaultDescription,
  email: websiteConfig.supportEmail,
  telephone: websiteConfig.supportPhone,
  identifier: "U85300UP2021NPL146867",
  address: {
    "@type": "PostalAddress",
    streetAddress: "A-711, 7th Floor, Anthurium Office Spaces, Noida Sector 73",
    addressLocality: "Noida",
    addressRegion: "Uttar Pradesh",
    postalCode: "201301",
    addressCountry: "IN",
  },
  sameAs: websiteConfig.socialLinks.map((link) => link.href),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${lora.variable} font-sans`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
        <LanguageProvider>
          <MotionProvider>
            <CampaignBar />
            {children}
            <MobileDonateBar />
            <MilestoneManager />
            <AccessibilityToolbar />
            <ChatBot />
          </MotionProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
