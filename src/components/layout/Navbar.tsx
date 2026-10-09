"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import Image from "next/image";

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isResourcesOpen, setIsResourcesOpen] = useState(false);
    const { t } = useLanguage();

    const navLinks = [
        { name: t("nav.home"), href: "/" },
        { name: t("nav.about"), href: "/about-us" },
        { name: t("nav.impact"), href: "/our-impact" },
        { name: t("nav.network"), href: "/network" },
        { name: t("nav.contact"), href: "/contact-us" },
        { name: t("nav.team"), href: "/our-team" },
    ];

    const resourcesLinks = [
        { name: t("nav.media"), href: "/media" },
        { name: t("nav.healthTools"), href: "/health-tools" },
        { name: t("nav.privacy"), href: "/privacy-policy" },
        { name: t("nav.whatsappPrivacy"), href: "/whatsapp-privacy-policy" },
        { name: t("nav.terms"), href: "/terms-and-conditions" },
    ];

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="container flex h-24 items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-4 group ml-4 lg:ml-10">
                    <div className="relative h-20 w-20 shrink-0 transition-transform duration-300 group-hover:scale-105">
                        <Image
                            src="/images/digiswasthya-logo-hero.png"
                            alt="DigiSwasthya Foundation Logo"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                    <div className="flex flex-col leading-none">
                        <div className="flex flex-wrap items-baseline gap-1.5">
                            <span className="text-xl md:text-2xl font-black text-primary-600 tracking-tighter">DigiSwasthya</span>
                            <span className="text-xl md:text-2xl font-black text-secondary-600 tracking-tighter">Foundation</span>
                        </div>
                        <span className="text-[10px] font-bold text-gray-500 mt-1 uppercase tracking-wider">{t("common.tagline")}</span>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-6 mt-4">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm font-bold text-primary-950 transition-colors hover:text-primary-700"
                        >
                            {link.name}
                        </Link>
                    ))}

                    {/* Resources Dropdown */}
                    <div className="relative group">
                        <button
                            onClick={() => setIsResourcesOpen(!isResourcesOpen)}
                            className="flex items-center gap-1 text-sm font-bold text-primary-950 hover:text-primary-700 focus:outline-none cursor-pointer"
                        >
                            {t("nav.resources")} <ChevronDown className="h-4 w-4" />
                        </button>

                        {/* Dropdown Menu (Hover or Click) */}
                        <div className="absolute right-0 top-full mt-2 w-48 rounded-md border bg-white shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                            <div className="py-2">
                                {resourcesLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary-600"
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Desktop Right Action Area: Staff Login DIRECTLY ABOVE Donate Button */}
                    <div className="flex flex-col items-center -mt-3.5 gap-1.5">
                        <Link 
                            href="/admin" 
                            className="text-[12px] font-black text-orange-700 hover:text-orange-800 transition-all flex items-center gap-1 tracking-tight py-0.5 hover:scale-105"
                        >
                            <span>🔒</span> Staff Login
                        </Link>
                        <Button asChild variant="primary" className="gap-2 shadow-sm">
                            <Link href="/donate">
                                <Heart className="h-4 w-4 fill-current" /> {t("nav.donate")}
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2.5 mr-3 rounded-xl bg-primary-50 text-primary-950 hover:bg-primary-100 active:bg-primary-200 border-2 border-primary-300 shadow-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
                >
                    {isOpen ? (
                        <X className="h-6 w-6 text-primary-950 stroke-[2.5]" />
                    ) : (
                        <Menu className="h-6 w-6 text-primary-950 stroke-[2.5]" />
                    )}
                </button>
            </div>

            {/* Mobile Menu Drawer */}
            {isOpen && (
                <div className="md:hidden border-t border-slate-100 bg-white/98 backdrop-blur-xl shadow-2xl relative z-[60] max-h-[calc(100vh-6rem)] overflow-y-auto">
                    <div className="container py-5 px-6 flex flex-col gap-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-sm font-bold text-gray-900 hover:text-primary-700 py-1 transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}

                        <div className="border-t border-slate-100 pt-3">
                            <div className="flex items-center justify-between mb-2">
                                <div className="font-bold text-xs uppercase tracking-wider text-gray-400">{t("nav.resources")}</div>
                                <Link
                                    href="/admin"
                                    onClick={() => setIsOpen(false)}
                                    className="px-3 py-1 rounded-full bg-orange-700 hover:bg-orange-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
                                >
                                    <span>🔒</span> Staff Portal
                                </Link>
                            </div>
                            {resourcesLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="block py-2 text-sm text-gray-700 hover:text-primary-600 pl-3 font-medium transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                        {/* Mobile Action Buttons: Donate Button */}
                        <div className="pt-2">
                            <Button asChild variant="primary" className="w-full gap-2 py-3 rounded-xl shadow-md">
                                <Link href="/donate" onClick={() => setIsOpen(false)}>
                                    <Heart className="h-4 w-4 fill-current" /> {t("nav.donate")}
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
