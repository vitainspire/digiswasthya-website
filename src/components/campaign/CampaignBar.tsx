"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Footprints, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { countdownLabel, useCampaignPromoted, useDaysToRace } from "./useCampaign";

const DISMISS_KEY = "ds-marathon-bar-dismissed";
const listeners = new Set<() => void>();
// Fallback for when storage is blocked, so the close button still works for this visit.
let dismissedThisVisit = false;

function subscribe(onChange: () => void) {
    listeners.add(onChange);
    window.addEventListener("storage", onChange);
    return () => {
        listeners.delete(onChange);
        window.removeEventListener("storage", onChange);
    };
}

function isDismissed() {
    if (dismissedThisVisit) return true;
    try {
        return localStorage.getItem(DISMISS_KEY) === "1";
    } catch {
        return false;
    }
}

function dismiss() {
    dismissedThisVisit = true;
    try {
        localStorage.setItem(DISMISS_KEY, "1");
    } catch {
        // Storage blocked; the bar stays hidden until the next visit.
    }
    listeners.forEach((listener) => listener());
}

export function CampaignBar() {
    const { t } = useLanguage();
    const pathname = usePathname() ?? "/";
    const promoted = useCampaignPromoted();
    const dismissed = useSyncExternalStore(subscribe, isDismissed, () => false);
    const days = useDaysToRace();

    if (!promoted || dismissed || pathname.startsWith("/marathon") || pathname.startsWith("/admin")) return null;

    return (
        <div className="relative bg-secondary-400 text-primary-950">
            <div className="container flex items-center justify-center gap-3 py-2.5 pl-4 pr-12 text-sm sm:text-base">
                <Footprints className="hidden h-5 w-5 shrink-0 sm:block" aria-hidden="true" />
                <p className="text-center leading-snug">
                    <span className="font-semibold">{t("campaign.barText")}</span>
                    {days !== null && <span className="ml-2 whitespace-nowrap">({countdownLabel(days, t)})</span>}{" "}
                    <Link
                        href="/marathon"
                        className="whitespace-nowrap font-bold underline underline-offset-4 hover:text-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-900"
                    >
                        {t("campaign.barCta")}
                    </Link>
                </p>
            </div>
            <button
                type="button"
                onClick={dismiss}
                aria-label={t("campaign.dismiss")}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 transition-colors hover:bg-secondary-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-900"
            >
                <X className="h-4 w-4" aria-hidden="true" />
            </button>
        </div>
    );
}
