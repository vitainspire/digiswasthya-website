import type { Metadata } from "next";
import UnsubscribeClient from "./UnsubscribeClient";

export const metadata: Metadata = {
  title: "Unsubscribe",
  description: "Manage your DigiSwasthya Foundation email preferences.",
  robots: { index: false, follow: false },
};

export default function UnsubscribePage() {
  return <UnsubscribeClient />;
}
