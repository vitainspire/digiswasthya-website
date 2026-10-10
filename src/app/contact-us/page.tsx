import type { Metadata } from "next";
import ContactUsClient from "./ContactUsClient";
import { ogImages } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with DigiSwasthya Foundation — reach out for healthcare help, volunteering, partnerships, or general enquiries.",
  alternates: { canonical: "/contact-us" },
  openGraph: {
    images: ogImages,
    title: "Contact Us | DigiSwasthya Foundation",
    description: "Reach out to DigiSwasthya Foundation for healthcare help, volunteering, or partnerships.",
    url: "/contact-us",
  },
};

export default function ContactUs() {
  return <ContactUsClient />;
}
