"use client";

import { useState, useSyncExternalStore } from "react";
import { Check, Copy, MessageCircle, Share2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { impactData } from "@/data/impactData";
import { marathonCampaign } from "@/data/marathonCampaign";

function kpi(id: string) {
    return (impactData.kpis.find((k) => k.id === id)?.value ?? 0).toLocaleString("en-IN");
}

export function campaignShareMessage(t: (key: string) => string) {
    return t("campaign.shareMessage")
        .replace("{consultations}", kpi("total-consultations"))
        .replace("{villages}", kpi("villages-covered"))
        .replace("{camps}", kpi("health-camps"))
        .replace("{screenings}", kpi("cancer-screenings"))
        .replace("{url}", marathonCampaign.fundraiserUrl);
}

export function whatsappShareHref(t: (key: string) => string) {
    return `https://wa.me/?text=${encodeURIComponent(campaignShareMessage(t))}`;
}

const noSubscribe = () => () => {};

export function ShareCampaign() {
    const { t } = useLanguage();
    const [copied, setCopied] = useState(false);
    const canShare = useSyncExternalStore(noSubscribe, () => typeof navigator.share === "function", () => false);

    async function copyLink() {
        try {
            await navigator.clipboard.writeText(marathonCampaign.fundraiserUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        } catch {
            // Clipboard can be blocked; the link is still visible on the page to copy by hand.
        }
    }

    async function share() {
        try {
            await navigator.share({ title: t("campaign.pageHeading"), text: campaignShareMessage(t) });
        } catch {
            // Closing the share sheet rejects; nothing to do.
        }
    }

    const secondary =
        "inline-flex h-12 items-center justify-center gap-2 rounded-xl border-2 border-primary-600 px-5 text-base font-semibold text-primary-700 transition-colors hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2";

    return (
        <div>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a
                    href={whatsappShareHref(t)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#157a3f] px-6 text-base font-bold text-white transition-colors hover:bg-[#116534] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
                >
                    <MessageCircle className="h-5 w-5" aria-hidden="true" /> {t("campaign.shareWhatsapp")}
                </a>
                {canShare && (
                    <button type="button" onClick={share} className={secondary}>
                        <Share2 className="h-5 w-5" aria-hidden="true" /> {t("campaign.shareMore")}
                    </button>
                )}
                <button type="button" onClick={copyLink} className={secondary}>
                    {copied ? <Check className="h-5 w-5" aria-hidden="true" /> : <Copy className="h-5 w-5" aria-hidden="true" />}
                    {copied ? t("campaign.copied") : t("campaign.copyLink")}
                </button>
            </div>
            <p className="mt-4 break-all text-sm text-gray-700">
                <span aria-live="polite" className="sr-only">
                    {copied ? t("campaign.copied") : ""}
                </span>
                {marathonCampaign.fundraiserUrl}
            </p>
        </div>
    );
}
