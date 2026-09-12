import type { Metadata } from "next";
import HealthToolsClient from "./HealthToolsClient";

export const metadata: Metadata = {
  title: "Health Tools",
  description:
    "Free health tools from DigiSwasthya Foundation, including a BMI calculator, to help you take informed steps toward better health.",
  alternates: { canonical: "/health-tools" },
  openGraph: {
    title: "Health Tools | DigiSwasthya Foundation",
    description: "Free health tools, including a BMI calculator, from DigiSwasthya Foundation.",
    url: "/health-tools",
  },
};

export default function HealthToolsPage() {
  return <HealthToolsClient />;
}
