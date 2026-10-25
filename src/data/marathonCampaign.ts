// Sandeep Kumar's Tata Mumbai Marathon fundraiser. Donations are taken on United Way Mumbai,
// the marathon's official philanthropy partner, not through our own donate flow.
// The site-wide bar and the homepage feature stop showing after `promoteUntil`; /marathon stays up.
export const marathonCampaign = {
    fundraiserUrl: "https://www.unitedwaymumbai.org/fundraiser/24363",
    raceDay: "2027-01-17",
    promoteUntil: "2027-01-31",
    goal: 250000,
};

// Supporters running alongside Sandeep, each with their own United Way Mumbai fundraiser. Shown on /marathon.
export const teamRunners = [
    { name: { en: "Sameer", hi: "समीर" }, fundraiserUrl: "https://www.unitedwaymumbai.org/fundraiser/26277" },
    { name: { en: "Ragini", hi: "रागिनी" }, fundraiserUrl: "https://www.unitedwaymumbai.org/fundraiser/26282" },
    { name: { en: "Mandakini", hi: "मंदाकिनी" }, fundraiserUrl: "https://www.unitedwaymumbai.org/fundraiser/24364" },
    { name: { en: "Ashok", hi: "अशोक" }, fundraiserUrl: "https://www.unitedwaymumbai.org/fundraiser/24362" },
    { name: { en: "Aayush", hi: "आयुष" }, fundraiserUrl: "https://www.unitedwaymumbai.org/fundraiser/28325" },
    { name: { en: "Rahul", hi: "राहुल" }, fundraiserUrl: "https://www.unitedwaymumbai.org/fundraiser/26281" },
];

const DAY_MS = 24 * 60 * 60 * 1000;
const raceStart = new Date(`${marathonCampaign.raceDay}T00:00:00+05:30`).getTime();
const promoteEnd = new Date(`${marathonCampaign.promoteUntil}T23:59:59+05:30`).getTime();

export function isCampaignPromoted(now: number) {
    return now <= promoteEnd;
}

// Whole days left until race day in India: 0 on the day itself, null once it has passed.
export function daysToRace(now: number) {
    if (now >= raceStart + DAY_MS) return null;
    return Math.max(0, Math.ceil((raceStart - now) / DAY_MS));
}

export function formatRaceDay(language: string, month: "long" | "short" = "long") {
    return new Date(raceStart).toLocaleDateString(language === "hi" ? "hi-IN" : "en-IN", {
        day: "numeric",
        month,
        year: "numeric",
        timeZone: "Asia/Kolkata",
    });
}
