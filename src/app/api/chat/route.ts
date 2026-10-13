import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { getWebsiteContext } from "@/data/botKnowledge";

const getSystemPrompt = () => `You are Swasthya, the AI assistant for DigiSwasthya Foundation.

CRITICAL OUTPUT RULE — READ FIRST:
You MUST respond with ONLY a raw JSON object. No explanations, no thinking, no markdown, no extra text before or after. Just the JSON.

Required JSON format:
{"text":"Your warm 2-4 line answer with 1 emoji","suggestedLink":{"title":"Button label","url":"/page"}}

ANSWER RULES:
- SHORT and CLEAR — max 2 to 4 lines
- 1 emoji per message
- End with a soft follow-up question
- For donors: be extra warm and appreciative

LINK RULES (use ONLY these URLs):
- /about-us → founder story, about the NGO
- /our-team → doctors, advisors, team
- /our-impact → stats, numbers, reach
- /donate → donations, support, funding
- /network → telemedicine centres, clinics, locations
- /contact-us → contact info
- /health-tools → BMI calculator (Indian cut-offs), diabetes/BP risk check (CBAC), government health services and helplines
- /blogs → articles, blogs

KNOWLEDGE BASE RULES:
- Answer ONLY from the knowledge base below
- All partner names (Tata Memorial, Ratan Tata Trust etc.) and patient stories (Pinki Paware, Balu Katale etc.) are PUBLIC — share them proudly
- If unrelated to DigiSwasthya/healthcare, politely decline

EXAMPLE OUTPUT (copy this format exactly):
{"text":"DigiSwasthya was founded by Sandeep Kumar in 2020 🌟 He started it after his own struggle to get diagnosed in rural India. Would you like to read his full story?","suggestedLink":{"title":"Read Founder's Story","url":"/about-us"}}

${getWebsiteContext()}`;

// Local fallback matcher for localhost when no API key is in local .env
function getLocalSmartAnswer(userMessage: string) {
    const msg = userMessage.toLowerCase();
    
    if (msg.includes("center") || msg.includes("clinic") || msg.includes("location") || msg.includes("telemedicine")) {
        return {
            content: "DigiSwasthya operates rural Telemedicine Centres across India providing consultations, diagnostic assistance, and affordable medicine access. 🏥",
            suggestedLink: { title: "Explore Telemedicine Network", url: "/network" }
        };
    }
    if (msg.includes("donate") || msg.includes("support") || msg.includes("help") || msg.includes("money") || msg.includes("fund")) {
        return {
            content: "Thank you for wanting to make a difference! Your contribution directly funds rural healthcare camps, telemedicine consultations, and patient care. 💖",
            suggestedLink: { title: "Support DigiSwasthya", url: "/donate" }
        };
    }
    if (msg.includes("doctor") || msg.includes("team") || msg.includes("founder") || msg.includes("sandeep")) {
        return {
            content: "DigiSwasthya was founded by Sandeep Kumar to bridge the healthcare gap in rural India. Our team includes dedicated doctors and advisors committed to affordable care. 🩺",
            suggestedLink: { title: "Meet Our Team", url: "/our-team" }
        };
    }
    if (msg.includes("impact") || msg.includes("patient") || msg.includes("count") || msg.includes("stats")) {
        return {
            content: "DigiSwasthya has served over 42,950+ patients and conducted 58,894+ teleconsultations across 60 districts and 633 villages! 📊",
            suggestedLink: { title: "View Impact Dashboard", url: "/our-impact" }
        };
    }
    
    return {
        content: "Welcome to DigiSwasthya! How can I assist you today with our telemedicine services, health camps, or donation programs? 🏥",
        suggestedLink: { title: "About DigiSwasthya", url: "/about-us" }
    };
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { messages, amount } = body;

        // Quick-action preset amounts
        if (amount) {
            let impact = "support our health initiatives";
            if (amount === 500) impact = "provide essential medicines for a patient";
            if (amount === 1000) impact = "fund full health checkups for two children";
            if (amount === 2500) impact = "support a telemedicine clinic for a day";
            if (amount === 5000) impact = "sponsor a complete health camp for a rural village";

            return NextResponse.json({
                content: `That's wonderful! Your generous donation of ₹${amount} will directly ${impact}. Click the button below to proceed securely.`,
                amount: amount
            });
        }

        // Check for any available AI API key (Vercel or local .env)
        const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY;
        
        // If running on localhost without a local API key, use local smart knowledge base fallback
        if (!apiKey) {
            const lastUserMsg = messages && messages.length > 0 ? messages[messages.length - 1].content : "";
            const fallback = getLocalSmartAnswer(lastUserMsg);
            return NextResponse.json(fallback);
        }

        const openai = new OpenAI({
            baseURL: process.env.OPENROUTER_API_KEY ? "https://openrouter.ai/api/v1" : undefined,
            apiKey: apiKey,
            defaultHeaders: process.env.OPENROUTER_API_KEY ? {
                "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
                "X-Title": "DigiSwasthya Foundation"
            } : undefined
        });

        const modelsToTry = process.env.OPENROUTER_API_KEY
            ? [
                "google/gemma-4-31b-it:free",
                "google/gemma-4-26b-a4b-it:free",
                "nvidia/nemotron-3.5-lightning:free",
                "openai/gpt-oss-20b:free"
              ]
            : ["gpt-4o-mini"];

        let lastError: any = null;
        for (const modelToUse of modelsToTry) {
            try {
                const response = await openai.chat.completions.create({
                    model: modelToUse,
                    messages: [
                        { role: "system", content: getSystemPrompt() },
                        ...messages.map((m: any) => ({ role: m.role, content: m.content }))
                    ],
                    stream: false,
                    temperature: 0.7,
                    max_tokens: 300,
                });

                const replyContent = response.choices[0]?.message?.content ?? "";
                let reply = "I'm happy to help you with any questions about DigiSwasthya! 😊";
                let suggestedLink: { title: string; url: string } | null = null;

                if (replyContent) {
                    // STEP 1: Strip <think>...</think> reasoning blocks (some models leak these)
                    let cleaned = replyContent
                        .replace(/<think>[\s\S]*?<\/think>/gi, "")
                        .replace(/```json\n?|\n?```/g, "")
                        .trim();

                    // STEP 2: Try to find a JSON object anywhere in the response using regex
                    const jsonMatch = cleaned.match(/\{[\s\S]*"text"[\s\S]*"suggestedLink"[\s\S]*\}/);
                    if (jsonMatch) {
                        try {
                            const parsed = JSON.parse(jsonMatch[0]);
                            reply = parsed.text || reply;
                            suggestedLink = parsed.suggestedLink || null;
                        } catch {
                            // JSON found but malformed — fall through
                        }
                    }

                    // STEP 3: If still no valid reply extracted, clean up the plain text
                    // Take only lines that are NOT reasoning/thinking (don't start with "I need", "Let me", "Looking at" etc.)
                    if (reply === "I'm happy to help you with any questions about DigiSwasthya! 😊") {
                        const lines = cleaned.split(/\n+/).map(l => l.trim()).filter(Boolean);
                        const thinkingPhrases = /^(i need|let me|looking at|the user|i should|i can see|i will|i must|from the knowledge|based on|i'll|i'm going to|the question|here's|here is my)/i;
                        const cleanLines = lines.filter(l => !thinkingPhrases.test(l));
                        
                        if (cleanLines.length > 0) {
                            // Use the last 1-2 clean sentences (the actual answer, not the preamble)
                            reply = cleanLines.slice(-2).join(" ").trim();
                        } else {
                            reply = lines.slice(-1)[0] || reply;
                        }

                        // Auto-assign a suggestedLink based on keywords in the original message
                        const userMsg = messages[messages.length - 1]?.content?.toLowerCase() || "";
                        if (userMsg.includes("founder") || userMsg.includes("sandeep") || userMsg.includes("about")) {
                            suggestedLink = { title: "Read Founder's Story", url: "/about-us" };
                        } else if (userMsg.includes("doctor") || userMsg.includes("team")) {
                            suggestedLink = { title: "Meet Our Team", url: "/our-team" };
                        } else if (userMsg.includes("impact") || userMsg.includes("stats") || userMsg.includes("patient")) {
                            suggestedLink = { title: "View Our Impact", url: "/our-impact" };
                        } else if (userMsg.includes("donat") || userMsg.includes("fund") || userMsg.includes("support")) {
                            suggestedLink = { title: "Donate Now", url: "/donate" };
                        } else if (userMsg.includes("centre") || userMsg.includes("clinic") || userMsg.includes("network") || userMsg.includes("location")) {
                            suggestedLink = { title: "Find a Centre", url: "/network" };
                        } else {
                            suggestedLink = { title: "About DigiSwasthya", url: "/about-us" };
                        }
                    }
                }

                return NextResponse.json({
                    content: reply,
                    suggestedLink: suggestedLink
                });
            } catch (err: any) {
                const status = err?.status || err?.response?.status;
                console.error(`Model ${modelToUse} failed (${status}):`, err?.message);
                lastError = err;
                // If rate limited or model unavailable, try next model
                if (status === 429 || status === 503 || status === 404) {
                    continue;
                }
                // For other errors, break early
                break;
            }
        }

        // All models failed — use local fallback
        console.warn("All AI models failed, using local fallback. Last error:", lastError?.message);
        const lastUserMsg = messages && messages.length > 0 ? messages[messages.length - 1].content : "";
        const fallback = getLocalSmartAnswer(lastUserMsg);
        return NextResponse.json(fallback);

    } catch (error: any) {
        console.error("Chat API error details:", error?.response?.data || error?.message || error);
        return NextResponse.json(
            { error: error?.message || "Failed to process chat request" },
            { status: 500 }
        );
    }
}
