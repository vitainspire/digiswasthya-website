import { FieldValue } from "firebase-admin/firestore";
import { getFirebaseAdminDb } from "./firebaseAdmin";

// Server-only: uses the Admin SDK, so Firestore security rules can deny all direct browser access.

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
        const docRef = getFirebaseAdminDb().collection("donations").doc(record.id);
        await docRef.set({
            ...record,
            date: record.date || FieldValue.serverTimestamp()
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
        const docRef = getFirebaseAdminDb().collection("subscribers").doc(cleanEmail);

        // We use set with merge to create or merge, keeping their subscription active
        await docRef.set({
            email: cleanEmail,
            name: name,
            isSubscribed: true,
            createdAt: FieldValue.serverTimestamp()
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
        const docRef = getFirebaseAdminDb().collection("subscribers").doc(cleanEmail);

        // Verify if subscriber exists first
        const docSnap = await docRef.get();
        if (docSnap.exists) {
            await docRef.update({
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
        const cleanRecord = Object.fromEntries(
            Object.entries(record).filter(([, value]) => value !== undefined)
        );
        const docRef = await getFirebaseAdminDb().collection("inquiries").add({
            ...cleanRecord,
            createdAt: FieldValue.serverTimestamp()
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
        const docRef = await getFirebaseAdminDb().collection("signups").add({
            ...record,
            phone: record.phone || null,
            status: "new",
            consent: true,
            consentAt: FieldValue.serverTimestamp(),
            createdAt: FieldValue.serverTimestamp()
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
        const querySnapshot = await getFirebaseAdminDb()
            .collection("subscribers")
            .where("isSubscribed", "==", true)
            .get();

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

