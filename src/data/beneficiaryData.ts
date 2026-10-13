/**
 * beneficiaryData.ts — Single source of truth for all beneficiary stories and patient testimonials.
 *
 * USED BY:
 *   - src/components/sections/BeneficiaryStories.tsx
 *   - src/data/botKnowledge.ts (chatbot context)
 */

export interface BeneficiaryStory {
    name: string;
    age?: string;
    role?: string;
    condition: string;
    result: string;
    video?: string;
}

export interface Testimonial {
    name: string;
    problem: string;
    body: string;
    image: string | null;
}

export const stories: BeneficiaryStory[] = [
    {
        name: "Pinki Paware",
        age: "41 years",
        role: "ASHA Worker, Nagpur",
        condition: "Severe swelling and pain in leg with no specialist access nearby",
        result: "Connected with Dr. Bhuvnesh Chaturvedi (Bone Specialist) via telemedicine. Swelling reduced, condition under control.",
        video: "/Videos/pinki-paware.mp4",
    },
    {
        name: "Bajrang Sony",
        age: "56 years",
        role: "DigiSwasthya Patient",
        condition: "Suffering from diabetes for over 10 years with no proper medical guidance",
        result: "Received expert consultation through DigiSwasthya. Now managing diabetes with proper medical guidance.",
        video: "/Videos/bajrang-sony.mp4",
    },
];

export const testimonials: Testimonial[] = [
    {
        name: "Balu Katale",
        problem: "Diabetic Foot Ulcers",
        body: "Encountered skin burns on leg due to agricultural chemicals. Learning about DigiSwasthya through a village health camp, sought timely intervention which saved both time and money.",
        image: "/images/testimonials/avatars/balu-katale.jpg"
    },
    {
        name: "Jagruti",
        problem: "Weight Loss Problem",
        body: "Despite treatments from several hospitals, nothing worked. Introduced to DigiSwasthya and spent only Rs. 400 on initial prescription. A strict diet plan resulted in positive recovery.",
        image: "/images/testimonials/avatars/jagruti.jpg"
    },
    {
        name: "Manisha Kumari",
        problem: "Osteosarcoma Cancer",
        body: "Diagnosed with Osteosarcoma cancer and feeling hopeless, DigiSwasthya Foundation connected her with doctors in Mumbai. Thanks to financial assistance from the Ratan Tata Trust, surgery was successfully conducted.",
        image: "/images/testimonials/avatars/manisha-kumari.jpg"
    },
    {
        name: "Sudhanshu Kumar",
        problem: "Lymph Node Swelling",
        body: "Endured persistent lymph node swelling for an entire year with misdiagnoses at three hospitals. After an online consultation through DigiSwasthya, the correct condition was diagnosed and he made a full recovery.",
        image: null
    },
    {
        name: "Bimala Devi",
        problem: "Early-Stage Cancer",
        body: "Diagnosed with early-stage cancer in time through DigiSwasthya's online consultations and tests. Received treatment followed by surgery for full recovery.",
        image: null
    },
    {
        name: "Rajneeta Devi",
        problem: "Breast Cancer",
        body: "DigiSwasthya arranged a second opinion tele-consultation with an oncologist from Homi Bhabha Cancer Hospital. Rajneeta underwent six cycles of chemotherapy, fully recovered, and now runs a small business.",
        image: null
    },
    {
        name: "Ram Dulare",
        problem: "Mouth Ulcer",
        body: "Suffered from severe mouth ulcers for 8 months. Consulted an online doctor from Mumbai through DigiSwasthya, felt significant relief within a week.",
        image: null
    },
    {
        name: "Shiv Daras Yadav",
        problem: "Chronic Skin Condition",
        body: "Visited a DigiSwasthya center after multiple unsuccessful treatments. Through a tele-consultation with a specialist, received a precise diagnosis and condition improved drastically.",
        image: null
    },
    {
        name: "Jaysing Hande",
        problem: "Leg Swelling & Back Pain",
        body: "Consulted Dr. Leena Saxena online through DigiSwasthya. Within 15 days, leg swelling significantly reduced and back pain became manageable.",
        image: null
    }
];
