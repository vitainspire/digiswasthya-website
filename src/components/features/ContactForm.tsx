"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle2, AlertTriangle, User, Mail, Phone, MessageSquare, MapPin, HeartPulse, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContactActions } from "./ContactActions";
import { useLanguage } from "@/context/LanguageContext";

type ContactType = "General Inquiry" | "Donor" | "Volunteer" | "Patient / Need Help";

interface FormData {
    name: string;
    email?: string;
    phone?: string;
    subject?: string;
    message: string;
    contactType: ContactType;
    location?: string;
    assistanceNeeded?: string;
    consent: boolean;
}

const VOLUNTEER_FORM_URL = "https://forms.gle/GvjUfAoMBKvqTNcXA";

export function ContactForm() {
    const { t } = useLanguage();
    const [submitted, setSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState(false);
    const { register, handleSubmit, watch, getValues, formState: { errors, isSubmitting } } = useForm<FormData>({
        defaultValues: {
            contactType: "General Inquiry"
        }
    });

    const contactType = watch("contactType");
    const isPatient = contactType === "Patient / Need Help";
    const isVolunteer = contactType === "Volunteer";

    const onSubmit = async (data: FormData) => {
        setSubmitError(false);
        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error("Request failed");
            setSubmitted(true);
        } catch (err) {
            console.error("Contact form submission failed:", err);
            setSubmitError(true);
        }
    };

    if (submitted) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-white p-12 md:p-16 rounded-[2rem] shadow-xl border border-gray-200 text-center space-y-8 max-w-2xl mx-auto"
            >
                <motion.div 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }} 
                    transition={{ type: "spring", delay: 0.2 }}
                    className="flex justify-center"
                >
                    <div className="bg-gradient-to-br from-primary-100 to-green-100 p-6 rounded-full shadow-inner border border-white">
                        <CheckCircle2 className="h-20 w-20 text-primary-600" />
                    </div>
                </motion.div>
                <div className="space-y-4">
                    <h3 className="text-4xl font-black text-gray-900 tracking-tight">{t("contactForm.successTitle")}</h3>
                    <p className="text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
                        {t("contactForm.successBody")}
                    </p>
                </div>
                <Button
                    variant="primary"
                    onClick={() => setSubmitted(false)}
                    className="mt-8 bg-gray-900 hover:bg-gray-800 text-white font-semibold px-10 py-6 rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95"
                >
                    {t("contactForm.sendAnother")}
                </Button>
            </motion.div>
        );
    }

    return (
        <section className="py-24 bg-transparent scroll-mt-28 relative" id="message-form">
            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-12 items-start">
                    
                    {/* Left Column: Form Info */}
                    <div className="w-full lg:w-1/3 pt-8 lg:sticky lg:top-32 space-y-8">
                        <div>
                            <h3 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
                                {t("contactForm.heading")}
                            </h3>
                            <p className="text-lg text-gray-700 font-medium leading-relaxed">
                                {t("contactForm.subheading")}
                            </p>
                        </div>
                        
                        <div className="hidden lg:flex flex-col gap-6">
                            <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex items-start gap-4 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 group">
                                <div className="bg-primary-50 p-4 rounded-2xl text-primary-600 group-hover:scale-110 transition-transform duration-300">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <div className="pt-1">
                                    <h4 className="font-bold text-gray-900 text-lg">Call Us</h4>
                                    <p className="text-gray-600 font-medium mt-1">+91 83184 24800</p>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex items-start gap-4 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 group">
                                <div className="bg-primary-50 p-4 rounded-2xl text-primary-600 group-hover:scale-110 transition-transform duration-300">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div className="pt-1">
                                    <h4 className="font-bold text-gray-900 text-lg">Email Us</h4>
                                    <p className="text-gray-600 font-medium mt-1">info@digiswasthya.org</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Form Container */}
                    <div className="w-full lg:w-2/3 bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(15,23,42,0.12)] border border-slate-200/90 p-6 sm:p-10 md:p-12 relative overflow-hidden ring-1 ring-slate-100">
                        {/* Top dark orange accent frame bar */}
                        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600" />
                        
                        {/* Decorative subtle ambient background */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-full blur-3xl opacity-60 pointer-events-none" />
                        
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-7 relative z-10">
                            
                            {/* Contact Type Section */}
                            <div className="bg-slate-50/90 p-5 sm:p-6 rounded-3xl border-2 border-slate-200/80 space-y-3 shadow-sm">
                                <label className="text-sm font-extrabold text-slate-900 flex items-center gap-2.5">
                                    <span className="p-1.5 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center">
                                        <HelpCircle className="w-4 h-4" />
                                    </span>
                                    {t("contactForm.contactingAs")}
                                </label>
                                <select
                                    {...register("contactType")}
                                    className="w-full bg-white border-2 border-slate-200 hover:border-slate-300 rounded-2xl p-4 text-slate-900 font-bold text-base sm:text-lg focus:border-primary-600 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none shadow-sm cursor-pointer"
                                >
                                    <option value="General Inquiry">{t("contactForm.typeGeneral")}</option>
                                    <option value="Donor">{t("contactForm.typeDonor")}</option>
                                    <option value="Volunteer">{t("contactForm.typeVolunteer")}</option>
                                    <option value="Patient / Need Help">{t("contactForm.typePatient")}</option>
                                </select>
                            </div>

                            <AnimatePresence>
                                {isPatient && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, height: "auto", scale: 1 }}
                                        exit={{ opacity: 0, height: 0, scale: 0.95 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="bg-gradient-to-br from-primary-50 to-primary-50 border-2 border-primary-200 rounded-3xl p-6 mb-6 shadow-sm">
                                            <div className="flex items-start gap-3 mb-4">
                                                <HeartPulse className="w-6 h-6 text-primary-700 flex-shrink-0 mt-1" />
                                                <p className="text-sm font-bold text-slate-950 leading-relaxed">{t("contactForm.patientHelpNote")}</p>
                                            </div>
                                            <ContactActions />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2.5">
                                    <label className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                                        <span className="p-1 rounded-md bg-primary-50 text-primary-700">
                                            <User className="w-4 h-4" />
                                        </span>
                                        {t("contactForm.fullName")}
                                    </label>
                                    <input
                                        {...register("name", { required: t("contactForm.nameRequired") })}
                                        placeholder={t("contactForm.namePlaceholder")}
                                        className="w-full bg-slate-50/90 hover:bg-slate-50 focus:bg-white border-2 border-slate-200/90 hover:border-slate-300 focus:border-primary-600 rounded-2xl p-4 text-slate-950 font-bold placeholder:text-slate-500 placeholder:font-normal focus:ring-4 focus:ring-primary-500/10 transition-all outline-none shadow-sm text-sm sm:text-base"
                                    />
                                    {errors.name && <p className="text-xs text-red-600 font-bold px-1">{errors.name.message}</p>}
                                </div>
                                <div className="space-y-2.5">
                                    <label className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                                        <span className="p-1 rounded-md bg-primary-50 text-primary-700">
                                            <Mail className="w-4 h-4" />
                                        </span>
                                        {t("contactForm.email")}
                                    </label>
                                    <input
                                        {...register("email", {
                                            validate: (value) => {
                                                const phone = getValues("phone");
                                                if (!value && !phone) return t("contactForm.emailOrPhoneRequired");
                                                if (value && !/^\S+@\S+$/i.test(value)) return t("contactForm.emailInvalid");
                                                return true;
                                            }
                                        })}
                                        type="email"
                                        placeholder={t("contactForm.emailPlaceholder")}
                                        className="w-full bg-slate-50/90 hover:bg-slate-50 focus:bg-white border-2 border-slate-200/90 hover:border-slate-300 focus:border-primary-600 rounded-2xl p-4 text-slate-950 font-bold placeholder:text-slate-500 placeholder:font-normal focus:ring-4 focus:ring-primary-500/10 transition-all outline-none shadow-sm text-sm sm:text-base"
                                    />
                                    {errors.email && <p className="text-xs text-red-600 font-bold px-1">{errors.email.message}</p>}
                                </div>
                            </div>

                            <div className="space-y-2.5">
                                <label className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                                    <span className="p-1 rounded-md bg-primary-50 text-primary-700">
                                        <Phone className="w-4 h-4" />
                                    </span>
                                    {t("contactForm.phone")} <span className="text-slate-500 font-medium ml-1 text-xs">({t("contactForm.phoneOptionalUnlessNoEmail")})</span>
                                </label>
                                <input
                                    {...register("phone", {
                                        validate: (value) => {
                                            const email = getValues("email");
                                            if (!value && !email) return t("contactForm.emailOrPhoneRequired");
                                            return true;
                                        }
                                    })}
                                    placeholder={t("contactForm.phonePlaceholder")}
                                    className="w-full bg-slate-50/90 hover:bg-slate-50 focus:bg-white border-2 border-slate-200/90 hover:border-slate-300 focus:border-primary-600 rounded-2xl p-4 text-slate-950 font-bold placeholder:text-slate-500 placeholder:font-normal focus:ring-4 focus:ring-primary-500/10 transition-all outline-none shadow-sm text-sm sm:text-base"
                                />
                                {errors.phone && <p className="text-xs text-red-600 font-bold px-1">{errors.phone.message}</p>}
                            </div>

                            {isPatient && (
                                <div className="grid md:grid-cols-2 gap-6 bg-red-50/60 p-6 rounded-3xl border-2 border-red-200/70 shadow-sm">
                                    <div className="space-y-2.5">
                                        <label className="text-sm font-extrabold text-red-950 flex items-center gap-2">
                                            <span className="p-1 rounded-md bg-red-100 text-red-700">
                                                <MapPin className="w-4 h-4" />
                                            </span>
                                            {t("contactForm.locationLabel")}
                                        </label>
                                        <input
                                            {...register("location")}
                                            placeholder={t("contactForm.locationPlaceholder")}
                                            className="w-full bg-white border-2 border-red-200 hover:border-red-300 focus:border-red-500 rounded-2xl p-4 text-slate-950 font-bold placeholder:text-slate-500 placeholder:font-normal focus:ring-4 focus:ring-red-500/10 transition-all outline-none shadow-sm text-sm sm:text-base"
                                        />
                                    </div>
                                    <div className="space-y-2.5">
                                        <label className="text-sm font-extrabold text-red-950 flex items-center gap-2">
                                            <span className="p-1 rounded-md bg-red-100 text-red-700">
                                                <HeartPulse className="w-4 h-4" />
                                            </span>
                                            {t("contactForm.assistanceLabel")}
                                        </label>
                                        <input
                                            {...register("assistanceNeeded")}
                                            placeholder={t("contactForm.assistancePlaceholder")}
                                            className="w-full bg-white border-2 border-red-200 hover:border-red-300 focus:border-red-500 rounded-2xl p-4 text-slate-950 font-bold placeholder:text-slate-500 placeholder:font-normal focus:ring-4 focus:ring-red-500/10 transition-all outline-none shadow-sm text-sm sm:text-base"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2.5">
                                <label className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                                    <span className="p-1 rounded-md bg-primary-50 text-primary-700">
                                        <MessageSquare className="w-4 h-4" />
                                    </span>
                                    {t("contactForm.subject")}
                                </label>
                                <input
                                    {...register("subject")}
                                    placeholder={t("contactForm.subjectPlaceholder")}
                                    className="w-full bg-slate-50/90 hover:bg-slate-50 focus:bg-white border-2 border-slate-200/90 hover:border-slate-300 focus:border-primary-600 rounded-2xl p-4 text-slate-950 font-bold placeholder:text-slate-500 placeholder:font-normal focus:ring-4 focus:ring-primary-500/10 transition-all outline-none shadow-sm text-sm sm:text-base"
                                />
                            </div>

                            <div className="space-y-2.5">
                                <label className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                                    <span className="p-1 rounded-md bg-primary-50 text-primary-700">
                                        <MessageSquare className="w-4 h-4" />
                                    </span>
                                    {t("contactForm.message")}
                                </label>
                                <textarea
                                    {...register("message", { required: t("contactForm.messageRequired") })}
                                    placeholder={t("contactForm.messagePlaceholder")}
                                    rows={5}
                                    className="w-full bg-slate-50/90 hover:bg-slate-50 focus:bg-white border-2 border-slate-200/90 hover:border-slate-300 focus:border-primary-600 rounded-2xl p-4 text-slate-950 font-bold placeholder:text-slate-500 placeholder:font-normal focus:ring-4 focus:ring-primary-500/10 transition-all outline-none resize-none shadow-sm text-sm sm:text-base"
                                />
                                {errors.message && <p className="text-xs text-red-600 font-bold px-1">{errors.message.message}</p>}
                            </div>

                            {isVolunteer && (
                                <motion.div 
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className="bg-primary-50 border-2 border-primary-200 rounded-2xl p-5 shadow-sm"
                                >
                                    <p className="text-sm text-primary-900 font-semibold leading-relaxed">
                                        {t("contactForm.volunteerNote")}{" "}
                                        <a href={VOLUNTEER_FORM_URL} target="_blank" rel="noopener noreferrer" className="text-primary-950 font-extrabold underline decoration-primary-500 decoration-2 underline-offset-2 hover:text-primary-700 transition-colors">
                                            {t("contactForm.volunteerNoteLink")}
                                        </a>
                                        {t("contactForm.volunteerNoteEnd")}
                                    </p>
                                </motion.div>
                            )}

                            <div className="flex items-start gap-3 pt-2">
                                <div className="flex items-center h-6">
                                    <input
                                        {...register("consent", { required: true })}
                                        type="checkbox"
                                        id="consent-form"
                                        className="h-5 w-5 text-primary-600 border-2 border-slate-300 rounded focus:ring-primary-500 transition-all cursor-pointer"
                                    />
                                </div>
                                <label htmlFor="consent-form" className="text-sm text-slate-700 font-semibold cursor-pointer leading-tight pt-0.5">
                                    {t("contactForm.consent")}
                                </label>
                            </div>

                            {submitError && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                    className="flex items-start gap-3 bg-red-50 border-l-4 border-red-500 rounded-r-xl p-5 shadow-sm"
                                >
                                    <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0" />
                                    <div>
                                        <p className="text-base font-bold text-red-900">{t("contactForm.errorTitle")}</p>
                                        <p className="text-sm text-red-700 mt-1 font-medium">{t("contactForm.errorBody")}</p>
                                    </div>
                                </motion.div>
                            )}

                            <motion.div
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.98 }}
                                className="pt-2"
                            >
                                <Button
                                    disabled={isSubmitting}
                                    className="w-full py-7 text-xl rounded-2xl font-black shadow-[0_10px_40px_-10px_rgba(234,88,12,0.45)] hover:shadow-[0_15px_50px_-10px_rgba(234,88,12,0.55)] transition-all flex gap-3 items-center justify-center bg-gradient-to-r from-primary-600 to-primary-600 hover:from-primary-700 hover:to-primary-700 text-white border-0"
                                    type="submit"
                                >
                                    {isSubmitting ? (
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                    ) : (
                                        <>
                                            {t("contactForm.submit")}
                                            <Send className="h-6 w-6" />
                                        </>
                                    )}
                                </Button>
                            </motion.div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
