"use client";

import { useEffect, useRef, useState, type ComponentProps, type ReactNode } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const controlClass =
    "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 focus-visible:border-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600/40 aria-[invalid=true]:border-red-600";

interface FieldShellProps {
    id: string;
    label: string;
    error?: string;
    optionalText?: string;
    children: ReactNode;
}

function FieldShell({ id, label, error, optionalText, children }: FieldShellProps) {
    return (
        <div className="space-y-1.5">
            <label htmlFor={id} className="block text-sm font-semibold text-primary-900">
                {label}
                {optionalText && <span className="ml-1.5 font-normal text-gray-500">({optionalText})</span>}
            </label>
            {children}
            {error && (
                <p id={`${id}-error`} className="text-sm font-medium text-red-700">
                    {error}
                </p>
            )}
        </div>
    );
}

type ControlProps = { id: string; label: string; error?: string; optionalText?: string };

export function TextInput({ id, label, error, optionalText, ...rest }: ControlProps & ComponentProps<"input">) {
    return (
        <FieldShell id={id} label={label} error={error} optionalText={optionalText}>
            <input
                id={id}
                className={controlClass}
                aria-invalid={!!error}
                aria-describedby={error ? `${id}-error` : undefined}
                {...rest}
            />
        </FieldShell>
    );
}

export function SelectInput({ id, label, error, optionalText, children, ...rest }: ControlProps & ComponentProps<"select">) {
    return (
        <FieldShell id={id} label={label} error={error} optionalText={optionalText}>
            <select
                id={id}
                className={controlClass}
                aria-invalid={!!error}
                aria-describedby={error ? `${id}-error` : undefined}
                {...rest}
            >
                {children}
            </select>
        </FieldShell>
    );
}

export function TextArea({ id, label, error, optionalText, ...rest }: ControlProps & ComponentProps<"textarea">) {
    return (
        <FieldShell id={id} label={label} error={error} optionalText={optionalText}>
            <textarea
                id={id}
                rows={4}
                className={`${controlClass} resize-y`}
                aria-invalid={!!error}
                aria-describedby={error ? `${id}-error` : undefined}
                {...rest}
            />
        </FieldShell>
    );
}

export function CheckboxField({ id, label, error, ...rest }: Omit<ControlProps, "optionalText"> & ComponentProps<"input">) {
    return (
        <div className="space-y-1.5">
            <div className="flex items-start gap-3">
                <input
                    id={id}
                    type="checkbox"
                    className="mt-1 h-5 w-5 shrink-0 rounded border-gray-300 text-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600/40"
                    aria-invalid={!!error}
                    aria-describedby={error ? `${id}-error` : undefined}
                    {...rest}
                />
                <label htmlFor={id} className="text-sm leading-relaxed text-gray-800">
                    {label}
                </label>
            </div>
            {error && (
                <p id={`${id}-error`} className="text-sm font-medium text-red-700">
                    {error}
                </p>
            )}
        </div>
    );
}

export function Honeypot(props: ComponentProps<"input">) {
    return (
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
            <label>
                Website
                <input type="text" tabIndex={-1} autoComplete="off" {...props} />
            </label>
        </div>
    );
}

export function SubmitButton({ busy, children, busyLabel }: { busy: boolean; children: ReactNode; busyLabel: string }) {
    return (
        <button
            type="submit"
            disabled={busy}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-6 py-3.5 text-base font-bold text-white transition-colors hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
        >
            {busy && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />}
            {busy ? busyLabel : children}
        </button>
    );
}

export function ErrorBanner({ title, body }: { title: string; body: string }) {
    return (
        <div role="alert" className="flex items-start gap-3 rounded-xl border-l-4 border-red-600 bg-red-50 p-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-700" aria-hidden="true" />
            <div className="text-sm text-red-900">
                <p className="font-bold">{title}</p>
                <p>{body}</p>
            </div>
        </div>
    );
}

export function SuccessCard({ title, body, actionLabel, onAction, extraHref, extraLabel }: { title: string; body: string; actionLabel: string; onAction: () => void; extraHref?: string; extraLabel?: string }) {
    const reduced = useReducedMotion();
    return (
        <motion.div
            role="status"
            initial={reduced ? false : { opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4 py-6 text-center"
        >
            <CheckCircle2 className="mx-auto h-14 w-14 text-primary-600" aria-hidden="true" />
            <h3 className="font-serif text-2xl font-bold text-primary-900">{title}</h3>
            <p className="mx-auto max-w-sm text-gray-700">{body}</p>
            {extraHref && extraLabel && (
                <div>
                    <Link
                        href={extraHref}
                        className="inline-flex h-12 items-center justify-center rounded-xl bg-secondary-400 px-6 text-base font-bold text-primary-950 transition-colors hover:bg-secondary-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
                    >
                        {extraLabel}
                    </Link>
                </div>
            )}
            <button
                type="button"
                onClick={onAction}
                className="rounded-xl border-2 border-primary-600 px-5 py-2.5 text-sm font-bold text-primary-700 transition-colors hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
            >
                {actionLabel}
            </button>
        </motion.div>
    );
}

export function useSignup(type: "donor" | "doctor") {
    const { t } = useLanguage();
    const startedAt = useRef(0);
    const [submitted, setSubmitted] = useState(false);
    const [failed, setFailed] = useState<string | null>(null);

    useEffect(() => {
        startedAt.current = Date.now();
    }, []);

    async function send(data: object) {
        setFailed(null);
        try {
            const res = await fetch("/api/join", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...data, type, consent: true, elapsedMs: Date.now() - startedAt.current }),
            });
            if (!res.ok) {
                const json = await res.json().catch(() => ({}));
                throw new Error(typeof json.error === "string" ? json.error : t("joinUs.errorBody"));
            }
            setSubmitted(true);
        } catch (error) {
            setFailed(error instanceof Error ? error.message : t("joinUs.errorBody"));
        }
    }

    function reset() {
        startedAt.current = Date.now();
        setSubmitted(false);
        setFailed(null);
    }

    return { submitted, failed, send, reset };
}
