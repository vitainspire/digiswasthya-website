"use client";

import { useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import {
    ShieldCheck, Lock, CheckCircle2, AlertCircle, ArrowRight, Loader2, Heart, User, Mail, MessageCircle, FileText,
} from "lucide-react";
import { UpiQrModal, RazorpayModal, DonationSummaryModal } from "@/components/donate/PaymentModals";
import { useImpactData } from "@/hooks/useImpactData";
import { useLanguage } from "@/context/LanguageContext";
import { donationTiers } from "@/data/donationTiers";
import { websiteConfig } from "@/data/websiteConfig";
import { registrations } from "@/data/registrations";
import { testimonials } from "@/data/beneficiaryData";

const featuredStory = testimonials.find((item) => item.name === "Manisha Kumari");

const MIN_AMOUNT = 100;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const HERO_STAT_IDS = ["total-consultations", "villages-covered", "health-camps"];

type FieldErrors = { amount?: string; name?: string; email?: string };

export default function DonatePage() {
    const { t, language } = useLanguage();
    const lang = language === "hi" ? "hi" : "en";
    const { data: impact } = useImpactData();
    const searchParams = useSearchParams();
    const requestedAmount = Number(searchParams.get("amount"));

    const [amount, setAmount] = useState<number | "">(requestedAmount >= MIN_AMOUNT ? requestedAmount : 1000);
    const [method, setMethod] = useState<"upi_qr" | "razorpay">("razorpay");
    const [isRecurring, setIsRecurring] = useState(searchParams.get("frequency") === "monthly");
    const [donorName, setDonorName] = useState("");
    const [donorEmail, setDonorEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
    const [paidWith, setPaidWith] = useState<"razorpay" | "upi" | null>(null);
    const [paymentRef, setPaymentRef] = useState<string | null>(null);
    const [activeModal, setActiveModal] = useState<null | "summary" | "upi_qr" | "razorpay">(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

    const stats = HERO_STAT_IDS.flatMap((id) => {
        const kpi = impact.kpis.find((k) => k.id === id);
        return kpi ? [{ id, value: kpi.value, label: kpi.label[lang] }] : [];
    });
    const selectedTier = donationTiers.find((tier) => tier.amount === amount);

    const validate = (): boolean => {
        const errors: FieldErrors = {};
        if (!Number(amount) || Number(amount) < MIN_AMOUNT) errors.amount = `The minimum donation is ₹${MIN_AMOUNT}.`;
        if (donorName.trim().length < 2) errors.name = "Enter your name for the receipt.";
        if (!EMAIL_PATTERN.test(donorEmail.trim())) errors.email = "Enter a valid email address. Your 80G receipt is sent here.";
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleDonation = () => {
        if (status === "processing") return;
        setErrorMessage(null);
        if (!validate()) return;
        setActiveModal("summary");
    };

    const handleUpiConfirm = () => {
        setActiveModal(null);
        setPaidWith("upi");
        setStatus("success");
    };

    /* Development fallback only: used when no Razorpay keys are configured */
    const handleRazorpayConfirm = useCallback(() => {
        setActiveModal(null);
        setPaidWith("razorpay");
        setStatus("success");
    }, []);

    const loadRazorpayScript = (): Promise<boolean> =>
        new Promise((resolve) => {
            if (typeof window !== "undefined" && window.Razorpay) { resolve(true); return; }
            const s = document.createElement("script");
            s.src = "https://checkout.razorpay.com/v1/checkout.js";
            s.onload = () => resolve(true);
            s.onerror = () => resolve(false);
            document.body.appendChild(s);
        });

    const initiateRazorpayPayment = useCallback(async () => {
        setActiveModal(null);
        setStatus("processing");
        setErrorMessage(null);
        try {
            const res = await fetch("/api/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: Number(amount), method: "razorpay" }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Order creation failed");

            if (data.isMock) {
                if (process.env.NODE_ENV === "production") {
                    throw new Error("Online payment is not available right now. Please pay by UPI or contact us.");
                }
                setStatus("idle");
                setActiveModal("razorpay");
                return;
            }

            const loaded = await loadRazorpayScript();
            if (!loaded) throw new Error("Failed to load the payment gateway. Check your connection.");
            setStatus("idle");

            const rzp = new window.Razorpay({
                key: data.key,
                amount: data.amount,
                currency: data.currency,
                name: "DigiSwasthya Foundation",
                description: isRecurring ? "Monthly Donation" : "One-time Donation",
                order_id: data.orderId,
                prefill: { name: donorName, email: donorEmail },
                theme: { color: "#00655D" },
                notes: {
                    ngo_reg: "U85300UP2021NPL146867",
                    name: donorName,
                    email: donorEmail,
                },
                handler: async (response: {
                    razorpay_order_id: string;
                    razorpay_payment_id: string;
                    razorpay_signature: string;
                }) => {
                    const vRes = await fetch("/api/verify-payment", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(response),
                    });
                    const vData = await vRes.json();
                    if (vData.success) {
                        setPaymentRef(response.razorpay_payment_id);
                        setPaidWith("razorpay");
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

    const shareText = encodeURIComponent("I just donated to DigiSwasthya Foundation, which brings specialist care to rural India by video call. You can support their work too: https://digiswasthya.org/donate");

    return (
        <main className="min-h-screen bg-surface">
            <Navbar />

            <div className="bg-primary-900 px-4 py-8 sm:px-6 sm:py-10">
                <div className="mx-auto max-w-6xl">
                    <h1 className="max-w-3xl font-serif text-3xl font-bold leading-tight text-white sm:text-4xl">
                        Give rural families access to specialist care
                    </h1>
                    <p className="mt-3 max-w-2xl text-lg leading-relaxed text-primary-100">
                        Your donation funds teleconsultations, health camps and screenings in villages across India. Donations are eligible for 80G tax exemption.
                    </p>
                    <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-4 border-t border-primary-700 pt-5">
                        {stats.map((stat) => (
                            <div key={stat.id}>
                                <dd className="font-serif text-2xl font-bold text-white">{stat.value.toLocaleString("en-IN")}</dd>
                                <dt className="text-sm font-medium text-primary-100">{stat.label}</dt>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>

            <section className="py-8 sm:py-12">
                <div className="mx-auto max-w-6xl px-4 sm:px-6">
                    <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-10">

                        <div className="order-2 flex flex-col gap-5 lg:order-1 lg:col-span-7">
                            <div className="flex items-start gap-3 rounded-2xl border border-primary-100 bg-primary-50 p-5">
                                <Heart size={20} className="mt-0.5 shrink-0 fill-primary-600 text-primary-600" aria-hidden="true" />
                                <p className="text-base leading-relaxed text-primary-900">
                                    <span className="font-semibold">Your contribution</span> helps bring essential healthcare services to underserved communities across rural India.
                                </p>
                            </div>

                            {featuredStory && (
                                <figure className="flex flex-col gap-4 rounded-2xl bg-primary-900 p-6 sm:flex-row sm:items-center">
                                    {featuredStory.image && (
                                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full ring-4 ring-primary-600">
                                            <Image src={featuredStory.image} alt={featuredStory.name} fill sizes="80px" className="object-cover" />
                                        </div>
                                    )}
                                    <div>
                                        <p className="eyebrow eyebrow-on-dark">{featuredStory.problem}</p>
                                        <blockquote className="mt-2 font-serif text-lg leading-relaxed text-white">{featuredStory.body}</blockquote>
                                        <figcaption className="mt-3 text-base font-semibold text-primary-100">{featuredStory.name}</figcaption>
                                    </div>
                                </figure>
                            )}

                            <figure className="overflow-hidden rounded-2xl border border-primary-100 bg-white">
                                <Image
                                    src="/images/resources/consultation.jpg"
                                    alt="DigiSwasthya Foundation telemedicine camp"
                                    width={1024}
                                    height={384}
                                    sizes="(min-width: 1024px) 58vw, 100vw"
                                    className="h-auto w-full object-cover"
                                />
                                <figcaption className="px-4 py-3 text-sm font-medium text-primary-800">Telemedicine camps in rural Uttar Pradesh</figcaption>
                            </figure>

                            <figure className="overflow-hidden rounded-2xl border border-primary-100 bg-white">
                                <Image
                                    src="/images/ds-community-outreach.jpg"
                                    alt="DigiSwasthya Foundation community outreach"
                                    width={720}
                                    height={320}
                                    sizes="(min-width: 1024px) 58vw, 100vw"
                                    className="h-auto w-full object-cover"
                                />
                                <figcaption className="px-4 py-3 text-sm font-medium text-primary-800">Doorstep health awareness and diagnosis</figcaption>
                            </figure>

                            <div className="rounded-2xl border border-primary-100 bg-white p-5">
                                <h2 className="font-serif text-xl font-bold text-primary-900">Registration and transparency</h2>
                                <ul className="mt-3 space-y-1.5 text-base text-gray-700">
                                    {registrations.map((reg) => (
                                        <li key={reg.value}>
                                            {reg.label.en}: <span className="font-mono font-semibold text-primary-900">{reg.value}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-base font-semibold">
                                    <a href={websiteConfig.annualReportsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary-700 underline underline-offset-4 hover:text-primary-600">
                                        <FileText size={16} aria-hidden="true" /> Annual reports
                                    </a>
                                    <a href={websiteConfig.balanceSheetsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary-700 underline underline-offset-4 hover:text-primary-600">
                                        <FileText size={16} aria-hidden="true" /> Audited balance sheets
                                    </a>
                                    <Link href="/privacy-policy" className="text-primary-700 underline underline-offset-4 hover:text-primary-600">Privacy policy</Link>
                                    <Link href="/terms-and-conditions" className="text-primary-700 underline underline-offset-4 hover:text-primary-600">Terms</Link>
                                </div>
                            </div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="order-1 lg:order-2 lg:col-span-5 lg:sticky lg:top-24"
                        >
                            <div className="overflow-hidden rounded-3xl border border-primary-100 bg-white shadow-lg">
                                <div className="flex items-center gap-2 border-b border-primary-100 bg-primary-50 px-5 py-3 text-base font-semibold text-primary-900">
                                    <ShieldCheck size={18} className="text-primary-600" aria-hidden="true" />
                                    Secure donation
                                </div>

                                <AnimatePresence mode="wait">
                                    {status === "success" ? (
                                        <motion.div
                                            key="success"
                                            initial={{ opacity: 0, scale: 0.97 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            role="status"
                                            className="flex flex-col items-center px-6 py-10 text-center"
                                        >
                                            <CheckCircle2 size={56} className="mb-4 text-primary-600" aria-hidden="true" />
                                            <h2 className="mb-2 font-serif text-2xl font-bold text-primary-900">Thank you for your support</h2>
                                            <p className="mb-4 max-w-sm text-base leading-relaxed text-gray-700">
                                                {paidWith === "upi"
                                                    ? "We will confirm your donation once we verify the UPI payment, then email your 80G receipt."
                                                    : `Your donation has been received. Your 80G receipt is on its way to ${donorEmail || "your email"}.`}
                                            </p>
                                            <div className="mb-2 rounded-xl border border-primary-200 bg-primary-50 px-4 py-2 text-base font-semibold text-primary-900">
                                                {isRecurring ? "Monthly" : "One-time"} donation: ₹{Number(amount).toLocaleString("en-IN")}
                                            </div>
                                            {paymentRef && <p className="mb-5 text-sm text-gray-600">Payment reference: {paymentRef}</p>}
                                            <div className="mt-3 flex w-full flex-col gap-3">
                                                <a
                                                    href={`https://wa.me/?text=${shareText}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary-600 text-base font-semibold text-white hover:bg-primary-700"
                                                >
                                                    <MessageCircle size={18} aria-hidden="true" /> Share on WhatsApp
                                                </a>
                                                <div className="flex gap-3">
                                                    <Link href="/our-impact" className="inline-flex h-11 flex-1 items-center justify-center rounded-xl border-2 border-primary-600 text-base font-semibold text-primary-700 hover:bg-primary-50">
                                                        See our impact
                                                    </Link>
                                                    <Link href="/contact-us#donor" className="inline-flex h-11 flex-1 items-center justify-center rounded-xl border-2 border-primary-600 text-base font-semibold text-primary-700 hover:bg-primary-50">
                                                        Join us
                                                    </Link>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="p-5">

                                            <div role="group" aria-label="Donation frequency" className="mb-5 flex gap-1 rounded-xl bg-primary-50 p-1">
                                                {[
                                                    { id: "btn-one-time", label: "One-time", recurring: false },
                                                    { id: "btn-monthly", label: "Monthly", recurring: true },
                                                ].map((option) => (
                                                    <button
                                                        key={option.id}
                                                        id={option.id}
                                                        type="button"
                                                        aria-pressed={isRecurring === option.recurring}
                                                        onClick={() => setIsRecurring(option.recurring)}
                                                        className={`h-11 flex-1 rounded-lg text-base font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 ${
                                                            isRecurring === option.recurring ? "bg-white text-primary-900 shadow-sm" : "text-primary-700 hover:text-primary-900"
                                                        }`}
                                                    >
                                                        {option.label}
                                                    </button>
                                                ))}
                                            </div>
                                            {isRecurring && (
                                                <p className="-mt-2 mb-4 text-sm text-gray-700">A monthly gift helps us plan and keep our centres running.</p>
                                            )}

                                            <fieldset className="mb-4">
                                                <legend className="mb-2 flex w-full items-center justify-between text-base font-semibold text-primary-900">
                                                    <span>Choose an amount</span>
                                                    <span className="text-sm font-medium text-primary-700">80G tax-exempt</span>
                                                </legend>
                                                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                                                    {donationTiers.map((tier) => {
                                                        const active = amount === tier.amount;
                                                        return (
                                                            <button
                                                                key={tier.amount}
                                                                id={`preset-${tier.amount}`}
                                                                type="button"
                                                                aria-pressed={active}
                                                                onClick={() => setAmount(tier.amount)}
                                                                className={`h-12 rounded-xl border-2 text-base font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 ${
                                                                    active
                                                                        ? "border-primary-600 bg-primary-600 text-white"
                                                                        : "border-primary-200 bg-white text-primary-900 hover:border-primary-500"
                                                                }`}
                                                            >
                                                                ₹{tier.amount.toLocaleString("en-IN")}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                                {selectedTier && (
                                                    <p className="mt-2 text-sm leading-relaxed text-primary-800">
                                                        {selectedTier.impact ?? t(`home.tier${selectedTier.amount}`)}
                                                    </p>
                                                )}
                                            </fieldset>

                                            <div className="mb-4">
                                                <label className="mb-1.5 block text-base font-semibold text-primary-900" htmlFor="donation-amount-input">Or enter another amount</label>
                                                <div className="relative">
                                                    <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-base font-bold text-primary-800">₹</span>
                                                    <Input
                                                        id="donation-amount-input"
                                                        type="number"
                                                        inputMode="numeric"
                                                        min={MIN_AMOUNT}
                                                        step={1}
                                                        value={amount}
                                                        aria-invalid={!!fieldErrors.amount}
                                                        aria-describedby="amount-help"
                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
                                                        placeholder="Enter amount"
                                                        className="h-12 rounded-xl pl-8 text-base font-semibold"
                                                    />
                                                </div>
                                                <p id="amount-help" className={`mt-1 text-sm ${fieldErrors.amount ? "font-medium text-red-700" : "text-gray-600"}`}>
                                                    {fieldErrors.amount ?? `The minimum donation is ₹${MIN_AMOUNT}.`}
                                                </p>
                                            </div>

                                            <div className="mb-4">
                                                <label className="mb-1.5 block text-base font-semibold text-primary-900" htmlFor="donor-name-input">Your name</label>
                                                <div className="relative">
                                                    <User size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-primary-600" aria-hidden="true" />
                                                    <Input
                                                        id="donor-name-input"
                                                        type="text"
                                                        autoComplete="name"
                                                        value={donorName}
                                                        aria-invalid={!!fieldErrors.name}
                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDonorName(e.target.value)}
                                                        placeholder="Enter your full name"
                                                        className="h-12 rounded-xl pl-10 text-base"
                                                    />
                                                </div>
                                                {fieldErrors.name && <p className="mt-1 text-sm font-medium text-red-700">{fieldErrors.name}</p>}
                                            </div>

                                            <div className="mb-5">
                                                <label className="mb-1.5 block text-base font-semibold text-primary-900" htmlFor="donor-email-input">Email address (for your 80G receipt)</label>
                                                <div className="relative">
                                                    <Mail size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-primary-600" aria-hidden="true" />
                                                    <Input
                                                        id="donor-email-input"
                                                        type="email"
                                                        autoComplete="email"
                                                        value={donorEmail}
                                                        aria-invalid={!!fieldErrors.email}
                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDonorEmail(e.target.value)}
                                                        placeholder="Enter your email address"
                                                        className="h-12 rounded-xl pl-10 text-base"
                                                    />
                                                </div>
                                                {fieldErrors.email && <p className="mt-1 text-sm font-medium text-red-700">{fieldErrors.email}</p>}
                                            </div>

                                            <fieldset className="mb-5">
                                                <legend className="mb-2 text-base font-semibold text-primary-900">Payment method</legend>
                                                <div className="grid grid-cols-2 gap-2.5">
                                                    {[
                                                        { id: "method-upi-qr", value: "upi_qr" as const, label: "UPI QR scan" },
                                                        { id: "method-razorpay", value: "razorpay" as const, label: "Cards / NetBanking" },
                                                    ].map((option) => (
                                                        <button
                                                            key={option.id}
                                                            id={option.id}
                                                            type="button"
                                                            aria-pressed={method === option.value}
                                                            onClick={() => setMethod(option.value)}
                                                            className={`h-12 rounded-xl border-2 text-base font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 ${
                                                                method === option.value
                                                                    ? "border-primary-600 bg-primary-50 text-primary-900"
                                                                    : "border-primary-200 bg-white text-primary-800 hover:border-primary-500"
                                                            }`}
                                                        >
                                                            {option.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </fieldset>

                                            <AnimatePresence>
                                                {status === "error" && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 4 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0 }}
                                                        role="alert"
                                                        className="mb-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-800"
                                                    >
                                                        <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
                                                        <span>{errorMessage}</span>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                            <button
                                                id="donate-now-btn"
                                                type="button"
                                                onClick={handleDonation}
                                                disabled={status === "processing"}
                                                className={`mb-4 flex h-14 w-full items-center justify-center gap-2 rounded-xl text-lg font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 ${
                                                    status === "processing"
                                                        ? "cursor-not-allowed bg-gray-200 text-gray-600"
                                                        : "bg-secondary-400 text-primary-950 shadow-sm hover:bg-secondary-300"
                                                }`}
                                            >
                                                {status === "processing" ? (
                                                    <><Loader2 size={20} className="animate-spin" aria-hidden="true" /><span>Processing</span></>
                                                ) : (
                                                    <><Heart size={18} className="fill-current" aria-hidden="true" /><span>Donate {isRecurring ? "monthly" : "now"} (₹{Number(amount || 0).toLocaleString("en-IN")})</span><ArrowRight size={16} aria-hidden="true" /></>
                                                )}
                                            </button>

                                            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 border-t border-primary-100 pt-3 text-sm font-medium text-gray-700">
                                                <span className="flex items-center gap-1"><Lock size={13} className="text-primary-600" aria-hidden="true" /> Secure payment</span>
                                                <span className="flex items-center gap-1"><ShieldCheck size={13} className="text-primary-600" aria-hidden="true" /> 80G tax exemption</span>
                                            </div>
                                            <p className="mt-2 text-center text-sm text-gray-600">
                                                NGO registration: <span className="font-mono font-semibold text-primary-900">U85300UP2021NPL146867</span>
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <p className="mt-4 text-center text-base">
                                <a href="https://linktr.ee/DigiSwasthya" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary-700 underline underline-offset-4 hover:text-primary-600">
                                    See photos of the work your donation supports
                                </a>
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            <Footer />

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
