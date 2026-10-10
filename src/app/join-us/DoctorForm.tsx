"use client";

import { useForm } from "react-hook-form";
import { useLanguage } from "@/context/LanguageContext";
import { CheckboxField, ErrorBanner, Honeypot, SelectInput, SubmitButton, SuccessCard, TextArea, TextInput, useSignup } from "./fields";

interface DoctorFormData {
    name: string;
    email: string;
    phone: string;
    registrationNumber: string;
    council: string;
    qualification: string;
    speciality: string;
    experienceYears: string;
    workplace: string;
    availability: string;
    languages: string;
    message: string;
    consent: boolean;
    website: string;
}

const AVAILABILITY = ["1-2", "3-5", "6-10", "10+"];

export function DoctorForm() {
    const { t } = useLanguage();
    const { submitted, failed, send, reset: resetSignup } = useSignup("doctor");
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<DoctorFormData>();

    if (submitted) {
        return (
            <SuccessCard
                title={t("joinUs.doctorSuccessTitle")}
                body={t("joinUs.doctorSuccessBody")}
                actionLabel={t("joinUs.sendAnother")}
                onAction={() => {
                    reset();
                    resetSignup();
                }}
            />
        );
    }

    const required = { required: t("joinUs.required") };

    return (
        <form onSubmit={handleSubmit(send)} noValidate className="relative space-y-5">
            <h2 className="font-serif text-2xl font-bold text-primary-900">{t("joinUs.doctorFormTitle")}</h2>

            <TextInput id="doctor-name" label={t("joinUs.name")} autoComplete="name" error={errors.name?.message} {...register("name", required)} />
            <div className="grid gap-5 sm:grid-cols-2">
                <TextInput
                    id="doctor-email"
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
                    id="doctor-phone"
                    type="tel"
                    label={t("joinUs.phoneWhatsapp")}
                    autoComplete="tel"
                    error={errors.phone?.message}
                    {...register("phone", {
                        required: t("joinUs.required"),
                        pattern: { value: /^\+?[\d\s()-]{8,20}$/, message: t("joinUs.phoneInvalid") },
                    })}
                />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
                <TextInput
                    id="doctor-registration"
                    label={t("joinUs.registrationNumber")}
                    error={errors.registrationNumber?.message}
                    {...register("registrationNumber", required)}
                />
                <TextInput
                    id="doctor-council"
                    label={t("joinUs.council")}
                    placeholder={t("joinUs.councilPlaceholder")}
                    error={errors.council?.message}
                    {...register("council", required)}
                />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
                <TextInput
                    id="doctor-qualification"
                    label={t("joinUs.qualification")}
                    placeholder={t("joinUs.qualificationPlaceholder")}
                    error={errors.qualification?.message}
                    {...register("qualification", required)}
                />
                <TextInput
                    id="doctor-speciality"
                    label={t("joinUs.speciality")}
                    placeholder={t("joinUs.specialityPlaceholder")}
                    error={errors.speciality?.message}
                    {...register("speciality", required)}
                />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
                <TextInput
                    id="doctor-experience"
                    type="number"
                    min={0}
                    max={70}
                    inputMode="numeric"
                    label={t("joinUs.experienceYears")}
                    optionalText={t("joinUs.optional")}
                    {...register("experienceYears")}
                />
                <SelectInput
                    id="doctor-availability"
                    label={t("joinUs.availability")}
                    optionalText={t("joinUs.optional")}
                    defaultValue=""
                    {...register("availability")}
                >
                    <option value="">{t("joinUs.availabilityPlaceholder")}</option>
                    {AVAILABILITY.map((key) => (
                        <option key={key} value={key}>
                            {t(`joinUs.availabilityOptions.${key}`)}
                        </option>
                    ))}
                </SelectInput>
            </div>
            <TextInput id="doctor-workplace" label={t("joinUs.workplace")} optionalText={t("joinUs.optional")} {...register("workplace")} />
            <TextInput id="doctor-languages" label={t("joinUs.languages")} optionalText={t("joinUs.optional")} {...register("languages")} />
            <TextArea id="doctor-message" label={t("joinUs.message")} optionalText={t("joinUs.optional")} maxLength={1000} {...register("message")} />

            <div className="border-t border-gray-100 pt-5">
                <CheckboxField
                    id="doctor-consent"
                    label={t("joinUs.consentDoctor")}
                    error={errors.consent && t("joinUs.consentRequired")}
                    {...register("consent", { required: true })}
                />
            </div>

            <Honeypot {...register("website")} />

            {failed && <ErrorBanner title={t("joinUs.errorTitle")} body={failed} />}
            <SubmitButton busy={isSubmitting} busyLabel={t("joinUs.sending")}>
                {t("joinUs.submitDoctor")}
            </SubmitButton>
        </form>
    );
}
