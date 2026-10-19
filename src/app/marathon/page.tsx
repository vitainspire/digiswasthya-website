import type { Metadata } from "next";
import MarathonClient from "./MarathonClient";
import { ogImages } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Run for Rural Health",
  description:
    "DigiSwasthya founder Sandeep Kumar, a childhood cancer survivor, is running the Tata Mumbai Marathon on 17 January 2027 to raise ₹2,50,000 for telemedicine in rural India. Support the run or share it.",
  alternates: { canonical: "/marathon" },
  openGraph: {
    images: ogImages,
    title: "Run with Sandeep for rural healthcare | DigiSwasthya Foundation",
    description: "Sandeep Kumar is running the Tata Mumbai Marathon to bring specialist healthcare closer to rural families. Support the run.",
    url: "/marathon",
  },
};

export default function Marathon() {
  return <MarathonClient />;
}
