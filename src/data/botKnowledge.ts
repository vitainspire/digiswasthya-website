/**
 * botKnowledge.ts — COMPLETE PUBLIC WEBSITE KNOWLEDGE BASE
 *
 * SECURITY RULES (strictly enforced):
 * ✅ Contains ONLY public-facing content visible to any website visitor.
 * ❌ NEVER include: API keys, .env values, Razorpay secrets, Firebase config,
 *    backend logic, internal admin routes, or any server-side credentials.
 *
 * HOW AUTO-UPDATE WORKS:
 * This file imports from data files (teamData, centreData, impactData, websiteConfig).
 * When any of those files are updated → the bot automatically gets the new data.
 * Never manually duplicate data here — always import from the source files.
 */

import { impactData } from "./impactData";
import { websiteConfig } from "./websiteConfig";
import {
    board,
    coreTeam,
    foundingTeam,
    advisoryBoard,
    doctors,
    onGroundTeam,
} from "./teamData";
import { STATIC_CENTRES as telemedicineCentres } from "./centreData";
import { stories, testimonials } from "./beneficiaryData";
import { partnerOrganizations } from "./partnersData";
import { formatRaceDay, marathonCampaign } from "./marathonCampaign";

export function getWebsiteContext(): string {
    const totalTeam = board.length + coreTeam.length + foundingTeam.length + advisoryBoard.length + doctors.length + onGroundTeam.length;

    return `
DIGISWASTHYA FOUNDATION — COMPLETE PUBLIC KNOWLEDGE BASE
Answer using ONLY this context. Be warm, helpful, detailed, and impressive.
Only decline if a question is 100% unrelated to DigiSwasthya, healthcare, or NGOs.

══════════════════════════════════════
PAGE: HOME
══════════════════════════════════════
Tagline: "Making Quality Healthcare Reach Every Rural Family"
Subtitle: Bridging the gap between rural India and modern medicine through expert teleconsultation and essential diagnostics at your doorstep.
NGO Motto: "Jahan Kam, Wahan Hum!" (Where there is less, there we are!)
Social Media:
- Facebook: facebook.com/DigiSwasthya
- Instagram: instagram.com/digiswasthya
- Twitter/X: x.com/DigiSwasthya
- LinkedIn: linkedin.com/company/digiswasthya
- YouTube: youtube.com/channel/UC52n8c8U4jAtHsIzq7-wKvQ
- Impact Gallery: linktr.ee/DigiSwasthya

══════════════════════════════════════
PAGE: ABOUT US
══════════════════════════════════════
Who We Are:
DigiSwasthya Foundation is a technology-enabled healthcare organization committed to making quality healthcare accessible, affordable, and inclusive for underserved communities across India. By combining digital healthcare, expert medical professionals, and community outreach initiatives, DigiSwasthya works to bridge the gap between healthcare services and the people who need them the most.

The Healthcare Challenge in India:
Rural and underserved communities face: shortage of specialist doctors, delayed diagnosis, limited healthcare infrastructure, financial constraints, and low health awareness.

Why DigiSwasthya Exists:
DigiSwasthya was established to reduce the gap between healthcare providers and underserved communities through technology-driven solutions, medical expertise, health camps, preventive screening programs, and awareness initiatives.

Mission: Making healthcare accessible to 1.4 billion people through technology by 2047.
Vision: To create a world where quality healthcare is accessible and affordable for all.
Values: Accountability, Benevolence, Compassion, Dignity.

Founder's Story (Sandeep Kumar):
In 2007, Sandeep Kumar was unwell and wandered from hospital to hospital in Sant Kabir Nagar, Uttar Pradesh, unable to get a correct diagnosis due to lack of qualified doctors. After 6 months, he was diagnosed with Ewing Sarcoma (a type of bone cancer) and his entire right humerus bone was replaced. Doctors said further delay would have left him immobilized. He recovered at Tata Memorial Hospital, Mumbai.
From 2015–2020, he dedicated himself to supporting cancer patients and survivors. In July 2020, he invested his savings to establish DigiSwasthya's first telemedicine clinic in his home district (Sant Kabir Nagar), creating one of the state's first hybrid medical consultation facilities. DigiSwasthya = Digi (Digital) + Swasthya (Health).

Certifications: Great Place to Work Certified (October 2025 – October 2026), Non-profit & Charity Organizations category.

How We Work — 8 Pillars:
1. Awareness Campaigns — Community outreach and health education in rural areas.
2. Accurate Information — Trained coordinators provide reliable health guidance.
3. Electronic Medical Records (EMR) — Digital patient records for continuity of care.
4. Primary Health Checkups — Basic assessments at village centers to detect early symptoms.
5. Expert Doctor Consultation — Teleconsultation video links with specialist city doctors.
6. Timely Diagnosis — Faster access to professional consultation to reduce delays.
7. Referral Pathways — Guidance to partner hospitals for advanced treatment.
8. Follow-Ups — Digital tracking and routine check-ins for chronic disease management.

Care Model Principles:
- Bringing Healthcare Closer to Communities: Trained coordinator welcomes patient, records vitals, connects with a doctor over live video, issues digital prescription, with no need to travel far.
- Delivering Better Care Through Technology: AI assists doctors to review patient history; clinical judgement is never replaced.
- Caring Beyond a Single Consultation: Chronic disease patients (diabetes, hypertension) receive ongoing care and follow-ups.
- Understanding the Whole Person: Model considers family history, nutrition, water & sanitation.
- Built for Rural India: Works offline in low-connectivity areas; syncs when back online. Runs in English and Hindi on Android devices.
- Protecting Every Patient's Trust: Patient data is encrypted and accessible only to authorized healthcare staff.
- Scaling Quality Healthcare: Every improvement rolls out to all centres, ensuring consistent care.

══════════════════════════════════════
PAGE: OUR TEAM
══════════════════════════════════════
Total Team Size: ${totalTeam} members

Founding Team & Leadership:
${foundingTeam.map(t => `- ${t.name} (${t.role})`).join("\n")}

Board of Directors:
${board.map(t => `- ${t.name} (${t.role})`).join("\n")}

Core Team:
${coreTeam.map(t => `- ${t.name} (${t.role})`).join("\n")}

Advisory Board:
${advisoryBoard.map(t => `- ${t.name} (${t.role})`).join("\n")}

Specialist Doctors:
${doctors.map(t => `- ${t.name} (${t.role})`).join("\n")}

On-Ground Operations Team:
${onGroundTeam.map(t => `- ${t.name} (${t.role})`).join("\n")}

══════════════════════════════════════
PAGE: OUR NETWORK (Telemedicine Centres)
══════════════════════════════════════
States Covered: Uttar Pradesh, Bihar, Maharashtra
Total Active Centres: ${telemedicineCentres.length}
Centre Helpline: +91 99879 44391

How It Works at a Centre:
Step 1 — Reach Out: Call or WhatsApp us. No appointment needed.
Step 2 — Visit Your Nearest Centre: Walk in to the nearest DigiSwasthya centre.
Step 3 — Get Checked & Consult a Specialist: Staff run on-site health checkup, then connect patient with a specialist via video.
Step 4 — Receive Your Treatment Plan: Get a personalized treatment plan, prescription, or referral to a partner hospital.

All ${telemedicineCentres.length} Active Centres:
${telemedicineCentres.map(c => `- ${c.name}, ${c.district}, ${c.state} — PIN ${c.pincode}`).join("\n")}

Centres by State:
- Uttar Pradesh: ${telemedicineCentres.filter(c => c.state === "Uttar Pradesh").map(c => `${c.name} (${c.district})`).join(", ")}
- Bihar: ${telemedicineCentres.filter(c => c.state === "Bihar").map(c => `${c.name} (${c.district})`).join(", ")}
- Maharashtra: ${telemedicineCentres.filter(c => c.state === "Maharashtra").map(c => `${c.name} (${c.district})`).join(", ")}

══════════════════════════════════════
PAGE: OUR IMPACT (Live Dynamic Metrics & Visualizations)
══════════════════════════════════════
Core Key Metrics:
${impactData.kpis.map(k => `- ${k.label.en}: ${k.value.toLocaleString('en-IN')}${k.suffix || ''} (${k.description.en})`).join("\n")}

Patient Age Distribution:
${impactData.ageDistribution.map(a => `- ${a.ageGroup}: ${a.count.toLocaleString('en-IN')} patients`).join("\n")}

Gender Distribution:
${impactData.genderDistribution.map(g => `- ${g.gender.en}: ${g.count.toLocaleString('en-IN')} (${g.percentage}%)`).join("\n")}

Patient Visit Type:
${impactData.patientTypeDistribution.map(p => `- ${p.type.en}: ${p.count.toLocaleString('en-IN')} (${p.percentage}%)`).join("\n")}

Consultations by Medical Department:
${impactData.consultationByDepartment.map(d => `- ${d.department.en}: ${d.count.toLocaleString('en-IN')} consultations`).join("\n")}

Top Diagnosed Diseases & Conditions:
${impactData.diseaseDistribution.map(dis => `- ${dis.name.en}: ${dis.value.toLocaleString('en-IN')} cases`).join("\n")}

Doctors by Specialty:
${impactData.doctorsBySpecialty.map(s => `- ${s.specialty.en}: ${s.count.toLocaleString('en-IN')} doctors`).join("\n")}

5-Year Patient Growth Trajectory:
${impactData.growthTrends.map(g => `- ${g.year}: ${g.patients.toLocaleString('en-IN')} patients, ${g.camps} camps, ${g.doctors} doctors`).join("\n")}

Regional Patient Distribution (Top Districts):
${impactData.regionalReach.map(r => `- ${r.district.en}: ${r.count.toLocaleString('en-IN')} patients`).join("\n")}

══════════════════════════════════════
PAGE: DONATE
══════════════════════════════════════
Headline: "Every Rupee Saves a Life"
Tagline: Help us bring quality healthcare to underserved communities across rural India.
NGO Registration Number (CIN / NPO): U85300UP2021NPL146867
80G Certificate No: AAICD5332R25LK02
CSR Form 1: CSR00016240
NGO Darpan ID: UP/2021/0291277
Tax Benefit: Donations are 80G tax exempt.
Minimum Donation: ₹100

Donation Tiers & Impact:
- ₹1500 — Provides essential medicines for a patient.
- ₹5,000 — Funds a full health checkup and diagnostics for two children. Sponsors teleconsultations for four patients.
- ₹10,000 — Supports a telemedicine clinic for a day.
- ₹25,000 — Sponsors a complete health camp for a rural village.

Donation Types: One-time or Monthly recurring.
Payment Methods: UPI QR Code, Razorpay (Credit/Debit Card, NetBanking, UPI).

Financial Transparency:
- 85% → Directly to rural health programs (medical camps, medicines, telemedicine).
- 10% → Logistics and field operations.
- 5% → Administrative and tech costs.

Step-by-Step Payment Process:
${websiteConfig.paymentProcessSteps.map((step, i) => `${i + 1}. ${step}`).join("\n")}

Impact Gallery: linktr.ee/DigiSwasthya

══════════════════════════════════════
PAGE: HEALTH TOOLS
══════════════════════════════════════
DigiSwasthya provides a free BMI (Body Mass Index) Health Assessment Tool on its website.
Purpose: Simple health awareness tools designed to help users better understand their health and wellness.
Disclaimer: These tools are for educational and awareness purposes only and do not replace professional medical advice. Consult a qualified healthcare professional for personalized guidance.

BMI Categories:
- Underweight (BMI < 18.5) — Consult a healthcare provider for nutritional advice.
- Normal (18.5–24.9) — Healthy range. Maintain balanced diet and regular exercise.
- Overweight (25–29.9) — Small changes in diet and exercise can help.
- Obese (BMI ≥ 30) — Consult a healthcare professional for a personalized health plan.

══════════════════════════════════════
CAMPAIGN: TATA MUMBAI MARATHON (/marathon)
══════════════════════════════════════
Founder Sandeep Kumar, a cancer survivor, is running the Tata Mumbai Marathon on ${formatRaceDay("en")} to raise ₹${marathonCampaign.goal.toLocaleString("en-IN")} for DigiSwasthya Foundation's telemedicine programme.
Donations for the run are made on his United Way Mumbai fundraiser: ${marathonCampaign.fundraiserUrl}
United Way Mumbai is the official philanthropy partner of the Tata Mumbai Marathon. People who prefer can still donate directly at /donate.
Supporters who cannot give can share the campaign on WhatsApp from the /marathon page.

══════════════════════════════════════
PAGE: BLOGS
══════════════════════════════════════
DigiSwasthya publishes blog articles focused on healthcare topics. Articles focus on how technology is bridging the gap between urban specialists and rural patients, ensuring timely diagnosis and effective treatment for underserved communities.

══════════════════════════════════════
PAGE: CONTACT US
══════════════════════════════════════
General Support Email: info@digiswasthya.org
Phone / Helpline: ${websiteConfig.supportPhone}
WhatsApp: ${websiteConfig.whatsappNumber}
Centre Phone: +91 99879 44391
Partnerships Email: partnerships@digiswasthya.org
Head Office Address: ${websiteConfig.headOfficeAddress}
Registered Address: ${websiteConfig.registeredAddress}
Response Time: Team responds within 24–48 hours.

The Contact Us page (/contact-us) has three forms, one per tab:
- Ask a question or get help: general questions, patients needing medical help, and volunteers (volunteers are pointed to a separate volunteer form). Needs a phone number or an email address.
- Donors and supporters: ask about giving once, giving monthly, sponsoring a centre or camp, or CSR partnerships. Optional tick box to receive impact updates by email.
- Doctors: request to join the network by sharing medical registration number, council, qualification and speciality. The doctor onboarding team replies within 24–48 hours.
All three forms need consent before they can be sent.

══════════════════════════════════════
COLLABORATION & PARTNERS
══════════════════════════════════════
Key Partners & Collaborating Organizations:
${partnerOrganizations.map(p => `- ${p.name} (${p.category}): ${p.description}`).join("\n")}

Collaboration Opportunities:
1. Impact Investors — Social/impact investors sought for capital and guidance to scale up. Looking for expertise in emerging medical technologies and public-private partnerships.
2. Centre Sponsors — Sponsors sought to fund expansion into rural/aspirational districts of their choice. Centres can be co-branded with the sponsoring organization.
3. Campaign Sponsors — Companies, trusts, and individuals can sponsor specific campaigns: breast care detection, girls screening for anemia, newborn baby screening, diabetic screening, heart screening programs.
Contact for partnerships: partnerships@digiswasthya.org or call +91 83184 24800.

══════════════════════════════════════
BENEFICIARIES & PATIENT STORIES (TESTIMONIALS)
══════════════════════════════════════
Featured Patient Stories & Case Studies:
${stories.map(s => `- ${s.name} (${s.age || ""}, ${s.role || "Patient"}): Condition: ${s.condition}. Outcome: ${s.result}`).join("\n")}

Patient Testimonials & Beneficiaries Treated:
${testimonials.map(t => `- ${t.name} (Issue: ${t.problem}): "${t.body}"`).join("\n")}
    `.trim();
}
