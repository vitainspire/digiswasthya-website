"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const HIDDEN_ON = ["/donate", "/admin"];

export function MobileDonateBar() {
    const pathname = usePathname();
    const { t } = useLanguage();

    if (HIDDEN_ON.some((path) => pathname.startsWith(path))) return null;

    return (
        <>
            <div className="h-16 md:hidden" aria-hidden="true" />
            <div className="fixed inset-x-0 bottom-0 z-30 flex h-16 items-center justify-between gap-3 border-t border-primary-100 bg-white/95 px-4 shadow-[0_-4px_16px_rgba(0,43,40,0.08)] backdrop-blur md:hidden">
                <p className="text-sm font-medium leading-tight text-primary-900">
                    {t("donateBar.text")}
                </p>
                <Link
                    href="/donate"
                    className="inline-flex shrink-0 items-center gap-2 rounded-full bg-secondary-400 px-5 py-2.5 text-sm font-bold text-primary-950 shadow-sm transition-colors hover:bg-secondary-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
                >
                    <Heart className="h-4 w-4 fill-current" aria-hidden="true" />
                    {t("nav.donate")}
                </Link>
            </div>
        </>
    );
}
