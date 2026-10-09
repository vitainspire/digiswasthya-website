import type { Metadata } from "next";
import WhatsAppPrivacyClient from "./WhatsAppPrivacyClient";

export const metadata: Metadata = {
  title: "WhatsApp Messaging & Data Privacy Policy",
  description: "How DigiSwasthya Foundation uses WhatsApp to send appointment reminders, prescriptions, and access to patient health records.",
  alternates: { canonical: "/whatsapp-privacy-policy" },
  robots: { index: true, follow: true },
};

export default function WhatsAppPrivacyPolicy() {
  return <WhatsAppPrivacyClient />;
}
