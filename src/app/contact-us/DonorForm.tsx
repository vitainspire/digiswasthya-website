"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLanguage } from "@/context/LanguageContext";
import { CheckboxField, ErrorBanner, Honeypot, SelectInput, SubmitButton, SuccessCard, TextArea, TextInput, useSignup } from "./fields";

interface DonorFormData {
    name: string;
    email: string;
    phone: string;
    location: string;
    interest: string;
    message: string;
    newsletter: boolean;
    consent: boolean;
    website: string;
}

const INTERESTS = ["give-once", "give-monthly", "sponsor-centre", "csr", "impact-investment", "learn-more"];

export function DonorForm() {
    const { t } = useLanguage();
    const { submitted, failed, send, reset: resetSignup } = useSignup("donor");
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<DonorFormData>({ defaultValues: { newsletter: false } });

    // Links such as /contact-us?interest=csr#donor (from the Partner page) preselect the reason.
    useEffect(() => {
        const interest = new URLSearchParams(window.location.search).get("interest");
        if (interest && INTERESTS.includes(interest)) setValue("interest", interest);
    }, [setValue]);

    if (submitted) {
        return (
            <SuccessCard
                title={t("joinUs.donorSuccessTitle")}
                body={t("joinUs.donorSuccessBody")}
                actionLabel={t("joinUs.sendAnother")}
                extraHref="/donate"
                extraLabel={t("joinUs.donateNow")}
                onAction={() => {
                    reset();
                    resetSignup();
                }}
            />
        );
    }

    return (
        <form onSubmit={handleSubmit(send)} noValidate className="relative space-y-5">
            <h2 className="font-serif text-2xl font-bold text-primary-900">{t("joinUs.donorFormTitle")}</h2>

            <TextInput
                id="donor-name"
                label={t("joinUs.name")}
                autoComplete="name"
                error={errors.name?.message}
                {...register("name", { required: t("joinUs.required") })}
            />
            <div className="grid gap-5 sm:grid-cols-2">
                <TextInput
                    id="donor-email"
                    type="email"
                    label={t("joinUs.email")}
                    autoComplete="email"
                    error={errors.email?.message}
                    {...register("email", {
                        required: t("joinUs.required"),
                        pattern: { value: /^\S+@\S+\.\S+$/, message: t("joinUs.emailInvalid") },
                    })}
                />
                <TextInput
                    id="donor-phone"
                    type="tel"
                    label={t("joinUs.phone")}
                    optionalText={t("joinUs.optional")}
                    autoComplete="tel"
                    error={errors.phone?.message}
                    {...register("phone", {
                        pattern: { value: /^\+?[\d\s()-]{8,20}$/, message: t("joinUs.phoneInvalid") },
                    })}
                />
            </div>
            <TextInput
                id="donor-location"
                label={t("joinUs.location")}
                optionalText={t("joinUs.optional")}
                autoComplete="address-level2"
                {...register("location")}
            />
            <SelectInput
                id="donor-interest"
                label={t("joinUs.interest")}
                error={errors.interest?.message}
                defaultValue=""
                {...register("interest", { required: t("joinUs.required") })}
            >
                <option value="" disabled>
                    {t("joinUs.interestPlaceholder")}
                </option>
                {INTERESTS.map((key) => (
                    <option key={key} value={key}>
                        {t(`joinUs.interests.${key}`)}
                    </option>
                ))}
            </SelectInput>
            <TextArea
                id="donor-message"
                label={t("joinUs.message")}
                optionalText={t("joinUs.optional")}
                maxLength={1000}
                {...register("message")}
            />

            <div className="space-y-3 border-t border-gray-100 pt-5">
                <CheckboxField id="donor-newsletter" label={t("joinUs.newsletter")} {...register("newsletter")} />
                <CheckboxField
                    id="donor-consent"
                    label={t("joinUs.consentDonor")}
                    error={errors.consent && t("joinUs.consentRequired")}
                    {...register("consent", { required: true })}
                />
            </div>

            <Honeypot {...register("website")} />

            {failed && <ErrorBanner title={t("joinUs.errorTitle")} body={failed} />}
            <SubmitButton busy={isSubmitting} busyLabel={t("joinUs.sending")}>
                {t("joinUs.submitDonor")}
            </SubmitButton>
        </form>
    );
}
