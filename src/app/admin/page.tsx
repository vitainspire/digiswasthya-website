import type { Metadata } from "next";
import AdminClient from "./AdminClient";

export const metadata: Metadata = {
  title: "Staff Portal",
  description: "DigiSwasthya Foundation staff portal.",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminClient />;
}
