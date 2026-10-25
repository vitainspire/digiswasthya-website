import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getActiveSubscribers } from "@/lib/db";

export async function GET(req: NextRequest) {
    try {
        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ status: "ok", message: "RESEND_API_KEY is not configured. Email feature disabled." });
        }
        const resend = new Resend(apiKey);
        const { searchParams } = new URL(req.url);
        const secretParam = searchParams.get("secret");
        const authHeader = req.headers.get("Authorization");

        const expectedSecret = process.env.CRON_SECRET || "digiswasthya_cron_dev_secret_123";

        // Security check
        const isAuthorized = 
            (authHeader === `Bearer ${expectedSecret}`) || 
            (secretParam === expectedSecret) ||
            (process.env.NODE_ENV === "development"); // Bypass in development to ease testing

        if (!isAuthorized) {
            return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
        }

        // 1. Fetch all active subscribers
        const subscribers = await getActiveSubscribers();
        
        if (subscribers.length === 0) {
            return NextResponse.json({ status: "ok", message: "No active subscribers found." });
        }

        console.log(`[Cron] Found ${subscribers.length} active subscribers. Preparing weekly update...`);

        // 2. Sample weekly newsletter data (in a real app, this could be fetched from a CMS or Firebase Collection)
        const weeklyStats = {
            patientsServed: 312,
            consultations: 245,
            campsHeld: 3,
            dates: "14th June - 20th June 2026"
        };

        const patientStory = {
            title: "Rohan's Road to Recovery",
            body: "9-year-old Rohan from Basti was suffering from severe skin allergies. Due to the lack of dermatologist clinics in his area, he was untreated for weeks. Through Digiswasthya's telemedicine centre, Rohan connected with an expert skin specialist in Lucknow. Within 7 days of starting his medication, Rohan is completely rash-free and back in school!",
        };

        // 3. Loop through subscribers and send emails
        const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

        const emailPromises = subscribers.map(async (subscriber) => {
            const unsubscribeUrl = `${appUrl}/api/unsubscribe?email=${encodeURIComponent(subscriber.email)}`;
            
            const newsletterHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f1f5f9; }
                    .container { max-width: 600px; margin: 0 auto; background: white; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
                    .header { background: #0f172a; padding: 25px; text-align: center; color: white; }
                    .header h1 { margin: 0; font-size: 22px; }
                    .header p { margin: 5px 0 0 0; font-size: 10px; color: #d97706; text-transform: uppercase; letter-spacing: 2px; }
                    .content { padding: 25px; }
                    .stats-grid { display: table; width: 100%; margin: 20px 0; border: 1px solid #e2e8f0; border-radius: 8px; text-align: center; }
                    .stats-cell { display: table-cell; padding: 15px; width: 33%; }
                    .stat-num { font-size: 24px; font-weight: bold; color: #d97706; }
                    .stat-label { font-size: 11px; color: #64748b; margin-top: 5px; }
                    .story-box { background: #f8fafc; border-radius: 8px; padding: 20px; margin: 25px 0; border: 1px dashed #cbd5e1; }
                    .story-title { font-weight: bold; font-size: 16px; color: #0f172a; margin-bottom: 10px; }
                    .button-container { text-align: center; margin: 30px 0; }
                    .btn { background: #d97706; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold; }
                    .footer { font-size: 11px; color: #64748b; text-align: center; padding: 20px; background: #f8fafc; border-top: 1px solid #e2e8f0; }
                    .footer a { color: #d97706; }
                    .image-container { text-align: center; margin: 20px 0; }
                    .story-image { max-width: 100%; border-radius: 6px; border: 1px solid #cbd5e1; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Digiswasthya Weekly Impact Update</h1>
                        <p>Steps Towards Healthy India</p>
                    </div>
                    <div class="content">
                        <p>Hi ${subscriber.name || "Friend"},</p>
                        <p>Here is your weekly update on how your support is directly changing lives across rural India. Thanks to your kindness, we continue to reach communities that have never had access to specialist healthcare before.</p>

                        <h3>Impact this week (${weeklyStats.dates})</h3>
                        <div class="stats-grid">
                            <div class="stats-cell" style="border-right: 1px solid #e2e8f0;">
                                <div class="stat-num">${weeklyStats.patientsServed}</div>
                                <div class="stat-label">Patients Served</div>
                            </div>
                            <div class="stats-cell" style="border-right: 1px solid #e2e8f0;">
                                <div class="stat-num">${weeklyStats.consultations}</div>
                                <div class="stat-label">Specialist Consults</div>
                            </div>
                            <div class="stats-cell">
                                <div class="stat-num">${weeklyStats.campsHeld}</div>
                                <div class="stat-label">Health Camps</div>
                            </div>
                        </div>

                        <div class="story-box">
                            <div class="story-title">❤️ Patient Impact Story: ${patientStory.title}</div>
                            <p style="margin: 0; font-size: 13.5px; line-height: 1.5; color: #475569;">${patientStory.body}</p>
                        </div>

                        <div class="image-container">
                            <p style="font-size: 12px; color: #64748b; font-weight: bold;">A real picture from one of our Telemedicine Centres:</p>
                            <img class="story-image" src="${appUrl}/images/resources/consultation.jpg" alt="Digiswasthya rural checkup" onerror="this.style.display='none'" />
                        </div>

                        <p>Every rupee you donate helps us consult one more patient, buy essential life-saving medications, or expand to one more village. Please consider supporting our work again.</p>

                        <div class="button-container">
                            <a href="${appUrl}/donate" class="btn" target="_blank">Support Our Work</a>
                        </div>
                    </div>
                    <div class="footer">
                        <p>Digiswasthya Foundation is a Section 8 NGO registered in India.</p>
                        <p>To opt out of weekly emails, click <a href="${unsubscribeUrl}">here to unsubscribe</a>.</p>
                    </div>
                </div>
            </body>
            </html>
            `;

            return resend.emails.send({
                from: `Digiswasthya Foundation <${fromEmail}>`,
                to: [subscriber.email],
                subject: `Weekly Impact: ${weeklyStats.patientsServed} Patients Served ❤️`,
                html: newsletterHtml
            });
        });

        const results = await Promise.all(emailPromises);

        return NextResponse.json({
            status: "ok",
            message: `Successfully processed weekly newsletters.`,
            emailsSentCount: results.length,
            details: results
        });

    } catch (error: any) {
        console.error("[Cron Weekly Error]:", error);
        return NextResponse.json({ error: error.message || "Failed to process weekly cron job" }, { status: 500 });
    }
}
