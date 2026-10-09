"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";

export default function WhatsAppPrivacyPolicy() {
    return (
        <main className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            {/* Hero Section */}
            <section className="bg-primary-900 text-white py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/hero-bg.png')] opacity-10 bg-cover bg-center"></div>
                <div className="container relative z-10 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-black mb-4 tracking-tight"
                    >
                        WhatsApp Messaging & Data Privacy Policy
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-primary-100 max-w-2xl mx-auto font-medium"
                    >
                        How DigiSwasthya Foundation uses WhatsApp to send appointment reminders, prescriptions, and access to your health records.
                    </motion.p>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-20 bg-white">
                <div className="container max-w-5xl">
                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 max-w-none text-gray-900 leading-relaxed space-y-8">

                        <div className="space-y-4">
                            <p className="text-gray-950 font-bold">
                                DIGISWASTHYA FOUNDATION (&quot;DigiSwasthya&quot;, &quot;We&quot;, &quot;Us&quot;, or &quot;Our&quot;) uses the WhatsApp Business Platform to communicate with patients and caregivers (&quot;You&quot;, &quot;Your&quot;) about their care — including appointment and medication reminders, prescriptions, and access to health records. This WhatsApp Messaging & Data Privacy Policy (&quot;Policy&quot;) explains what information is sent over WhatsApp, why, how it is protected, and the choices available to You. It supplements, and should be read together with, Our general <a href="/privacy-policy" className="text-primary-600 hover:underline">Privacy Policy</a>.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-2xl font-black text-black uppercase tracking-tight">1. Scope Of This Policy</h3>
                            <div className="space-y-4 text-gray-950 font-medium">
                                <p>This Policy applies specifically to messages sent or received through the WhatsApp number(s) operated by or on behalf of DIGISWASTHYA FOUNDATION for patient communication. It covers messages sent through our official WhatsApp Business number, including those delivered via WhatsApp Business Solution Providers (BSPs) and Meta&apos;s WhatsApp Business Platform infrastructure.</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-2xl font-black text-black uppercase tracking-tight">2. Why We Message You On WhatsApp</h3>
                            <div className="space-y-4 text-gray-950 font-medium">
                                <p>We use WhatsApp, where You have opted in, to:</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Send appointment confirmations, reschedule notices, and visit reminders;</li>
                                    <li>Send medication and follow-up care reminders;</li>
                                    <li>Share prescriptions issued by Our Health Care Professionals;</li>
                                    <li>Provide You a secure link or reference to access Your personal health records held by Us;</li>
                                    <li>Respond to queries You send Us on WhatsApp, including health-related questions; and</li>
                                    <li>Share general health camp, outreach, or service announcements relevant to You.</li>
                                </ul>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-2xl font-black text-black uppercase tracking-tight">3. Consent And Opt-In</h3>
                            <div className="space-y-4 text-gray-950 font-medium">
                                <p>We will only send You reminders, prescriptions, or health record access messages on WhatsApp after You have given Your explicit opt-in consent — whether at the time of registration, during a visit to one of Our centres, verbally to Our staff, or by messaging Us first on WhatsApp. We do not add phone numbers to WhatsApp messaging without this consent.</p>
                                <p>Where You message Us first on WhatsApp with a health query, We treat this as consent to respond to You on the same channel for that conversation.</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-2xl font-black text-black uppercase tracking-tight">4. Information Shared Through WhatsApp</h3>
                            <div className="space-y-4 text-gray-950 font-medium">
                                <p>Depending on the purpose of the message, information exchanged over WhatsApp may include:</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Your name;</li>
                                    <li>Appointment date, time, and centre/location details;</li>
                                    <li>Medication names, dosage, and prescription details issued by Your Health Care Professional;</li>
                                    <li>A link or reference number to retrieve Your health records securely; and</li>
                                    <li>Details of any health query You choose to share with Us over WhatsApp.</li>
                                </ul>
                                <p>We share only the minimum information necessary for the specific purpose of each message and avoid sending highly sensitive health details over WhatsApp where a secure, authenticated channel (such as a patient portal link) is available instead.</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-2xl font-black text-black uppercase tracking-tight">5. How To Opt Out</h3>
                            <div className="space-y-4 text-gray-950 font-medium">
                                <p>You may withdraw Your consent to receive WhatsApp messages from Us at any time by replying &quot;STOP&quot; or &quot;UNSUBSCRIBE&quot; to any message, or by writing to Us at <a href="mailto:info@digiswasthya.org" className="text-primary-600 hover:underline">info@digiswasthya.org</a>. Once You opt out, We will stop sending You reminders and other non-essential messages on WhatsApp, though We may still contact You through other means (such as phone or in person) for matters relating to Your ongoing care, unless You instruct Us otherwise.</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-2xl font-black text-black uppercase tracking-tight">6. Role Of WhatsApp And Meta</h3>
                            <div className="space-y-4 text-gray-950 font-medium">
                                <p>WhatsApp is operated by Meta Platforms, Inc. and/or its affiliates (&quot;Meta&quot;). Messages sent through the WhatsApp Business Platform are transmitted using WhatsApp&apos;s infrastructure, and may also pass through a WhatsApp Business Solution Provider that We use to manage messaging. Meta and Our Solution Provider process this information as service providers acting on Our instructions, and their handling of Your information is additionally governed by Meta&apos;s own <a href="https://www.whatsapp.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">WhatsApp Privacy Policy</a> and Business Terms of Service.</p>
                                <p>We do not permit Meta or Our Solution Provider to use Your health information for their own advertising or marketing purposes.</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-2xl font-black text-black uppercase tracking-tight">7. Data Security</h3>
                            <div className="space-y-4 text-gray-950 font-medium">
                                <p>Messages sent over WhatsApp are protected by WhatsApp&apos;s end-to-end encryption in transit. Internally, access to the WhatsApp Business account and any linked patient data is restricted to authorised Our staff and representatives on a need-to-know basis, consistent with the security practices described in Our <a href="/privacy-policy" className="text-primary-600 hover:underline">Privacy Policy</a>.</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-2xl font-black text-black uppercase tracking-tight">8. Data Retention</h3>
                            <div className="space-y-4 text-gray-950 font-medium">
                                <p>We retain WhatsApp conversation records only as long as necessary to provide You care, respond to Your queries, and meet Our legal and record-keeping obligations, in line with the retention period described in Our general Privacy Policy. WhatsApp and/or Our Solution Provider may separately retain limited message metadata in accordance with their own policies.</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-2xl font-black text-black uppercase tracking-tight">9. Your Rights</h3>
                            <div className="space-y-4 text-gray-950 font-medium">
                                <p>You may request access to, correction of, or deletion of information We hold about You, and withdraw Your consent to WhatsApp communications, by writing to Us at <a href="mailto:info@digiswasthya.org" className="text-primary-600 hover:underline">info@digiswasthya.org</a>. These rights are in addition to those described in Clause 3 (Control Over Your Personal Information) of Our general Privacy Policy.</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-2xl font-black text-black uppercase tracking-tight">10. Not For Medical Emergencies</h3>
                            <div className="space-y-4 text-gray-950 font-medium">
                                <p>WhatsApp messaging is not monitored continuously and must not be used to report a medical emergency. If You or someone You know needs urgent medical attention, please call Our helpline at <a href="tel:+918318424800" className="text-primary-600 hover:underline">+91-83184-24800</a> or visit Your nearest hospital or emergency service immediately.</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-2xl font-black text-black uppercase tracking-tight">11. Changes To This Policy</h3>
                            <div className="space-y-4 text-gray-950 font-medium">
                                <p>We may update this Policy from time to time to reflect changes in how We use WhatsApp or changes required by Meta or applicable law. We will post the updated Policy on this page, and significant changes will be communicated to You through a prominent notice.</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-2xl font-black text-black uppercase tracking-tight">12. Grievance Officer / Contact Us</h3>
                            <div className="space-y-4 text-gray-950 font-medium">
                                <p>For any questions, concerns, or grievances regarding WhatsApp messaging or Your health information shared through this channel, please contact Our Grievance Officer at <a href="mailto:info@digiswasthya.org" className="text-primary-600 hover:underline">info@digiswasthya.org</a> or call <a href="tel:+918318424800" className="text-primary-600 hover:underline">+91-83184-24800</a>. We will make all reasonable efforts to resolve Your concerns in a timely manner.</p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
