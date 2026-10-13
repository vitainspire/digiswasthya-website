export interface LocalizedString {
    en: string;
    hi: string;
}

export interface KPICardData {
    id: string;
    value: number;
    suffix?: string;
    label: LocalizedString;
    icon: string;
    description: LocalizedString;
}

export interface GrowthChartPoint {
    year: string;
    patients: number;
    camps: number;
    doctors: number;
}

export interface TeleconsultationGrowthPoint {
    year: string;
    consultations: number;
}

export interface DiseaseDistributionItem {
    name: LocalizedString;
    value: number;
    color: string;
}

export interface RegionalReachItem {
    district: LocalizedString;
    count: number;
}

export interface MilestoneItem {
    year: string;
    title: LocalizedString;
    description: LocalizedString;
    icon: string;
}

export interface ConsultationByDeptItem {
    department: LocalizedString;
    count: number;
    color: string;
}

export interface DoctorsBySpecialtyItem {
    specialty: LocalizedString;
    count: number;
    color: string;
}

export interface AgeDistributionItem {
    ageGroup: string;
    count: number;
    color: string;
}

export interface GenderItem {
    gender: LocalizedString;
    count: number;
    percentage: number;
    color: string;
}

export interface PatientTypeItem {
    type: LocalizedString;
    count: number;
    percentage: number;
    color: string;
}

export interface ImpactPageData {
    hero: {
        badge: LocalizedString;
        title: LocalizedString;
        subtitle: LocalizedString;
    };
    kpis: KPICardData[];
    growthTrends: GrowthChartPoint[];
    teleconsultationGrowth: TeleconsultationGrowthPoint[];
    diseaseDistribution: DiseaseDistributionItem[];
    regionalReach: RegionalReachItem[];
    timeline: MilestoneItem[];
    consultationByDepartment: ConsultationByDeptItem[];
    doctorsBySpecialty: DoctorsBySpecialtyItem[];
    ageDistribution: AgeDistributionItem[];
    genderDistribution: GenderItem[];
    patientTypeDistribution: PatientTypeItem[];
}

// Caption shown under headline KPI figures. Update when the signed-off KPIs are refreshed.
export const impactAsOf: LocalizedString = {
    en: "Totals since July 2020, as of October 2026",
    hi: "जुलाई 2020 से अब तक के कुल आँकड़े, अक्टूबर 2026 तक"
};

export const impactData: ImpactPageData = {
    hero: {
        badge: {
            en: "Transparent Social Impact",
            hi: "पारदर्शी सामाजिक प्रभाव"
        },
        title: {
            en: "Our Measurable Healthcare Impact",
            hi: "हमारा मापने योग्य स्वास्थ्य प्रभाव"
        },
        subtitle: {
            en: "Live aggregate figures updated weekly from the DigiSwasthya Management Portal. Explore our healthcare reach, teleconsultations, and demographic distribution.",
            hi: "डिजीस्वास्थ्य प्रबंधन पोर्टल से साप्ताहिक रूप से अपडेट किए गए लाइव आंकड़े। हमारी स्वास्थ्य पहुंच, टेलीमेडिसिन परामर्श और जनसांख्यिकीय वितरण का अन्वेषण करें।"
        }
    },

    // ─── TOP 5 KPI CARDS (Matching Management Portal Header) ─────────────────────
    kpis: [
        {
            id: "total-consultations",
            value: 144796,
            label: { en: "Teleconsultations", hi: "टेली-परामर्श" },
            icon: "Stethoscope",
            description: {
                en: "Teleconsultations completed, July 2020 to September 2026.",
                hi: "जुलाई 2020 से सितंबर 2026 तक पूरे किए गए टेली-परामर्श।"
            }
        },
        {
            id: "vitals-checkups",
            value: 167667,
            label: { en: "Vitals Checkups", hi: "वाइटल्स जांच" },
            icon: "HeartPulse",
            description: {
                en: "Vitals checkups conducted, July 2020 to September 2026.",
                hi: "जुलाई 2020 से सितंबर 2026 तक की गई वाइटल्स जांच।"
            }
        },
        {
            id: "villages-covered",
            value: 2305,
            label: { en: "Villages Covered", hi: "गाँव कवर किए" },
            icon: "MapPin",
            description: {
                en: "Villages reached, July 2020 to September 2026.",
                hi: "जुलाई 2020 से सितंबर 2026 तक पहुँचे गाँव।"
            }
        },
        {
            id: "ayushman-cards",
            value: 46753,
            label: { en: "Ayushman Cards Created", hi: "आयुष्मान कार्ड बनाए गए" },
            icon: "IdCard",
            description: {
                en: "Ayushman Cards created for eligible families, till 10 October 2026.",
                hi: "10 अक्टूबर 2026 तक पात्र परिवारों के लिए बनाए गए आयुष्मान कार्ड।"
            }
        },
        {
            id: "health-camps",
            value: 2376,
            label: { en: "Health Camps Conducted", hi: "स्वास्थ्य शिविर आयोजित" },
            icon: "Tent",
            description: {
                en: "On-ground medical camps conducted for rural communities.",
                hi: "ग्रामीण समुदायों के लिए आयोजित जमीनी चिकित्सा शिविर।"
            }
        },
        {
            id: "cancer-patients-served",
            value: 687,
            label: { en: "Cancer Patients Served", hi: "कैंसर रोगियों की सेवा" },
            icon: "HeartHandshake",
            description: {
                en: "Cancer patients supported through DigiSwasthya.",
                hi: "डिजीस्वास्थ्य के माध्यम से सहायता प्राप्त कैंसर रोगी।"
            }
        },
        {
            id: "cancer-screenings",
            value: 16338,
            label: { en: "Cancer Screenings", hi: "कैंसर स्क्रीनिंग" },
            icon: "ScanSearch",
            description: {
                en: "Oral, breast, and cervical cancer screenings.",
                hi: "मुख, स्तन और गर्भाशय ग्रीवा कैंसर की स्क्रीनिंग।"
            }
        },
        {
            id: "cancer-screening-camps",
            value: 132,
            label: { en: "Cancer Screening Camps", hi: "कैंसर स्क्रीनिंग शिविर" },
            icon: "Tent",
            description: {
                en: "Camps dedicated to cancer screening.",
                hi: "कैंसर स्क्रीनिंग के लिए समर्पित शिविर।"
            }
        }
    ],

    // ─── GROWTH TRENDS ──────────────────────────────────────────────────────────
    growthTrends: [
        { year: "2024", patients: 2, camps: 1, doctors: 40 },
        { year: "2025", patients: 19823, camps: 3, doctors: 90 },
        { year: "2026", patients: 27223, camps: 5, doctors: 125 }
    ],

    teleconsultationGrowth: [
        { year: "2024", consultations: 2 },
        { year: "2025", consultations: 20986 },
        { year: "2026", consultations: 37880 }
    ],

    // ─── TOP DISEASES (Horizontal Bar Chart) ────────────────────────────────────
    diseaseDistribution: [
        { name: { en: "Common Cold & Throat Infection (URTI)", hi: "ऊपरी श्वसन पथ संक्रमण (URTI)" }, value: 3247, color: "#8b5cf6" },
        { name: { en: "High Blood Pressure (Hypertension)", hi: "उच्च रक्तचाप (हाइपरटेंशन)" }, value: 2376, color: "#8b5cf6" },
        { name: { en: "Skin Rash & Irritation (Eczema)", hi: "एक्जिमा (त्वचा की स्थिति)" }, value: 1431, color: "#8b5cf6" },
        { name: { en: "Fungal Skin Infection (Ringworm)", hi: "टीनिया (फंगल संक्रमण)" }, value: 1318, color: "#8b5cf6" },
        { name: { en: "Severe Dry Skin (Xerosis)", hi: "जेरोसिस (गंभीर सूखी त्वचा)" }, value: 795, color: "#8b5cf6" },
        { name: { en: "Sudden Fever Illness", hi: "तीव्र ज्वर बीमारी" }, value: 778, color: "#8b5cf6" },
        { name: { en: "Chest & Lung Infection (LRTI)", hi: "निचला श्वसन संक्रमण (LRTI)" }, value: 774, color: "#8b5cf6" },
        { name: { en: "Stomach Inflammation (Gastritis)", hi: "गैस्ट्राइटिस (पेट की सूजन)" }, value: 675, color: "#8b5cf6" },
        { name: { en: "General Weakness & Fatigue", hi: "सामान्य कमजोरी और थकान" }, value: 624, color: "#8b5cf6" },
        { name: { en: "Type 2 Diabetes (Sugar Disease)", hi: "टाइप 2 मधुमेह (T2DM)" }, value: 602, color: "#8b5cf6" },
        { name: { en: "Joint Pain & Inflammation", hi: "जोड़ों का दर्द और सूजन" }, value: 587, color: "#8b5cf6" },
        { name: { en: "Age-Related Health Decline", hi: "उम्र संबंधी स्वास्थ्य ह्रास" }, value: 524, color: "#8b5cf6" },
        { name: { en: "Acne & Skin Irritation", hi: "मुहासे और त्वचा रोग" }, value: 504, color: "#8b5cf6" },
        { name: { en: "Knee Pain & Joint Wear (Osteoarthritis)", hi: "घुटने का दर्द और ऑस्टियोआर्थराइटिस" }, value: 499, color: "#8b5cf6" }
    ],

    // ─── CONSULTATION BY DEPARTMENT ─────────────────────────────────────────────
    consultationByDepartment: [
        { department: { en: "General Medicine", hi: "सामान्य चिकित्सा" }, count: 15967, color: "#2563eb" },
        { department: { en: "Dermatology", hi: "त्वचा रोग" }, count: 10223, color: "#2563eb" },
        { department: { en: "Pediatrics", hi: "बाल रोग" }, count: 3700, color: "#2563eb" },
        { department: { en: "Gynecology", hi: "स्त्री रोग" }, count: 3513, color: "#2563eb" },
        { department: { en: "Orthopaedics (MS)", hi: "हड्डी रोग (MS)" }, count: 3307, color: "#2563eb" },
        { department: { en: "General Physician", hi: "सामान्य चिकित्सक" }, count: 3245, color: "#2563eb" },
        { department: { en: "Pediatrician", hi: "बाल चिकित्सा" }, count: 2889, color: "#2563eb" },
        { department: { en: "Internal Medicine", hi: "आंतरिक चिकित्सा" }, count: 2691, color: "#2563eb" },
        { department: { en: "General Physician & Gynaecology", hi: "सामान्य चिकित्सा व स्त्री रोग" }, count: 2132, color: "#2563eb" },
        { department: { en: "Orthopedics", hi: "ऑर्थोपेडिक्स" }, count: 2089, color: "#2563eb" },
        { department: { en: "Orthopaedic", hi: "हड्डी रोग विशेषज्ञ" }, count: 1976, color: "#2563eb" },
        { department: { en: "ENT (Ear, Nose & Throat)", hi: "कान, नाक, गला" }, count: 1143, color: "#2563eb" },
        { department: { en: "Homeopathy", hi: "होम्योपैथिक" }, count: 498, color: "#2563eb" },
        { department: { en: "Neurology", hi: "न्यूरोलॉजी" }, count: 453, color: "#2563eb" },
        { department: { en: "Ophthalmology (Specialist)", hi: "नेत्र विशेषज्ञ" }, count: 323, color: "#2563eb" },
        { department: { en: "Dermatology & Leprosy", hi: "त्वचा एवं कुष्ठ रोग" }, count: 180, color: "#2563eb" },
        { department: { en: "Cardiology", hi: "हृदय रोग" }, count: 150, color: "#2563eb" },
        { department: { en: "Ophthalmology (Consultant)", hi: "नेत्र सलाहकार" }, count: 140, color: "#2563eb" },
        { department: { en: "Dentistry (General)", hi: "दंत चिकित्सा" }, count: 135, color: "#2563eb" },
        { department: { en: "Dentist", hi: "दंत चिकित्सक" }, count: 115, color: "#2563eb" },
        { department: { en: "Ophthalmology", hi: "नेत्र विज्ञान" }, count: 68, color: "#2563eb" },
        { department: { en: "Clinical Dietitian", hi: "नैदानिक ​​आहार विशेषज्ञ" }, count: 55, color: "#2563eb" },
        { department: { en: "Gynecologist", hi: "स्त्री रोग विशेषज्ञ" }, count: 49, color: "#2563eb" },
        { department: { en: "Medical Oncology", hi: "मेडिकल ऑन्कोलॉजी" }, count: 33, color: "#2563eb" },
        { department: { en: "Oncology", hi: "ऑन्कोलॉजी" }, count: 25, color: "#2563eb" },
        { department: { en: "General & Gastrointestinal Surgery", hi: "सामान्य एवं जठरांत्र संबंधी सर्जरी" }, count: 20, color: "#2563eb" },
        { department: { en: "Diabetology", hi: "मधुमेह विज्ञान" }, count: 18, color: "#2563eb" },
        { department: { en: "Gynecology & Obstetrics", hi: "स्त्री रोग एवं प्रसूति विज्ञान" }, count: 18, color: "#2563eb" },
        { department: { en: "Physiotherapy", hi: "फिजियोथेरेपी" }, count: 15, color: "#2563eb" },
        { department: { en: "Clinical Nutrition", hi: "नैदानिक ​​पोषण" }, count: 14, color: "#2563eb" },
        { department: { en: "General Surgery", hi: "सामान्य सर्जरी" }, count: 14, color: "#2563eb" },
        { department: { en: "Pulmonology", hi: "पल्मोनोलॉजी" }, count: 14, color: "#2563eb" },
        { department: { en: "Nephrology", hi: "नेफ्रोलॉजी" }, count: 13, color: "#2563eb" },
        { department: { en: "Oral & Dental Care", hi: "मौखिक एवं दंत देखभाल" }, count: 10, color: "#2563eb" },
        { department: { en: "Gastroenterology", hi: "गैस्ट्रोएंटरोलॉजी" }, count: 6, color: "#2563eb" },
        { department: { en: "Psychiatry", hi: "मनोचिकित्सा" }, count: 4, color: "#2563eb" },
        { department: { en: "Nutritionist", hi: "न्यूट्रिशनिस्ट" }, count: 3, color: "#2563eb" },
        { department: { en: "Orthopaedics", hi: "ऑर्थोपेडिक्स" }, count: 3, color: "#2563eb" },
        { department: { en: "Psychology", hi: "मनोविज्ञान" }, count: 3, color: "#2563eb" },
        { department: { en: "General Cardiology", hi: "सामान्य कार्डियोलॉजी" }, count: 2, color: "#2563eb" },
        { department: { en: "Pediatric Hemato-Oncology", hi: "बाल रोग हेमेटो-ऑन्कोलॉजी" }, count: 2, color: "#2563eb" }
    ],

    // ─── DOCTORS BY SPECIALTY (Horizontal Bar Chart) ────────────────────────────
    doctorsBySpecialty: [
        { specialty: { en: "General Physician", hi: "सामान्य चिकित्सक" }, count: 21, color: "#059669" },
        { specialty: { en: "Dermatologist", hi: "त्वचा रोग" }, count: 8, color: "#059669" },
        { specialty: { en: "General Medicine", hi: "सामान्य चिकित्सा" }, count: 7, color: "#059669" },
        { specialty: { en: "Dentist", hi: "दंत चिकित्सक" }, count: 6, color: "#059669" },
        { specialty: { en: "Oncologist", hi: "ऑन्कोलॉजिस्ट" }, count: 6, color: "#059669" },
        { specialty: { en: "Ent", hi: "ईएनटी" }, count: 5, color: "#059669" },
        { specialty: { en: "Nutritionist", hi: "न्यूट्रिशनिस्ट" }, count: 5, color: "#059669" },
        { specialty: { en: "Paediatrician", hi: "बाल रोग" }, count: 5, color: "#059669" },
        { specialty: { en: "Psychogist", hi: "मनोवैज्ञानिक" }, count: 5, color: "#059669" },
        { specialty: { en: "Gynarlogist", hi: "स्त्री रोग" }, count: 4, color: "#059669" },
        { specialty: { en: "Community Healthcare Specialist", hi: "सामुदायिक स्वास्थ्य विशेषज्ञ" }, count: 4, color: "#059669" },
        { specialty: { en: "Opthamologist", hi: "नेत्र रोग" }, count: 4, color: "#059669" },
        { specialty: { en: "Physiotherapist", hi: "फिजियोथेरेपिस्ट" }, count: 4, color: "#059669" },
        { specialty: { en: "Diabetologist", hi: "डायबिटीज विशेषज्ञ" }, count: 3, color: "#059669" },
        { specialty: { en: "Medical Oncologist", hi: "मेडिकल ऑन्कोलॉजिस्ट" }, count: 3, color: "#059669" },
        { specialty: { en: "Gynecologist", hi: "स्त्री रोग विशेषज्ञ" }, count: 2, color: "#059669" },
        { specialty: { en: "Nephrologist", hi: "नेफ्रोलॉजिस्ट" }, count: 2, color: "#059669" },
        { specialty: { en: "Neurologist", hi: "न्यूरोलॉजिस्ट" }, count: 2, color: "#059669" },
        { specialty: { en: "Oerthopedic", hi: "ऑर्थोपेडिक" }, count: 2, color: "#059669" },
        { specialty: { en: "Pulmonogist", hi: "पल्मोनोलॉजिस्ट" }, count: 2, color: "#059669" },
        { specialty: { en: "Urologist", hi: "यूरोलॉजिस्ट" }, count: 2, color: "#059669" },
        { specialty: { en: "Cardiologist General", hi: "सामान्य कार्डियोलॉजिस्ट" }, count: 1, color: "#059669" },
        { specialty: { en: "Cardiology", hi: "हृदय रोग" }, count: 1, color: "#059669" },
        { specialty: { en: "Clinical Dietitan", hi: "नैदानिक ​​आहार विशेषज्ञ" }, count: 1, color: "#059669" },
        { specialty: { en: "Clinical Nutrionist", hi: "नैदानिक ​​न्यूट्रिशनिस्ट" }, count: 1, color: "#059669" },
        { specialty: { en: "Dentistey", hi: "दंत चिकित्सा" }, count: 1, color: "#059669" },
        { specialty: { en: "Dermatology And Leprosy", hi: "त्वचा एवं कुष्ठ रोग" }, count: 1, color: "#059669" },
        { specialty: { en: "Family physician ,A Surgeon of Standing And Proctological", hi: "पारिवारिक डॉक्टर एवं सर्जन" }, count: 1, color: "#059669" },
        { specialty: { en: "Gastronterologist", hi: "गैस्ट्रोएंटेरोलॉजिस्ट" }, count: 1, color: "#059669" },
        { specialty: { en: "General Physiciean,Gynaecologist", hi: "सामान्य चिकित्सक व स्त्री रोग" }, count: 1, color: "#059669" },
        { specialty: { en: "Genaral Surgeon", hi: "सामान्य सर्जन" }, count: 1, color: "#059669" },
        { specialty: { en: "General Surgeon,Gastrointestinal Endo Surgeons", hi: "सामान्य व जठरांत्र सर्जन" }, count: 1, color: "#059669" },
        { specialty: { en: "Gynecologist,General physiciean", hi: "स्त्री रोग व सामान्य डॉक्टर" }, count: 1, color: "#059669" },
        { specialty: { en: "Gynecology &Obstetrics", hi: "स्त्री रोग व प्रसूति विज्ञान" }, count: 1, color: "#059669" },
        { specialty: { en: "Hepatologist", hi: "हेपेटोलॉजिस्ट" }, count: 1, color: "#059669" },
        { specialty: { en: "Homopathic", hi: "होम्योपैथिक" }, count: 1, color: "#059669" },
        { specialty: { en: "Neurosurgeon", hi: "न्यूरोसर्जन" }, count: 1, color: "#059669" },
        { specialty: { en: "Opthathmology", hi: "नेत्र विज्ञान" }, count: 1, color: "#059669" },
        { specialty: { en: "Oral And Dental Care", hi: "मौखिक एवं दंत देखरेख" }, count: 1, color: "#059669" },
        { specialty: { en: "Orthopaedics.MS", hi: "हड्डी रोग MS" }, count: 1, color: "#059669" },
        { specialty: { en: "Pediatric Hemato Oncology", hi: "बाल रोग हेमेटो ऑन्कोलॉजी" }, count: 1, color: "#059669" },
        { specialty: { en: "Peditrician", hi: "बाल चिकित्सा" }, count: 1, color: "#059669" },
        { specialty: { en: "Phychitrist", hi: "मनोचिकित्सक" }, count: 1, color: "#059669" },
        { specialty: { en: "Thoracis surgeon", hi: "थॉरेसिक सर्जन" }, count: 1, color: "#059669" }
    ],

    // ─── AGE DISTRIBUTION (7 Bands Multi-Color) ────────────────────────────────
    ageDistribution: [
        { ageGroup: "0-5",          count: 3045,  color: "#2563eb" },
        { ageGroup: "6-12",         count: 4680,  color: "#059669" },
        { ageGroup: "13-18",        count: 3635,  color: "#d97706" },
        { ageGroup: "19-35",        count: 9330,  color: "#8b5cf6" },
        { ageGroup: "36-60",        count: 14266, color: "#ef4444" },
        { ageGroup: "60+",          count: 7889,  color: "#0891b2" },
        { ageGroup: "Not recorded", count: 81,    color: "#ec4899" }
    ],

    // ─── GENDER DISTRIBUTION ────────────────────────────────────────────────────
    genderDistribution: [
        { gender: { en: "Female", hi: "महिला" }, count: 25022, percentage: 58, color: "#059669" },
        { gender: { en: "Male",   hi: "पुरुष" },  count: 17897, percentage: 42, color: "#1e3a8a" },
        { gender: { en: "Other",  hi: "अन्य" },  count: 7,     percentage: 0,  color: "#38bdf8" }
    ],

    // ─── NEW VS FOLLOW-UP ───────────────────────────────────────────────────────
    patientTypeDistribution: [
        { type: { en: "Follow-up",      hi: "अनुवर्ती" },      count: 2603,  percentage: 5,  color: "#059669" },
        { type: { en: "New",            hi: "नए मरीज" },      count: 14964, percentage: 25, color: "#2563eb" },
        { type: { en: "Not categorised",hi: "अवर्गीकृत" },    count: 41302, percentage: 70, color: "#d97706" }
    ],

    // ─── DISTRICTS COVERED (84 Districts · 633 Villages) ────────────────────────
    regionalReach: [
        { district: { en: "Nagpur", hi: "नागपुर" }, count: 14430 },
        { district: { en: "Pune", hi: "पुणे" }, count: 6595 },
        { district: { en: "Sant Kabir Nagar", hi: "संत कबीर नगर" }, count: 2473 },
        { district: { en: "Lucknow", hi: "लखनऊ" }, count: 1965 },
        { district: { en: "Sant Kabeer Nagar", hi: "संत कबीर नगर" }, count: 895 },
        { district: { en: "Barabanki", hi: "बाराबंकी" }, count: 438 },
        { district: { en: "Raigad", hi: "रायगढ़" }, count: 249 },
        { district: { en: "Nashik", hi: "नाशिक" }, count: 188 },
        { district: { en: "Palghar", hi: "पालघर" }, count: 163 },
        { district: { en: "Gorakhpur", hi: "गोरखपुर" }, count: 60 },
        { district: { en: "Muzaffarpur", hi: "मुजफ्फरपुर" }, count: 25 },
        { district: { en: "Jharkhand", hi: "झारखंड" }, count: 19 },
        { district: { en: "Mumbai City", hi: "मुंबई शहर" }, count: 18 },
        { district: { en: "New Delhi", hi: "नई दिल्ली" }, count: 17 },
        { district: { en: "Varanasi", hi: "वाराणसी" }, count: 17 },
        { district: { en: "Nagaur", hi: "नागौर" }, count: 16 },
        { district: { en: "Basti", hi: "बस्ती" }, count: 8 },
        { district: { en: "Chandauli", hi: "चंदौली" }, count: 8 },
        { district: { en: "Giridih", hi: "गिरिडीह" }, count: 5 },
        { district: { en: "Ludhiana", hi: "लुधियाना" }, count: 5 },
        { district: { en: "Patna", hi: "पटना" }, count: 4 },
        { district: { en: "Rae Bareli", hi: "रायबरेली" }, count: 4 },
        { district: { en: "Bhandara", hi: "भंडारा" }, count: 3 },
        { district: { en: "Bihar", hi: "बिहार" }, count: 3 },
        { district: { en: "East Champaran", hi: "पूर्वी चंपारण" }, count: 3 },
        { district: { en: "Mumbai", hi: "मुंबई" }, count: 3 },
        { district: { en: "Ranchi", hi: "रांची" }, count: 3 },
        { district: { en: "Sejalpur", hi: "सेजलपुर" }, count: 3 },
        { district: { en: "Thane", hi: "ठाणे" }, count: 3 },
        { district: { en: "Bengaluru Urban", hi: "बेंगलुरु अर्बन" }, count: 2 },
        { district: { en: "Bkt", hi: "बीकेटी" }, count: 2 },
        { district: { en: "Chandrapur", hi: "चंद्रपुर" }, count: 2 },
        { district: { en: "Gautam Buddha Nagar", hi: "गौतम बुद्ध नगर" }, count: 2 },
        { district: { en: "Gaya", hi: "गया" }, count: 2 },
        { district: { en: "Kanpur Nagar", hi: "कानपुर नगर" }, count: 2 },
        { district: { en: "Khairthal Tijara", hi: "खैरथल तिजारा" }, count: 2 },
        { district: { en: "Nagpure", hi: "नागपुर" }, count: 2 },
        { district: { en: "Pathankot", hi: "पठानकोट" }, count: 2 },
        { district: { en: "Puri", hi: "पुरी" }, count: 2 },
        { district: { en: "Shahjahanpur", hi: "शाहजहांपुर" }, count: 2 },
        { district: { en: "Tehri Garhwal", hi: "टिहरी गढ़वाल" }, count: 2 },
        { district: { en: "West Champaran", hi: "पश्चिम चंपारण" }, count: 2 },
        { district: { en: "Agar Malwa", hi: "आगर मालवा" }, count: 1 },
        { district: { en: "Ajmer", hi: "अजमेर" }, count: 1 },
        { district: { en: "Aligarh", hi: "अलीगढ़" }, count: 1 },
        { district: { en: "Ambala", hi: "अम्बाला" }, count: 1 },
        { district: { en: "Banda", hi: "बांदा" }, count: 1 },
        { district: { en: "Bhojpur", hi: "भोजपुर" }, count: 1 },
        { district: { en: "Birbhum", hi: "बीरभूम" }, count: 1 },
        { district: { en: "Central Delhi", hi: "सेंट्रल दिल्ली" }, count: 1 },
        { district: { en: "Chandigarh", hi: "चंडीगढ़" }, count: 1 },
        { district: { en: "Deogarh", hi: "देवगढ़" }, count: 1 },
        { district: { en: "Durg", hi: "दुर्ग" }, count: 1 },
        { district: { en: "East Chmparan", hi: "पूर्वी चंपारण" }, count: 1 },
        { district: { en: "Gurugram", hi: "गुरुग्राम" }, count: 1 },
        { district: { en: "Hazaribagh", hi: "हजारीबाग" }, count: 1 },
        { district: { en: "Jamm", hi: "जम्मू" }, count: 1 },
        { district: { en: "Javahar Palghar", hi: "जवाहर पालघर" }, count: 1 },
        { district: { en: "Maharashtra", hi: "महाराष्ट्र" }, count: 1 },
        { district: { en: "Manali", hi: "मनाली" }, count: 1 }
    ],

    // ─── TIMELINE (UNTOUCHED) ───────────────────────────────────────────────────
    timeline: [
        {
            year: "2020",
            title: { en: "Organisation Founded", hi: "संगठन की स्थापना" },
            description: {
                en: "DigiSwasthya Foundation was registered as an NGO, with the core mission of bridging the rural healthcare gap using technology.",
                hi: "डिजीस्वास्थ्य फाउंडेशन को एक गैर सरकारी संगठन (NGO) के रूप में पंजीकृत किया गया, जिसका मुख्य उद्देश्य प्रौद्योगिकी का उपयोग करके ग्रामीण स्वास्थ्य सेवा के अंतर को पाटना था।"
            },
            icon: "Building"
        },
        {
            year: "2021",
            title: { en: "First Community Health Camp", hi: "पहला सामुदायिक स्वास्थ्य शिविर" },
            description: {
                en: "Conducted our first physical health and awareness camp in a remote village, validating the on-the-ground needs of rural patients.",
                hi: "एक सुदूर गाँव में अपना पहला भौतिक स्वास्थ्य और जागरूकता शिविर आयोजित किया, जिससे ग्रामीण रोगियों की जमीनी जरूरतों की पुष्टि हुई।"
            },
            icon: "Activity"
        },
        {
            year: "2022",
            title: { en: "Expansion to Multiple Districts", hi: "कई जिलों में विस्तार" },
            description: {
                en: "Scaled outreach to cover villages in multiple adjoining districts, establishing a reliable volunteer network.",
                hi: "एक विश्वसनीय स्वयंसेवक नेटवर्क स्थापित करते हुए, कई निकटवर्ती जिलों के गांवों को कवर करने के लिए पहुंच का विस्तार किया।"
            },
            icon: "Users"
        },
        {
            year: "2023",
            title: { en: "Telemedicine Programme Launch", hi: "टेलीमेडिसिन कार्यक्रम का शुभारंभ" },
            description: {
                en: "Inaugurated dedicated digital teleconsultation nodes linking rural centres with specialist doctors in Tier 1 cities.",
                hi: "टियर 1 शहरों में विशेषज्ञ डॉक्टरों के साथ ग्रामीण केंद्रों को जोड़ने वाले समर्पित डिजिटल टेली-परामर्श नोड्स का उद्घाटन किया।"
            },
            icon: "Stethoscope"
        },
        {
            year: "2024",
            title: { en: "National Recognition & Scaled Operations", hi: "राष्ट्रीय मान्यता और उन्नत संचालन" },
            description: {
                en: "Certified as a Great Place to Work, while expanding tele-clinics to new rural districts and serving over 90,000 patients.",
                hi: "महान कार्यस्थल (Great Place to Work) के रूप में प्रमाणित, जबकि नए ग्रामीण जिलों में टेली-क्लीनिक का विस्तार किया और 90,000 से अधिक रोगियों की सेवा की।"
            },
            icon: "Award"
        },
        {
            year: "2025",
            title: { en: "100,000+ Patients Served", hi: "1,00,000+ मरीजों की सेवा" },
            description: {
                en: "Reached a major milestone of directly treating over 100,000 individuals through telemedicine consultations and regional checkup camps.",
                hi: "टेलीमेडिसिन परामर्श और क्षेत्रीय जांच शिविरों के माध्यम से सीधे 1,00,000 से अधिक व्यक्तियों का इलाज करने का एक बड़ा मील का पत्थर हासिल किया।"
            },
            icon: "HeartHandshake"
        },
        {
            year: "2030",
            title: { en: "Future Vision 2030", hi: "भविष्य की दृष्टि 2030" },
            description: {
                en: "Targeting complete saturation of digital tele-clinics in every rural block of Uttar Pradesh, extending services to over 5 million people.",
                hi: "उत्तर प्रदेश के प्रत्येक ग्रामीण ब्लॉक में डिजिटल टेली-क्लीनिक की पूर्ण संतृप्ति का लक्ष्य, जिससे 50 लाख से अधिक लोगों को सेवाएं दी जा सकें।"
            },
            icon: "TrendingUp"
        }
    ]
};
