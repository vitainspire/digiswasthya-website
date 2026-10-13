import type { Metadata } from "next";
import PartnerClient from "./PartnerClient";
import { ogImages } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Partner With Us",
  description:
    "Partner with DigiSwasthya Foundation as a CSR team, foundation or impact investor. Sponsor a telemedicine centre, fund a screening campaign, or help us scale rural primary healthcare.",
  alternates: { canonical: "/partner" },
  openGraph: {
    images: ogImages,
    title: "Partner With Us | DigiSwasthya Foundation",
    description: "Sponsor a centre, fund a screening campaign, or help scale rural primary healthcare in India.",
    url: "/partner",
  },
};

export default function PartnerPage() {
  return <PartnerClient />;
}
