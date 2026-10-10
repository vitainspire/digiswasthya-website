/**
 * centreData.ts — Single source of truth for all DigiSwasthya telemedicine centre data.
 *
 * USED BY:
 *   - src/components/sections/TelemedicineCentres.tsx  → renders the Network page listing
 *   - src/components/impact/InteractiveReachMap.tsx    → renders the interactive map
 *   - src/hooks/useLiveCentres.ts                      → Firebase real-time hook (imports type)
 *   - src/data/botKnowledge.ts                         → chatbot context
 *
 * To add/remove a centre: update STATIC_CENTRES below ONLY.
 * Both the website and the chatbot will automatically reflect the change.
 */

/**
 * Unified centre record — matches what the seed script writes to Firebase.
 * Supports both the Centres listing page and the InteractiveReachMap.
 */
export interface LiveCentre {
    // Identity
    id: string;           // Firestore doc id e.g. "DS-TMC-001"
    code: string;         // e.g. "DS-TMC-001"
    name: string;         // e.g. "Kathaicha"

    // Location — for listing page
    district: string;     // e.g. "Sant Kabir Nagar"
    state: string;        // e.g. "Uttar Pradesh"
    pincode: string;
    address?: string;
    phone?: string;
    mapLink?: string;

    // Location — for map component
    stateId: string;      // e.g. "up" — must match indiaStates SVG id
    stateHi: string;      // Hindi name of state
    districtHi: string;   // Hindi name of district
    pinX: number;         // SVG map x coordinate
    pinY: number;         // SVG map y coordinate

    // Map styling
    color: string;        // Tailwind fill class e.g. "fill-emerald-500 hover:fill-emerald-600 stroke-emerald-600 stroke-[1.5]"
    accentColor: string;  // e.g. "emerald"

    // Status
    isActive: boolean;
}

// Phone is common across all centres
export const CENTRE_PHONE = "+91 99879 44391";

export const STATIC_CENTRES: LiveCentre[] = [
    // 1. Uttar Pradesh (3 Centres)
    { id: "DS-TMC-001",  code: "DS-TMC-001",  name: "Kathaicha",                     district: "Sant Kabir Nagar", state: "Uttar Pradesh", pincode: "272176", mapLink: "https://maps.app.goo.gl/4gydYNL5zncHEfbVA", stateId: "up", stateHi: "उत्तर प्रदेश", districtHi: "संत कबीर नगर", pinX: 310, pinY: 257, color: "fill-emerald-500 hover:fill-emerald-600 stroke-emerald-600 stroke-[1.5]", accentColor: "emerald", isActive: true },
    { id: "DS-TMC-003",  code: "DS-TMC-003",  name: "Asharafpur",                    district: "Sant Kabir Nagar", state: "Uttar Pradesh", pincode: "272162", mapLink: "https://maps.app.goo.gl/v4DK68qZuXnsaBpF9", stateId: "up", stateHi: "उत्तर प्रदेश", districtHi: "संत कबीर नगर", pinX: 313, pinY: 252, color: "fill-emerald-500 hover:fill-emerald-600 stroke-emerald-600 stroke-[1.5]", accentColor: "emerald", isActive: true },
    { id: "DS-TMC-004",  code: "DS-TMC-004",  name: "Itaunja",                       district: "Lucknow",          state: "Uttar Pradesh", pincode: "226203", stateId: "up", stateHi: "उत्तर प्रदेश", districtHi: "लखनऊ",          pinX: 266, pinY: 247, color: "fill-emerald-500 hover:fill-emerald-600 stroke-emerald-600 stroke-[1.5]", accentColor: "emerald", isActive: true },

    // 2. Maharashtra (14 Centres)
    { id: "DS-TMC-005",  code: "DS-TMC-005",  name: "Gorewada",                      district: "Nagpur",           state: "Maharashtra",   pincode: "440013", stateId: "mh", stateHi: "महाराष्ट्र",    districtHi: "नागपुर",         pinX: 246, pinY: 396, color: "fill-sky-500 hover:fill-sky-600 stroke-sky-600 stroke-[1.5]",         accentColor: "sky",     isActive: true },
    { id: "DS-TMC-006",  code: "DS-TMC-006",  name: "Jagnath Budhwari",              district: "Nagpur",           state: "Maharashtra",   pincode: "440002", stateId: "mh", stateHi: "महाराष्ट्र",    districtHi: "नागपुर",         pinX: 250, pinY: 396, color: "fill-sky-500 hover:fill-sky-600 stroke-sky-600 stroke-[1.5]",         accentColor: "sky",     isActive: true },
    { id: "DS-TMC-007",  code: "DS-TMC-007",  name: "Indira Gandhi Rugnalaya (IGR)", district: "Nagpur",           state: "Maharashtra",   pincode: "440033", stateId: "mh", stateHi: "महाराष्ट्र",    districtHi: "नागपुर",         pinX: 254, pinY: 396, color: "fill-sky-500 hover:fill-sky-600 stroke-sky-600 stroke-[1.5]",         accentColor: "sky",     isActive: true },
    { id: "DS-TMC-008",  code: "DS-TMC-008",  name: "Chinchbhavan",                  district: "Nagpur",           state: "Maharashtra",   pincode: "440037", stateId: "mh", stateHi: "महाराष्ट्र",    districtHi: "नागपुर",         pinX: 244, pinY: 402, color: "fill-sky-500 hover:fill-sky-600 stroke-sky-600 stroke-[1.5]",         accentColor: "sky",     isActive: true },
    { id: "DS-TMC-009",  code: "DS-TMC-009",  name: "Narsala",                       district: "Nagpur",           state: "Maharashtra",   pincode: "440034", stateId: "mh", stateHi: "महाराष्ट्र",    districtHi: "नागपुर",         pinX: 248, pinY: 402, color: "fill-sky-500 hover:fill-sky-600 stroke-sky-600 stroke-[1.5]",         accentColor: "sky",     isActive: true },
    { id: "DS-TMC-010",  code: "DS-TMC-010",  name: "Hasanbagh",                     district: "Nagpur",           state: "Maharashtra",   pincode: "440024", stateId: "mh", stateHi: "महाराष्ट्र",    districtHi: "नागपुर",         pinX: 252, pinY: 402, color: "fill-sky-500 hover:fill-sky-600 stroke-sky-600 stroke-[1.5]",         accentColor: "sky",     isActive: true },
    { id: "DS-TMC-011",  code: "DS-TMC-011",  name: "Chakole",                       district: "Nagpur",           state: "Maharashtra",   pincode: "440008", stateId: "mh", stateHi: "महाराष्ट्र",    districtHi: "नागपुर",         pinX: 246, pinY: 408, color: "fill-sky-500 hover:fill-sky-600 stroke-sky-600 stroke-[1.5]",         accentColor: "sky",     isActive: true },
    { id: "DS-TMC-012",  code: "DS-TMC-012",  name: "Bharatwada, Vijay Nagar",       district: "Nagpur",           state: "Maharashtra",   pincode: "440035", stateId: "mh", stateHi: "महाराष्ट्र",    districtHi: "नागपुर",         pinX: 250, pinY: 408, color: "fill-sky-500 hover:fill-sky-600 stroke-sky-600 stroke-[1.5]",         accentColor: "sky",     isActive: true },
    { id: "DS-TMC-013",  code: "DS-TMC-013",  name: "Peth",                          district: "Pune",             state: "Maharashtra",   pincode: "410512", stateId: "mh", stateHi: "महाराष्ट्र",    districtHi: "पुणे",           pinX: 160, pinY: 448, color: "fill-sky-500 hover:fill-sky-600 stroke-sky-600 stroke-[1.5]",         accentColor: "sky",     isActive: true },
    { id: "DS-TMC-014",  code: "DS-TMC-014",  name: "Rajgurunagar",                  district: "Pune",             state: "Maharashtra",   pincode: "410505", stateId: "mh", stateHi: "महाराष्ट्र",    districtHi: "पुणे",           pinX: 164, pinY: 452, color: "fill-sky-500 hover:fill-sky-600 stroke-sky-600 stroke-[1.5]",         accentColor: "sky",     isActive: true },
    { id: "DS-TMC-015",  code: "DS-TMC-015",  name: "Karanjawane",                   district: "Pune",             state: "Maharashtra",   pincode: "412209", stateId: "mh", stateHi: "महाराष्ट्र",    districtHi: "पुणे",           pinX: 168, pinY: 456, color: "fill-sky-500 hover:fill-sky-600 stroke-sky-600 stroke-[1.5]",         accentColor: "sky",     isActive: true },
    { id: "TMC-DSF0018", code: "TMC-DSF0018", name: "Khodala, Mokhada",              district: "Palghar",          state: "Maharashtra",   pincode: "401604", stateId: "mh", stateHi: "महाराष्ट्र",    districtHi: "पालघर",          pinX: 138, pinY: 416, color: "fill-sky-500 hover:fill-sky-600 stroke-sky-600 stroke-[1.5]",         accentColor: "sky",     isActive: true },
    { id: "TMC-00-DS19", code: "TMC-00-DS19", name: "Borgaon",                       district: "Nashik",           state: "Maharashtra",   pincode: "422211", stateId: "mh", stateHi: "महाराष्ट्र",    districtHi: "नाशिक",          pinX: 154, pinY: 406, color: "fill-sky-500 hover:fill-sky-600 stroke-sky-600 stroke-[1.5]",         accentColor: "sky",     isActive: true },
    { id: "TMC-0020",    code: "TMC-0020",    name: "Khalapur",                      district: "Raigad",           state: "Maharashtra",   pincode: "410202", stateId: "mh", stateHi: "महाराष्ट्र",    districtHi: "रायगड",          pinX: 144, pinY: 442, color: "fill-sky-500 hover:fill-sky-600 stroke-sky-600 stroke-[1.5]",         accentColor: "sky",     isActive: true },
    { id: "TMC-HBT-RAMNAGAR", code: "TMC-HBT-RAMNAGAR", name: "TMC HBT Ramnagar", district: "Thane", state: "Maharashtra", pincode: "400604", address: "5WWV+VJR, Wagle Industrial Estate, Thane West, Thane, Maharashtra 400604", mapLink: "https://maps.app.goo.gl/NU2ex9NfRPRexXFV6?g_st=ic", stateId: "mh", stateHi: "महाराष्ट्र", districtHi: "ठाणे", pinX: 140, pinY: 430, color: "fill-sky-500 hover:fill-sky-600 stroke-sky-600 stroke-[1.5]",         accentColor: "sky",     isActive: true },
    { id: "TMC-UHWC-HAJURI", code: "TMC-UHWC-HAJURI", name: "TMC UHWC Hajuri", district: "Thane", state: "Maharashtra", pincode: "400604", address: "5XV5+VFX, Hazuri Dargah Rd, Wagle Estate, Ambika Nagar No 3, Thane West, Thane, Maharashtra 400604", mapLink: "https://maps.app.goo.gl/GHaVY7vBtSzb3knh6?g_st=ic", stateId: "mh", stateHi: "महाराष्ट्र", districtHi: "ठाणे", pinX: 143, pinY: 433, color: "fill-sky-500 hover:fill-sky-600 stroke-sky-600 stroke-[1.5]",         accentColor: "sky",     isActive: true },

    // 3. Bihar (1 Centre)
    { id: "DS-TMC-002",  code: "DS-TMC-002",  name: "Sahebganj",                     district: "Muzaffarpur",      state: "Bihar",         pincode: "843125", mapLink: "https://maps.app.goo.gl/d8C46korjVmwhAE6A", stateId: "br", stateHi: "बिहार",         districtHi: "मुजफ्फरपुर",    pinX: 354, pinY: 267, color: "fill-amber-500 hover:fill-amber-600 stroke-amber-600 stroke-[1.5]",   accentColor: "amber",   isActive: true },
];
