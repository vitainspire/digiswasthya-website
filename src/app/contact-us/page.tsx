import type { Metadata } from "next";
import ContactUsClient from "./ContactUsClient";
import { ogImages } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with DigiSwasthya Foundation for healthcare help or general questions, ask about supporting rural healthcare, or request to join our network of doctors.",
  alternates: { canonical: "/contact-us" },
  openGraph: {
    images: ogImages,
    title: "Contact Us | DigiSwasthya Foundation",
    description: "Get healthcare help, support rural healthcare as a donor, or join our network of volunteer doctors.",
    url: "/contact-us",
  },
};

export default function ContactUs() {
  return <ContactUsClient />;
}
