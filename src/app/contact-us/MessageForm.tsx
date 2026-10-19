"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { HeartPulse } from "lucide-react";
import { ContactActions } from "@/components/features/ContactActions";
import { useLanguage } from "@/context/LanguageContext";
import { CheckboxField, ErrorBanner, SelectInput, SubmitButton, SuccessCard, TextArea, TextInput } from "./fields";

interface MessageFormData {
    contactType: string;
    name: string;
    email: string;
    phone: string;
    location: string;
    assistanceNeeded: string;
    subject: string;
    message: string;
    consent: boolean;
}

// Values are the contact types /api/contact accepts. Donors use the donor tab instead.
const CONTACT_TYPES = [
    { value: "General Inquiry", label: "contactForm.typeGeneral" },
    { value: "Patient / Need Help", label: "contactForm.typePatient" },
    { value: "Volunteer", label: "contactForm.typeVolunteer" },
];

const VOLUNTEER_FORM_URL = "https://forms.gle/GvjUfAoMBKvqTNcXA";

export function MessageForm() {
    const { t } = useLanguage();
    const [submitted, setSubmitted] = useState(false);
    const [failed, setFailed] = useState(false);
    const {
        register,
        handleSubmit,
        watch,
        getValues,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<MessageFormData>({ defaultValues: { contactType: "General Inquiry" } });

    const contactType = watch("contactType");

    async function send(data: MessageFormData) {
        setFailed(false);
        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error("Request failed");
            setSubmitted(true);
        } catch (error) {
            console.error("Contact form submission failed:", error);
            setFailed(true);
        }
    }

    if (submitted) {
        return (
            <SuccessCard
                title={t("contactForm.successTitle")}
                body={t("contactForm.successBody")}
                actionLabel={t("contactForm.sendAnother")}
                onAction={() => {
                    reset();
                    setSubmitted(false);
                }}
            />
        );
    }

    const emailOrPhone = () => getValues(["email", "phone"]).some((value) => value?.trim()) || t("contactForm.emailOrPhoneRequired");

    return (
        <form onSubmit={handleSubmit(send)} noValidate className="space-y-5">
            <h2 className="font-serif text-2xl font-bold text-primary-900">{t("contactForm.title")}</h2>

            <SelectInput id="contact-type" label={t("contactForm.contactingAs")} {...register("contactType")}>
                {CONTACT_TYPES.map(({ value, label }) => (
                    <option key={value} value={value}>
                        {t(label)}
                    </option>
                ))}
            </SelectInput>

            {contactType === "Patient / Need Help" && (
                <div className="space-y-3 rounded-xl border border-primary-200 bg-primary-50 p-4">
                    <p className="flex items-start gap-2 text-sm font-semibold leading-relaxed text-primary-900">
                        <HeartPulse className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" aria-hidden="true" />
                        {t("contactForm.patientHelpNote")}
                    </p>
                    <ContactActions />
                </div>
            )}

            {contactType === "Volunteer" && (
                <p className="rounded-xl border border-primary-200 bg-primary-50 p-4 text-sm leading-relaxed text-primary-900">
                    {t("contactForm.volunteerNote")}{" "}
                    <a
                        href={VOLUNTEER_FORM_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold underline underline-offset-2 hover:text-primary-700"
                    >
                        {t("contactForm.volunteerNoteLink")}
                    </a>
                    {t("contactForm.volunteerNoteEnd")}
                </p>
            )}

            <TextInput
                id="contact-name"
                label={t("joinUs.name")}
                autoComplete="name"
                error={errors.name?.message}
                {...register("name", { required: t("joinUs.required") })}
            />

            <div className="space-y-3">
                <p className="text-sm text-gray-700">{t("contactForm.reachHint")}</p>
                <div className="grid gap-5 sm:grid-cols-2">
                    <TextInput
                        id="contact-email"
                        type="email"
                        label={t("joinUs.email")}
                        autoComplete="email"
                        error={errors.email?.message}
                        {...register("email", {
                            validate: emailOrPhone,
                            pattern: { value: /^\S+@\S+\.\S+$/, message: t("joinUs.emailInvalid") },
                            deps: "phone",
                        })}
                    />
                    <TextInput
                        id="contact-phone"
                        type="tel"
                        label={t("joinUs.phoneWhatsapp")}
                        autoComplete="tel"
                        error={errors.phone?.message}
                        {...register("phone", {
                            validate: emailOrPhone,
                            pattern: { value: /^\+?[\d\s()-]{8,20}$/, message: t("joinUs.phoneInvalid") },
                            deps: "email",
                        })}
                    />
                </div>
            </div>

            {contactType === "Patient / Need Help" && (
                <div className="grid gap-5 sm:grid-cols-2">
                    <TextInput
                        id="contact-location"
                        label={t("contactForm.locationLabel")}
                        placeholder={t("contactForm.locationPlaceholder")}
                        maxLength={150}
                        {...register("location", { shouldUnregister: true })}
                    />
                    <TextInput
                        id="contact-assistance"
                        label={t("contactForm.assistanceLabel")}
                        placeholder={t("contactForm.assistancePlaceholder")}
                        maxLength={300}
                        {...register("assistanceNeeded", { shouldUnregister: true })}
                    />
                </div>
            )}

            <TextInput
                id="contact-subject"
                label={t("contactForm.subject")}
                optionalText={t("joinUs.optional")}
                maxLength={150}
                {...register("subject")}
            />
            <TextArea
                id="contact-message"
                label={t("contactForm.message")}
                maxLength={3000}
                error={errors.message?.message}
                {...register("message", { required: t("joinUs.required") })}
            />

            <div className="border-t border-gray-100 pt-5">
                <CheckboxField
                    id="contact-consent"
                    label={t("contactForm.consent")}
                    error={errors.consent && t("joinUs.consentRequired")}
                    {...register("consent", { required: true })}
                />
            </div>

            {failed && <ErrorBanner title={t("contactForm.errorTitle")} body={t("contactForm.errorBody")} />}
            <SubmitButton busy={isSubmitting} busyLabel={t("joinUs.sending")}>
                {t("contactForm.submit")}
            </SubmitButton>
        </form>
    );
}
