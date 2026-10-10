import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export function ServiceCard({
    title,
    description,
    icon,
}: {
    title: string;
    description: string;
    icon?: React.ReactNode;
}) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            {icon && <div className="mb-4 text-primary-600">{icon}</div>}
            <h3 className="text-xl font-semibold mb-2 text-gray-900">{title}</h3>
            <p className="text-gray-600 mb-4">{description}</p>
            <Link href="/contact-us" className="text-primary-600 text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
                Learn more <ArrowRight className="h-4 w-4" />
            </Link>
        </div>
    );
}

function initialOf(name: string) {
    const stripped = name.replace(/^((major|dr|mr|ms|mrs|km|shri|smt)\.?\s+)+/i, "").trim();
    return (stripped || name).charAt(0).toUpperCase();
}

export function TeamCard({
    name,
    role,
    image,
}: {
    name: string;
    role: string;
    image?: string;
}) {
    return (
        <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow border hover:shadow-lg transition-shadow">
            <div className="h-24 w-24 rounded-full bg-gray-200 mb-4 flex items-center justify-center text-xl font-bold text-gray-400 overflow-hidden relative">
                {image ? (
                    <Image
                        src={image}
                        alt={name}
                        fill
                        className="object-cover object-top"
                    />
                ) : (
                    initialOf(name)
                )}
            </div>
            <h4 className="text-lg font-bold text-gray-900 text-center">{name}</h4>
            <p className="text-sm text-primary-600 text-center">{role}</p>
        </div>
    );
}
