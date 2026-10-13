import type { Metadata } from "next";
import HealthToolsClient from "./HealthToolsClient";
import { ogImages } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Health Tools",
  description:
    "Free health tools from DigiSwasthya Foundation: a BMI calculator with Indian cut-offs, a diabetes and BP risk check based on the government CBAC checklist, and links to official government health services.",
  alternates: { canonical: "/health-tools" },
  openGraph: {
    images: ogImages,
    title: "Health Tools | DigiSwasthya Foundation",
    description: "A BMI calculator, a diabetes and BP risk check, and links to official government health services.",
    url: "/health-tools",
  },
};

export default function HealthToolsPage() {
  return <HealthToolsClient />;
}
