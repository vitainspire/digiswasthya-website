import type { Metadata } from "next";
import HomeClient from "./HomeClient";
import { ogImages } from "@/lib/seo";

export const metadata: Metadata = {
  title: "DigiSwasthya Foundation | Telemedicine for Rural India",
  description:
    "DigiSwasthya connects rural and underserved communities across India to doctors through telemedicine, health camps, and community outreach. Donate, volunteer, or find care near you.",
  alternates: { canonical: "/" },
  openGraph: {
    images: ogImages,
    title: "DigiSwasthya Foundation | Telemedicine for Rural India",
    description:
      "DigiSwasthya connects rural and underserved communities across India to doctors through telemedicine, health camps, and community outreach.",
    url: "/",
  },
};

export default function Home() {
  return <HomeClient />;
}
