/**
 * partnersData.ts — Single source of truth for all DigiSwasthya partner organizations and hospital collaborations.
 *
 * USED BY:
 *   - src/data/botKnowledge.ts (chatbot context)
 */

export interface PartnerOrg {
    name: string;
    category: string;
    description: string;
}

export const partnerOrganizations: PartnerOrg[] = [
    {
        name: "Tata Memorial Hospital, Mumbai",
        category: "Oncology & Specialist Referral Partner",
        description: "Provides expert cancer treatment guidance, second opinions, and specialized care referrals for rural patients."
    },
    {
        name: "Homi Bhabha Cancer Hospital & Research Centre",
        category: "Medical & Cancer Care Partner",
        description: "Collaborates on oncologist tele-consultations, chemotherapy plans, and advanced cancer screenings."
    },
    {
        name: "Ratan Tata Trust",
        category: "Financial Assistance & Philanthropy Partner",
        description: "Provides critical financial aid and grant support for surgeries, cancer treatments, and life-saving operations for underprivileged patients."
    },
    {
        name: "Great Place to Work® Institute",
        category: "Certification & Workplace Partner",
        description: "Certified DigiSwasthya Foundation as a Great Place to Work (2025–2026) in the Non-Profit & Charity category."
    },
    {
        name: "Government Primary & Community Health Centers (PHCs/CHCs)",
        category: "Healthcare Delivery Partner",
        description: "Partnership with government health centers across Uttar Pradesh, Bihar, and Maharashtra to run collaborative checkup clinics and telemedicine nodes."
    }
];
