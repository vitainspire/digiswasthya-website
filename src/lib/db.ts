import { db } from "./firebase";
import { 
    collection, 
    doc, 
    setDoc, 
    addDoc, 
    getDoc, 
    getDocs, 
    query, 
    where, 
    serverTimestamp,
    updateDoc
} from "firebase/firestore";

export interface DonationRecord {
    id: string; // Razorpay payment ID or Mock ID
    name: string;
    email: string;
    amount: number;
    pan?: string;
    address?: string;
    date?: Date | string | number;
}

export interface SubscriberRecord {
    email: string;
    name: string;
    isSubscribed: boolean;
    createdAt?: Date | string | number;
}

export interface InquiryRecord {
    name: string;
    email?: string;
    phone?: string;
    contactType: string;
    subject?: string;
    message: string;
    location?: string;
    assistanceNeeded?: string;
    language?: string;
}

/**
 * Saves a successful donation record to Firestore
 */
export async function saveDonation(record: DonationRecord) {
    try {
        const docRef = doc(db, "donations", record.id);
        await setDoc(docRef, {
            ...record,
            date: record.date || serverTimestamp()
        });
        console.log(`[Firestore] Saved donation: ${record.id}`);
        return true;
    } catch (error) {
        console.error("[Firestore Error] Failed to save donation:", error);
        throw error;
    }
}

/**
 * Auto-enrolls a donor into the subscribers list
 */
export async function enrollSubscriber(email: string, name: string) {
    try {
        const cleanEmail = email.trim().toLowerCase();
        const docRef = doc(db, "subscribers", cleanEmail);
        
        // We use setDoc to create or merge, keeping their subscription active
        await setDoc(docRef, {
            email: cleanEmail,
            name: name,
            isSubscribed: true,
            createdAt: serverTimestamp()
        }, { merge: true });
        
        console.log(`[Firestore] Enrolled subscriber: ${cleanEmail}`);
        return true;
    } catch (error) {
        console.error("[Firestore Error] Failed to enroll subscriber:", error);
        throw error;
    }
}

/**
 * Unsubscribes a user by setting isSubscribed to false
 */
export async function unsubscribeUser(email: string) {
    try {
        const cleanEmail = email.trim().toLowerCase();
        const docRef = doc(db, "subscribers", cleanEmail);
        
        // Verify if subscriber exists first
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            await updateDoc(docRef, {
                isSubscribed: false
            });
            console.log(`[Firestore] Unsubscribed: ${cleanEmail}`);
            return true;
        } else {
            console.warn(`[Firestore] Subscriber not found for unsubscribe: ${cleanEmail}`);
            return false;
        }
    } catch (error) {
        console.error("[Firestore Error] Failed to unsubscribe:", error);
        throw error;
    }
}

/**
 * Saves an inbound contact/inquiry form submission (general, donor, volunteer, or patient help requests)
 */
export async function saveInquiry(record: InquiryRecord) {
    try {
        const inquiriesCol = collection(db, "inquiries");
        const cleanRecord = Object.fromEntries(
            Object.entries(record).filter(([, value]) => value !== undefined)
        );
        const docRef = await addDoc(inquiriesCol, {
            ...cleanRecord,
            createdAt: serverTimestamp()
        });
        console.log(`[Firestore] Saved inquiry: ${docRef.id}`);
        return docRef.id;
    } catch (error) {
        console.error("[Firestore Error] Failed to save inquiry:", error);
        throw error;
    }
}

export interface SignupRecord {
    type: "donor" | "doctor";
    name: string;
    email: string;
    phone?: string;
    details: Record<string, string>;
    newsletterOptIn?: boolean;
}

/**
 * Saves a donor or doctor signup request from the Join Us page
 */
export async function saveSignup(record: SignupRecord) {
    try {
        const docRef = await addDoc(collection(db, "signups"), {
            ...record,
            phone: record.phone || null,
            status: "new",
            consent: true,
            consentAt: serverTimestamp(),
            createdAt: serverTimestamp()
        });
        console.log(`[Firestore] Saved ${record.type} signup: ${docRef.id}`);
        return docRef.id;
    } catch (error) {
        console.error("[Firestore Error] Failed to save signup:", error);
        throw error;
    }
}

/**
 * Retrieves all active subscribers (isSubscribed === true)
 */
export async function getActiveSubscribers(): Promise<SubscriberRecord[]> {
    try {
        const subscribersCol = collection(db, "subscribers");
        const q = query(subscribersCol, where("isSubscribed", "==", true));
        const querySnapshot = await getDocs(q);
        
        const subscribers: SubscriberRecord[] = [];
        querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            subscribers.push({
                email: data.email,
                name: data.name,
                isSubscribed: data.isSubscribed,
                createdAt: data.createdAt
            });
        });
        
        return subscribers;
    } catch (error) {
        console.error("[Firestore Error] Failed to fetch active subscribers:", error);
        throw error;
    }
}


