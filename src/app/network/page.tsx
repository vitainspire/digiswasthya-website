import type { Metadata } from "next";
import NetworkClient from "./NetworkClient";

export const metadata: Metadata = {
  title: "Find Care Near You",
  description:
    "DigiSwasthya runs technology-enabled telemedicine centres across India, bringing specialist doctors and essential diagnostics within reach of rural families. Find your nearest centre.",
  alternates: { canonical: "/network" },
  openGraph: {
    title: "Find Care Near You | DigiSwasthya Foundation",
    description: "Find your nearest DigiSwasthya telemedicine centre across rural India.",
    url: "/network",
  },
};

export default function NetworkPage() {
  return <NetworkClient />;
}
