"use client";

import { useState } from "react";
import Image from "next/image";
import { Pause, Play } from "lucide-react";
import type { LogoItem } from "@/data/logosData";
import { cn } from "@/lib/utils";

interface LogoWallProps {
    logos: LogoItem[];
    /** "marquee" scrolls in a single row with a pause control; "grid" wraps. */
    variant?: "marquee" | "grid";
    className?: string;
}

function Logo({ logo, duplicate = false }: { logo: LogoItem; duplicate?: boolean }) {
    const img = (
        <Image
            src={logo.image}
            alt={logo.name}
            fill
            sizes="160px"
            className="object-contain"
        />
    );

    return (
        <div className="relative h-16 w-36 shrink-0 rounded-xl bg-white p-2 sm:w-40">
            <div className="relative h-full w-full">
                {logo.link ? (
                    <a href={logo.link} target="_blank" rel="noopener noreferrer" className="absolute inset-0" aria-label={logo.name} tabIndex={duplicate ? -1 : undefined}>
                        {img}
                    </a>
                ) : (
                    img
                )}
            </div>
        </div>
    );
}

export function LogoWall({ logos, variant = "marquee", className }: LogoWallProps) {
    const [paused, setPaused] = useState(false);

    if (variant === "grid") {
        return (
            <ul className={cn("flex flex-wrap items-center justify-center gap-3", className)}>
                {logos.map((logo) => (
                    <li key={logo.name}>
                        <Logo logo={logo} />
                    </li>
                ))}
            </ul>
        );
    }

    return (
        <div className={cn("flex items-center gap-3", className)}>
            <div className="relative min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
                {/* The list is rendered twice and shifted by -50% for a seamless loop; per-item padding (not gap) keeps both halves equal. */}
                <ul
                    className="flex w-max animate-marquee hover:[animation-play-state:paused]"
                    style={{ animationDuration: `${logos.length * 3}s`, animationPlayState: paused ? "paused" : undefined }}
                >
                    {[...logos, ...logos].map((logo, i) => (
                        <li key={`${logo.name}-${i}`} className="pr-3" aria-hidden={i >= logos.length}>
                            <Logo logo={logo} duplicate={i >= logos.length} />
                        </li>
                    ))}
                </ul>
            </div>
            <button
                type="button"
                onClick={() => setPaused((p) => !p)}
                aria-label={paused ? "Resume scrolling logos" : "Pause scrolling logos"}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-primary-200 text-primary-700 transition-colors hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
            >
                {paused ? <Play className="h-4 w-4" aria-hidden="true" /> : <Pause className="h-4 w-4" aria-hidden="true" />}
            </button>
        </div>
    );
}
