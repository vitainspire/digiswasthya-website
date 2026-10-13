/**
 * healthServices.ts — Official Government of India health services and trusted guides
 * listed on the Health Tools page. Link only to the official source; do not re-host
 * government or ICMR-NIN documents.
 *
 * USED BY:
 *   - src/app/health-tools/HealthToolsClient.tsx
 */

import type { LocalizedString } from "@/data/impactData";

export type HealthServiceIcon = "card" | "id" | "video" | "syringe" | "mind" | "quit";

export interface HealthService {
    icon: HealthServiceIcon;
    name: LocalizedString;
    description: LocalizedString;
    /** Official website, opened in a new tab. */
    href?: string;
    /** Toll-free helpline number as officially written, shown as a tap-to-call link. */
    phone?: string;
}

export const healthServices: HealthService[] = [
    {
        icon: "card",
        name: { en: "Ayushman Bharat (PM-JAY) card", hi: "आयुष्मान भारत (PM-JAY) कार्ड" },
        description: {
            en: "Check if your family is eligible for free hospital treatment of up to ₹5 lakh a year.",
            hi: "देखें कि क्या आपका परिवार हर साल ₹5 लाख तक के मुफ़्त अस्पताल इलाज का पात्र है।",
        },
        href: "https://beneficiary.nha.gov.in/",
        phone: "14555",
    },
    {
        icon: "id",
        name: { en: "ABHA health ID", hi: "ABHA स्वास्थ्य आईडी" },
        description: {
            en: "Create your free digital health ID to keep your health records in one place.",
            hi: "अपने सभी स्वास्थ्य रिकॉर्ड एक जगह रखने के लिए अपनी मुफ़्त डिजिटल स्वास्थ्य आईडी बनाएँ।",
        },
        href: "https://abha.abdm.gov.in/",
    },
    {
        icon: "video",
        name: { en: "eSanjeevani", hi: "ई-संजीवनी" },
        description: {
            en: "Free video consultation with a government doctor from your phone.",
            hi: "अपने फ़ोन से सरकारी डॉक्टर से मुफ़्त वीडियो परामर्श।",
        },
        href: "https://esanjeevani.mohfw.gov.in/",
    },
    {
        icon: "syringe",
        name: { en: "U-WIN vaccination records", hi: "U-WIN टीकाकरण रिकॉर्ड" },
        description: {
            en: "Register and track vaccinations for pregnant women and children.",
            hi: "गर्भवती महिलाओं और बच्चों के टीकाकरण का पंजीकरण करें और रिकॉर्ड देखें।",
        },
        href: "https://uwin.mohfw.gov.in/",
    },
    {
        icon: "mind",
        name: { en: "Tele-MANAS mental health helpline", hi: "टेली-मानस मानसिक स्वास्थ्य हेल्पलाइन" },
        description: {
            en: "Free, confidential support for stress, anxiety or low mood, 24 hours a day.",
            hi: "तनाव, चिंता या उदासी के लिए मुफ़्त और गोपनीय सहायता, 24 घंटे।",
        },
        phone: "14416",
    },
    {
        icon: "quit",
        name: { en: "National Tobacco Quit Line", hi: "राष्ट्रीय तंबाकू छोड़ो हेल्पलाइन" },
        description: {
            en: "Free counselling to help you stop smoking, gutkha or khaini.",
            hi: "धूम्रपान, गुटखा या खैनी छोड़ने में मदद के लिए मुफ़्त परामर्श।",
        },
        phone: "1800 112 356",
    },
];

export interface HealthGuide {
    title: LocalizedString;
    source: LocalizedString;
    description: LocalizedString;
    href: LocalizedString;
}

export const healthGuides: HealthGuide[] = [
    {
        title: { en: "Dietary Guidelines for Indians (2024)", hi: "भारतीयों के लिए आहार दिशानिर्देश (2024)" },
        source: { en: "ICMR-National Institute of Nutrition", hi: "ICMR-राष्ट्रीय पोषण संस्थान" },
        description: {
            en: "Includes \"My Plate for the Day\", the official picture guide to a balanced Indian meal.",
            hi: "इसमें \"माई प्लेट फ़ॉर द डे\" शामिल है, संतुलित भारतीय भोजन की आधिकारिक चित्र गाइड।",
        },
        href: {
            en: "https://www.nin.res.in/dietaryguidelines/pdfjs/locale/DGI24thJune2024fin.pdf",
            hi: "https://www.nin.res.in/dietaryguidelines/pdfjs/locale/DGI24thJune2024fin.pdf",
        },
    },
    {
        title: { en: "Mother and Child Protection Card", hi: "मातृ एवं शिशु सुरक्षा कार्ड (MCP कार्ड)" },
        source: { en: "Ministry of Health and Family Welfare", hi: "स्वास्थ्य एवं परिवार कल्याण मंत्रालय" },
        description: {
            en: "Pregnancy care, child growth charts, feeding advice and the vaccination record in one card.",
            hi: "गर्भावस्था देखभाल, बच्चे का विकास चार्ट, आहार सलाह और टीकाकरण रिकॉर्ड, सब एक कार्ड में।",
        },
        href: {
            en: "https://hbnc-hbyc.mohfw.gov.in/assets/document/Revised%20India%20MCP%20Card%20English_(28-05-2018).pdf",
            hi: "https://iec.unicef.in/document/mother-and-child-protection-card",
        },
    },
    {
        title: { en: "Child Growth Standards", hi: "बाल विकास मानक" },
        source: { en: "World Health Organization", hi: "विश्व स्वास्थ्य संगठन" },
        description: {
            en: "Height and weight charts to check if a child under 5 is growing well.",
            hi: "5 साल से कम उम्र का बच्चा ठीक से बढ़ रहा है या नहीं, यह जाँचने के लिए लंबाई और वज़न चार्ट।",
        },
        href: {
            en: "https://www.who.int/tools/child-growth-standards/standards",
            hi: "https://www.who.int/tools/child-growth-standards/standards",
        },
    },
];
