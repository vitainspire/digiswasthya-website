import staticImpactData from "@/data/liveImpactStore.json";
import { STATIC_CENTRES } from "@/data/centreData";
import { Milestone, MilestoneCategory, MilestoneTier } from "@/types/milestone";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type LiveImpactData = Record<string, any>;

/**
 * Format raw count to a user-friendly milestone string (e.g. 25000 -> "25,000+", 100000 -> "1,00,000+")
 */
export function formatMilestoneNumber(num: number): string {
    return num.toLocaleString("en-IN") + "+";
}

interface MilestoneRule {
    category: MilestoneCategory;
    /** Regular milestone step interval (e.g., 10000 = celebrate every 10k) */
    stepSize: number;
    /** Mega milestone interval — multiples of this trigger confetti + full modal (e.g., 50000 = confetti at 50k, 1L, 1.5L, 2L...) */
    megaStepSize: number;
    /** Minimum value before the first milestone is shown */
    minValue: number;
    image: string;
    accentColor: string;
    badge: { en: string; hi: string };
    getHeadline: (count: string) => { en: string; hi: string };
    getDescription: (count: string) => { en: string; hi: string };
    getShareText: (count: string) => { en: string; hi: string };
}

export const MILESTONE_RULES: MilestoneRule[] = [
    {
        category: "women_health",
        stepSize: 5000,       // Progress pill every +5k (5k, 10k, 15k, 20k...)
        megaStepSize: 25000,  // Mega confetti at 25k, 50k, 75k, 1L, 1.25L...
        minValue: 5000,       // Start showing from 5,000+
        image: "/images/milestones/women_health.jpg",
        accentColor: "pink",
        badge: {
            en: "🌸 NEW MILESTONE",
            hi: "🌸 नया मील का पत्थर"
        },
        getHeadline: (count) => ({
            en: `We Just Crossed ${count} Lives Touched!`,
            hi: `हमने ${count} जीवन को छूने का कीर्तिमान पार किया!`
        }),
        getDescription: (count) => ({
            en: `Every rural mother deserves healthcare with dignity. Thanks to your kindness, ${count} women received free specialist care right at their doorstep.`,
            hi: `ग्रामीण भारत में हर मां सम्मानजनक स्वास्थ्य सेवा की हकदार है। आपके सहयोग से ${count} महिलाओं को उनके घर तक मुफ्त विशेषज्ञ देखभाल मिली।`
        }),
        getShareText: (count) => ({
            en: `Over ${count} rural mothers and women received free healthcare through DigiSwasthya Foundation! See the live impact:`,
            hi: `डिजीस्वास्थ्य फाउंडेशन के माध्यम से ${count} से अधिक ग्रामीण माताओं और महिलाओं को मुफ्त स्वास्थ्य सेवा मिली! लाइव प्रभाव देखें:`
        })
    },
    {
        category: "total_patients",
        stepSize: 10000,      // Progress pill every +10k (10k, 20k, 30k, 40k...)
        megaStepSize: 50000,  // Mega confetti at 50k, 1L, 1.5L, 2L, 2.5L...
        minValue: 10000,      // Start showing from 10,000+
        image: "/images/milestones/total_patients.jpg",
        accentColor: "orange",
        badge: {
            en: "✨ MAJOR MILESTONE",
            hi: "✨ प्रमुख मील का पत्थर"
        },
        getHeadline: (count) => ({
            en: `We Just Crossed ${count} Rural Patients Served!`,
            hi: `हमने ${count} ग्रामीण मरीजों की सेवा का कीर्तिमान पार किया!`
        }),
        getDescription: (count) => ({
            en: `Bringing quality healthcare directly to remote villages — your kindness turns hope into healing for over ${count} families across India.`,
            hi: `दूरदराज के गांवों तक गुणवत्तापूर्ण स्वास्थ्य सेवा पहुंचाना — आपकी दयालुता भारत भर के ${count} से अधिक परिवारों के लिए आशा को आरोग्य में बदलती है।`
        }),
        getShareText: (count) => ({
            en: `DigiSwasthya has now served over ${count} rural patients with free healthcare! Explore the journey:`,
            hi: `डिजीस्वास्थ्य ने अब ${count} से अधिक ग्रामीण मरीजों को मुफ्त स्वास्थ्य सेवा प्रदान की है! यात्रा देखें:`
        })
    },
    {
        category: "teleconsultations",
        stepSize: 10000,      // Progress pill every +10k (10k, 20k, 30k...)
        megaStepSize: 50000,  // Mega confetti at 50k, 1L, 1.5L, 2L...
        minValue: 10000,      // Start showing from 10,000+
        image: "/images/milestones/teleconsultations.jpg",
        accentColor: "sky",
        badge: {
            en: "🩺 TELEMEDICINE MILESTONE",
            hi: "🩺 टेलीमेडिसिन मील का पत्थर"
        },
        getHeadline: (count) => ({
            en: `We Just Crossed ${count} Free Teleconsultations!`,
            hi: `हमने ${count} मुफ्त टेली-परामर्श का मील का पत्थर छुआ!`
        }),
        getDescription: (count) => ({
            en: `Connecting remote village families directly with specialized medical care in minutes, saving life-critical travel time and financial distress for thousands of households.`,
            hi: `ग्रामीण परिवारों को मिनटों में विशेषज्ञ चिकित्सा सहायता से जोड़कर हजारों परिवारों के लिए जीवन रक्षक समय और यात्रा खर्च की बचत की।`
        }),
        getShareText: (count) => ({
            en: `Over ${count} free telemedicine consultations completed for underserved families by DigiSwasthya!`,
            hi: `डिजीस्वास्थ्य द्वारा जरूरतमंद परिवारों के लिए ${count} से अधिक मुफ्त टेलीमेडिसिन परामर्श पूरे किए गए!`
        })
    },
    {
        category: "centres",
        stepSize: 1,          // Progress pill every +1 new centre
        megaStepSize: 5,      // Mega confetti at 5, 10, 15, 20, 25, 30...
        minValue: 5,          // Start showing from 5 centres
        image: "/images/milestones/centres.jpg",
        accentColor: "emerald",
        badge: {
            en: "🏥 HEALTHCARE SANCTUARY",
            hi: "🏥 स्वास्थ्य केंद्र विस्तार"
        },
        getHeadline: (count) => ({
            en: `New Rural Telemedicine Hubs Active: ${count} Centres!`,
            hi: `नए ग्रामीण टेलीमेडिसिन केंद्र सक्रिय: अब ${count} केंद्र!`
        }),
        getDescription: (count) => ({
            en: `Every telemedicine centre is a permanent sanctuary of health for rural families, bringing continuous specialist healthcare to dozens of surrounding villages.`,
            hi: `प्रत्येक टेलीमेडिसिन केंद्र ग्रामीण परिवारों के लिए स्वास्थ्य का एक स्थायी आश्रय है, जो आसपास के दर्जनों गांवों में निरंतर विशेषज्ञ स्वास्थ्य सेवा पहुंचाता है।`
        }),
        getShareText: (count) => ({
            en: `DigiSwasthya now operates ${count} active rural telemedicine centres delivering free specialist care!`,
            hi: `डिजीस्वास्थ्य अब ${count} सक्रिय ग्रामीण टेलीमेडिसिन केंद्र संचालित कर रहा है!`
        })
    },
    {
        category: "doctors",
        stepSize: 25,         // Progress pill every +25 doctors (50, 75, 100, 125...)
        megaStepSize: 100,    // Mega confetti at 100, 200, 300, 400, 500...
        minValue: 50,         // Start showing from 50 doctors
        image: "/images/milestones/doctors.jpg",
        accentColor: "teal",
        badge: {
            en: "👨‍⚕️ SPECIALIST NETWORK",
            hi: "👨‍⚕️ विशेषज्ञ नेटवर्क"
        },
        getHeadline: (count) => ({
            en: `${count} Specialist Doctors Volunteering for Rural India!`,
            hi: `${count} विशेषज्ञ डॉक्टर अब ग्रामीण भारत की सेवा में समर्पित!`
        }),
        getDescription: (count) => ({
            en: `Dedicated medical specialists from premier hospitals generously donate their clinical time and compassionate care to heal remote communities.`,
            hi: `अग्रणी अस्पतालों के समर्पित चिकित्सा विशेषज्ञ दूरदराज के समुदायों के इलाज के लिए अपना बहुमूल्य समय और विशेषज्ञता दे रहे हैं।`
        }),
        getShareText: (count) => ({
            en: `${count} doctors are volunteering their clinical expertise with DigiSwasthya to heal rural India!`,
            hi: `${count} डॉक्टर ग्रामीण भारत के इलाज के लिए डिजीस्वास्थ्य के साथ अपना समय दे रहे हैं!`
        })
    },
    {
        category: "districts",
        stepSize: 5,          // Progress pill every +5 districts (25, 30, 35, 40...)
        megaStepSize: 25,     // Mega confetti at 25, 50, 75, 100, 125...
        minValue: 25,         // Start showing from 25 districts
        image: "/images/milestones/expansion_map.jpg",
        accentColor: "indigo",
        badge: {
            en: "📍 EXPANDING HORIZONS",
            hi: "📍 नेटवर्क विस्तार"
        },
        getHeadline: (count) => ({
            en: `Care Expanding Across ${count} Rural Districts!`,
            hi: `अब ${count} ग्रामीण जिलों तक पहुंचा हमारा स्वास्थ्य नेटवर्क!`
        }),
        getDescription: (count) => ({
            en: `Our mission to eliminate healthcare disparity continues to spread nationwide, bringing specialized consultations to remote underserved regions.`,
            hi: `स्वास्थ्य असमानता को दूर करने का हमारा संकल्प देशभर में फैल रहा है, जिससे दूरदराज के क्षेत्रों में विशेषज्ञ परामर्श पहुंच रहा है।`
        }),
        getShareText: (count) => ({
            en: `DigiSwasthya healthcare outreach has now expanded across ${count} rural districts in India!`,
            hi: `डिजीस्वास्थ्य की स्वास्थ्य सेवा अब भारत के ${count} ग्रामीण जिलों में विस्तारित हो चुकी है!`
        })
    },
    {
        category: "districts_states",
        stepSize: 1,          // Progress pill every +1 new state
        megaStepSize: 5,      // Mega confetti at 5, 10, 15, 20 states...
        minValue: 3,          // Start showing from 3 states
        image: "/images/milestones/districts_states.jpg",
        accentColor: "blue",
        badge: {
            en: "🇮🇳 PAN-INDIA OUTREACH",
            hi: "🇮🇳 अखिल भारतीय पहुंच"
        },
        getHeadline: (count) => ({
            en: `Healing Reach Across Multiple Indian States!`,
            hi: `कई भारतीय राज्यों में फैली हमारी स्वास्थ्य सेवा!`
        }),
        getDescription: (count) => ({
            en: `Bridging the urban-rural healthcare divide across multiple states, ensuring distance is no longer a barrier to specialist doctor consultations.`,
            hi: `विभिन्न राज्यों में ग्रामीण और शहरी स्वास्थ्य अंतर को पाटना, यह सुनिश्चित करना कि दूरी अब डॉक्टर से इलाज में बाधा न बने।`
        }),
        getShareText: (count) => ({
            en: `DigiSwasthya is delivering free healthcare to rural communities across multiple states in India!`,
            hi: `डिजीस्वास्थ्य भारत के कई राज्यों के ग्रामीण समुदायों को मुफ्त स्वास्थ्य सेवा प्रदान कर रहा है!`
        })
    },
    {
        category: "health_camps",
        stepSize: 5,          // Progress pill every +5 camps
        megaStepSize: 10,     // Mega confetti at 10, 20, 30, 40, 50 camps...
        minValue: 5,          // Start showing from 5 camps
        image: "/images/milestones/health_camps.jpg",
        accentColor: "amber",
        badge: {
            en: "🎪 MEGA HEALTH CAMPS",
            hi: "🎪 स्वास्थ्य शिविर"
        },
        getHeadline: (count) => ({
            en: `Conducting Life-Saving Health Camps in Remote Villages!`,
            hi: `दूरदराज के गांवों में जीवन रक्षक स्वास्थ्य शिविर!`
        }),
        getDescription: (count) => ({
            en: `On-ground medical checkup and early screening drives bring specialized diagnostics directly to villagers who cannot afford to travel to cities.`,
            hi: `जमीनी स्तर पर स्वास्थ्य जांच और शीघ्र निदान शिविर सीधे उन ग्रामीणों तक पहुंचते हैं जो बड़े शहरों की यात्रा करने में असमर्थ हैं।`
        }),
        getShareText: (count) => ({
            en: `DigiSwasthya is conducting free on-ground medical screening camps across rural India!`,
            hi: `डिजीस्वास्थ्य ग्रामीण भारत में मुफ्त जमीनी स्वास्थ्य जांच शिविर आयोजित कर रहा है!`
        })
    }
];

/**
 * Extracts milestone metrics from impact data.
 * @param liveData - Optional live data from Firebase API. Falls back to static JSON if not provided.
 */
export function getLiveMetrics(liveData?: LiveImpactData) {
    // Use live Firebase data if available, otherwise fall back to static JSON file
    const source = liveData || staticImpactData;

    const kpis = source?.kpis || {};
    const demographics = source?.demographics || {};
    const reach = source?.reach || {};

    const totalPatients = Number(kpis.total_patients || 43418);
    const totalTeleconsultations = Number(kpis.total_teleconsultations || 59674);
    const totalCamps = Number(kpis.total_camps || 5);
    const totalDoctors = Number(kpis.total_doctors || 125);
    const femalePatients = Number(demographics?.gender_split?.female || 25298);
    const totalDistricts = Number(reach?.districts || 60);
    const activeCentres = STATIC_CENTRES.filter((c) => c.isActive).length || 18;

    return {
        women_health: femalePatients,
        total_patients: totalPatients,
        teleconsultations: totalTeleconsultations,
        centres: activeCentres,
        doctors: totalDoctors,
        districts: totalDistricts,
        districts_states: Number(reach?.states || 3),
        health_camps: totalCamps
    };
}

/**
 * DYNAMIC Milestone Engine — uses math formulas instead of hardcoded arrays.
 * Automatically calculates milestones to infinity (1L 10k, 1L 20k, 2L, 5L, etc.)
 * without ever needing code changes.
 *
 * How it works:
 *   1. milestoneValue = Math.floor(currentValue / stepSize) * stepSize
 *      → e.g. 1,14,500 patients with stepSize 10000 → milestone = 1,10,000
 *   2. tier = (milestoneValue % megaStepSize === 0) ? "mega" : "progress"
 *      → e.g. 1,10,000 % 50000 ≠ 0 → "progress" (floating pill)
 *      → e.g. 1,50,000 % 50000 === 0 → "mega" (confetti + modal)
 */
export function calculateAchievedMilestones(liveData?: LiveImpactData): Milestone[] {
    const metrics = getLiveMetrics(liveData);
    const achieved: Milestone[] = [];

    for (const rule of MILESTONE_RULES) {
        const currentValue = metrics[rule.category] || 0;

        // Dynamically calculate the highest milestone crossed using math
        const milestoneValue = Math.floor(currentValue / rule.stepSize) * rule.stepSize;

        // Only show if we've crossed the minimum threshold
        if (milestoneValue >= rule.minValue) {
            const formatted = formatMilestoneNumber(milestoneValue);

            // Determine tier: mega if it's a multiple of megaStepSize, otherwise progress
            const tier: MilestoneTier = milestoneValue % rule.megaStepSize === 0 ? "mega" : "progress";

            achieved.push({
                id: `ms_${rule.category}_${milestoneValue}`,
                category: rule.category,
                tier,
                threshold: milestoneValue,
                currentValue,
                badge: rule.badge,
                headline: rule.getHeadline(formatted),
                description: rule.getDescription(formatted),
                image: rule.image,
                accentColor: rule.accentColor,
                shareMessage: rule.getShareText(formatted)
            });
        }
    }

    return achieved;
}

/**
 * Returns the primary active milestone to celebrate.
 * Prioritizes mega tier and women_health / total_patients.
 */
export function getPrimaryMilestone(liveData?: LiveImpactData): Milestone | null {
    const milestones = calculateAchievedMilestones(liveData);
    if (milestones.length === 0) return null;

    // Prioritize Patients Served first, then Women's Health, then other mega milestones
    const totalPatients = milestones.find((m) => m.category === "total_patients");
    if (totalPatients) return totalPatients;

    const womenHealth = milestones.find((m) => m.category === "women_health");
    if (womenHealth) return womenHealth;

    const tele = milestones.find((m) => m.category === "teleconsultations");
    if (tele) return tele;

    const megaMilestones = milestones.filter((m) => m.tier === "mega");
    if (megaMilestones.length > 0) {
        return megaMilestones[0];
    }

    return milestones[0];
}

/**
 * Returns a specific milestone by category (useful for manual testing or previewing)
 */
export function getMilestoneByCategory(category: MilestoneCategory, liveData?: LiveImpactData): Milestone | null {
    const milestones = calculateAchievedMilestones(liveData);
    const found = milestones.find((m) => m.category === category);
    if (found) return found;

    // If not achieved yet, return a mockup version using the minValue
    const rule = MILESTONE_RULES.find((r) => r.category === category);
    if (!rule) return null;

    const formatted = formatMilestoneNumber(rule.minValue);

    return {
        id: `ms_${rule.category}_${rule.minValue}`,
        category: rule.category,
        tier: "progress",
        threshold: rule.minValue,
        currentValue: rule.minValue,
        badge: rule.badge,
        headline: rule.getHeadline(formatted),
        description: rule.getDescription(formatted),
        image: rule.image,
        accentColor: rule.accentColor,
        shareMessage: rule.getShareText(formatted)
    };
}
