/**
 * registrations.ts — Statutory registration numbers and transparency documents.
 *
 * USED BY:
 *   - src/app/partner/PartnerClient.tsx
 */

import type { LocalizedString } from "@/data/impactData";
import { websiteConfig } from "@/data/websiteConfig";

export const registrations: { label: LocalizedString; value: string }[] = [
    { label: { en: "80G certificate number", hi: "80G प्रमाणपत्र संख्या" }, value: "AAICD5332R25LK02" },
    { label: { en: "CIN / NPO registration", hi: "CIN / NPO पंजीकरण" }, value: "U85300UP2021NPL146867" },
    { label: { en: "NGO Darpan ID", hi: "NGO दर्पण आईडी" }, value: "UP/2021/0291277" },
    { label: { en: "CSR Form 1", hi: "CSR फ़ॉर्म 1" }, value: "CSR00016240" },
];

export const transparencyDocs: { label: LocalizedString; href: string }[] = [
    { label: { en: "Annual reports", hi: "वार्षिक रिपोर्ट" }, href: websiteConfig.annualReportsUrl },
    { label: { en: "Audited balance sheets", hi: "अंकेक्षित बैलेंस शीट" }, href: websiteConfig.balanceSheetsUrl },
];
