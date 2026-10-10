"use client";

import { useState } from "react";
import { Globe, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

const languages = [
    { code: "en", name: "English" },
    { code: "hi", name: "Hindi (हिंदी)" },
];

export function TranslationWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const { language, setLanguage, t } = useLanguage();

    const handleLanguageChange = (langCode: string) => {
        setLanguage(langCode);
        setIsOpen(false);
    };

    return (
        <div className="fixed bottom-20 left-4 md:bottom-6 md:left-6 z-40 flex flex-col items-start">
            {isOpen && (
                <div className="mb-3 w-48 sm:w-56 rounded-2xl sm:rounded-[1.5rem] border-2 sm:border-4 border-white bg-white/95 backdrop-blur-md shadow-2xl overflow-hidden max-h-[60vh] overflow-y-auto animate-in fade-in slide-in-from-bottom-5 duration-300 ring-1 ring-black/5">
                    <div className="px-4 py-3 sm:px-5 sm:py-4 bg-primary-600 text-white font-bold text-[11px] sm:text-xs uppercase tracking-widest text-center border-b border-white/10">
                        {t("common.selectLanguage")}
                    </div>
                    <div className="p-1.5 sm:p-2 space-y-1">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => handleLanguageChange(lang.code)}
                                className={cn(
                                    "flex w-full items-center justify-between px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm rounded-xl transition-all duration-200",
                                    language === lang.code
                                        ? "bg-primary-600 text-white font-bold shadow-md scale-[1.02]"
                                        : "text-gray-700 hover:bg-primary-50 hover:text-primary-700 font-medium"
                                )}
                            >
                                {lang.name}
                                {language === lang.code && <Check className="h-4 w-4 text-white" />}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex items-center gap-2 sm:gap-3">
                <Button
                    variant="primary"
                    size="icon"
                    className="h-11 w-11 sm:h-14 sm:w-14 rounded-full shadow-[0_6px_20px_rgba(0,0,0,0.15)] bg-primary-600 hover:bg-primary-700 hover:scale-105 active:scale-95 transition-all duration-200 border-2 sm:border-3 border-white"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Change language"
                >
                    <Globe className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </Button>

                {/* Text badge — visible on tablets & desktops, hidden on small mobile to keep screen clear */}
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="hidden sm:flex bg-white/95 backdrop-blur-md text-primary-900 text-xs sm:text-sm font-bold px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-2xl shadow-lg border border-primary-100 items-center gap-2"
                >
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    {languages.find(l => l.code === language)?.name}
                </motion.div>
            </div>
        </div>
    );
}
