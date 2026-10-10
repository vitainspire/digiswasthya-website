import type { ReactNode } from "react";

interface PageHeroProps {
    title: ReactNode;
    subtitle?: ReactNode;
    children?: ReactNode;
}

export function PageHero({ title, subtitle, children }: PageHeroProps) {
    return (
        <section className="border-b border-primary-100 bg-primary-50 py-12 md:py-16">
            <div className="container max-w-5xl px-4">
                <h1 className="max-w-3xl font-serif text-4xl font-bold leading-tight text-primary-900 md:text-5xl">{title}</h1>
                {subtitle && <p className="mt-4 max-w-2xl text-lg leading-relaxed text-primary-900/80">{subtitle}</p>}
                {children && <div className="mt-6">{children}</div>}
            </div>
        </section>
    );
}
