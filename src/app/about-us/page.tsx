import type { Metadata } from "next";
import AboutUsClient from "./AboutUsClient";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn how DigiSwasthya Foundation started, the founder's story, and our mission to bring affordable telemedicine and healthcare access to rural India.",
  alternates: { canonical: "/about-us" },
  openGraph: {
    title: "About Us | DigiSwasthya Foundation",
    description:
      "Learn how DigiSwasthya Foundation started and our mission to bring affordable telemedicine to rural India.",
    url: "/about-us",
  },
};

export default function AboutUs() {
  return <AboutUsClient />;
}
