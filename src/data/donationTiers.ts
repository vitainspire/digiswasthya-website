export interface DonationTier {
    amount: number;
    // Per-rupee outcome, e.g. "funds 10 teleconsultations". Leave null until the figure is confirmed.
    impact: string | null;
}

export const donationTiers: DonationTier[] = [
    { amount: 500, impact: null },
    { amount: 1000, impact: null },
    { amount: 2500, impact: null },
    { amount: 5000, impact: null },
];

export const suggestedTier = 1000;
