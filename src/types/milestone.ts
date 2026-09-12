export type MilestoneCategory =
    | "women_health"
    | "total_patients"
    | "teleconsultations"
    | "centres"
    | "doctors"
    | "districts"
    | "districts_states"
    | "health_camps";

export type MilestoneTier = "mega" | "progress";

export interface LocalizedString {
    en: string;
    hi: string;
}

export interface Milestone {
    id: string;
    category: MilestoneCategory;
    tier: MilestoneTier;
    threshold: number;
    currentValue: number;
    badge: LocalizedString;
    headline: LocalizedString;
    description: LocalizedString;
    image: string;
    accentColor: string; // e.g. "orange", "emerald", "sky", "purple"
    shareMessage: LocalizedString;
}
