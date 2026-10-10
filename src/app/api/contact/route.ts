import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { saveInquiry } from "@/lib/db";
import { websiteConfig } from "@/data/websiteConfig";
import { escapeHtml, hasLineBreak } from "@/lib/mail";
import { clientIp, rateLimited } from "@/lib/rateLimit";

const CONTACT_TYPES = ["General Inquiry", "Donor", "Donor / Supporter", "Volunteer", "Patient", "Patient / Need Help"];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function field(value: unknown, max: number): string | null {
    if (value === undefined || value === null) return "";
    if (typeof value !== "string" || value.length > max) return null;
    return value.trim();
}

export async function POST(req: NextRequest) {
    if (rateLimited(`contact:${clientIp(req)}`, 10)) {
        return NextResponse.json({ error: "Too many requests. Please try again in a few minutes." }, { status: 429 });
    }

    try {
        const body = await req.json().catch(() => null);
        if (!body || typeof body !== "object" || Array.isArray(body)) {
            return NextResponse.json({ error: "Invalid request." }, { status: 400 });
        }

        const name = field(body.name, 100);
        const email = field(body.email, 254);
        const phone = field(body.phone, 20);
        const subject = field(body.subject, 150);
        const message = field(body.message, 3000);
        const location = field(body.location, 150);
        const assistanceNeeded = field(body.assistanceNeeded, 300);
        const language = field(body.language, 10);
        const contactType = CONTACT_TYPES.includes(body.contactType) ? (body.contactType as string) : "General Inquiry";

        if (
            name === null || email === null || phone === null || subject === null || message === null ||
            location === null || assistanceNeeded === null || language === null
        ) {
            return NextResponse.json({ error: "Some details are missing or too long." }, { status: 400 });
        }
        if (!name || !message || !(email || phone)) {
            return NextResponse.json(
                { error: "Name, message, and either an email or phone number are required." },
                { status: 400 }
            );
        }
        if (body.consent !== true) {
            return NextResponse.json({ error: "Consent is required." }, { status: 400 });
        }
        if (email && (!EMAIL_PATTERN.test(email) || hasLineBreak(email))) {
            return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
        }

        await saveInquiry({
            name,
            email: email || undefined,
            phone: phone || undefined,
            contactType,
            subject: subject || undefined,
            message,
            location: location || undefined,
            assistanceNeeded: assistanceNeeded || undefined,
            language: language || undefined,
        });

        // 1. Setup Nodemailer Transporter
        const smtpEmail = process.env.SMTP_EMAIL;
        const smtpPassword = process.env.SMTP_PASSWORD;

        if (!smtpEmail || !smtpPassword || smtpEmail === "your_email@gmail.com") {
            console.warn("[Contact API] Missing or default SMTP credentials. Saving to DB only.");
            return NextResponse.json({ status: "ok", warning: "Email configuration missing" });
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: smtpEmail,
                pass: smtpPassword,
            },
        });

        const notifyEmail = process.env.INQUIRY_EMAIL || websiteConfig.inquiryEmail;

        const detailRows = [
            ["Contact Type", contactType],
            ["Name", name],
            ["Email", email],
            ["Phone", phone],
            ["Subject", subject],
            ["Location", location],
            ["Assistance Needed", assistanceNeeded],
        ]
            .filter(([, value]) => value) // Only keep fields that have an actual value
            .map(([label, value]) => `<tr><td style="padding:6px 12px;color:#666;font-weight:600;">${label}</td><td style="padding:6px 12px;">${escapeHtml(value)}</td></tr>`)
            .join("");

        // 2. Send Notification Email to the DigiSwasthya Team
        try {
            await transporter.sendMail({
                from: `"DigiSwasthya Website" <${smtpEmail}>`,
                to: notifyEmail,
                replyTo: email || undefined,
                subject: `New ${contactType} from ${name.replace(/[\r\n]/g, " ")}`,
                html: `
                <div style="font-family:sans-serif;color:#333;">
                    <h2 style="color:#00655d;">New website inquiry</h2>
                    <table>${detailRows}</table>
                    <p style="margin-top:16px;"><strong>Message:</strong><br/>${escapeHtml(message).replace(/\r?\n/g, "<br/>")}</p>
                </div>
                `,
            });
        } catch (err) {
            console.error("[Contact API] Failed to send internal notification email:", err);
        }

        // 3. Send Smart Auto-Responder Email to the User
        if (email) {
            try {
                const userEmailSubject = "Thank you for reaching out to DigiSwasthya";
                const safeName = escapeHtml(name);
                let userEmailHtml = "";

                if (contactType === "Donor" || contactType === "Donor / Supporter") {
                    userEmailHtml = `
                    <div style="font-family:sans-serif;color:#333;line-height:1.6;">
                        <p>Dear ${safeName},</p>
                        <p>Thank you for your generous heart! Our donor relations team has just been notified of your message and we will reach out to you very shortly.</p>
                        <p>If you wish to make a contribution immediately, you can do so securely at our website: <a href="https://digiswasthya.org/donate">https://digiswasthya.org/donate</a></p>
                        <p>Warm regards,<br/><strong>DigiSwasthya Foundation</strong></p>
                    </div>
                    `;
                } else if (contactType === "Patient" || contactType === "Patient / Need Help") {
                    userEmailHtml = `
                    <div style="font-family:sans-serif;color:#333;line-height:1.6;">
                        <p>Dear ${safeName},</p>
                        <p>We have received your medical request. Our health coordinators are reviewing it right now.</p>
                        <p style="color:red;"><strong>If this is an urgent medical matter, please do not wait — call us immediately at +91 83184 24800.</strong></p>
                        <p>Warm regards,<br/><strong>DigiSwasthya Foundation</strong></p>
                    </div>
                    `;
                } else {
                    userEmailHtml = `
                    <div style="font-family:sans-serif;color:#333;line-height:1.6;">
                        <p>Dear ${safeName},</p>
                        <p>Thank you for reaching out to DigiSwasthya Foundation. Our team has received your message and will get back to you within a few hours.</p>
                        <p>Warm regards,<br/><strong>DigiSwasthya Foundation</strong></p>
                    </div>
                    `;
                }

                await transporter.sendMail({
                    from: `"DigiSwasthya Foundation" <${smtpEmail}>`,
                    to: email,
                    subject: userEmailSubject,
                    html: userEmailHtml,
                });
            } catch (err) {
                console.error("[Contact API] Failed to send confirmation email to user:", err);
            }
        }

        return NextResponse.json({ status: "ok" });
    } catch (error) {
        console.error("[Contact API Error]:", error);
        return NextResponse.json({ error: "Failed to submit inquiry. Please try again." }, { status: 500 });
    }
}
