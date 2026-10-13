import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
    eyebrow?: ReactNode;
    title: ReactNode;
    lead?: ReactNode;
    align?: "left" | "center";
    tone?: "light" | "dark";
    as?: "h1" | "h2";
    className?: string;
}

export function SectionHeader({ eyebrow, title, lead, align = "left", tone = "light", as: Heading = "h2", className }: SectionHeaderProps) {
    const dark = tone === "dark";

    return (
        <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
            {eyebrow && <p className={cn("eyebrow", dark && "eyebrow-on-dark")}>{eyebrow}</p>}
            <Heading className={cn("mt-3 font-serif text-3xl font-bold leading-tight md:text-4xl", dark ? "text-white" : "text-primary-900")}>
                {title}
            </Heading>
            {lead && <p className={cn("mt-4 text-lg leading-relaxed", dark ? "text-primary-100" : "text-primary-900/80")}>{lead}</p>}
        </div>
    );
}
