import { Suspense } from "react";
import type { Metadata } from "next";
import DonateClient from "./DonateClient";
import { ogImages } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Donate",
  description:
    "Support DigiSwasthya Foundation's telemedicine work in rural India. Donate via UPI or card — contributions are eligible for 80G tax exemption.",
  alternates: { canonical: "/donate" },
  openGraph: {
    images: ogImages,
    title: "Donate | DigiSwasthya Foundation",
    description:
      "Support telemedicine access for rural India. Donations are eligible for 80G tax exemption.",
    url: "/donate",
  },
};

export default function DonatePage() {
  return (
    <Suspense>
      <DonateClient />
    </Suspense>
  );
}
