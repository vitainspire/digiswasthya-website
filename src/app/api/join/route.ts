import { NextRequest, NextResponse } from "next/server";
import { enrollSubscriber, saveSignup, type SignupRecord } from "@/lib/db";
import { escapeHtml, getMailer, hasLineBreak } from "@/lib/mail";
import { clientIp, rateLimited } from "@/lib/rateLimit";
import { websiteConfig } from "@/data/websiteConfig";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_FILL_MS = 3000;

const DONOR_INTERESTS: Record<string, string> = {
    "give-once": "Giving once",
    "give-monthly": "Giving every month",
    "sponsor-centre": "Sponsoring a centre or camp",
    csr: "CSR or corporate partnership",
    "learn-more": "Learning more about the work",
};

const DOCTOR_AVAILABILITY: Record<string, string> = {
    "1-2": "1-2 hours a week",
    "3-5": "3-5 hours a week",
    "6-10": "6-10 hours a week",
    "10+": "More than 10 hours a week",
};

class ValidationError extends Error {}

function text(body: Record<string, unknown>, key: string, max: number, required = false): string {
    const raw = body[key];
    if (raw === undefined || raw === null || raw === "") {
        if (required) throw new ValidationError(`${key} is required`);
        return "";
    }
    if (typeof raw !== "string") throw new ValidationError(`${key} must be text`);
    const value = raw.trim();
    if (required && !value) throw new ValidationError(`${key} is required`);
    if (value.length > max) throw new ValidationError(`${key} is too long`);
    return value;
}

function phone(body: Record<string, unknown>, required: boolean): string {
    const value = text(body, "phone", 20, required);
    if (value && !/^\+?[\d\s()-]{8,20}$/.test(value)) throw new ValidationError("phone is invalid");
    return value;
}

function choice(body: Record<string, unknown>, key: string, allowed: Record<string, string>, required: boolean): string {
    const value = text(body, key, 20, required);
    if (value && !(value in allowed)) throw new ValidationError(`${key} is invalid`);
    return value;
}

function parse(body: Record<string, unknown>): SignupRecord {
    const type = body.type;
    if (type !== "donor" && type !== "doctor") throw new ValidationError("type is invalid");
    if (body.consent !== true) throw new ValidationError("consent is required");

    const name = text(body, "name", 100, true);
    const email = text(body, "email", 254, true);
    if (!EMAIL_PATTERN.test(email) || hasLineBreak(email) || hasLineBreak(name)) {
        throw new ValidationError("email is invalid");
    }

    if (type === "donor") {
        return {
            type,
            name,
            email,
            phone: phone(body, false) || undefined,
            newsletterOptIn: body.newsletter === true,
            details: {
                location: text(body, "location", 100),
                interest: choice(body, "interest", DONOR_INTERESTS, true),
                message: text(body, "message", 1000),
            },
        };
    }

    const experience = text(body, "experienceYears", 2);
    if (experience && !/^\d{1,2}$/.test(experience)) throw new ValidationError("experienceYears is invalid");

    return {
        type,
        name,
        email,
        phone: phone(body, true),
        details: {
            registrationNumber: text(body, "registrationNumber", 40, true),
            council: text(body, "council", 100, true),
            qualification: text(body, "qualification", 100, true),
            speciality: text(body, "speciality", 100, true),
            experienceYears: experience,
            workplace: text(body, "workplace", 150),
            availability: choice(body, "availability", DOCTOR_AVAILABILITY, false),
            languages: text(body, "languages", 150),
            message: text(body, "message", 1000),
        },
    };
}

function rows(entries: [string, string][]): string {
    return entries
        .filter(([, value]) => value)
        .map(
            ([label, value]) =>
                `<tr><td style="padding:6px 12px 6px 0;color:#555;vertical-align:top;">${escapeHtml(label)}</td><td style="padding:6px 0;"><strong>${escapeHtml(value)}</strong></td></tr>`
        )
        .join("");
}

async function sendEmails(record: SignupRecord) {
    const mailer = getMailer();
    if (!mailer) return false;

    const { type, name, email, phone, details } = record;
    const isDoctor = type === "doctor";
    const to = isDoctor
        ? process.env.DOCTOR_ONBOARDER_EMAIL || websiteConfig.inquiryEmail
        : process.env.DONOR_INFO_EMAIL || websiteConfig.inquiryEmail;

    const entries: [string, string][] = isDoctor
        ? [
              ["Name", name],
              ["Email", email],
              ["Phone / WhatsApp", phone ?? ""],
              ["Registration number", details.registrationNumber],
              ["Council", details.council],
              ["Qualification", details.qualification],
              ["Speciality", details.speciality],
              ["Years of experience", details.experienceYears],
              ["Workplace and city", details.workplace],
              ["Availability", DOCTOR_AVAILABILITY[details.availability] ?? ""],
              ["Languages", details.languages],
              ["Note", details.message],
          ]
        : [
              ["Name", name],
              ["Email", email],
              ["Phone", phone ?? ""],
              ["City / state", details.location],
              ["Interested in", DONOR_INTERESTS[details.interest] ?? ""],
              ["Wants impact updates", record.newsletterOptIn ? "Yes" : "No"],
              ["Message", details.message],
          ];

    try {
        await mailer.transport.sendMail({
            from: `"DigiSwasthya Website" <${mailer.from}>`,
            to,
            replyTo: email,
            subject: isDoctor
                ? `Doctor signup request: ${name.replace(/[\r\n]/g, " ")} (${details.speciality.replace(/[\r\n]/g, " ")})`
                : `Donor info request: ${name.replace(/[\r\n]/g, " ")}`,
            html: `<div style="font-family:sans-serif;max-width:600px;"><h2 style="color:#00655d;">${isDoctor ? "New doctor signup request" : "New donor info request"}</h2><table>${rows(entries)}</table></div>`,
        });
    } catch (error) {
        console.error("[Join Email Error] Team notification failed:", error);
    }

    try {
        const firstName = escapeHtml(name.split(/\s+/)[0]);
        const body = isDoctor
            ? "Thank you for offering your time to DigiSwasthya. Our doctor onboarding team will review your details and contact you within 24-48 hours to talk about next steps."
            : 'Thank you for your interest in supporting DigiSwasthya. Our team will get back to you within 24-48 hours with the information you asked for. If you would like to give right away, you can <a href="https://digiswasthya.org/donate" style="color:#00655d;">donate here</a>.';
        await mailer.transport.sendMail({
            from: `"DigiSwasthya Foundation" <${mailer.from}>`,
            to: email,
            subject: "We received your request - DigiSwasthya Foundation",
            html: `<div style="font-family:sans-serif;max-width:600px;"><p>Dear ${firstName},</p><p>${body}</p><p>Warm regards,<br/>DigiSwasthya Foundation</p></div>`,
        });
    } catch (error) {
        console.error("[Join Email Error] Confirmation failed:", error);
    }

    return true;
}

export async function POST(req: NextRequest) {
    if (rateLimited(`join:${clientIp(req)}`)) {
        return NextResponse.json({ error: "Too many requests. Please try again in a few minutes." }, { status: 429 });
    }

    let body: Record<string, unknown>;
    try {
        const json = await req.json();
        if (!json || typeof json !== "object" || Array.isArray(json)) throw new Error("not an object");
        body = json as Record<string, unknown>;
    } catch {
        return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    // Bots fill the hidden field or submit instantly; pretend it worked and save nothing.
    const elapsed = typeof body.elapsedMs === "number" ? body.elapsedMs : 0;
    if (body.website || elapsed < MIN_FILL_MS) {
        return NextResponse.json({ status: "ok" });
    }

    let record: SignupRecord;
    try {
        record = parse(body);
    } catch (error) {
        if (error instanceof ValidationError) {
            return NextResponse.json({ error: "Please check the highlighted details and try again." }, { status: 400 });
        }
        throw error;
    }

    try {
        await saveSignup(record);
    } catch {
        return NextResponse.json({ error: "We could not save your request. Please try again." }, { status: 500 });
    }

    if (record.newsletterOptIn) {
        try {
            await enrollSubscriber(record.email, record.name);
        } catch (error) {
            console.error("[Join] Newsletter enrolment failed:", error);
        }
    }

    const emailed = await sendEmails(record);
    return NextResponse.json(emailed ? { status: "ok" } : { status: "ok", warning: "Email configuration missing" });
}
