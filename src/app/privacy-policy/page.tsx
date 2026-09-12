import type { Metadata } from "next";
import PrivacyPolicyClient from "./PrivacyPolicyClient";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "DigiSwasthya Foundation's privacy policy — how we collect, use, and protect your personal information.",
  alternates: { canonical: "/privacy-policy" },
  robots: { index: true, follow: true },
};

export default function PrivacyPolicy() {
  return <PrivacyPolicyClient />;
}
