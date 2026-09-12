"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import {
    ShieldCheck, Lock, CheckCircle2, AlertCircle,
    ArrowRight, Loader2, Heart, User, Mail, Sparkles, Check
} from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UpiQrModal, RazorpayModal, DonationSummaryModal } from "@/components/donate/PaymentModals";

const PRESET_AMOUNTS = [500, 1000, 2500, 5000];

export default function DonatePage() {
    const [amount, setAmount] = useState<number | "">(1000);
    const [method, setMethod] = useState<"upi_qr" | "razorpay">("razorpay");
    const [isRecurring, setIsRecurring] = useState(false);
    const [donorName, setDonorName] = useState("");
    const [donorEmail, setDonorEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
    const [activeModal, setActiveModal] = useState<null | "summary" | "upi_qr" | "razorpay">(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [livesImpacted, setLivesImpacted] = useState<number>(2850000);

    const formatNumber = (num: number) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    useEffect(() => {
        async function fetchStats() {
            try {
                const ref = doc(db, "stats", "main");
                const snap = await getDoc(ref);
                if (snap.exists()) {
                    const data = snap.data();
                    if (data.livesImpacted !== undefined && data.livesImpacted !== null) {
                        setLivesImpacted(data.livesImpacted);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch donate page stats:", err);
            }
        }
        fetchStats();
    }, []);

    const handleDonation = () => {
        if (status === "processing") return;
        const donationAmount = Number(amount);
        if (!donationAmount || donationAmount < 100) {
            setErrorMessage("Minimum donation amount is ₹100.");
            return;
        }
        setErrorMessage(null);
        // Show summary first — donor reviews before paying
        setActiveModal("summary");
    };

    const handleUpiConfirm = () => { setActiveModal(null); setStatus("success"); };

    /* kept for demo/mock fallback only */
    const handleRazorpayConfirm = useCallback(() => {
        setActiveModal(null);
        setStatus("success");
    }, []);

    /* ── Load Razorpay checkout.js once ── */
    const loadRazorpayScript = (): Promise<boolean> =>
        new Promise((resolve) => {
            if (typeof window !== "undefined" && window.Razorpay) { resolve(true); return; }
            const s = document.createElement("script");
            s.src = "https://checkout.razorpay.com/v1/checkout.js";
            s.onload = () => resolve(true);
            s.onerror = () => resolve(false);
            document.body.appendChild(s);
        });

    /* ── Real Razorpay payment flow ── */
    const initiateRazorpayPayment = useCallback(async () => {
        setActiveModal(null);
        setStatus("processing");
        setErrorMessage(null);
        try {
            /* 1. Create order on our backend */
            const res = await fetch("/api/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: Number(amount), method: "razorpay" }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Order creation failed");

            /* 2. Demo/mock mode — show fake modal instead */
            if (data.isMock) {
                setStatus("idle");
                setActiveModal("razorpay");
                return;
            }

            /* 3. Load Razorpay checkout script */
            const loaded = await loadRazorpayScript();
            if (!loaded) throw new Error("Failed to load payment gateway. Check your connection.");
            setStatus("idle");

            /* 4. Open Razorpay checkout popup */
            const rzp = new window.Razorpay({
                key: data.key,
                amount: data.amount,
                currency: data.currency,
                name: "DigiSwasthya Foundation",
                description: isRecurring ? "Monthly Donation" : "One-time Donation",
                order_id: data.orderId,
                prefill: { name: donorName, email: donorEmail },
                theme: { color: "#059669" },
                notes: { 
                    ngo_reg: "U85300UP2020NPL130635",
                    name: donorName,
                    email: donorEmail
                },
                handler: async (response: {
                    razorpay_order_id: string;
                    razorpay_payment_id: string;
                    razorpay_signature: string;
                }) => {
                    /* 5. Verify payment signature */
                    const vRes = await fetch("/api/verify-payment", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(response),
                    });
                    const vData = await vRes.json();
                    if (vData.success) {
                        setStatus("success");
                    } else {
                        setStatus("error");
                        setErrorMessage("Payment verification failed. Please contact support.");
                    }
                },
                modal: { ondismiss: () => setStatus("idle") },
            });
            rzp.open();
        } catch (err) {
            console.error("Razorpay error:", err);
            setStatus("error");
            setErrorMessage(err instanceof Error ? err.message : "Payment failed. Please try again.");
        }
    }, [amount, donorName, donorEmail, isRecurring]);

    return (
        <main className="min-h-screen bg-[#fafcf9]">
            <Navbar />

            {/* ── Hero Strip (Compact & Modern) ── */}
            <div className="bg-gradient-to-r from-primary-950 via-primary-900 to-primary-950 py-6 sm:py-7 px-4 sm:px-6 border-b border-primary-800/80">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">

                        {/* Left Content */}
                        <div className="lg:col-span-7 space-y-2 sm:space-y-2.5">
                            <div className="inline-flex items-center gap-2 text-amber-300 text-[11px] font-bold uppercase tracking-wider">
                                <span className="h-px w-5 bg-amber-300" /> Support DigiSwasthya Foundation
                            </div>
                            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
                                Every Rupee Saves a Life
                            </h1>
                            <p className="text-emerald-100/90 text-xs sm:text-sm leading-relaxed max-w-xl">
                                Help us bring quality healthcare and telemedicine to underserved rural communities across India.
                            </p>
                            <div className="flex items-center gap-6 sm:gap-8 border-t border-primary-800/80 pt-3">
                                <div>
                                    <div className="text-xl sm:text-2xl font-black text-white leading-none">{formatNumber(livesImpacted)}+</div>
                                    <div className="text-[10px] sm:text-[11px] text-emerald-300 uppercase tracking-wider font-semibold mt-1">Lives Impacted</div>
                                </div>
                                <div className="h-7 w-px bg-primary-800" />
                                <div>
                                    <div className="text-xl sm:text-2xl font-black text-amber-300 leading-none">80G</div>
                                    <div className="text-[10px] sm:text-[11px] text-emerald-300 uppercase tracking-wider font-semibold mt-1">Tax Deductible</div>
                                </div>
                            </div>
                        </div>

                        {/* Right — Linktree impact link (Compact Card) */}
                        <div className="lg:col-span-5 flex flex-col items-start lg:items-end justify-center">
                            <div className="bg-white/10 border border-white/15 rounded-2xl p-4 sm:p-5 backdrop-blur-md max-w-sm w-full shadow-lg shadow-black/10">
                                <p className="text-amber-300 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider mb-1">See Our Impact</p>
                                <p className="text-white text-xs sm:text-sm leading-relaxed mb-3">
                                    View images of the impact <span className="text-amber-300 font-semibold">your donation</span> creates for rural families.
                                </p>
                                <a
                                    href="https://linktr.ee/DigiSwasthya"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs sm:text-sm px-4 py-2 rounded-xl transition-all duration-200 shadow-md hover:-translate-y-0.5 w-full sm:w-auto"
                                >
                                    <Sparkles size={13} />
                                    <span>linktr.ee/DigiSwasthya</span>
                                    <ArrowRight size={13} />
                                </a>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* ── Main Content (Luminous Modern Light Section) ── */}
            <section className="py-8 sm:py-12 relative">
                <div className="absolute top-12 left-10 w-96 h-96 bg-emerald-200/25 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">

                        {/* LEFT — Images & Contribution Highlight (Col 7) */}
                        <div className="lg:col-span-7 flex flex-col gap-4">
                            {/* Highlighted Contribution Banner */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                                className="bg-gradient-to-r from-emerald-50 via-teal-50/50 to-white border border-emerald-200/80 rounded-2xl p-4 sm:p-5 shadow-sm relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-emerald-600 to-teal-500" />
                                <div className="flex items-start gap-3 pl-1">
                                    <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                                        <Heart size={16} className="fill-white" />
                                    </div>
                                    <div>
                                        <p className="text-slate-900 text-xs sm:text-sm font-semibold leading-relaxed">
                                            <span className="font-extrabold text-emerald-800">Your contribution</span> helps bring essential healthcare services to underserved communities across rural India.
                                        </p>
                                        <p className="text-slate-500 text-[11px] mt-1 font-medium">
                                            Transparent utilization • Direct beneficiary reach • 80G tax benefit
                                        </p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Medical Camp Photo */}
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="rounded-2xl overflow-hidden shadow-md shadow-slate-200/70 border border-slate-200/80 bg-white group"
                            >
                                <div className="relative">
                                    <Image
                                        src="/images/ds-medical-camp.jpg"
                                        alt="DigiSwasthya Foundation medical camp"
                                        width={720}
                                        height={420}
                                        className="w-full h-auto object-cover group-hover:scale-[1.01] transition-transform duration-500"
                                        priority
                                    />
                                    <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                        Telemedicine Camps in Rural UP
                                    </div>
                                </div>
                            </motion.div>

                            {/* Community Outreach Photo */}
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="rounded-2xl overflow-hidden shadow-md shadow-slate-200/70 border border-slate-200/80 bg-white group"
                            >
                                <div className="relative">
                                    <Image
                                        src="/images/ds-community-outreach.jpg"
                                        alt="DigiSwasthya Foundation community outreach"
                                        width={720}
                                        height={320}
                                        className="w-full h-auto object-cover group-hover:scale-[1.01] transition-transform duration-500"
                                    />
                                    <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                                        <Check size={12} className="text-emerald-400" />
                                        Doorstep Health Awareness & Diagnosis
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* RIGHT — Premium Modern Donation Card (Col 5) */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="lg:col-span-5 sticky top-6"
                        >
                            <div className="bg-white rounded-3xl border border-emerald-100 shadow-xl shadow-slate-200/80 overflow-hidden">

                                {/* Card Header */}
                                <div className="bg-gradient-to-r from-emerald-50 via-teal-50/50 to-emerald-50 px-5 py-3 border-b border-emerald-100/90 flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 text-emerald-900 text-xs font-bold uppercase tracking-wider">
                                        <ShieldCheck size={14} className="text-emerald-600" />
                                        <span>Secure Donation</span>
                                    </div>
                                </div>

                                <AnimatePresence mode="wait">
                                    {status === "success" ? (
                                        <motion.div
                                            key="success"
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.35 }}
                                            className="flex flex-col items-center justify-center text-center px-6 py-10 min-h-[380px]"
                                        >
                                            <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-300 flex items-center justify-center gap-1 mb-4 shadow-sm">
                                                <CheckCircle2 size={32} className="text-emerald-600" />
                                            </div>
                                            <h2 className="font-serif text-xl font-bold text-slate-900 mb-2">Thank You for Your Support!</h2>
                                            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-xs mb-4">
                                                Your generous contribution has been received. You will receive an 80G tax exemption receipt on your registered email.
                                            </p>
                                            <div className="text-xs sm:text-sm text-emerald-800 font-bold border border-emerald-200 bg-emerald-50 px-4 py-2 rounded-xl mb-6">
                                                {isRecurring ? "Monthly" : "One-time"} Donation: ₹{Number(amount).toLocaleString("en-IN")}
                                            </div>
                                            <Link
                                                href="/"
                                                className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl transition-all shadow-md shadow-emerald-700/20"
                                            >
                                                Return to Home <ArrowRight size={14} />
                                            </Link>
                                        </motion.div>
                                    ) : (
                                        <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="p-4 sm:p-5">

                                            {/* Frequency Toggle */}
                                            <div className="flex bg-slate-100 p-1 rounded-xl gap-1 mb-4">
                                                <button
                                                    id="btn-one-time"
                                                    type="button"
                                                    onClick={() => setIsRecurring(false)}
                                                    className={`flex-1 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                                                        !isRecurring
                                                            ? "bg-white text-emerald-800 shadow-sm border border-slate-200/50"
                                                            : "text-slate-500 hover:text-slate-900"
                                                    }`}
                                                >
                                                    One-time
                                                </button>
                                                <button
                                                    id="btn-monthly"
                                                    type="button"
                                                    onClick={() => setIsRecurring(true)}
                                                    className={`flex-1 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
                                                        isRecurring
                                                            ? "bg-white text-emerald-800 shadow-sm border border-slate-200/50"
                                                            : "text-slate-500 hover:text-slate-900"
                                                    }`}
                                                >
                                                    <span>Monthly</span>
                                                    <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded-full">2x Impact</span>
                                                </button>
                                            </div>

                                            {/* Amount Selection */}
                                            <div className="mb-3.5">
                                                <div className="flex items-center justify-between mb-1.5">
                                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Select Amount</label>
                                                    <span className="text-[10px] font-bold text-emerald-700">80G Tax Exempt</span>
                                                </div>
                                                <div className="grid grid-cols-4 gap-2">
                                                    {PRESET_AMOUNTS.map((preset) => {
                                                        const active = amount === preset;
                                                        return (
                                                            <button
                                                                key={preset}
                                                                id={`preset-${preset}`}
                                                                type="button"
                                                                onClick={() => setAmount(preset)}
                                                                className={`py-2 sm:py-2.5 rounded-xl border text-xs sm:text-sm font-extrabold transition-all ${
                                                                    active
                                                                        ? "border-emerald-600 bg-emerald-600 text-white shadow-md shadow-emerald-600/20 scale-[1.02]"
                                                                        : "border-slate-200 bg-slate-50/70 text-slate-700 hover:bg-emerald-50/60 hover:border-emerald-300 hover:text-emerald-900"
                                                                }`}
                                                            >
                                                                ₹{preset.toLocaleString("en-IN")}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* Custom Amount Input */}
                                            <div className="mb-3.5">
                                                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Or Enter Custom Amount</label>
                                                <div className="relative">
                                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-800 font-black text-base pointer-events-none">₹</span>
                                                    <Input
                                                        id="donation-amount-input"
                                                        type="number"
                                                        value={amount}
                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
                                                        placeholder="Enter amount"
                                                        className="pl-8 h-10 text-base font-bold text-slate-900 bg-slate-50/40 border-slate-200 focus:bg-white focus:border-emerald-600 focus:ring-emerald-500/20 rounded-xl"
                                                    />
                                                </div>
                                                <p className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
                                                    <span>Minimum donation amount is ₹100</span>
                                                    <span className="text-emerald-700 font-semibold">100% directly utilized</span>
                                                </p>
                                            </div>

                                            {/* Donor Name */}
                                            <div className="mb-3">
                                                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1" htmlFor="donor-name-input">Your Name</label>
                                                <div className="relative">
                                                    <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                                    <Input
                                                        id="donor-name-input"
                                                        type="text"
                                                        value={donorName}
                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDonorName(e.target.value)}
                                                        placeholder="Enter your full name"
                                                        className="pl-9 h-9 sm:h-10 border-slate-200 text-xs sm:text-sm text-slate-900 font-medium placeholder:text-slate-400 bg-slate-50/40 focus:bg-white focus:border-emerald-600 rounded-xl"
                                                    />
                                                </div>
                                            </div>

                                            {/* Donor Email */}
                                            <div className="mb-3.5">
                                                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1" htmlFor="donor-email-input">Email Address (for 80G Receipt)</label>
                                                <div className="relative">
                                                    <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                                    <Input
                                                        id="donor-email-input"
                                                        type="email"
                                                        value={donorEmail}
                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDonorEmail(e.target.value)}
                                                        placeholder="Enter your email address"
                                                        className="pl-9 h-9 sm:h-10 border-slate-200 text-xs sm:text-sm text-slate-900 font-medium placeholder:text-slate-400 bg-slate-50/40 focus:bg-white focus:border-emerald-600 rounded-xl"
                                                    />
                                                </div>
                                            </div>

                                            {/* Payment Method Selector */}
                                            <div className="mb-4">
                                                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Payment Method</label>
                                                <div className="grid grid-cols-2 gap-2.5">
                                                    <button
                                                        id="method-upi-qr"
                                                        type="button"
                                                        onClick={() => setMethod("upi_qr")}
                                                        className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-xs sm:text-sm font-bold transition-all ${
                                                            method === "upi_qr"
                                                                ? "border-emerald-600 bg-emerald-50 text-emerald-900 shadow-sm"
                                                                : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:bg-slate-50/60"
                                                        }`}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                                            <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" />
                                                            <rect x="5" y="5" width="3" height="3" fill="currentColor" stroke="none" /><rect x="16" y="5" width="3" height="3" fill="currentColor" stroke="none" /><rect x="5" y="16" width="3" height="3" fill="currentColor" stroke="none" />
                                                            <path d="M14 14h3v3h-3z" fill="currentColor" stroke="none" /><path d="M17 17h4" /><path d="M17 14v7" />
                                                        </svg>
                                                        <span>UPI QR Scan</span>
                                                    </button>
                                                    <button
                                                        id="method-razorpay"
                                                        type="button"
                                                        onClick={() => setMethod("razorpay")}
                                                        className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-xs sm:text-sm font-bold transition-all ${
                                                            method === "razorpay"
                                                                ? "border-emerald-600 bg-emerald-50 text-emerald-900 shadow-sm"
                                                                : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:bg-slate-50/60"
                                                        }`}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                                                        </svg>
                                                        <span>Cards / NetBanking</span>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Error Message */}
                                            <AnimatePresence>
                                                {status === "error" && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 4 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0 }}
                                                        className="flex items-center gap-2 p-2.5 bg-red-50 border border-red-200 rounded-xl mb-3.5 text-red-700 text-xs font-semibold"
                                                    >
                                                        <AlertCircle size={14} className="shrink-0" />
                                                        <span>{errorMessage}</span>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                            {/* Donate Now Button */}
                                            <button
                                                id="donate-now-btn"
                                                type="button"
                                                onClick={handleDonation}
                                                disabled={status === "processing"}
                                                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm sm:text-base transition-all mb-3.5 shadow-md shadow-emerald-700/20 active:scale-[0.99] ${
                                                    status === "processing"
                                                        ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                                                        : "text-white bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 hover:from-emerald-700 hover:to-teal-800 hover:shadow-lg hover:-translate-y-0.5"
                                                }`}
                                            >
                                                {status === "processing" ? (
                                                    <><Loader2 size={18} className="animate-spin" /><span>Processing...</span></>
                                                ) : (
                                                    <><Heart size={16} className="fill-white" /><span>Donate {isRecurring ? "Monthly" : "Now"} (₹{Number(amount || 0).toLocaleString("en-IN")})</span><ArrowRight size={15} /></>
                                                )}
                                            </button>

                                            {/* Trust row */}
                                            <div className="flex items-center justify-center gap-2 flex-wrap text-slate-500 text-[11px] font-medium border-t border-slate-100 pt-3">
                                                <span className="flex items-center gap-1"><Lock size={11} className="text-emerald-600" /> Secure Payment</span>
                                                <span className="text-slate-300">•</span>
                                                <span className="flex items-center gap-1"><ShieldCheck size={11} className="text-emerald-600" /> 80G Tax Exemption</span>
                                            </div>
                                            <p className="text-center mt-2 text-[10px] text-slate-400 uppercase tracking-wider font-medium">
                                                NGO Reg. No: <span className="font-mono text-slate-600 font-semibold">U85300UP2020NPL130635</span>
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <Footer />

            {/* ── MODALS ── */}
            <AnimatePresence>
                {activeModal === "summary" && (
                    <DonationSummaryModal
                        amount={Number(amount)}
                        name={donorName}
                        email={donorEmail}
                        isRecurring={isRecurring}
                        method={method}
                        onConfirm={() => method === "razorpay" ? initiateRazorpayPayment() : setActiveModal(method)}
                        onEdit={() => setActiveModal(null)}
                    />
                )}
                {activeModal === "upi_qr" && (
                    <UpiQrModal amount={Number(amount)} onConfirm={handleUpiConfirm} onClose={() => setActiveModal(null)} />
                )}
                {activeModal === "razorpay" && (
                    <RazorpayModal amount={Number(amount)} isRecurring={isRecurring} onConfirm={handleRazorpayConfirm} onClose={() => setActiveModal(null)} />
                )}
            </AnimatePresence>
        </main>
    );
}
