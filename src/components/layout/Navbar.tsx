"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, Heart, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import Image from "next/image";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";

const STAFF_LOGIN_URL = "https://digiswasthya.in";

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isResourcesOpen, setIsResourcesOpen] = useState(false);
    const { t } = useLanguage();

    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsOpen(false);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isOpen]);

    const navLinks = [
        { name: t("nav.home"), href: "/" },
        { name: t("nav.about"), href: "/about-us" },
        { name: t("nav.impact"), href: "/our-impact" },
        { name: t("nav.network"), href: "/network" },
        { name: t("nav.contact"), href: "/contact-us" },
        { name: t("nav.team"), href: "/our-team" },
        { name: t("nav.joinUs"), href: "/join-us" },
    ];

    const resourcesLinks = [
        { name: t("nav.media"), href: "/media" },
        { name: t("nav.healthTools"), href: "/health-tools" },
        { name: t("nav.privacy"), href: "/privacy-policy" },
        { name: t("nav.whatsappPrivacy"), href: "/whatsapp-privacy-policy" },
        { name: t("nav.terms"), href: "/terms-and-conditions" },
    ];

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-primary-100 bg-white/95 backdrop-blur">
            <div className="container flex h-20 items-center justify-between gap-4">
                <Link href="/" className="flex items-center gap-3 group lg:ml-4">
                    <div className="relative h-14 w-14 shrink-0 transition-transform duration-300 group-hover:scale-105">
                        <Image
                            src="/images/digiswasthya-logo-hero.png"
                            alt="DigiSwasthya Foundation Logo"
                            fill
                            sizes="56px"
                            className="object-contain"
                            priority
                        />
                    </div>
                    <div className="flex flex-col leading-tight">
                        <span className="font-serif text-lg font-bold tracking-tight text-primary-600 sm:text-xl">
                            DigiSwasthya Foundation
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{t("common.tagline")}</span>
                    </div>
                </Link>

                <div className="hidden items-center gap-4 xl:gap-5 lg:flex">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="whitespace-nowrap text-sm font-semibold text-primary-900 transition-colors hover:text-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 rounded"
                        >
                            {link.name}
                        </Link>
                    ))}

                    <div
                        className="relative"
                        onMouseEnter={() => setIsResourcesOpen(true)}
                        onMouseLeave={() => setIsResourcesOpen(false)}
                        onBlur={(e) => {
                            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setIsResourcesOpen(false);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Escape") setIsResourcesOpen(false);
                        }}
                    >
                        <button
                            type="button"
                            onClick={() => setIsResourcesOpen((open) => !open)}
                            aria-expanded={isResourcesOpen}
                            aria-haspopup="menu"
                            className="flex cursor-pointer items-center gap-1 whitespace-nowrap rounded text-sm font-semibold text-primary-900 hover:text-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
                        >
                            {t("nav.resources")}
                            <ChevronDown className={`h-4 w-4 transition-transform ${isResourcesOpen ? "rotate-180" : ""}`} aria-hidden="true" />
                        </button>

                        {isResourcesOpen && (
                            <div role="menu" className="absolute right-0 top-full z-50 w-52 pt-2">
                                <div className="rounded-xl border border-primary-100 bg-white py-2 shadow-lg">
                                    {resourcesLinks.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            role="menuitem"
                                            className="block px-4 py-2 text-sm text-primary-900 hover:bg-primary-50 hover:text-primary-600 focus-visible:bg-primary-50 focus-visible:outline-none"
                                        >
                                            {link.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <LanguageSwitcher />
                    <a
                        href={STAFF_LOGIN_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 whitespace-nowrap rounded text-xs font-semibold text-primary-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
                    >
                        <Lock className="h-3 w-3" aria-hidden="true" /> Staff Login
                    </a>
                    <Button asChild variant="donate" className="gap-2 whitespace-nowrap px-5">
                        <Link href="/donate">
                            <Heart className="h-4 w-4 fill-current" aria-hidden="true" /> {t("nav.donate")}
                        </Link>
                    </Button>
                </div>

                <button
                    className="rounded-xl border-2 border-primary-200 bg-primary-50 p-2.5 text-primary-900 transition-colors hover:bg-primary-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 lg:hidden"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
                    aria-expanded={isOpen}
                    aria-controls="mobile-menu"
                >
                    {isOpen ? <X className="h-6 w-6 stroke-[2.5]" aria-hidden="true" /> : <Menu className="h-6 w-6 stroke-[2.5]" aria-hidden="true" />}
                </button>
            </div>

            {isOpen && (
                <div id="mobile-menu" className="relative z-[60] max-h-[calc(100vh-5rem)] overflow-y-auto border-t border-primary-100 bg-white shadow-2xl lg:hidden">
                    <div className="container flex flex-col gap-4 px-6 py-5">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="py-1 text-base font-semibold text-primary-900 transition-colors hover:text-primary-600"
                                onClick={() => setIsOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}

                        <div className="border-t border-primary-100 pt-3">
                            <div className="mb-2 flex items-center justify-between">
                                <div className="text-sm font-semibold text-primary-800">{t("nav.resources")}</div>
                                <a
                                    href={STAFF_LOGIN_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-1.5 rounded-full border border-primary-300 px-3 py-1 text-sm font-semibold text-primary-700 hover:bg-primary-50"
                                >
                                    <Lock className="h-3.5 w-3.5" aria-hidden="true" /> Staff Login
                                </a>
                            </div>
                            {resourcesLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="block py-2 pl-3 text-sm font-medium text-primary-900 transition-colors hover:text-primary-600"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                        <div className="pt-2">
                            <div className="mb-3">
                                <LanguageSwitcher />
                            </div>
                            <Button asChild variant="donate" className="w-full gap-2 rounded-xl py-3 text-base">
                                <Link href="/donate" onClick={() => setIsOpen(false)}>
                                    <Heart className="h-4 w-4 fill-current" aria-hidden="true" /> {t("nav.donate")}
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
