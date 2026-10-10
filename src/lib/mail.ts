import nodemailer from "nodemailer";

export function escapeHtml(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

export function hasLineBreak(value: string): boolean {
    return /[\r\n]/.test(value);
}

export function getMailer() {
    const user = process.env.SMTP_EMAIL;
    const pass = process.env.SMTP_PASSWORD;
    if (!user || !pass || user === "your_email@gmail.com") return null;
    return {
        from: user,
        transport: nodemailer.createTransport({ service: "gmail", auth: { user, pass } }),
    };
}
