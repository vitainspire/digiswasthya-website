"use client";

import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import Link from "next/link";

function UnsubscribeContent() {
    const searchParams = useSearchParams();
    const status = searchParams.get("status");
    const email = searchParams.get("email");
    const [resubscribed, setResubscribed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleResubscribe = async () => {
        if (!email) return;
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/unsubscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, action: "subscribe" })
            });
            const data = await res.json();
            if (res.ok) {
                setResubscribed(true);
            } else {
                setError(data.error || "Something went wrong. Please try again.");
            }
        } catch (err) {
            setError("Failed to connect to the server.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-8 text-center">
            {/* Logo/Icon */}
            <div className="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
                <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 19v-8.93a2 2 0 01.89-1.664l8-5.333a2 2 0 012.22 0l8 5.333A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-2.25-1.5a2 2 0 00-2.25 0l-2.25 1.5" />
                </svg>
            </div>

            {resubscribed ? (
                <>
                    <h1 className="text-2xl font-bold text-slate-800 mb-2">You&apos;re back on the list!</h1>
                    <p className="text-slate-600 text-sm mb-8">
                        Thank you for resubscribing. You will continue to receive our weekly updates and impact stories.
                    </p>
                    <Link href="/" className="inline-block w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 px-6 rounded-xl transition duration-200 shadow-lg shadow-slate-100">
                        Go back to home page
                    </Link>
                </>
            ) : status === "success" ? (
                <>
                    <h1 className="text-2xl font-bold text-slate-800 mb-2">Successfully Unsubscribed</h1>
                    <p className="text-slate-600 text-sm mb-6">
                        You have been unsubscribed from our weekly impact update emails. We&apos;re sorry to see you go!
                    </p>
                    {email && (
                        <p className="text-xs text-slate-400 mb-8 bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-wrap break-all">
                            Unsubscribed email: <span className="font-medium text-slate-600">{email}</span>
                        </p>
                    )}
                    <button
                        onClick={handleResubscribe}
                        disabled={loading}
                        className="inline-block w-full bg-amber-600 hover:bg-amber-500 disabled:bg-amber-300 text-white font-semibold py-3 px-6 cursor-pointer rounded-xl transition duration-200 shadow-lg shadow-amber-100 mb-4"
                    >
                        {loading ? "Re-subscribing..." : "Oops, subscribe me again!"}
                    </button>
                    {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
                </>
            ) : (
                <>
                    <h1 className="text-2xl font-bold text-slate-800 mb-2">Something went wrong</h1>
                    <p className="text-slate-600 text-sm mb-8">
                        We couldn&apos;t process your unsubscribe request. You may have already unsubscribed, or the link is invalid.
                    </p>
                    <Link href="/" className="inline-block w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 px-6 rounded-xl transition duration-200 shadow-lg shadow-slate-100">
                        Go back to home page
                    </Link>
                </>
            )}
        </div>
    );
}

export default function UnsubscribePage() {
    return (
        <div className="min-h-screen bg-gradient-to-tr from-slate-50 to-slate-100 flex items-center justify-center p-6">
            <Suspense fallback={
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                    <p className="text-slate-500">Loading...</p>
                </div>
            }>
                <UnsubscribeContent />
            </Suspense>
        </div>
    );
}
