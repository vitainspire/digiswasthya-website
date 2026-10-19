"use client";

import { useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Building2, HandHeart, Mail, MapPin, MessageCircle, MessagesSquare, Phone, Stethoscope } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { STATIC_CENTRES } from "@/data/centreData";
import { websiteConfig } from "@/data/websiteConfig";
import { MessageForm } from "./MessageForm";
import { DonorForm } from "./DonorForm";
import { DoctorForm } from "./DoctorForm";

type Tab = "message" | "donor" | "doctor";
const TABS: Tab[] = ["message", "donor", "doctor"];
const FORMS: Record<Tab, () => React.JSX.Element> = { message: MessageForm, donor: DonorForm, doctor: DoctorForm };

const phoneHref = `tel:${websiteConfig.supportPhone.replace(/[^\d+]/g, "")}`;
const whatsappHref = `https://wa.me/${websiteConfig.whatsappNumber.replace(/\D/g, "")}`;

function subscribeToHash(onChange: () => void) {
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
}

export default function ContactUsClient() {
    const { t, language } = useLanguage();
    const reduced = useReducedMotion();
    const hash = useSyncExternalStore(subscribeToHash, () => window.location.hash, () => "");
    const [chosen, setChosen] = useState<Tab | null>(null);
    const fromHash = TABS.find((id) => hash === `#${id}`) ?? null;
    const tab: Tab = chosen ?? fromHash ?? "message";
    const tabRefs = useRef<Record<Tab, HTMLButtonElement | null>>({ message: null, donor: null, doctor: null });

    function select(next: Tab, focus = false) {
        setChosen(next);
        window.history.replaceState(null, "", `#${next}`);
        if (focus) tabRefs.current[next]?.focus();
    }

    function onKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft" && e.key !== "Home" && e.key !== "End") return;
        e.preventDefault();
        const index = TABS.indexOf(tab);
        const next =
            e.key === "Home" ? TABS[0] : e.key === "End" ? TABS[TABS.length - 1] : TABS[(index + (e.key === "ArrowRight" ? 1 : TABS.length - 1)) % TABS.length];
        select(next, true);
    }

    const tabs = [
        { id: "message" as const, icon: MessagesSquare, title: t("joinUs.messageTab"), hint: t("joinUs.messageTabHint") },
        { id: "donor" as const, icon: HandHeart, title: t("joinUs.donorTab"), hint: t("joinUs.donorTabHint") },
        { id: "doctor" as const, icon: Stethoscope, title: t("joinUs.doctorTab"), hint: t("joinUs.doctorTabHint") },
    ];
    const steps = [t(`joinUs.${tab}Step1`), t(`joinUs.${tab}Step2`), t(`joinUs.${tab}Step3`)];
    const Form = FORMS[tab];

    const centreStates = [
        ...new Set(STATIC_CENTRES.filter((c) => c.isActive).map((c) => (language === "hi" ? c.stateHi : c.state))),
    ];
    const reach = [
        { icon: Phone, label: t("joinUs.call"), value: websiteConfig.supportPhone, href: phoneHref },
        { icon: MessageCircle, label: t("joinUs.whatsapp"), value: websiteConfig.whatsappNumber, href: whatsappHref },
        { icon: Mail, label: t("joinUs.email"), value: websiteConfig.supportEmail, href: `mailto:${websiteConfig.supportEmail}` },
        { icon: MapPin, label: t("joinUs.headOffice"), value: websiteConfig.headOfficeAddress },
        { icon: Building2, label: t("joinUs.registeredAddress"), value: websiteConfig.registeredAddress },
    ];

    return (
        <main className="flex min-h-screen flex-col bg-white">
            <Navbar />

            <section className="bg-primary-50 py-14 md:py-20">
                <div className="container max-w-5xl">
                    <h1 className="max-w-2xl font-serif text-4xl font-bold leading-tight text-primary-900 md:text-5xl">
                        {t("joinUs.heroTitle")}
                    </h1>
                    <p className="mt-4 max-w-xl text-lg leading-relaxed text-primary-900/80">{t("joinUs.heroBody")}</p>
                    <p className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-base text-primary-900">
                        <span className="font-semibold">{t("joinUs.urgentLead")}</span>
                        <a href={phoneHref} className="inline-flex items-center gap-2 font-semibold text-primary-700 underline underline-offset-4 hover:text-primary-900">
                            <Phone className="h-4 w-4" aria-hidden="true" /> {websiteConfig.supportPhone}
                        </a>
                        <a
                            href={whatsappHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 font-semibold text-primary-700 underline underline-offset-4 hover:text-primary-900"
                        >
                            <MessageCircle className="h-4 w-4" aria-hidden="true" /> {t("joinUs.whatsappChat")}
                        </a>
                    </p>

                    <div role="tablist" aria-label={t("joinUs.tabsLabel")} className="mt-10 grid gap-4 md:grid-cols-3">
                        {tabs.map(({ id, icon: Icon, title, hint }) => {
                            const selected = tab === id;
                            return (
                                <button
                                    key={id}
                                    ref={(el) => {
                                        tabRefs.current[id] = el;
                                    }}
                                    type="button"
                                    role="tab"
                                    id={`tab-${id}`}
                                    aria-selected={selected}
                                    aria-controls="contact-panel"
                                    tabIndex={selected ? 0 : -1}
                                    onClick={() => select(id)}
                                    onKeyDown={onKeyDown}
                                    className={`flex items-start gap-4 rounded-2xl border-2 p-5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 ${
                                        selected
                                            ? "border-primary-600 bg-primary-600 text-white"
                                            : "border-primary-200 bg-white text-primary-900 hover:border-primary-400"
                                    }`}
                                >
                                    <Icon className={`mt-1 h-7 w-7 shrink-0 ${selected ? "text-white" : "text-primary-600"}`} aria-hidden="true" />
                                    <span>
                                        <span className="block font-serif text-xl font-bold">{title}</span>
                                        <span className={`mt-1 block text-sm leading-relaxed ${selected ? "text-primary-50" : "text-gray-700"}`}>{hint}</span>
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="py-12 md:py-16">
                <div className="container grid max-w-5xl gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] lg:gap-14">
                    <div className="order-2 lg:order-1">
                        <h2 className="font-serif text-xl font-bold text-primary-900">{t("joinUs.nextTitle")}</h2>
                        <ol className="mt-5 space-y-5">
                            {steps.map((step, i) => (
                                <li key={step} className="flex gap-4">
                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-800">
                                        {i + 1}
                                    </span>
                                    <p className="pt-1 leading-relaxed text-gray-800">{step}</p>
                                </li>
                            ))}
                        </ol>
                    </div>

                    <div
                        role="tabpanel"
                        id="contact-panel"
                        aria-labelledby={`tab-${tab}`}
                        className="order-1 rounded-2xl border border-primary-100 bg-white p-6 shadow-sm md:p-8 lg:order-2"
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.div
                                key={tab}
                                initial={reduced ? false : { opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={reduced ? undefined : { opacity: 0 }}
                                transition={{ duration: 0.15 }}
                            >
                                <Form />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </section>

            <section className="border-t border-primary-100 py-12 md:py-16">
                <div className="container grid max-w-5xl gap-10 md:grid-cols-2 lg:gap-14">
                    <div>
                        <h2 className="font-serif text-xl font-bold text-primary-900">{t("joinUs.reachTitle")}</h2>
                        <ul className="mt-5 space-y-5">
                            {reach.map(({ icon: Icon, label, value, href }) => (
                                <li key={label} className="flex gap-4">
                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700">
                                        <Icon className="h-5 w-5" aria-hidden="true" />
                                    </span>
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-gray-700">{label}</p>
                                        {href ? (
                                            <a
                                                href={href}
                                                {...(href.startsWith("https:") && { target: "_blank", rel: "noopener noreferrer" })}
                                                className="break-words font-semibold text-primary-900 underline-offset-4 hover:text-primary-700 hover:underline"
                                            >
                                                {value}
                                            </a>
                                        ) : (
                                            <p className="leading-relaxed text-primary-900">{value}</p>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <Link
                        href="/network"
                        className="group flex flex-col justify-between rounded-2xl bg-primary-900 p-6 text-white transition-colors hover:bg-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 md:p-8"
                    >
                        <div>
                            <MapPin className="h-7 w-7 text-primary-200" aria-hidden="true" />
                            <h2 className="mt-4 font-serif text-2xl font-bold">{t("joinUs.centreTitle")}</h2>
                            <p className="mt-2 leading-relaxed text-primary-100">
                                {t("joinUs.centreBody").replace("{states}", centreStates.join(", "))}
                            </p>
                        </div>
                        <span className="mt-6 inline-flex items-center gap-2 font-semibold">
                            {t("joinUs.centreCta")}
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                        </span>
                    </Link>
                </div>
            </section>

            <Footer />
        </main>
    );
}
