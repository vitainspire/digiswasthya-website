"use client";

import { useLanguage } from "@/context/LanguageContext";

const OPTIONS = [
    { code: "en", label: "EN", name: "English" },
    { code: "hi", label: "हिं", name: "हिंदी" },
];

export function LanguageSwitcher() {
    const { language, setLanguage } = useLanguage();

    return (
        <div role="group" aria-label="Language" className="inline-flex overflow-hidden rounded-full border border-primary-200 bg-white text-sm font-semibold">
            {OPTIONS.map((option) => (
                <button
                    key={option.code}
                    type="button"
                    lang={option.code}
                    title={option.name}
                    aria-pressed={language === option.code}
                    onClick={() => setLanguage(option.code)}
                    className={`px-3 py-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-600 ${
                        language === option.code ? "bg-primary-600 text-white" : "text-primary-800 hover:bg-primary-50"
                    }`}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
}
