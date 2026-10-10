import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import crypto from "crypto";

// Razorpay instantiation guarded inside handler function below

export async function POST(req: NextRequest) {
    try {
        const { amount, method } = await req.json();

        // 1. Lightweight Validation
        if (!amount || amount < 100) {
            return NextResponse.json({ error: "Min ₹100" }, { status: 400 });
        }

        // 2. Immediate Order Creation
        if (method === "razorpay") {
            const keyId = process.env.RAZORPAY_KEY_ID;
            const keySecret = process.env.RAZORPAY_KEY_SECRET;

            // Check for missing or placeholder keys
            if (!keyId || !keySecret || keyId.includes("placeholder") || keySecret.includes("placeholder")) {
                return NextResponse.json({
                    orderId: `demo_${Date.now()}`,
                    amount: amount * 100,
                    currency: "INR",
                    key: keyId || "rzp_test_placeholder",
                    isMock: true
                });
            }

            const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

            const order = await razorpay.orders.create({
                amount: Math.round(amount * 100),
                currency: "INR",
                receipt: `order_${crypto.randomBytes(4).toString("hex")}`,
                notes: { ngo_reg: "U85300UP2021NPL146867" }
            });

            return NextResponse.json({
                orderId: order.id,
                amount: order.amount,
                currency: order.currency,
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
            });
        }

        // Placeholder for PayPal fast order creation
        if (method === "paypal") {
            return NextResponse.json({
                approvalUrl: "#",
                message: "PayPal Redirecting..."
            });
        }

        return NextResponse.json({ error: "Invalid Method" }, { status: 400 });

    } catch (error) {
        console.error("Order Creation Error:", error);
        return NextResponse.json({ error: "Gateway Busy" }, { status: 503 });
    }
}
