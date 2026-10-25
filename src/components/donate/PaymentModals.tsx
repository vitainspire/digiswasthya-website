"use client";


/* ── Razorpay global type ── */
declare global {
    interface Window {
        Razorpay: new (options: Record<string, unknown>) => { open(): void };
    }
}

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import {
    ShieldCheck, Lock, CheckCircle2, AlertCircle,
    ArrowRight, Loader2, Heart, X, ChevronLeft,
    Search, Eye, EyeOff, Edit2, User, Mail, Repeat, CreditCard as CardIcon,
} from "lucide-react";


/* ─────────────────────────────────────────────────────────────
   CONSTANTS
   ───────────────────────────────────────────────────────────── */
const QR_UPI_ID = "digiswasthya@yesbank";
const QR_IMAGE_URL = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=upi://pay?pa=${encodeURIComponent(QR_UPI_ID)}&pn=DigiSwasthya&cu=INR`;
const PRESET_AMOUNTS = [500, 1000, 2500, 5000];

/* ─────────────────────────────────────────────────────────────
   AUTHENTIC BRAND ICONS
   Each icon faithfully reproduces the real brand's colour/style
   ───────────────────────────────────────────────────────────── */

/* PhonePe – deep purple, white Pe lettermark */
const IconPhonePe = ({ size = 40 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
        <rect width="40" height="40" rx="10" fill="#5f259f" />
        <path d="M24.5 11h-8a1.5 1.5 0 0 0-1.5 1.5v15a1.5 1.5 0 0 0 1.5 1.5H20l4.5 3v-3h.5A1.5 1.5 0 0 0 26.5 27.5V17l-2-6Z" fill="#fff" fillOpacity=".15" />
        <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fontSize="13" fontWeight="800" fill="white" fontFamily="'Arial',sans-serif" letterSpacing="-0.5">Pe</text>
    </svg>
);

/* Google Pay – white background with multicolour G */
const IconGPay = ({ size = 40 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
        <rect width="40" height="40" rx="10" fill="#fff" stroke="#e8e8e8" strokeWidth="1" />
        <text x="7" y="26" fontSize="12" fontWeight="700" fill="#4285F4" fontFamily="'Arial',sans-serif">G</text>
        <text x="18" y="26" fontSize="12" fontWeight="700" fill="#34A853" fontFamily="'Arial',sans-serif">P</text>
        <text x="26" y="26" fontSize="12" fontWeight="700" fill="#EA4335" fontFamily="'Arial',sans-serif">a</text>
        <text x="33" y="26" fontSize="12" fontWeight="700" fill="#FBBC05" fontFamily="'Arial',sans-serif">y</text>
    </svg>
);

/* Paytm – deep navy + cyan */
const IconPaytm = ({ size = 40 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
        <rect width="40" height="40" rx="10" fill="#002970" />
        <rect x="8" y="17" width="24" height="7" rx="2" fill="#00baf2" />
        <text x="50%" y="56%" dominantBaseline="middle" textAnchor="middle" fontSize="7.5" fontWeight="800" fill="#002970" fontFamily="'Arial',sans-serif" letterSpacing="0.2">PAYTM</text>
    </svg>
);

/* BHIM – govt navy + saffron stripe */
const IconBHIM = ({ size = 40 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
        <rect width="40" height="40" rx="10" fill="#00205c" />
        <rect x="0" y="30" width="40" height="10" rx="10" fill="#f7941d" />
        <rect x="0" y="30" width="40" height="5" fill="#f7941d" />
        <text x="50%" y="46%" dominantBaseline="middle" textAnchor="middle" fontSize="11" fontWeight="800" fill="white" fontFamily="'Arial',sans-serif" letterSpacing="1">BHIM</text>
    </svg>
);

/* Paytm Wallet icon (slightly different treatment) */
const IconPaytmWallet = ({ size = 40 }: { size?: number }) => <IconPaytm size={size} />;

/* MobiKwik – orange */
const IconMobiKwik = ({ size = 40 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
        <rect width="40" height="40" rx="10" fill="#f47920" />
        <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fontSize="8" fontWeight="800" fill="white" fontFamily="'Arial',sans-serif" letterSpacing="0.2">MobiKwik</text>
    </svg>
);

/* Freecharge – teal */
const IconFreecharge = ({ size = 40 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
        <rect width="40" height="40" rx="10" fill="#00bcd4" />
        <text x="50%" y="38%" dominantBaseline="middle" textAnchor="middle" fontSize="7" fontWeight="800" fill="white" fontFamily="'Arial',sans-serif">Free</text>
        <text x="50%" y="65%" dominantBaseline="middle" textAnchor="middle" fontSize="7" fontWeight="800" fill="white" fontFamily="'Arial',sans-serif">charge</text>
    </svg>
);

/* Bank icon — generic, coloured by bank */
const BankIcon = ({ abbr, color, text = "white" }: { abbr: string; color: string; text?: string }) => (
    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0"
        style={{ background: color, color: text, letterSpacing: "0.02em" }}>
        {abbr}
    </div>
);

/* ─────────────────────────────────────────────────────────────
   HELPER — smooth close-on-escape + backdrop click
   ───────────────────────────────────────────────────────────── */
function useModalClose(onClose: () => void) {
    useEffect(() => {
        const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", fn);
        document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("keydown", fn);
            document.body.style.overflow = "";
        };
    }, [onClose]);
}

/* ─────────────────────────────────────────────────────────────
   MODAL SHELL
   ───────────────────────────────────────────────────────────── */
function ModalShell({ children, onClose, accentGradient, wide = false }: {
    children: React.ReactNode;
    onClose: () => void;
    accentGradient: string;
    wide?: boolean;
}) {
    useModalClose(onClose);
    return (
        <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-0 sm:px-4"
            style={{ background: "rgba(5,15,10,0.60)", backdropFilter: "blur(7px)" }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <motion.div
                initial={{ opacity: 0, y: 48, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 24, scale: 0.98 }}
                transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
                className={`relative w-full bg-white ${wide ? "max-w-md" : "max-w-sm"} rounded-t-3xl sm:rounded-2xl overflow-hidden`}
                style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.08)", maxHeight: "92vh", overflowY: "auto" }}
            >
                {/* brand accent bar */}
                <div className="h-1 w-full flex-shrink-0" style={{ background: accentGradient }} />
                {/* close */}
                <button
                    onClick={onClose}
                    className="absolute top-3.5 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all duration-150"
                >
                    <X size={15} />
                </button>
                {children}
            </motion.div>
        </div>
    );
}

/* slide transition helper */
const slideIn = (dir: "left" | "right" = "right") => ({
    initial: { opacity: 0, x: dir === "right" ? 28 : -28 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: dir === "right" ? -28 : 28 },
    transition: { duration: 0.26, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] },
});

/* ─────────────────────────────────────────────────────────────
   PROCESSING + SUCCESS OVERLAY  (shared)
   ───────────────────────────────────────────────────────────── */
function ProcessingView({ onDone }: { onDone: () => void }) {
    const [phase, setPhase] = useState<"loading" | "success">("loading");
    useEffect(() => {
        const t1 = setTimeout(() => setPhase("success"), 1600);
        const t2 = setTimeout(() => onDone(), 2800);
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, [onDone]);

    return (
        <div className="flex flex-col items-center justify-center py-16 px-8 min-h-[260px]">
            <AnimatePresence mode="wait">
                {phase === "loading" ? (
                    <motion.div key="spin" {...slideIn()} className="flex flex-col items-center gap-4">
                        <div className="relative w-16 h-16">
                            <svg className="w-16 h-16 animate-spin" viewBox="0 0 64 64" fill="none">
                                <circle cx="32" cy="32" r="28" stroke="#e5f0e8" strokeWidth="6" />
                                <path d="M32 4a28 28 0 0 1 28 28" stroke="#00655d" strokeWidth="6" strokeLinecap="round" />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Lock size={18} className="text-primary-600" />
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-700 text-center">Verifying Payment</p>
                            <p className="text-xs text-gray-400 text-center mt-0.5">Please wait…</p>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div key="done" {...slideIn()} className="flex flex-col items-center gap-3">
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 260, damping: 18 }}
                            className="w-16 h-16 rounded-full flex items-center justify-center"
                            style={{ background: "linear-gradient(135deg,#00655d,#1d7a72)" }}
                        >
                            <CheckCircle2 size={32} className="text-white" strokeWidth={2.5} />
                        </motion.div>
                        <div>
                            <p className="text-sm font-bold text-gray-800 text-center">Payment Successful</p>
                            <p className="text-xs text-gray-400 text-center mt-0.5">Thank you for your contribution ♥</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   UPI QR MODAL
   ═══════════════════════════════════════════════════════════════ */
function UpiQrModal({ amount, onConfirm, onClose }: { amount: number; onConfirm: () => void; onClose: () => void }) {
    const [copied, setCopied] = useState(false);
    const [phase, setPhase] = useState<"qr" | "processing">("qr");

    const handleConfirm = () => setPhase("processing");

    const copy = () => {
        navigator.clipboard.writeText(QR_UPI_ID).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <ModalShell onClose={onClose} accentGradient="linear-gradient(90deg,#00655d,#1d7a72,#00655d)">
            <AnimatePresence mode="wait">
                {phase === "qr" ? (
                    <motion.div key="qr-view" {...slideIn()} className="px-6 pt-5 pb-7">
                        {/* header */}
                        <div className="flex items-center gap-2 mb-1">
                            <span className="w-5 h-5 rounded-full bg-primary-50 border border-primary-200 flex items-center justify-center">
                                <Heart size={10} className="text-primary-600 fill-primary-600" />
                            </span>
                            <span className="text-xs font-bold text-primary-700 uppercase tracking-widest">DigiSwasthya Foundation</span>
                        </div>
                        <h2 className="font-serif text-[22px] font-bold text-gray-900 leading-tight mb-0.5">Scan &amp; Donate</h2>
                        <p className="text-xs text-gray-400 mb-4">Support DigiSwasthya Foundation using any UPI app</p>

                        {/* amount pill */}
                        <div className="flex justify-center mb-4">
                            <span className="bg-primary-50 border border-primary-200 text-primary-700 text-sm font-bold px-6 py-1.5 rounded-full">
                                ₹{amount.toLocaleString("en-IN")}
                            </span>
                        </div>

                        {/* QR */}
                        <div className="flex justify-center mb-4">
                            <div className="p-3 rounded-2xl border border-gray-100 bg-white" style={{ boxShadow: "0 2px 18px rgba(26,107,58,0.08)" }}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={QR_IMAGE_URL} alt="UPI QR Code" width={168} height={168} className="block rounded-lg" />
                            </div>
                        </div>

                        {/* UPI apps */}
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest text-center mb-3">Pay using</p>
                        <div className="flex items-end justify-center gap-4 mb-4">
                            {[
                                { Icon: IconPhonePe, label: "PhonePe" },
                                { Icon: IconGPay, label: "GPay" },
                                { Icon: IconPaytm, label: "Paytm" },
                                { Icon: IconBHIM, label: "BHIM" },
                            ].map(({ Icon, label }) => (
                                <div key={label} className="flex flex-col items-center gap-1">
                                    <Icon size={38} />
                                    <span className="text-xs text-gray-400 font-medium">{label}</span>
                                </div>
                            ))}
                        </div>

                        {/* UPI ID copy */}
                        <button onClick={copy}
                            className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-dashed border-primary-200 bg-primary-50/60 mb-1 group transition-colors hover:bg-primary-100/60">
                            <div className="text-left">
                                <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest">UPI ID</p>
                                <p className="text-sm font-bold text-primary-800 font-mono tracking-tight">{QR_UPI_ID}</p>
                            </div>
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-lg transition-colors ${copied ? "bg-primary-100 text-primary-700" : "bg-white text-primary-600 group-hover:text-primary-800 border border-gray-100"}`}>
                                {copied ? "Copied ✓" : "Copy"}
                            </span>
                        </button>
                        <p className="text-center text-xs text-gray-400 mb-5">Scan with any UPI app to complete your donation</p>

                        {/* buttons */}
                        <button onClick={handleConfirm}
                            className="w-full py-3.5 rounded-xl font-bold text-white text-sm mb-2.5 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                            style={{ background: "linear-gradient(135deg,#00655d,#1d7a72)", boxShadow: "0 4px 18px rgba(26,107,58,0.32)" }}>
                            <CheckCircle2 size={15} strokeWidth={2.5} /> I Have Donated
                        </button>
                        <button onClick={onClose}
                            className="w-full py-3 rounded-xl font-semibold text-gray-500 text-sm border border-gray-200 hover:bg-gray-50 transition-colors">
                            Close
                        </button>
                    </motion.div>
                ) : (
                    <motion.div key="processing" {...slideIn()}>
                        <ProcessingView onDone={onConfirm} />
                    </motion.div>
                )}
            </AnimatePresence>
        </ModalShell>
    );
}

/* ═══════════════════════════════════════════════════════════════
   RAZORPAY MODAL — multi-screen
   Screens: picker → upi / cards / netbanking / wallets → processing → done
   ═══════════════════════════════════════════════════════════════ */
type RzpScreen = "picker" | "upi" | "cards" | "netbanking" | "wallets" | "processing";

const BANKS = [
    { name: "State Bank of India", abbr: "SBI", color: "#1B4F9B", text: "white" },
    { name: "HDFC Bank", abbr: "HDFC", color: "#004C97", text: "white" },
    { name: "ICICI Bank", abbr: "ICICI", color: "#F06A20", text: "white" },
    { name: "Axis Bank", abbr: "AXIS", color: "#97144D", text: "white" },
    { name: "Kotak Mahindra", abbr: "KMB", color: "#ED1C24", text: "white" },
    { name: "Punjab National", abbr: "PNB", color: "#4B2882", text: "white" },
    { name: "Bank of Baroda", abbr: "BOB", color: "#F7941D", text: "white" },
    { name: "Canara Bank", abbr: "CNR", color: "#003580", text: "white" },
];

function RazorpayModal({ amount, isRecurring, onConfirm, onClose }: {
    amount: number; isRecurring: boolean; onConfirm: () => void; onClose: () => void;
}) {
    const [screen, setScreen] = useState<RzpScreen>("picker");
    const [prevScreen, setPrev] = useState<RzpScreen>("picker");
    const [upiApp, setUpiApp] = useState<string | null>(null);
    const [upiId, setUpiId] = useState("");
    const [bankSearch, setBankSearch] = useState("");
    const [selectedBank, setSelectedBank] = useState<string | null>(null);
    const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
    const [card, setCard] = useState({ number: "", name: "", expiry: "", cvv: "" });
    const [showCvv, setShowCvv] = useState(false);

    const go = (s: RzpScreen) => { setPrev(screen); setScreen(s); };
    const back = () => setScreen(prevScreen === screen ? "picker" : prevScreen);
    const proceed = () => go("processing");

    const filteredBanks = BANKS.filter(b =>
        b.name.toLowerCase().includes(bankSearch.toLowerCase()) ||
        b.abbr.toLowerCase().includes(bankSearch.toLowerCase())
    );

    // card number formatter
    const formatCard = (v: string) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
    const formatExpiry = (v: string) => {
        const d = v.replace(/\D/g, "").slice(0, 4);
        return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
    };

    return (
        <ModalShell onClose={onClose} accentGradient="linear-gradient(90deg,#4776E6,#8E54E9,#4776E6)" wide>
            <AnimatePresence mode="wait">

                {/* ─── PICKER ──────────────────────────────────── */}
                {screen === "picker" && (
                    <motion.div key="picker" {...slideIn()} className="px-6 pt-5 pb-7">
                        <div className="flex items-center gap-2 mb-1">
                            <Lock size={11} className="text-indigo-500" />
                            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Secure Online Payment</span>
                        </div>
                        <h2 className="font-serif text-[22px] font-bold text-gray-900 mb-0.5">Choose Payment Method</h2>
                        <p className="text-xs text-gray-400 mb-5">Choose your preferred payment method</p>

                        <div className="flex justify-center mb-5">
                            <span className="bg-indigo-50 border border-indigo-200 text-indigo-700 text-sm font-bold px-6 py-1.5 rounded-full">
                                {isRecurring ? "Monthly" : "One-time"} · ₹{amount.toLocaleString("en-IN")}
                            </span>
                        </div>

                        <div className="flex flex-col gap-2.5 mb-6">
                            {[
                                {
                                    id: "upi", label: "UPI", sub: "PhonePe, GPay, Paytm & more", badge: "Instant",
                                    icon: (
                                        <svg viewBox="0 0 24 24" className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2">
                                            <rect x="2" y="5" width="20" height="14" rx="2" />
                                            <path d="M12 10v4M10 12h4" />
                                        </svg>
                                    ),
                                },
                                {
                                    id: "cards", label: "Credit / Debit Card", sub: "Visa, Mastercard, RuPay",
                                    icon: (
                                        <svg viewBox="0 0 24 24" className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2">
                                            <rect x="2" y="5" width="20" height="14" rx="2" />
                                            <path d="M2 10h20M6 15h4" strokeLinecap="round" />
                                        </svg>
                                    ),
                                },
                                {
                                    id: "netbanking", label: "Net Banking", sub: "All major Indian banks",
                                    icon: (
                                        <svg viewBox="0 0 24 24" className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 10v11M12 10v11M16 10v11" strokeLinecap="round" />
                                        </svg>
                                    ),
                                },
                                {
                                    id: "wallets", label: "Wallets", sub: "Paytm, MobiKwik, Freecharge",
                                    icon: (
                                        <svg viewBox="0 0 24 24" className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5Z" />
                                            <path d="M16 12a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z" />
                                        </svg>
                                    ),
                                },
                            ].map((m, i) => (
                                <motion.button key={m.id}
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.055 }}
                                    onClick={() => go(m.id as RzpScreen)}
                                    className="flex items-center gap-3.5 px-4 py-3.5 rounded-xl border-2 border-gray-100 bg-gray-50 hover:border-indigo-200 hover:bg-indigo-50/40 text-left transition-all group"
                                >
                                    <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-50 transition-colors"
                                        style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.07)" }}>
                                        {m.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-semibold text-gray-800">{m.label}</span>
                                            {m.badge && (
                                                <span className="text-xs font-bold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full">{m.badge}</span>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-400 mt-0.5">{m.sub}</p>
                                    </div>
                                    <ArrowRight size={14} className="text-gray-300 group-hover:text-indigo-400 flex-shrink-0 transition-colors" />
                                </motion.button>
                            ))}
                        </div>

                        <button onClick={onClose}
                            className="w-full py-3 rounded-xl font-semibold text-gray-500 text-sm border border-gray-200 hover:bg-gray-50 transition-colors">
                            Close
                        </button>
                        <div className="flex items-center justify-center gap-2 mt-4 text-gray-300 text-xs font-medium">
                            <ShieldCheck size={11} /> <span>256-bit SSL Encrypted</span>
                            <span>·</span>
                            <Lock size={11} /> <span>PCI DSS Compliant</span>
                        </div>
                    </motion.div>
                )}

                {/* ─── UPI SUB-SCREEN ──────────────────────────── */}
                {screen === "upi" && (
                    <motion.div key="upi" {...slideIn()} className="px-6 pt-5 pb-7">
                        <button onClick={() => go("picker")} className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 mb-4 transition-colors">
                            <ChevronLeft size={14} /> Back
                        </button>
                        <h2 className="font-serif text-[20px] font-bold text-gray-900 mb-0.5">Pay via UPI</h2>
                        <p className="text-xs text-gray-400 mb-5">Select your preferred UPI app or enter UPI ID</p>

                        {/* App grid */}
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Choose app</p>
                        <div className="grid grid-cols-4 gap-3 mb-5">
                            {[
                                { id: "phonepe", label: "PhonePe", Icon: IconPhonePe },
                                { id: "gpay", label: "Google Pay", Icon: IconGPay },
                                { id: "paytm", label: "Paytm", Icon: IconPaytm },
                                { id: "bhim", label: "BHIM", Icon: IconBHIM },
                            ].map(({ id, label, Icon }) => (
                                <button key={id} onClick={() => setUpiApp(id)}
                                    className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 transition-all ${upiApp === id ? "border-indigo-400 bg-indigo-50" : "border-gray-100 bg-gray-50 hover:border-indigo-200"}`}>
                                    <Icon size={38} />
                                    <span className="text-xs text-gray-500 font-medium leading-tight text-center">{label}</span>
                                </button>
                            ))}
                        </div>

                        {/* UPI ID input */}
                        <div className="mb-5">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                                Or enter UPI ID
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={upiId}
                                    onChange={e => setUpiId(e.target.value)}
                                    placeholder="yourname@upi"
                                    className="w-full h-12 px-4 text-sm font-medium text-gray-800 border-2 border-gray-200 rounded-xl outline-none focus:border-indigo-400 transition-colors placeholder:text-gray-300"
                                />
                                {upiId && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        <div className="w-5 h-5 rounded-full bg-primary-100 flex items-center justify-center">
                                            <CheckCircle2 size={12} className="text-primary-600" />
                                        </div>
                                    </div>
                                )}
                            </div>
                            <p className="text-xs text-gray-400 mt-1.5">Example: 9876543210@upi or yourname@okaxis</p>
                        </div>

                        <button onClick={proceed}
                            disabled={!upiApp && !upiId}
                            className="w-full py-3.5 rounded-xl font-bold text-white text-sm mb-2.5 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                            style={{
                                background: (!upiApp && !upiId) ? "#d1d5db" : "linear-gradient(135deg,#4776E6,#8E54E9)",
                                boxShadow: (!upiApp && !upiId) ? "none" : "0 4px 18px rgba(71,118,230,0.35)",
                                color: (!upiApp && !upiId) ? "#9ca3af" : "white",
                                cursor: (!upiApp && !upiId) ? "not-allowed" : "pointer"
                            }}>
                            <ArrowRight size={15} /> Proceed Payment
                        </button>
                        <button onClick={() => go("picker")}
                            className="w-full py-3 rounded-xl font-semibold text-gray-500 text-sm border border-gray-200 hover:bg-gray-50 transition-colors">
                            Back
                        </button>
                    </motion.div>
                )}

                {/* ─── CARDS SUB-SCREEN ────────────────────────── */}
                {screen === "cards" && (
                    <motion.div key="cards" {...slideIn()} className="px-6 pt-5 pb-7">
                        <button onClick={() => go("picker")} className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 mb-4 transition-colors">
                            <ChevronLeft size={14} /> Back
                        </button>

                        {/* card preview */}
                        <div className="relative h-36 rounded-2xl mb-6 overflow-hidden"
                            style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%)" }}>
                            <div className="absolute inset-0 opacity-10"
                                style={{ backgroundImage: "repeating-linear-gradient(45deg,transparent,transparent 10px,rgba(255,255,255,.05) 10px,rgba(255,255,255,.05) 20px)" }} />
                            {/* chip */}
                            <div className="absolute top-5 left-5 w-9 h-7 rounded-md" style={{ background: "linear-gradient(135deg,#d4af37,#f9e077)" }} />
                            {/* number */}
                            <div className="absolute bottom-10 left-5 text-white font-mono text-sm tracking-[0.22em] opacity-90">
                                {card.number || "•••• •••• •••• ••••"}
                            </div>
                            <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
                                <div>
                                    <p className="text-xs text-blue-200 uppercase tracking-wider">Card Holder</p>
                                    <p className="text-white text-xs font-semibold mt-0.5 uppercase tracking-wide truncate max-w-[140px]">
                                        {card.name || "Your Name"}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-blue-200 uppercase tracking-wider">Expires</p>
                                    <p className="text-white text-xs font-semibold mt-0.5">{card.expiry || "MM/YY"}</p>
                                </div>
                            </div>
                            {/* Visa watermark */}
                            <div className="absolute top-5 right-5 text-white font-black italic text-base opacity-80 tracking-tight">VISA</div>
                        </div>

                        <div className="flex flex-col gap-4 mb-5">
                            {/* Card number */}
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Card Number</label>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    value={card.number}
                                    onChange={e => setCard(c => ({ ...c, number: formatCard(e.target.value) }))}
                                    placeholder="1234 5678 9012 3456"
                                    maxLength={19}
                                    className="w-full h-12 px-4 text-sm font-mono font-semibold text-gray-800 border-2 border-gray-200 rounded-xl outline-none focus:border-indigo-400 transition-colors tracking-wider placeholder:font-sans placeholder:text-gray-300 placeholder:font-normal"
                                />
                            </div>
                            {/* Name */}
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Cardholder Name</label>
                                <input
                                    type="text"
                                    value={card.name}
                                    onChange={e => setCard(c => ({ ...c, name: e.target.value.toUpperCase() }))}
                                    placeholder="AS ON CARD"
                                    className="w-full h-12 px-4 text-sm font-semibold text-gray-800 border-2 border-gray-200 rounded-xl outline-none focus:border-indigo-400 transition-colors uppercase placeholder:normal-case placeholder:text-gray-300 placeholder:font-normal"
                                />
                            </div>
                            {/* Expiry + CVV */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Expiry</label>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        value={card.expiry}
                                        onChange={e => setCard(c => ({ ...c, expiry: formatExpiry(e.target.value) }))}
                                        placeholder="MM/YY"
                                        maxLength={5}
                                        className="w-full h-12 px-4 text-sm font-mono font-semibold text-gray-800 border-2 border-gray-200 rounded-xl outline-none focus:border-indigo-400 transition-colors placeholder:font-sans placeholder:text-gray-300 placeholder:font-normal"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">CVV</label>
                                    <div className="relative">
                                        <input
                                            type={showCvv ? "text" : "password"}
                                            value={card.cvv}
                                            onChange={e => setCard(c => ({ ...c, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) }))}
                                            placeholder="•••"
                                            maxLength={4}
                                            className="w-full h-12 pl-4 pr-10 text-sm font-mono font-semibold text-gray-800 border-2 border-gray-200 rounded-xl outline-none focus:border-indigo-400 transition-colors placeholder:text-gray-300"
                                        />
                                        <button onClick={() => setShowCvv(v => !v)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                            {showCvv ? <EyeOff size={14} /> : <Eye size={14} />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* security note */}
                        <div className="flex items-center gap-2 bg-primary-50 border border-primary-200 rounded-xl px-4 py-2.5 mb-5">
                            <ShieldCheck size={14} className="text-primary-600 flex-shrink-0" />
                            <p className="text-xs text-primary-700 font-medium">Your card details are encrypted and never stored.</p>
                        </div>

                        <button onClick={proceed}
                            disabled={!card.number || !card.name || !card.expiry || !card.cvv}
                            className="w-full py-3.5 rounded-xl font-bold text-white text-sm mb-2.5 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                            style={{
                                background: (!card.number || !card.name || !card.expiry || !card.cvv) ? "#d1d5db" : "linear-gradient(135deg,#4776E6,#8E54E9)",
                                boxShadow: (!card.number || !card.name || !card.expiry || !card.cvv) ? "none" : "0 4px 18px rgba(71,118,230,0.35)",
                                color: (!card.number || !card.name || !card.expiry || !card.cvv) ? "#9ca3af" : "white",
                                cursor: (!card.number || !card.name || !card.expiry || !card.cvv) ? "not-allowed" : "pointer"
                            }}>
                            <Lock size={14} /> Proceed Payment
                        </button>
                        <button onClick={() => go("picker")}
                            className="w-full py-3 rounded-xl font-semibold text-gray-500 text-sm border border-gray-200 hover:bg-gray-50 transition-colors">
                            Back
                        </button>
                    </motion.div>
                )}

                {/* ─── NETBANKING ──────────────────────────────── */}
                {screen === "netbanking" && (
                    <motion.div key="netbanking" {...slideIn()} className="px-6 pt-5 pb-7">
                        <button onClick={() => go("picker")} className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 mb-4 transition-colors">
                            <ChevronLeft size={14} /> Back
                        </button>
                        <h2 className="font-serif text-[20px] font-bold text-gray-900 mb-0.5">Net Banking</h2>
                        <p className="text-xs text-gray-400 mb-4">Select your bank to continue</p>

                        {/* search */}
                        <div className="relative mb-4">
                            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={bankSearch}
                                onChange={e => setBankSearch(e.target.value)}
                                placeholder="Search your bank..."
                                className="w-full h-11 pl-9 pr-4 text-sm text-gray-700 border-2 border-gray-200 rounded-xl outline-none focus:border-indigo-400 transition-colors placeholder:text-gray-300"
                            />
                        </div>

                        {!bankSearch && (
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2.5">Popular Banks</p>
                        )}

                        <div className="flex flex-col gap-2 mb-5 max-h-56 overflow-y-auto pr-1">
                            {filteredBanks.map((bank) => (
                                <button key={bank.abbr} onClick={() => setSelectedBank(bank.name)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all ${selectedBank === bank.name ? "border-indigo-400 bg-indigo-50" : "border-gray-100 bg-gray-50 hover:border-indigo-200"}`}>
                                    <BankIcon abbr={bank.abbr} color={bank.color} text={bank.text} />
                                    <span className="text-sm font-semibold text-gray-800">{bank.name}</span>
                                    {selectedBank === bank.name && (
                                        <div className="ml-auto w-4 h-4 rounded-full bg-indigo-600 flex items-center justify-center">
                                            <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                        </div>
                                    )}
                                </button>
                            ))}
                            {filteredBanks.length === 0 && (
                                <p className="text-center text-sm text-gray-400 py-6">No banks found for &quot;{bankSearch}&quot;</p>
                            )}
                        </div>

                        <button onClick={proceed}
                            disabled={!selectedBank}
                            className="w-full py-3.5 rounded-xl font-bold text-white text-sm mb-2.5 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                            style={{
                                background: !selectedBank ? "#d1d5db" : "linear-gradient(135deg,#4776E6,#8E54E9)",
                                boxShadow: !selectedBank ? "none" : "0 4px 18px rgba(71,118,230,0.35)",
                                color: !selectedBank ? "#9ca3af" : "white",
                                cursor: !selectedBank ? "not-allowed" : "pointer"
                            }}>
                            <ArrowRight size={15} /> Proceed Payment
                        </button>
                        <button onClick={() => go("picker")}
                            className="w-full py-3 rounded-xl font-semibold text-gray-500 text-sm border border-gray-200 hover:bg-gray-50 transition-colors">
                            Back
                        </button>
                    </motion.div>
                )}

                {/* ─── WALLETS ──────────────────────────────────── */}
                {screen === "wallets" && (
                    <motion.div key="wallets" {...slideIn()} className="px-6 pt-5 pb-7">
                        <button onClick={() => go("picker")} className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 mb-4 transition-colors">
                            <ChevronLeft size={14} /> Back
                        </button>
                        <h2 className="font-serif text-[20px] font-bold text-gray-900 mb-0.5">Pay via Wallet</h2>
                        <p className="text-xs text-gray-400 mb-5">Select your preferred wallet</p>

                        <div className="flex flex-col gap-2.5 mb-5">
                            {[
                                { id: "paytm", label: "Paytm Wallet", sub: "Instant cashback on donations", Icon: IconPaytmWallet },
                                { id: "mobikwik", label: "MobiKwik", sub: "Pay with SuperCash", Icon: IconMobiKwik },
                                { id: "freecharge", label: "Freecharge", sub: "Zero-fee transactions", Icon: IconFreecharge },
                            ].map(({ id, label, sub, Icon }) => (
                                <button key={id} onClick={() => setSelectedWallet(id)}
                                    className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl border-2 text-left transition-all ${selectedWallet === id ? "border-indigo-400 bg-indigo-50" : "border-gray-100 bg-gray-50 hover:border-indigo-200"}`}>
                                    <Icon size={40} />
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-gray-800">{label}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
                                    </div>
                                    <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all ${selectedWallet === id ? "border-indigo-600 bg-indigo-600" : "border-gray-300"}`}>
                                        {selectedWallet === id && (
                                            <div className="w-full h-full rounded-full flex items-center justify-center">
                                                <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                            </div>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>

                        <button onClick={proceed}
                            disabled={!selectedWallet}
                            className="w-full py-3.5 rounded-xl font-bold text-white text-sm mb-2.5 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                            style={{
                                background: !selectedWallet ? "#d1d5db" : "linear-gradient(135deg,#4776E6,#8E54E9)",
                                boxShadow: !selectedWallet ? "none" : "0 4px 18px rgba(71,118,230,0.35)",
                                color: !selectedWallet ? "#9ca3af" : "white",
                                cursor: !selectedWallet ? "not-allowed" : "pointer"
                            }}>
                            <ArrowRight size={15} /> Proceed Payment
                        </button>
                        <button onClick={() => go("picker")}
                            className="w-full py-3 rounded-xl font-semibold text-gray-500 text-sm border border-gray-200 hover:bg-gray-50 transition-colors">
                            Back
                        </button>
                    </motion.div>
                )}

                {/* ─── PROCESSING ──────────────────────────────── */}
                {screen === "processing" && (
                    <motion.div key="processing" {...slideIn()}>
                        <ProcessingView onDone={onConfirm} />
                    </motion.div>
                )}

            </AnimatePresence>
        </ModalShell>
    );
}

/* ═══════════════════════════════════════════════════════════════
   DONATION SUMMARY MODAL
   Shows a clean preview of all donor details before payment opens.
   Donor can confirm or go back to edit.
   ═══════════════════════════════════════════════════════════════ */
function DonationSummaryModal({ amount, name, email, isRecurring, method, onConfirm, onEdit }: {
    amount: number;
    name: string;
    email: string;
    isRecurring: boolean;
    method: "upi_qr" | "razorpay";
    onConfirm: () => void;
    onEdit: () => void;
}) {
    useModalClose(onEdit);

    const methodLabel = method === "upi_qr" ? "UPI QR Code" : "Razorpay (Cards / UPI / Wallets)";
    const methodIcon = method === "upi_qr"
        ? (
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="5" y="5" width="3" height="3" fill="currentColor" stroke="none" /><rect x="16" y="5" width="3" height="3" fill="currentColor" stroke="none" /><rect x="5" y="16" width="3" height="3" fill="currentColor" stroke="none" />
                <path d="M14 14h3v3h-3z" fill="currentColor" stroke="none" /><path d="M17 17h4" /><path d="M17 14v7" />
            </svg>
        )
        : (
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
        );

    const rows: { icon: React.ReactNode; label: string; value: string; highlight?: boolean }[] = [
        {
            icon: <User size={14} className="text-primary-500" />,
            label: "Donor Name",
            value: name.trim() || "—",
        },
        {
            icon: <Mail size={14} className="text-primary-500" />,
            label: "Email Address",
            value: email.trim() || "—",
        },
        {
            icon: <Heart size={14} className="text-primary-500 fill-primary-100" />,
            label: "Donation Amount",
            value: `₹${amount.toLocaleString("en-IN")}`,
            highlight: true,
        },
        {
            icon: <Repeat size={14} className="text-primary-500" />,
            label: "Frequency",
            value: isRecurring ? "Monthly (Recurring)" : "One-time",
        },
        {
            icon: methodIcon,
            label: "Payment Method",
            value: methodLabel,
        },
    ];

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{ background: "rgba(5,15,10,0.65)", backdropFilter: "blur(8px)" }}
            onClick={(e) => { if (e.target === e.currentTarget) onEdit(); }}
        >
            <motion.div
                initial={{ opacity: 0, y: 36, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.97 }}
                transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                className="relative w-full max-w-md bg-white rounded-2xl overflow-hidden"
                style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.08)" }}
            >
                {/* Green top accent */}
                <div className="h-1.5 w-full" style={{ background: "linear-gradient(90deg,#00655d,#1d7a72,#00655d)" }} />

                {/* Close */}
                <button
                    onClick={onEdit}
                    className="absolute top-3.5 right-3.5 z-10 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all"
                >
                    <X size={15} />
                </button>

                <div className="px-6 pt-5 pb-6">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-1">
                        <CheckCircle2 size={13} className="text-primary-600" />
                        <span className="text-xs font-bold text-primary-700 uppercase tracking-widest">Review Your Donation</span>
                    </div>
                    <h2 className="font-serif text-xl font-bold text-gray-900 leading-tight mb-0.5">Donation Summary</h2>
                    <p className="text-xs text-gray-400 mb-4">Please confirm your details before proceeding to payment.</p>

                    {/* Summary rows — stacked label+value, nothing truncated */}
                    <div className="rounded-xl border border-gray-100 overflow-hidden mb-4 divide-y divide-gray-100">
                        {rows.map((row) => (
                            <div key={row.label} className={`flex items-center gap-3 px-4 py-3 ${row.highlight ? "bg-primary-50/60" : "bg-white"}`}>
                                <div className="w-7 h-7 rounded-lg bg-white border border-gray-100 flex items-center justify-center flex-shrink-0"
                                    style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                                    {row.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none">{row.label}</p>
                                    <p className={`text-sm font-bold mt-0.5 break-all leading-snug ${row.highlight ? "text-primary-700" : "text-gray-900"}`}>
                                        {row.value}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* 80G note */}
                    <div className="flex items-start gap-2.5 bg-primary-50 border border-primary-200 rounded-xl px-4 py-2.5 mb-4">
                        <ShieldCheck size={13} className="text-primary-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-primary-700 font-semibold leading-snug">Eligible for 80G Tax Exemption · NGO Reg. U85300UP2021NPL146867</p>
                    </div>

                    {/* Buttons */}
                    <button
                        onClick={onConfirm}
                        className="w-full py-3 rounded-xl font-bold text-white text-sm mb-2.5 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                        style={{
                            background: "linear-gradient(135deg,#00655d,#1d7a72)",
                            boxShadow: "0 4px 16px rgba(26,107,58,0.32)"
                        }}
                    >
                        <ArrowRight size={15} /> Confirm &amp; Proceed to Payment
                    </button>
                    <button
                        onClick={onEdit}
                        className="w-full py-2.5 rounded-xl font-semibold text-gray-600 text-sm border border-gray-200 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                    >
                        <Edit2 size={13} /> Edit Details
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

export { UpiQrModal, RazorpayModal, DonationSummaryModal };

