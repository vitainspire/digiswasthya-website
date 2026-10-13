"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, ClipboardList, MapPin, RefreshCw } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

/**
 * Part A (risk assessment) of the MoHFW Community Based Assessment Checklist (CBAC),
 * used by ASHA workers for adults aged 30+. Scores: age 0–2, tobacco 0–2, daily alcohol 0–1,
 * waist 0–2, physical activity 0–1, family history 0–2. A total above 4 means the person
 * may be at risk and should be screened.
 */

type Sex = "woman" | "man";
type QuestionId = "age" | "tobacco" | "alcohol" | "waist" | "activity" | "family";

interface Option {
    label: string;
    score: number;
}

const HIGH_RISK_ABOVE = 4;

function OptionGroup({
    name,
    legend,
    hint,
    options,
    value,
    onChange,
}: {
    name: string;
    legend: string;
    hint?: string;
    options: Option[];
    value: number | undefined;
    onChange: (index: number) => void;
}) {
    return (
        <fieldset>
            <legend className="text-base font-semibold text-primary-900">{legend}</legend>
            {hint && <p className="mt-1 text-sm text-gray-600">{hint}</p>}
            <div className="mt-3 flex flex-wrap gap-2">
                {options.map((option, index) => (
                    <label
                        key={option.label}
                        className={cn(
                            "cursor-pointer rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary-600 has-[:focus-visible]:ring-offset-2",
                            value === index
                                ? "border-primary-600 bg-primary-50 text-primary-800"
                                : "border-gray-200 bg-white text-gray-800 hover:border-primary-300"
                        )}
                    >
                        <input
                            type="radio"
                            name={name}
                            className="sr-only"
                            checked={value === index}
                            onChange={() => onChange(index)}
                        />
                        {option.label}
                    </label>
                ))}
            </div>
        </fieldset>
    );
}

export function NcdRiskCheck() {
    const { t } = useLanguage();
    const [sex, setSex] = useState<Sex | null>(null);
    const [answers, setAnswers] = useState<Partial<Record<QuestionId, number>>>({});

    const setAnswer = (id: QuestionId) => (index: number) => setAnswers((prev) => ({ ...prev, [id]: index }));

    const waistOptions: Option[] = sex
        ? [0, 1, 2].map((score) => ({ label: t(`ncdRisk.waist${sex === "woman" ? "W" : "M"}${score}`), score }))
        : [];

    const questions: { id: QuestionId; legend: string; hint?: string; options: Option[] }[] = [
        {
            id: "age",
            legend: t("ncdRisk.ageQ"),
            options: [0, 1, 2].map((score) => ({ label: t(`ncdRisk.age${score}`), score })),
        },
        {
            id: "tobacco",
            legend: t("ncdRisk.tobaccoQ"),
            options: [0, 1, 2].map((score) => ({ label: t(`ncdRisk.tobacco${score}`), score })),
        },
        {
            id: "alcohol",
            legend: t("ncdRisk.alcoholQ"),
            options: [
                { label: t("ncdRisk.no"), score: 0 },
                { label: t("ncdRisk.yes"), score: 1 },
            ],
        },
        {
            id: "waist",
            legend: t("ncdRisk.waistQ"),
            hint: t("ncdRisk.waistHint"),
            options: waistOptions,
        },
        {
            id: "activity",
            legend: t("ncdRisk.activityQ"),
            hint: t("ncdRisk.activityHint"),
            options: [
                { label: t("ncdRisk.yes"), score: 0 },
                { label: t("ncdRisk.no"), score: 1 },
            ],
        },
        {
            id: "family",
            legend: t("ncdRisk.familyQ"),
            options: [
                { label: t("ncdRisk.no"), score: 0 },
                { label: t("ncdRisk.yes"), score: 2 },
            ],
        },
    ];

    const answered = questions.filter((q) => answers[q.id] !== undefined).length;
    const complete = answered === questions.length;
    const score = questions.reduce((sum, q) => {
        const index = answers[q.id];
        return index === undefined ? sum : sum + (q.options[index]?.score ?? 0);
    }, 0);
    const highRisk = score > HIGH_RISK_ABOVE;

    const reset = () => {
        setSex(null);
        setAnswers({});
    };

    return (
        <section className="mx-auto flex max-w-4xl flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl md:flex-row">
            <div className="space-y-7 border-b border-gray-100 p-8 md:w-3/5 md:border-b-0 md:border-r lg:p-10">
                <p className="text-sm font-medium text-gray-600">{t("ncdRisk.forAdults")}</p>

                <OptionGroup
                    name="ncd-sex"
                    legend={t("ncdRisk.sexQ")}
                    options={[
                        { label: t("ncdRisk.woman"), score: 0 },
                        { label: t("ncdRisk.man"), score: 0 },
                    ]}
                    value={sex === null ? undefined : sex === "woman" ? 0 : 1}
                    onChange={(index) => {
                        const next: Sex = index === 0 ? "woman" : "man";
                        // The waist bands depend on sex, so a change clears the waist answer.
                        if (next !== sex) setAnswers((prev) => ({ ...prev, waist: undefined }));
                        setSex(next);
                    }}
                />

                {questions.map((q) =>
                    q.id === "waist" && !sex ? (
                        <fieldset key={q.id} disabled>
                            <legend className="text-base font-semibold text-primary-900">{q.legend}</legend>
                            <p className="mt-1 text-sm text-gray-600">{t("ncdRisk.waistPickSex")}</p>
                        </fieldset>
                    ) : (
                        <OptionGroup
                            key={q.id}
                            name={`ncd-${q.id}`}
                            legend={q.legend}
                            hint={q.hint}
                            options={q.options}
                            value={answers[q.id]}
                            onChange={setAnswer(q.id)}
                        />
                    )
                )}

                <p className="border-t border-gray-100 pt-4 text-sm leading-relaxed text-gray-600">{t("ncdRisk.source")}</p>
            </div>

            <div className="flex flex-col gap-6 bg-gray-50/50 p-8 md:w-2/5 lg:p-10">
                <div aria-live="polite" className="space-y-4">
                    {!complete ? (
                        <div className="space-y-4 text-center md:pt-8">
                            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-gray-100 bg-white shadow-sm">
                                <ClipboardList className="h-10 w-10 text-primary-200" aria-hidden="true" />
                            </div>
                            <p className="font-bold text-gray-900">{t("ncdRisk.progress").replace("{n}", String(answered))}</p>
                            <div className="mx-auto h-2 max-w-[200px] overflow-hidden rounded-full bg-gray-200">
                                <div className="h-full bg-primary-600 transition-all" style={{ width: `${(answered / questions.length) * 100}%` }} />
                            </div>
                            <p className="text-sm text-gray-600">{t("ncdRisk.placeholder")}</p>
                        </div>
                    ) : (
                        <>
                            <div className="text-center">
                                <p className="text-sm font-bold uppercase tracking-widest text-primary-600">{t("ncdRisk.scoreLabel")}</p>
                                <p className="text-6xl font-bold tabular-nums text-gray-900">{score}</p>
                                <p className="text-sm font-medium text-gray-600">{t("ncdRisk.outOf")}</p>
                            </div>
                            <div
                                className={cn(
                                    "space-y-2 rounded-3xl border p-5",
                                    highRisk ? "border-orange-100 bg-orange-50 text-orange-900" : "border-green-100 bg-green-50 text-green-900"
                                )}
                            >
                                <h4 className="flex items-center gap-2 text-lg font-bold">
                                    {highRisk ? <AlertTriangle className="h-5 w-5 shrink-0" aria-hidden="true" /> : <CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden="true" />}
                                    {t(highRisk ? "ncdRisk.highTitle" : "ncdRisk.lowTitle")}
                                </h4>
                                <p className="text-sm leading-relaxed">{t(highRisk ? "ncdRisk.highBody" : "ncdRisk.lowBody")}</p>
                            </div>
                            <div className="flex flex-col gap-2 sm:flex-row md:flex-col">
                                <Link
                                    href="/network"
                                    className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-primary-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
                                >
                                    <MapPin className="h-4 w-4" aria-hidden="true" />
                                    {t("healthTools.findCentre")}
                                </Link>
                                <button
                                    type="button"
                                    onClick={reset}
                                    className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-200"
                                >
                                    <RefreshCw className="h-4 w-4" aria-hidden="true" />
                                    {t("ncdRisk.startOver")}
                                </button>
                            </div>
                        </>
                    )}
                </div>

                <div className="mt-auto rounded-2xl border border-gray-200 bg-white p-5">
                    <p className="text-sm font-bold text-gray-900">{t("ncdRisk.warningTitle")}</p>
                    <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-gray-700">
                        {[1, 2, 3, 4].map((n) => (
                            <li key={n}>{t(`ncdRisk.warning${n}`)}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}
