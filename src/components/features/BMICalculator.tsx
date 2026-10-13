"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Info, RefreshCw, ChevronRight, MapPin } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

type UnitSystem = "metric" | "imperial";
type BMICategory = "Underweight" | "Normal" | "Overweight" | "Obese" | null;
type Sex = "woman" | "man";

interface BMIResult {
    value: number;
    category: BMICategory;
    message: string;
    color: string;
    /** null when no waist was entered */
    waistHigh: boolean | null;
}

const categoryColors = {
    Underweight: "text-blue-700 bg-blue-50 border-blue-100",
    Normal: "text-green-700 bg-green-50 border-green-100",
    Overweight: "text-orange-700 bg-orange-50 border-orange-100",
    Obese: "text-red-700 bg-red-50 border-red-100"
};

// Indian consensus guidelines (2009) and the WHO expert consultation for Asian populations (2004):
// overweight from BMI 23, obesity from 25; abdominal obesity from a waist of 80 cm (women) / 90 cm (men).
const OVERWEIGHT_FROM = 23;
const OBESE_FROM = 25;
const WAIST_LIMIT_CM: Record<Sex, number> = { woman: 80, man: 90 };

// The scale is drawn piecewise so the narrow overweight band (23-25) stays readable.
const SCALE = [
    { from: 15, to: 18.5, start: 0, end: 20, bar: "bg-blue-400", label: "bmiCalculator.under" },
    { from: 18.5, to: OVERWEIGHT_FROM, start: 20, end: 50, bar: "bg-green-500", label: "bmiCalculator.normal" },
    { from: OVERWEIGHT_FROM, to: OBESE_FROM, start: 50, end: 70, bar: "bg-orange-400", label: "bmiCalculator.over" },
    { from: OBESE_FROM, to: 35, start: 70, end: 100, bar: "bg-red-500", label: "bmiCalculator.obese" },
];

function scalePosition(bmi: number) {
    const band = SCALE.find((b) => bmi < b.to) ?? SCALE[SCALE.length - 1];
    const clamped = Math.min(Math.max(bmi, band.from), band.to);
    return band.start + ((clamped - band.from) / (band.to - band.from)) * (band.end - band.start);
}

const inputClass = "w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-lg font-bold text-gray-900 focus:ring-2 focus:ring-primary-500 outline-none transition-all";

export function BMICalculator() {
    const { t } = useLanguage();
    const [unitSystem, setUnitSystem] = useState<UnitSystem>("metric");
    const [weight, setWeight] = useState<string>("");
    const [height, setHeight] = useState<string>("");
    const [heightInches, setHeightInches] = useState<string>("");
    const [waist, setWaist] = useState<string>("");
    const [sex, setSex] = useState<Sex | null>(null);
    const [result, setResult] = useState<BMIResult | null>(null);

    const guidanceMessages = {
        Underweight: t("bmiCalculator.messages.underweight"),
        Normal: t("bmiCalculator.messages.normal"),
        Overweight: t("bmiCalculator.messages.overweight"),
        Obese: t("bmiCalculator.messages.obese")
    };

    const categoryNames = {
        Underweight: t("bmiCalculator.categories.underweight"),
        Normal: t("bmiCalculator.categories.normal"),
        Overweight: t("bmiCalculator.categories.overweight"),
        Obese: t("bmiCalculator.categories.obese")
    };

    const calculateBMI = (e: React.FormEvent) => {
        e.preventDefault();
        let bmiValue = 0;
        const w = parseFloat(weight);

        if (unitSystem === "metric") {
            const h = parseFloat(height);
            if (w > 0 && h > 0) {
                const heightInMeters = h / 100;
                bmiValue = w / (heightInMeters * heightInMeters);
            }
        } else {
            const hFt = parseFloat(height);
            const hIn = parseFloat(heightInches) || 0;
            const totalInches = (hFt * 12) + hIn;
            if (w > 0 && totalInches > 0) {
                bmiValue = (w * 703) / (totalInches * totalInches);
            }
        }

        if (bmiValue > 0) {
            let cat: BMICategory = "Normal";
            if (bmiValue < 18.5) cat = "Underweight";
            else if (bmiValue < OVERWEIGHT_FROM) cat = "Normal";
            else if (bmiValue < OBESE_FROM) cat = "Overweight";
            else cat = "Obese";

            const waistValue = parseFloat(waist);
            const waistCm = unitSystem === "metric" ? waistValue : waistValue * 2.54;
            const waistHigh = waistCm > 0 && sex ? waistCm >= WAIST_LIMIT_CM[sex] : null;

            setResult({
                value: bmiValue,
                category: cat,
                message: guidanceMessages[cat],
                color: categoryColors[cat],
                waistHigh
            });
        }
    };

    const resetFields = () => {
        setWeight("");
        setHeight("");
        setHeightInches("");
        setWaist("");
        setSex(null);
        setResult(null);
    };

    const needsCheckup = result && (result.category === "Overweight" || result.category === "Obese" || result.waistHigh);

    return (
        <section className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden max-w-4xl mx-auto flex flex-col md:flex-row">
            {/* Input Section */}
            <div className="md:w-1/2 p-8 lg:p-12 border-b md:border-b-0 md:border-r border-gray-100">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-bold text-gray-900 border-l-4 border-primary-500 pl-4">{t("bmiCalculator.assessment")}</h3>
                    <div className="bg-gray-100 p-1 rounded-xl flex gap-1">
                        <button
                            type="button"
                            aria-pressed={unitSystem === "metric"}
                            onClick={() => { setUnitSystem("metric"); setResult(null); }}
                            className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${unitSystem === "metric" ? "bg-white text-primary-600 shadow-sm" : "text-gray-600 hover:text-gray-800"}`}
                        >
                            {t("bmiCalculator.metric")}
                        </button>
                        <button
                            type="button"
                            aria-pressed={unitSystem === "imperial"}
                            onClick={() => { setUnitSystem("imperial"); setResult(null); }}
                            className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${unitSystem === "imperial" ? "bg-white text-primary-600 shadow-sm" : "text-gray-600 hover:text-gray-800"}`}
                        >
                            {t("bmiCalculator.imperial")}
                        </button>
                    </div>
                </div>

                <form onSubmit={calculateBMI} className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="bmi-weight" className="text-sm font-bold text-gray-900 flex justify-between">
                            {t("bmiCalculator.weight")}
                            <span className="text-sm font-medium text-gray-500">({unitSystem === "metric" ? t("bmiCalculator.kg") : t("bmiCalculator.lbs")})</span>
                        </label>
                        <input
                            id="bmi-weight"
                            type="number"
                            inputMode="decimal"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            placeholder={unitSystem === "metric" ? "e.g. 70" : "e.g. 154"}
                            className={inputClass}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="bmi-height" className="text-sm font-bold text-gray-900 flex justify-between">
                            {t("bmiCalculator.height")}
                            <span className="text-sm font-medium text-gray-500">({unitSystem === "metric" ? t("bmiCalculator.cm") : t("bmiCalculator.ftIn")})</span>
                        </label>
                        <div className="flex gap-3">
                            <input
                                id="bmi-height"
                                type="number"
                                inputMode="decimal"
                                value={height}
                                onChange={(e) => setHeight(e.target.value)}
                                placeholder={unitSystem === "metric" ? "e.g. 165" : "ft"}
                                className={`flex-1 ${inputClass}`}
                                required
                            />
                            {unitSystem === "imperial" && (
                                <input
                                    type="number"
                                    inputMode="decimal"
                                    aria-label={t("bmiCalculator.in")}
                                    value={heightInches}
                                    onChange={(e) => setHeightInches(e.target.value)}
                                    placeholder="in"
                                    className="w-24 bg-gray-50 border border-gray-200 rounded-2xl p-4 text-lg font-bold text-gray-900 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                    required
                                />
                            )}
                        </div>
                    </div>

                    <fieldset className="space-y-2 rounded-2xl border border-dashed border-gray-200 p-4">
                        <legend className="px-1 text-sm font-bold text-gray-900">{t("bmiCalculator.waistOptional")}</legend>
                        <p className="text-sm text-gray-600">{t("bmiCalculator.waistHint")}</p>
                        <div className="flex gap-2" role="radiogroup" aria-label={t("ncdRisk.sexQ")}>
                            {(["woman", "man"] as const).map((option) => (
                                <button
                                    key={option}
                                    type="button"
                                    role="radio"
                                    aria-checked={sex === option}
                                    onClick={() => setSex(option)}
                                    className={`flex-1 rounded-xl border px-3 py-2 text-sm font-semibold transition-colors ${sex === option ? "border-primary-600 bg-primary-50 text-primary-700" : "border-gray-200 text-gray-700 hover:bg-gray-50"}`}
                                >
                                    {t(`ncdRisk.${option}`)}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center gap-3">
                            <input
                                type="number"
                                inputMode="decimal"
                                aria-label={t("bmiCalculator.waistOptional")}
                                value={waist}
                                onChange={(e) => setWaist(e.target.value)}
                                placeholder={unitSystem === "metric" ? "e.g. 85" : "e.g. 33"}
                                className={inputClass}
                            />
                            <span className="text-sm font-medium text-gray-500">{unitSystem === "metric" ? t("bmiCalculator.cm") : t("bmiCalculator.in")}</span>
                        </div>
                    </fieldset>

                    <div className="flex gap-3 pt-2">
                        <Button
                            type="submit"
                            className="flex-1 py-4 h-auto rounded-2xl text-lg font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                        >
                            {t("bmiCalculator.calculate")}
                            <ChevronRight className="h-5 w-5" aria-hidden="true" />
                        </Button>
                        <button
                            type="button"
                            onClick={resetFields}
                            className="p-4 bg-gray-100 text-gray-600 rounded-2xl hover:bg-gray-200 transition-colors"
                            title={t("bmiCalculator.reset")}
                            aria-label={t("bmiCalculator.reset")}
                        >
                            <RefreshCw className="h-6 w-6" aria-hidden="true" />
                        </button>
                    </div>
                </form>

                <div className="mt-8 space-y-1 border-t border-gray-100 pt-4 text-sm leading-relaxed text-gray-600">
                    <p>{t("bmiCalculator.adultsOnly")}</p>
                    <p>{t("bmiCalculator.source")}</p>
                    <p className="italic">{t("bmi.disclaimer")}</p>
                </div>
            </div>

            {/* Results Section */}
            <div className="md:w-1/2 bg-gray-50/50 p-8 lg:p-12 flex flex-col items-center justify-center relative" aria-live="polite">
                <AnimatePresence mode="wait">
                    {!result ? (
                        <motion.div
                            key="placeholder"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center space-y-4"
                        >
                            <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mx-auto border border-gray-100">
                                <Info className="h-10 w-10 text-primary-200" aria-hidden="true" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-gray-900 font-bold">{t("bmiCalculator.readyTitle")}</p>
                                <p className="text-sm text-gray-600 max-w-[220px]">{t("bmiCalculator.readySub")}</p>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            className="w-full space-y-6"
                        >
                            <div className="text-center">
                                <p className="text-sm font-bold text-primary-600 uppercase tracking-widest mb-1">{t("bmiCalculator.yourBmiValue")}</p>
                                <div className="text-6xl font-bold text-gray-900 tracking-tight tabular-nums">
                                    {result.value.toFixed(1)}
                                </div>
                            </div>

                            <div className={`p-6 rounded-3xl border text-center space-y-2 ${result.color}`}>
                                <h4 className="font-bold text-xl">{categoryNames[result.category!]}</h4>
                                <p className="text-sm font-medium leading-relaxed">{result.message}</p>
                            </div>

                            <div className="pt-4" aria-hidden="true">
                                <div className="relative">
                                    <div className="h-2 w-full rounded-full flex overflow-hidden">
                                        {SCALE.map((band) => (
                                            <div key={band.label} className={`h-full ${band.bar}`} style={{ width: `${band.end - band.start}%` }} />
                                        ))}
                                    </div>
                                    <div
                                        className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-gray-900 shadow"
                                        style={{ left: `${scalePosition(result.value)}%` }}
                                    />
                                </div>
                                <div className="relative mt-2 h-4 text-xs font-semibold text-gray-500 tabular-nums">
                                    {SCALE.slice(1).map((band) => (
                                        <span key={band.from} className="absolute -translate-x-1/2" style={{ left: `${band.start}%` }}>{band.from}</span>
                                    ))}
                                </div>
                                <div className="flex text-xs font-bold text-gray-600">
                                    {SCALE.map((band) => (
                                        <span key={band.label} className="text-center" style={{ width: `${band.end - band.start}%` }}>{t(band.label)}</span>
                                    ))}
                                </div>
                            </div>

                            {result.waistHigh !== null && (
                                <p className={`rounded-2xl border p-4 text-sm leading-relaxed ${result.waistHigh ? "border-orange-100 bg-orange-50 text-orange-800" : "border-green-100 bg-green-50 text-green-800"}`}>
                                    {t(result.waistHigh ? "bmiCalculator.waistHigh" : "bmiCalculator.waistOk")}
                                </p>
                            )}

                            {needsCheckup && (
                                <Link
                                    href="/network"
                                    className="flex items-center justify-center gap-2 rounded-2xl border-2 border-primary-600 px-4 py-3 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-50"
                                >
                                    <MapPin className="h-4 w-4" aria-hidden="true" />
                                    {t("healthTools.findCentre")}
                                </Link>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
