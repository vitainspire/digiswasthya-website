"use client";

import { useSyncExternalStore } from "react";
import { daysToRace, isCampaignPromoted } from "@/data/marathonCampaign";

const noSubscribe = () => () => {};

// Pages are prerendered, so anything that depends on today's date is worked out in the browser.
// The server snapshot shows the promotion; the client hides it if the campaign is over.
export function useCampaignPromoted() {
    return useSyncExternalStore(noSubscribe, () => isCampaignPromoted(Date.now()), () => true);
}

export function useDaysToRace() {
    return useSyncExternalStore(noSubscribe, () => daysToRace(Date.now()), () => null);
}

export function countdownLabel(days: number, t: (key: string) => string) {
    if (days === 0) return t("campaign.raceDayToday");
    if (days === 1) return t("campaign.oneDayToGo");
    return t("campaign.daysToGo").replace("{days}", String(days));
}
