import type { Metadata } from "next";
import TermsClient from "./TermsClient";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "Terms and conditions for using the DigiSwasthya Foundation website and services.",
  alternates: { canonical: "/terms-and-conditions" },
  robots: { index: true, follow: true },
};

export default function TermsAndConditions() {
  return <TermsClient />;
}
