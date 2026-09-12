"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";

export default function PrivacyPolicy() {
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
                        Privacy Policy
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-primary-100 max-w-2xl mx-auto font-medium"
                    >
                        DigiSwasthya Foundation&apos;s commitment to your privacy and data protection.
                    </motion.p>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-20 bg-white">
                <div className="container max-w-5xl">
                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 max-w-none text-gray-900 leading-relaxed space-y-8">

                        <div className="space-y-4">
                            <p className="text-gray-950 font-bold">
                                DigiSwasthya Foundation is committed to respecting the privacy of every person who shares information or data. Your privacy protection is important to us, and we strive to take due care and protection of the information we receive from you, the User. In this regard, we adhere to the various governing laws, such as
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-gray-950 font-medium">
                                <li>The Information Technology Act, 2000 – Section 43A.</li>
                                <li>The Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Information) Rules, 2011.</li>
                            </ul>
                            <p className="text-gray-950">
                                This Privacy Policy (“Privacy Policy”) applies to the collection, storage, processing, disclosure, and transfer of your Personal Information (defined below) as per the above-mentioned laws, particularly when you use the website of <a href="https://www.digiswashtya.org" className="text-primary-600 hover:underline">https://www.digiswashtya.org</a> (“Website”) operated by DIGISWASTHYA FOUNDATION for any information or services (“Services”).
                            </p>
                            <p className="text-gray-950">
                                The terms ‘You’ or ‘Your’ refer to you as the User (registered or unregistered) of the Website and/or Services, and the terms ‘We’, ‘Us,” and ‘Our’ refer to DIGISWASTHYA FOUNDATION.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-2xl font-black text-black uppercase tracking-tight">1. ACCESS</h3>
                            <div className="space-y-4 text-gray-950 font-medium">
                                <p>We collect Your Personal Information directly from you, from third-parties and automatically through the Our Website. This Personal Information, for instance, would relate to the type of device You are using, the time that You have logged on to Our Website, Your IP address and other Personal Information as listed in Clause 5 below.</p>
                                <p>You may access the Personal Information shared by You with Us in the manner given below. You can further choose to share additional Personal Information with Us, and you can modify your personal data, by writing to Us on Our below-mentioned email id.</p>
                                <p>We keep in mind that the Personal Information shared by You is accessible to you. You can write to Us at the email id specified in Clause 15.</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-2xl font-black text-black uppercase tracking-tight">2. CONSENT</h3>
                            <div className="space-y-4 text-gray-950 font-medium">
                                <p>By choosing the Opt-In option on the Website and thereafter, by providing Us Your personal information or availing services of DIGISWASTHYA FOUNDATION or by making use of the facilities provided by the Website, it is agreed by You that You have freely consented to the collection, storage, processing, disclosure, and transfer of Your Personal Information in accordance with the provisions of this Privacy Policy and any amendments thereof.</p>
                                <p>You acknowledge that You have provided Your Personal Information out of your free will and after understanding how it will be used. You also consent that the collection, storage, processing, disclosure, and transfer of any Personal and Privacy Information shall not cause any wrongful loss to You if it is done in accordance with the provisions of this Privacy Policy. However, we shall not be liable for any loss that may happen to you owing to the provision of wrongful Personal Information by You.</p>
                                <p>We will share personal information outside of DIGISWASTHYA FOUNDATION only when we have your consent. We will ask for your explicit consent to share any sensitive personal information.</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-2xl font-black text-black uppercase tracking-tight">3. CONTROL OVER YOUR PERSONAL INFORMATION</h3>
                            <div className="space-y-4 text-gray-950 font-medium">
                                <p>You have the right to withdraw Your consent at any point, provided such withdrawal of the consent is intimated to us in writing through an email at <a href="mailto:support@digiswasthya.org" className="text-primary-600 hover:underline">support@digiswasthya.org</a> requesting the same. If You wish to rectify the Personal Information that we may have collected to offer You personalized services and offers, as per Clause 12 of this Policy, you may write to the Grievance Officer, as mentioned under Clause 15.1 of this Policy, citing the reason for such rectification of Personal Information.</p>
                                <p>Once You withdraw Your Consent to share the Personal Information collected by Us, We shall have the option not to fulfill the purposes for which the said Personal Information was sought and We may restrict you from using our Services or the Website.</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-2xl font-black text-black uppercase tracking-tight">4. CHANGES TO THE PRIVACY POLICY</h3>
                            <div className="space-y-4 text-gray-950 font-medium">
                                <p>We reserve the right to change this Privacy Policy from time to time. We will not reduce your rights under this Privacy Policy without your explicit consent. We always indicate the date when the last changes were published, and we will offer access to archived versions for your review. If changes are significant, we’ll provide a more prominent notice (including, for certain services, email notification of Privacy Policy changes).</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-2xl font-black text-black uppercase tracking-tight">5. PERSONAL INFORMATION COLLECTED</h3>
                            <div className="space-y-4 text-gray-950 font-medium">
                                <p>The kinds of information that We collect about You include but are not limited to the following:</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Patient/Caregiver/Doctor/Health Care Professional Name,</li>
                                    <li>Birth date/age,</li>
                                    <li>Gender,</li>
                                    <li>Address (including country and pin/postal code),</li>
                                    <li>Phone number/mobile number,</li>
                                    <li>Email address,</li>
                                    <li>Physical, physiological, and mental health condition provided by You and/or your Health Care Professional,</li>
                                    <li>Personal medical records and history,</li>
                                    <li>Valid financial information at the time of purchase of product/service and/or online payment,</li>
                                    <li>Login ID and password,</li>
                                    <li>User details as provided at the time of registration or thereafter,</li>
                                    <li>Records of interaction with DIGISWASTHYA FOUNDATION representatives,</li>
                                    <li>Your usage details such as time, frequency, duration and pattern of use, features used and the amount of storage used,</li>
                                    <li>Master and transaction data and other data stored in Your user account,</li>
                                    <li>Any other information that is willingly shared by You (collectively referred to as “Personal Information”).</li>
                                    <li>Biometrics data</li>
                                    <li>Genetic Data</li>
                                    <li>Transgender Status</li>
                                    <li>Intersex Status</li>
                                    <li>Caste or Tribe</li>
                                    <li>Religious or political belief or affiliation</li>
                                    <li>Sexual orientation</li>
                                </ul>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-2xl font-black text-black uppercase tracking-tight">6. HOW WE COLLECT PERSONAL INFORMATION</h3>
                            <div className="space-y-4 text-gray-950 font-medium">
                                <p>The methods by which we collect your Personal Information include but are not limited to the following:</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>When You fill the patient registration form,</li>
                                    <li>When You provide details to a DIGISWASTHYA FOUNDATION Health Care Professional or DIGISWASTHYA FOUNDATION representative,</li>
                                    <li>When You register on Our Website,</li>
                                    <li>When You provide Your Personal Information to Us during course of receiving services,</li>
                                    <li>When You use the features on Our Website,</li>
                                    <li>When you provide access to any other website.</li>
                                    <li>By the use of cookies (more fully detailed in Clause 9 of this Privacy Policy).</li>
                                </ul>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-2xl font-black text-black uppercase tracking-tight">7. USE OF PERSONAL INFORMATION</h3>
                            <div className="space-y-4 text-gray-950 font-medium">
                                <p>Your Personal Information may be used or processed for various purposes including but not limited to the following:</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>To provide effective Services</li>
                                    <li>To operate and improve the Website and/or our Services;</li>
                                    <li>To perform studies, research, and analysis for improving Our information, analysis, services, and technologies; and ensuring that the content displayed is customized to Your interests and preferences;</li>
                                    <li>To contact You via phone, SMS, WhatsApp, or email for appointments, technical issues, payment reminders, deals and offers, and other announcements;</li>
                                    <li>To send promotional mailings from Us or any of Our channel partners via SMS, WhatsApp, or email;</li>
                                    <li>To advertise products and services of DIGISWASTHYA FOUNDATION and third parties;</li>
                                    <li>To transfer information about You if we are acquired by or merged with another company;</li>
                                    <li>To share with our business partners the provision of specific services you have ordered so as to enable them to provide effective services to You;</li>
                                    <li>To administer or otherwise carry out Our obligations in relation to any agreement You have with us;</li>
                                    <li>To build your profile on the Website;</li>
                                    <li>To respond to subpoenas, court orders, or legal process, or to establish or exercise Our legal rights or defend against legal claims; and</li>
                                    <li>To investigate, prevent, or take action regarding illegal activities, suspected fraud, violations of our Terms of Use, breach of Our agreement with you or as otherwise required by law,</li>
                                    <li>To aggregate Personal Information for research, statistical analysis, and business intelligence purposes, and to sell or otherwise transfer such research, statistical, or intelligence data in an aggregated or non-personally identifiable form to third parties and affiliates (referred to as “Purpose(s)”)</li>
                                </ul>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-2xl font-black text-black uppercase tracking-tight">8. SHARING AND TRANSFERRING OF PERSONAL INFORMATION</h3>
                            <div className="space-y-4 text-gray-950 font-medium">
                                <p>Once you have freely consented to share your Personal Information with us, You authorize us to exchange, transfer, share, or part with all or any of Your Personal Information across borders and from Your country to any other countries across the world with the Cloud Service Provider and Our affiliates/agents / third party service providers/partners/banks and financial institutions or any other persons, for the purposes specified under this Policy or as may be required by applicable law.</p>
                                <p>You acknowledge that some countries where we may transfer Your Personal Information may not have data protection laws that are as stringent as the laws of Your own country. You acknowledge that it is adequate that when DIGISWASTHYA FOUNDATION transfers Your Personal Information to any other entity within or outside Your country of residence, DIGISWASTHYA FOUNDATION will place contractual obligations on the transferee, which will oblige the transferee to adhere to the provisions of this Privacy Policy.</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-2xl font-black text-black uppercase tracking-tight">9. USE OF COOKIES</h3>
                            <div className="space-y-4 text-gray-950 font-medium">
                                <p>We may store temporary or permanent ‘cookies’ on your computer. You can erase or choose to block these cookies from your computer. You can configure your computer’s browser to alert you when we attempt to send you a cookie with an option to accept or refuse the cookie. If you have turned cookies off, you may be prevented from using certain features of the Website. In the course of displaying advertisements regarding its services or optimizing services to its Users, DIGISWASTHYA FOUNDATION may allow authorized third parties to place or recognize a unique cookie on the User’s browser/device. DIGISWASTHYA FOUNDATION does not store personally identifiable information in the cookies. Further, DIGISWASTHYA FOUNDATION does not exercise control over the sites displayed as search results or links from within its Services. These other sites may place their own cookies or other files on Your computer, collect data, or solicit personal information from You, for which DIGISWASTHYA FOUNDATION is not responsible or liable. DIGISWASTHYA FOUNDATION encourages You to read the privacy policies of all external sites.</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-2xl font-black text-black uppercase tracking-tight">10. SECURITY</h3>
                            <div className="space-y-4 text-gray-950 font-medium">
                                <p>The security of your Personal Information is important to us. We have adopted reasonable security practices and procedures, including role-based access and need-to-know basis, password protection, encryption, etc., to ensure that the Personal Information collected is secure. We restrict access to your Personal Information to Our and Our affiliates’ employees, agents, third-party service providers, partners, and agencies on a need-to-know basis and in relation to the Purposes specified above in this Policy.</p>
                                <p>While We will endeavor to take all reasonable and appropriate steps to keep secure any information that We hold about You and prevent unauthorized access, you acknowledge that the internet is not 100% secure and that We cannot provide any absolute assurance regarding the security of Your Personal Information. We will not be liable in any way in relation to any breach of security or unintended loss or disclosure of information caused by Us in relation to your Personal Information.</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-2xl font-black text-black uppercase tracking-tight">11. THIRD PARTY REFERENCES AND LINKS</h3>
                            <div className="space-y-4 text-gray-950 font-medium">
                                <p>During Your interactions with Us, it may happen that We provide/include references to third parties or fiduciaries and/or links and hyperlinks to third-party websites. It may also happen that you include links and hyperlinks to third-party websites. The reference of such third parties or listing of such third-party external sites (by You or by Us) does not imply endorsement of such party or site by DIGISWASTHYA FOUNDATION. Such third-parties and third-party sites are governed by their own terms and conditions. We do not make any representations regarding the availability and performance of any of the third parties or third-party sites. We are not responsible for the content, terms of use, privacy policies, and practices of such third-party websites.</p>
                                <p>Do-not-track requests There is no standard for how online service should respond to “Do Not Track” signals or other mechanisms that may allow you to opt out of the collection of information across networks of websites and online services. Therefore, we do not honor “Do Not Track” signals. As standards develop, we will revisit this issue and update this notice if our practices change.</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-2xl font-black text-black uppercase tracking-tight">12. RECTIFICATION/CORRECTION OF PERSONAL INFORMATION</h3>
                            <div className="space-y-4 text-gray-950 font-medium">
                                <p>If You need to update or correct your Personal Information, you may send updates and corrections to us at <a href="mailto:support@digiswasthya.org" className="text-primary-600 hover:underline">support@digiswasthya.org</a>. We will make all reasonable efforts to incorporate the changes within a reasonable period.</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-2xl font-black text-black uppercase tracking-tight">13. COMPLIANCE WITH LAWS</h3>
                            <div className="space-y-4 text-gray-950 font-medium">
                                <p>You are not allowed to use the services of the Website if any of the terms of this Privacy Policy are not in accordance with the applicable laws of your country.</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-2xl font-black text-black uppercase tracking-tight">14. TERM OF STORAGE OF PERSONAL INFORMATION</h3>
                            <div className="space-y-4 text-gray-950 font-medium">
                                <p>DIGISWASTHYA FOUNDATION shall store Your Personal Information at least for a period of three years from the last date of use of the Services or Website or for such period as may be required by law.</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-2xl font-black text-black uppercase tracking-tight">15. GRIEVANCE OFFICER</h3>
                            <div className="space-y-4 text-gray-950 font-medium">
                                <p>We have appointed a Grievance Officer to address any concerns or grievances that You may have regarding the processing of Your Personal Information. If you have any such grievances, please write to our Grievance Officer at <a href="mailto:support@digiswasthya.org" className="text-primary-600 hover:underline">support@digiswasthya.org</a>, and Our officer will attempt to resolve Your issues in a timely manner.</p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
