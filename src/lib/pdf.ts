import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

/**
 * Converts a number into Indian Rupees words (Crore, Lakh, Thousand, Hundred, etc.)
 */
export function numberToWords(num: number): string {
    const a = [
        "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
        "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
    ];
    const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

    if (num === 0) return "Zero";

    function convertLessThanOneThousand(n: number): string {
        if (n < 20) return a[n];
        const digit = n % 10;
        if (n < 100) return b[Math.floor(n / 10)] + (digit ? " " + a[digit] : "");
        return a[Math.floor(n / 100)] + " Hundred" + (n % 100 !== 0 ? " and " + convertLessThanOneThousand(n % 100) : "");
    }

    let words = "";
    
    const crore = Math.floor(num / 10000000);
    num %= 10000000;
    const lakh = Math.floor(num / 100000);
    num %= 100000;
    const thousand = Math.floor(num / 1000);
    num %= 1000;
    const remaining = num;

    if (crore > 0) {
        words += convertLessThanOneThousand(crore) + " Crore ";
    }
    if (lakh > 0) {
        words += convertLessThanOneThousand(lakh) + " Lakh ";
    }
    if (thousand > 0) {
        words += convertLessThanOneThousand(thousand) + " Thousand ";
    }
    if (remaining > 0) {
        words += convertLessThanOneThousand(remaining);
    }

    return words.trim();
}

/**
 * Generates an 80G Tax Exemption Receipt as a PDF Buffer in memory using pdf-lib
 */
export async function generate80GReceipt(
    donorName: string,
    amount: number,
    dateStr: string,
    receiptNumber: string,
    pan?: string,
    address?: string
): Promise<Buffer> {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 Portrait in points
    const { width, height } = page.getSize();

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // --- Draw Elegant Border ---
    page.drawRectangle({
        x: 30,
        y: 30,
        width: width - 60,
        height: height - 60,
        borderColor: rgb(0.88, 0.91, 0.94),
        borderWidth: 1,
    });

    // --- Header Text ---
    page.drawText("DIGISWASTHYA FOUNDATION", {
        x: 50,
        y: height - 80,
        size: 20,
        font: boldFont,
        color: rgb(0.06, 0.09, 0.16),
    });
    
    page.drawText("Section 8 NGO | Registration No: U85300UP2021NPL146867", {
        x: 50,
        y: height - 98,
        size: 8.5,
        font: font,
        color: rgb(0.39, 0.45, 0.55),
    });

    page.drawText("Registered Office: C/O Sandeep Kumar, Kathaicha, Nokta, Sant Kabir Nagar, Uttar Pradesh - 272176", {
        x: 50,
        y: height - 110,
        size: 8.5,
        font: font,
        color: rgb(0.39, 0.45, 0.55),
    });

    page.drawText("Email: info@digiswasthya.org | Website: www.digiswasthya.org", {
        x: 50,
        y: height - 122,
        size: 8.5,
        font: font,
        color: rgb(0.39, 0.45, 0.55),
    });

    // Divider Line
    page.drawLine({
        start: { x: 50, y: height - 135 },
        end: { x: width - 50, y: height - 135 },
        color: rgb(0.79, 0.83, 0.88),
        thickness: 1,
    });

    // --- Title ---
    page.drawText("DONATION RECEIPT & TAX EXEMPTION CERTIFICATE", {
        x: 50,
        y: height - 165,
        size: 13,
        font: boldFont,
        color: rgb(0.12, 0.16, 0.23),
    });

    page.drawText("(Under Section 80G of the Income Tax Act, 1961)", {
        x: 50,
        y: height - 178,
        size: 9.5,
        font: font,
        color: rgb(0.28, 0.33, 0.41),
    });

    // --- Details Grid ---
    const gridY = height - 230;
    
    page.drawText("Receipt Number:", { x: 60, y: gridY, size: 9.5, font: font, color: rgb(0.2, 0.25, 0.33) });
    page.drawText(receiptNumber, { x: 170, y: gridY, size: 9.5, font: boldFont, color: rgb(0.06, 0.09, 0.16) });

    page.drawText("Date of Donation:", { x: 60, y: gridY - 20, size: 9.5, font: font, color: rgb(0.2, 0.25, 0.33) });
    page.drawText(dateStr, { x: 170, y: gridY - 20, size: 9.5, font: font, color: rgb(0.06, 0.09, 0.16) });

    page.drawText("Donor Name:", { x: 60, y: gridY - 40, size: 9.5, font: font, color: rgb(0.2, 0.25, 0.33) });
    page.drawText(donorName, { x: 170, y: gridY - 40, size: 9.5, font: boldFont, color: rgb(0.06, 0.09, 0.16) });

    page.drawText("Donor PAN:", { x: 60, y: gridY - 60, size: 9.5, font: font, color: rgb(0.2, 0.25, 0.33) });
    page.drawText(pan || "Not Provided", { x: 170, y: gridY - 60, size: 9.5, font: font, color: rgb(0.06, 0.09, 0.16) });

    if (address) {
        page.drawText("Donor Address:", { x: 60, y: gridY - 80, size: 9.5, font: font, color: rgb(0.2, 0.25, 0.33) });
        page.drawText(address, { x: 170, y: gridY - 80, size: 9.5, font: font, color: rgb(0.06, 0.09, 0.16) });
    }

    // --- Payment Box ---
    page.drawRectangle({
        x: width - 230,
        y: gridY - 60,
        width: 180,
        height: 75,
        color: rgb(0.97, 0.98, 0.99),
        borderColor: rgb(0.88, 0.91, 0.94),
        borderWidth: 1,
    });

    page.drawText("TOTAL AMOUNT RECEIVED", {
        x: width - 210,
        y: gridY + 2,
        size: 8,
        font: font,
        color: rgb(0.28, 0.33, 0.41),
    });

    page.drawText(`INR ${amount.toLocaleString("en-IN")}`, {
        x: width - 210,
        y: gridY - 18,
        size: 16,
        font: boldFont,
        color: rgb(0.06, 0.09, 0.16),
    });

    page.drawText("Rupees " + numberToWords(amount) + " Only", {
        x: width - 210,
        y: gridY - 42,
        size: 7,
        font: font,
        color: rgb(0.39, 0.45, 0.55),
    });

    // --- Tax Exemption details box ---
    const infoY = gridY - 180;
    page.drawRectangle({
        x: 50,
        y: infoY,
        width: width - 100,
        height: 80,
        color: rgb(0.95, 0.96, 0.98),
        borderColor: rgb(0.79, 0.83, 0.88),
        borderWidth: 1,
    });

    page.drawText("Important Information for Tax Exemption:", { x: 60, y: infoY + 62, size: 8.5, font: boldFont, color: rgb(0.2, 0.25, 0.33) });
    page.drawText("1. Digiswasthya Foundation is registered under Section 12A & 80G of the Income Tax Act, 1961.", { x: 60, y: infoY + 48, size: 8, font: font, color: rgb(0.2, 0.25, 0.33) });
    page.drawText("2. Unique Registration Number (URN): URN-PLACEHOLDER-80G (Perpetual Validity).", { x: 60, y: infoY + 36, size: 8, font: font, color: rgb(0.2, 0.25, 0.33) });
    page.drawText("3. Donors are eligible for a 50% tax exemption on the donation amount under Section 80G of the IT Act.", { x: 60, y: infoY + 24, size: 8, font: font, color: rgb(0.2, 0.25, 0.33) });
    page.drawText("4. This is a computer-generated receipt and does not require a physical signature.", { x: 60, y: infoY + 12, size: 8, font: font, color: rgb(0.2, 0.25, 0.33) });

    // --- Signatures ---
    const sigY = infoY - 80;
    page.drawLine({
        start: { x: width - 210, y: sigY },
        end: { x: width - 50, y: sigY },
        color: rgb(0.88, 0.91, 0.94),
        thickness: 1,
    });

    page.drawText("For Digiswasthya Foundation", {
        x: width - 210,
        y: sigY + 15,
        size: 9,
        font: font,
        color: rgb(0.28, 0.33, 0.41),
    });

    page.drawText("Authorized Signatory", {
        x: width - 210,
        y: sigY - 15,
        size: 9,
        font: boldFont,
        color: rgb(0.06, 0.09, 0.16),
    });

    // Thank you text at bottom
    page.drawText("Thank you for your generous contribution. Your support helps us bridge the healthcare gap in rural India.", {
        x: 50,
        y: 60,
        size: 8,
        font: font,
        color: rgb(0.58, 0.64, 0.72),
    });

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
}

/**
 * Generates a beautiful Certificate of Appreciation as a PDF Buffer in memory (Landscape) using pdf-lib
 */
export async function generateCertificate(
    donorName: string,
    amount: number,
    dateStr: string
): Promise<Buffer> {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([841.89, 595.28]); // A4 Landscape
    const { width, height } = page.getSize();

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // --- Elegant Outer Frame ---
    page.drawRectangle({
        x: 20,
        y: 20,
        width: width - 40,
        height: height - 40,
        borderColor: rgb(0.06, 0.09, 0.16),
        borderWidth: 4,
    });

    page.drawRectangle({
        x: 28,
        y: 28,
        width: width - 56,
        height: height - 56,
        borderColor: rgb(0.85, 0.47, 0.02),
        borderWidth: 1.5,
    });

    // Decorative corner lines (amber)
    // Top-Left corner accent
    page.drawLine({ start: { x: 40, y: height - 60 }, end: { x: 40, y: height - 40 }, color: rgb(0.85, 0.47, 0.02), thickness: 1 });
    page.drawLine({ start: { x: 40, y: height - 40 }, end: { x: 60, y: height - 40 }, color: rgb(0.85, 0.47, 0.02), thickness: 1 });
    
    // Top-Right corner accent
    page.drawLine({ start: { x: width - 40, y: height - 60 }, end: { x: width - 40, y: height - 40 }, color: rgb(0.85, 0.47, 0.02), thickness: 1 });
    page.drawLine({ start: { x: width - 40, y: height - 40 }, end: { x: width - 60, y: height - 40 }, color: rgb(0.85, 0.47, 0.02), thickness: 1 });

    // Bottom-Left corner accent
    page.drawLine({ start: { x: 40, y: 60 }, end: { x: 40, y: 40 }, color: rgb(0.85, 0.47, 0.02), thickness: 1 });
    page.drawLine({ start: { x: 40, y: 40 }, end: { x: 60, y: 40 }, color: rgb(0.85, 0.47, 0.02), thickness: 1 });

    // Bottom-Right corner accent
    page.drawLine({ start: { x: width - 40, y: 60 }, end: { x: width - 40, y: 40 }, color: rgb(0.85, 0.47, 0.02), thickness: 1 });
    page.drawLine({ start: { x: width - 40, y: 40 }, end: { x: width - 60, y: 40 }, color: rgb(0.85, 0.47, 0.02), thickness: 1 });

    // Logo Text
    page.drawText("DIGISWASTHYA FOUNDATION", {
        x: width / 2 - 120,
        y: height - 80,
        size: 16,
        font: boldFont,
        color: rgb(0.06, 0.09, 0.16),
    });

    page.drawText("STEPS TOWARDS HEALTHY INDIA", {
        x: width / 2 - 80,
        y: height - 95,
        size: 8,
        font: font,
        color: rgb(0.85, 0.47, 0.02),
    });

    // Heading
    page.drawText("CERTIFICATE OF APPRECIATION", {
        x: width / 2 - 200,
        y: height - 160,
        size: 26,
        font: boldFont,
        color: rgb(0.12, 0.16, 0.23),
    });

    page.drawText("THIS CERTIFICATE IS GRATEFULLY PRESENTED TO", {
        x: width / 2 - 150,
        y: height - 200,
        size: 11,
        font: font,
        color: rgb(0.39, 0.45, 0.55),
    });

    // Donor Name (Centered)
    page.drawText(donorName, {
        x: width / 2 - (donorName.length * 6),
        y: height - 250,
        size: 24,
        font: boldFont,
        color: rgb(0.85, 0.47, 0.02),
    });

    // Narrative Text
    const descText1 = `in recognition of your generous donation of INR ${amount.toLocaleString("en-IN")} on ${dateStr}.`;
    page.drawText(descText1, {
        x: width / 2 - (descText1.length * 3),
        y: height - 290,
        size: 11,
        font: font,
        color: rgb(0.28, 0.33, 0.41),
    });

    const descText2 = "Your valuable contribution enables Digiswasthya to bridge the healthcare gap in rural India,";
    page.drawText(descText2, {
        x: width / 2 - 230,
        y: height - 320,
        size: 10,
        font: font,
        color: rgb(0.39, 0.45, 0.55),
    });

    const descText3 = "powering telemedicine centers and providing critical specialist consultations to underserved patients.";
    page.drawText(descText3, {
        x: width / 2 - 275,
        y: height - 335,
        size: 10,
        font: font,
        color: rgb(0.39, 0.45, 0.55),
    });

    // Signatures
    const sigLineY = 100;
    
    // Founder
    page.drawLine({ start: { x: 120, y: sigLineY }, end: { x: 280, y: sigLineY }, color: rgb(0.79, 0.83, 0.88), thickness: 1 });
    page.drawText("Sandeep Kumar", { x: 160, y: sigLineY - 15, size: 10, font: boldFont, color: rgb(0.12, 0.16, 0.23) });
    page.drawText("Founder & Director", { x: 155, y: sigLineY - 27, size: 8.5, font: font, color: rgb(0.39, 0.45, 0.55) });

    // Representative
    page.drawLine({ start: { x: width - 280, y: sigLineY }, end: { x: width - 120, y: sigLineY }, color: rgb(0.79, 0.83, 0.88), thickness: 1 });
    page.drawText("Authorized Representative", { x: width - 260, y: sigLineY - 15, size: 10, font: boldFont, color: rgb(0.12, 0.16, 0.23) });
    page.drawText("Digiswasthya Foundation", { x: width - 250, y: sigLineY - 27, size: 8.5, font: font, color: rgb(0.39, 0.45, 0.55) });

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
}
