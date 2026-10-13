"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import Image from "next/image";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { cn } from "@/lib/utils";

interface NavLink {
    name: string;
    href: string;
}

interface NavGroup {
    name: string;
    items: NavLink[];
}

type NavEntry = NavLink | NavGroup;

const isGroup = (entry: NavEntry): entry is NavGroup => "items" in entry;

const isActive = (pathname: string, href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

function NavDropdown({ group, pathname }: { group: NavGroup; pathname: string }) {
    const [open, setOpen] = useState(false);
    const active = group.items.some((item) => isActive(pathname, item.href));

    return (
        <div
            className="relative"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(false);
            }}
            onKeyDown={(e) => {
                if (e.key === "Escape") setOpen(false);
            }}
        >
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
                aria-haspopup="menu"
                className={cn(
                    "flex cursor-pointer items-center gap-1 whitespace-nowrap rounded text-sm font-semibold hover:text-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2",
                    active ? "text-primary-600" : "text-primary-900"
                )}
            >
                {group.name}
                <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
            </button>

            {open && (
                <div role="menu" className="absolute left-0 top-full z-50 w-56 pt-2">
                    <div className="rounded-xl border border-primary-100 bg-white py-2 shadow-lg">
                        {group.items.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                role="menuitem"
                                aria-current={isActive(pathname, item.href) ? "page" : undefined}
                                className={cn(
                                    "block px-4 py-2 text-sm hover:bg-primary-50 hover:text-primary-600 focus-visible:bg-primary-50 focus-visible:outline-none",
                                    isActive(pathname, item.href) ? "font-semibold text-primary-600" : "text-primary-900"
                                )}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useLanguage();
    const pathname = usePathname() ?? "/";

    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsOpen(false);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isOpen]);

    const entries: NavEntry[] = [
        { name: t("nav.home"), href: "/" },
        {
            name: t("nav.aboutGroup"),
            items: [
                { name: t("nav.about"), href: "/about-us" },
                { name: t("nav.team"), href: "/our-team" },
                { name: t("nav.media"), href: "/media" },
            ],
        },
        {
            name: t("nav.ourWork"),
            items: [
                { name: t("nav.impact"), href: "/our-impact" },
                { name: t("nav.network"), href: "/network" },
                { name: t("nav.healthTools"), href: "/health-tools" },
            ],
        },
        { name: t("nav.partner"), href: "/partner" },
        { name: t("nav.joinUs"), href: "/join-us" },
        { name: t("nav.contact"), href: "/contact-us" },
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

                <div className="hidden items-center gap-4 lg:flex xl:gap-7">
                    {entries.map((entry) =>
                        isGroup(entry) ? (
                            <NavDropdown key={entry.name} group={entry} pathname={pathname} />
                        ) : (
                            <Link
                                key={entry.href}
                                href={entry.href}
                                aria-current={isActive(pathname, entry.href) ? "page" : undefined}
                                className={cn(
                                    "whitespace-nowrap rounded text-sm font-semibold transition-colors hover:text-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2",
                                    isActive(pathname, entry.href) ? "text-primary-600" : "text-primary-900"
                                )}
                            >
                                {entry.name}
                            </Link>
                        )
                    )}

                    <LanguageSwitcher />
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
                    <div className="container flex flex-col gap-1 px-6 py-5">
                        {entries.map((entry) =>
                            isGroup(entry) ? (
                                <div key={entry.name} className="border-t border-primary-100 py-3">
                                    <p className="eyebrow mb-1">{entry.name}</p>
                                    {entry.items.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            aria-current={isActive(pathname, item.href) ? "page" : undefined}
                                            className="block py-2 pl-3 text-base font-medium text-primary-900 transition-colors hover:text-primary-600"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <Link
                                    key={entry.href}
                                    href={entry.href}
                                    aria-current={isActive(pathname, entry.href) ? "page" : undefined}
                                    className="border-t border-primary-100 py-3 text-base font-semibold text-primary-900 transition-colors first:border-t-0 first:pt-2 hover:text-primary-600"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {entry.name}
                                </Link>
                            )
                        )}

                        <div className="border-t border-primary-100 pt-4">
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
