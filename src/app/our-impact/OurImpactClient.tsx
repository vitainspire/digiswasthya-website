"use client";

import { Navbar }                         from "@/components/layout/Navbar";
import { Footer }                         from "@/components/layout/Footer";
import { ImpactHero }                     from "@/components/impact/ImpactHero";
import { PortalKPICards }                 from "@/components/impact/PortalKPICards";
import { PortalSmoothLineChart }          from "@/components/impact/PortalSmoothLineChart";
import { PortalDepartmentBarChart }       from "@/components/impact/PortalDepartmentBarChart";
import { PortalTopDiseasesChart }         from "@/components/impact/PortalTopDiseasesChart";
import { PortalAgeDistributionChart }     from "@/components/impact/PortalAgeDistributionChart";
import { PortalDonutPair }                from "@/components/impact/PortalDonutPair";
import { PortalDoctorsSpecialtyChart }    from "@/components/impact/PortalDoctorsSpecialtyChart";
import { ImpactTimeline }                 from "@/components/impact/ImpactTimeline";
import { InteractiveReachMap }            from "@/components/impact/InteractiveReachMap";
import { useImpactData }                  from "@/hooks/useImpactData";
export default function OurImpact() {
    const { data, rawLiveStore } = useImpactData();

    // Live Data mappings with fallback defaults
    const kpiData = {
        patientsServed: rawLiveStore?.kpis?.total_patients ?? 42950,
        teleconsultations: rawLiveStore?.kpis?.total_teleconsultations ?? 58894,
        healthCamps: rawLiveStore?.kpis?.total_camps ?? 5,
        doctors: rawLiveStore?.kpis?.total_doctors ?? 125,
        partnerHospitals: rawLiveStore?.kpis?.total_hospitals ?? 0
    };

    const patientGrowthData = rawLiveStore?.growth ? rawLiveStore.growth.map((g: any) => ({ year: g.year, value: g.patients })) : [
        { year: "2024", value: 2 },
        { year: "2025", value: 19823 },
        { year: "2026", value: 27223 }
    ];

    const teleconsultationGrowthData = rawLiveStore?.growth ? rawLiveStore.growth.map((g: any) => ({ year: g.year, value: g.teleconsultations })) : [
        { year: "2024", value: 2 },
        { year: "2025", value: 20986 },
        { year: "2026", value: 37880 }
    ];

    const healthCampsGrowthData = [
        { year: "2026", value: rawLiveStore?.kpis?.total_camps ?? 5 }
    ];

    const departmentData = rawLiveStore?.departments ?? [
        { department: "General Medicine", count: 15967 },
        { department: "Dermatologist", count: 10223 },
        { department: "Pediatrician", count: 3700 },
        { department: "Gynaecologist", count: 3513 },
        { department: "Orthopaedics, MS", count: 3307 },
        { department: "General Physician", count: 3245 },
        { department: "Paediatrician", count: 2889 },
        { department: "Internal Medicine", count: 2691 },
        { department: "General Physician, Gynaecologist", count: 2132 },
        { department: "Orthopedic", count: 2089 },
        { department: "Orthopaedic", count: 1976 },
        { department: "Ent", count: 1143 },
        { department: "Homopathic", count: 498 },
        { department: "Neurologist", count: 453 },
        { department: "Ophthalmology", count: 323 },
        { department: "Dermatology And Leprosy", count: 180 },
        { department: "Cardiology", count: 150 },
        { department: "Opthamologist", count: 140 },
        { department: "Dentistry", count: 135 },
        { department: "Dentist", count: 115 },
        { department: "Ophthalmology", count: 68 },
        { department: "Clinical Dietitian", count: 55 },
        { department: "Gynecologist", count: 49 },
        { department: "Medical Oncologist", count: 33 },
        { department: "Oncologist", count: 25 },
        { department: "General Surgeon, Gastrointestinal Endo Surgeons", count: 20 },
        { department: "Diabetologist", count: 18 },
        { department: "Gynecology & Obstetrics", count: 18 },
        { department: "Physiotherapist", count: 15 },
        { department: "Clinical Nutritionist", count: 14 },
        { department: "General Surgeon", count: 14 },
        { department: "Pulmonologist", count: 14 },
        { department: "Nephrologist", count: 13 },
        { department: "Oral And Dental Care", count: 10 },
        { department: "Gastroenterologist", count: 6 },
        { department: "Psychiatrist", count: 4 },
        { department: "Nutritionist", count: 3 },
        { department: "Orthopaedics", count: 3 },
        { department: "Psychologist", count: 3 },
        { department: "Cardiologist General", count: 2 },
        { department: "Pediatric Hemato Oncology", count: 2 }
    ];

    const DISEASE_NAME_MAP: Record<string, string> = {
        "urti": "Common Cold & Throat Infection (URTI)",
        "upper respiratory tract inf": "Common Cold & Throat Infection (URTI)",
        "upper respiratory infection (urti)": "Common Cold & Throat Infection (URTI)",
        "htn": "High Blood Pressure (Hypertension)",
        "hypertension (high bp)": "High Blood Pressure (Hypertension)",
        "eczema": "Skin Rash & Irritation (Eczema)",
        "eczema (skin condition)": "Skin Rash & Irritation (Eczema)",
        "tinea": "Fungal Skin Infection (Ringworm)",
        "tinea (fungal infection)": "Fungal Skin Infection (Ringworm)",
        "xerosis": "Severe Dry Skin (Xerosis)",
        "xerosis (severe dry skin)": "Severe Dry Skin (Xerosis)",
        "acute febrile illness": "Sudden Fever Illness",
        "lrti": "Chest & Lung Infection (LRTI)",
        "lower respiratory infection (lrti)": "Chest & Lung Infection (LRTI)",
        "gastritis": "Stomach Inflammation (Gastritis)",
        "gastritis (stomach inflammation)": "Stomach Inflammation (Gastritis)",
        "gen weakness": "General Weakness & Fatigue",
        "general weakness & fatigue": "General Weakness & Fatigue",
        "t2dm": "Type 2 Diabetes (Sugar Disease)",
        "type 2 diabetes mellitus (t2dm)": "Type 2 Diabetes (Sugar Disease)",
        "joint pain": "Joint Pain & Inflammation",
        "joint pain & inflammation": "Joint Pain & Inflammation",
        "age": "Age-Related Health Decline",
        "age-related health degeneration": "Age-Related Health Decline",
        "acne": "Acne & Skin Irritation",
        "acne & dermatitis": "Acne & Skin Irritation",
        "knee pain": "Knee Pain & Joint Wear (Osteoarthritis)",
        "knee pain & osteoarthritis": "Knee Pain & Joint Wear (Osteoarthritis)"
    };

    const rawDiseaseData: { disease: string; count: number }[] = rawLiveStore?.top_diseases ?? [
        { disease: "Common Cold & Throat Infection (URTI)", count: 2599 },
        { disease: "High Blood Pressure (Hypertension)", count: 2376 },
        { disease: "Skin Rash & Irritation (Eczema)", count: 1431 },
        { disease: "Fungal Skin Infection (Ringworm)", count: 1318 },
        { disease: "Severe Dry Skin (Xerosis)", count: 795 },
        { disease: "Sudden Fever Illness", count: 778 },
        { disease: "Chest & Lung Infection (LRTI)", count: 774 },
        { disease: "Stomach Inflammation (Gastritis)", count: 675 },
        { disease: "Upper Respiratory Tract Inf", count: 648 },
        { disease: "General Weakness & Fatigue", count: 624 },
        { disease: "Type 2 Diabetes (Sugar Disease)", count: 602 },
        { disease: "Joint Pain & Inflammation", count: 587 },
        { disease: "Age-Related Health Decline", count: 524 },
        { disease: "Acne & Skin Irritation", count: 504 },
        { disease: "Knee Pain & Joint Wear (Osteoarthritis)", count: 499 }
    ];

    const diseaseData = (() => {
        const merged = new Map<string, number>();
        for (const d of rawDiseaseData) {
            const friendlyName = DISEASE_NAME_MAP[d.disease.trim().toLowerCase()] ?? d.disease;
            merged.set(friendlyName, (merged.get(friendlyName) ?? 0) + d.count);
        }
        return Array.from(merged.entries()).map(([disease, count]) => ({ disease, count }));
    })();

    const ageDistributionData = rawLiveStore?.demographics?.age_groups ? rawLiveStore.demographics.age_groups.map((a: any) => ({
        range: a.range,
        count: a.count,
        color: a.range === "0-5" ? "#2563eb" : a.range === "6-12" ? "#059669" : a.range === "13-18" ? "#d97706" : a.range === "19-35" ? "#7e22ce" : a.range === "36-60" ? "#e11d48" : "#0891b2"
    })).filter((a: any) => a.range !== "Not recorded") : [
        { range: "0-5",          count: 3045,  color: "#2563eb", gradient: "linear-gradient(180deg, #60a5fa 0%, #2563eb 100%)", shadowColor: "rgba(37,99,235,0.3)" },
        { range: "6-12",         count: 4680,  color: "#059669", gradient: "linear-gradient(180deg, #34d399 0%, #059669 100%)", shadowColor: "rgba(5,150,105,0.3)" },
        { range: "13-18",        count: 3635,  color: "#d97706", gradient: "linear-gradient(180deg, #fbbf24 0%, #d97706 100%)", shadowColor: "rgba(217,119,6,0.3)" },
        { range: "19-35",        count: 9330,  color: "#7e22ce", gradient: "linear-gradient(180deg, #c084fc 0%, #7e22ce 100%)", shadowColor: "rgba(126,34,206,0.3)" },
        { range: "36-60",        count: 14266, color: "#e11d48", gradient: "linear-gradient(180deg, #fb7185 0%, #e11d48 100%)", shadowColor: "rgba(225,29,72,0.3)" },
        { range: "60+",          count: 7889,  color: "#0891b2", gradient: "linear-gradient(180deg, #22d3ee 0%, #0891b2 100%)", shadowColor: "rgba(8,145,178,0.3)" }
    ];

    const genderSplit = rawLiveStore?.demographics?.gender_split;
    const genderSlices = genderSplit ? (() => {
        const total = (genderSplit.female || 0) + (genderSplit.male || 0) + (genderSplit.other || 0);
        return [
            { label: "Female", percentage: total ? Math.round((genderSplit.female / total) * 100) : 0, count: genderSplit.female || 0, color: "#d81b60" },
            { label: "Male", percentage: total ? Math.round((genderSplit.male / total) * 100) : 0, count: genderSplit.male || 0, color: "#1d63ed" },
            { label: "Other", percentage: total ? Math.round((genderSplit.other / total) * 100) : 0, count: genderSplit.other || 0, color: "#8b5cf6" }
        ];
    })() : [
        { label: "Female", percentage: 58, count: 25022, color: "#d81b60" },
        { label: "Male", percentage: 42, count: 17897, color: "#1d63ed" },
        { label: "Other", percentage: 0, count: 7, color: "#8b5cf6" }
    ];

    const ptTypes = rawLiveStore?.demographics?.patient_types;
    const patientTypeSlices = ptTypes ? (() => {
        const total = (ptTypes.followUp || 0) + (ptTypes.new || 0) + (ptTypes.notCategorised || 0);
        return [
            { label: "Follow-up", percentage: total ? Math.round((ptTypes.followUp / total) * 100) : 0, count: ptTypes.followUp || 0, color: "#059669" },
            { label: "New", percentage: total ? Math.round((ptTypes.new / total) * 100) : 0, count: ptTypes.new || 0, color: "#2563eb" },
            { label: "Not categorised", percentage: total ? Math.round((ptTypes.notCategorised / total) * 100) : 0, count: ptTypes.notCategorised || 0, color: "#d97706" }
        ];
    })() : [
        { label: "Follow-up", percentage: 5, count: 2603, color: "#059669" },
        { label: "New", percentage: 25, count: 14964, color: "#2563eb" },
        { label: "Not categorised", percentage: 70, count: 41302, color: "#d97706" }
    ];

    const doctorSpecialtyData = rawLiveStore?.doctor_specialties ?? [
        { specialty: "General Physician", count: 21 },
        { specialty: "Dermatologist", count: 8 },
        { specialty: "General Medicine", count: 7 },
        { specialty: "Dentist", count: 6 },
        { specialty: "Oncologist", count: 6 },
        { specialty: "Ent", count: 5 },
        { specialty: "Nutritionist", count: 5 },
        { specialty: "Paediatrician", count: 5 },
        { specialty: "Psychogist", count: 5 },
        { specialty: "Gynarlogist", count: 4 },
        { specialty: "Community Healthcare Specialist", count: 4 },
        { specialty: "Opthamologist", count: 4 },
        { specialty: "Physiotherapist", count: 4 },
        { specialty: "Diabetologist", count: 3 },
        { specialty: "Medical Oncologist", count: 3 },
        { specialty: "Gynecologist", count: 2 },
        { specialty: "Nephrologist", count: 2 },
        { specialty: "Neurologist", count: 2 },
        { specialty: "Oerthopedic", count: 2 },
        { specialty: "Pulmonogist", count: 2 },
        { specialty: "Urologist", count: 2 },
        { specialty: "Cardiologist General", count: 1 },
        { specialty: "Cardiology", count: 1 },
        { specialty: "Clinical Dietitan", count: 1 },
        { specialty: "Clinical Nutrionist", count: 1 },
        { specialty: "Dentistey", count: 1 },
        { specialty: "Dermatology And Leprosy", count: 1 },
        { specialty: "Family physician ,A Surgeon of Standing And Proctological", count: 1 },
        { specialty: "Gastronterologist", count: 1 },
        { specialty: "General Physiciean,Gynaecologist", count: 1 },
        { specialty: "Genaral Surgeon", count: 1 },
        { specialty: "General Surgeon,Gastrointestinal Endo Surgeons", count: 1 },
        { specialty: "Gynecologist,General physiciean", count: 1 },
        { specialty: "Gynecology &Obstetrics", count: 1 },
        { specialty: "Hepatologist", count: 1 },
        { specialty: "Homopathic", count: 1 },
        { specialty: "Neurosurgeon", count: 1 },
        { specialty: "Opthathmology", count: 1 },
        { specialty: "Oral And Dental Care", count: 1 },
        { specialty: "Orthopaedics.MS", count: 1 },
        { specialty: "Pediatric Hemato Oncology", count: 1 },
        { specialty: "Peditrician", count: 1 },
        { specialty: "Phychitrist", count: 1 },
        { specialty: "Thoracis surgeon", count: 1 }
    ];

    return (
        <main className="min-h-screen bg-[#f4f8f6] flex flex-col justify-between font-sans">
            <div>
                <Navbar />

                {/* Hero Section */}
                <ImpactHero />

                <div className="container max-w-7xl mx-auto px-4 pt-6">

                    {/* Top 5 KPI Summary Cards (Image 1) */}
                    <PortalKPICards data={kpiData} />

                    {/* Side-by-side Compact Line Charts Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        {/* Patient Growth Smooth Line Curve (Image 2) */}
                        <PortalSmoothLineChart
                            title="PATIENT GROWTH"
                            subtitle="Patients registered per period"
                            data={patientGrowthData}
                            lineColor="#2563eb"
                            gradientFrom="#2563eb"
                            maxScale={28000}
                        />

                        {/* Teleconsultation Growth Smooth Line Curve (Image 3) */}
                        <PortalSmoothLineChart
                            title="TELECONSULTATION GROWTH"
                            subtitle="Completed consultations per period"
                            data={teleconsultationGrowthData}
                            lineColor="#059669"
                            gradientFrom="#059669"
                            maxScale={38000}
                        />
                    </div>

                    {/* Consultations by Department & Top Diseases Side-by-side Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        <PortalDepartmentBarChart data={departmentData} />
                        <PortalTopDiseasesChart data={diseaseData} />
                    </div>

                    {/* Age Distribution & Doctors by Specialty Side-by-side Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        <PortalAgeDistributionChart data={ageDistributionData} />
                        <PortalDoctorsSpecialtyChart data={doctorSpecialtyData} />
                    </div>

                    {/* Gender Distribution & New vs Follow-up Donut Pair (Image 7) */}
                    <PortalDonutPair genderData={genderSlices} patientTypeData={patientTypeSlices} />
                </div>

                {/* Geographic Interactive Reach Map with Integrated District Search */}
                <InteractiveReachMap districtList={data.regionalReach} totalVillages={633} />

                {/* Journey Timeline */}
                <ImpactTimeline />
            </div>

            <Footer />
        </main>
    );
}
