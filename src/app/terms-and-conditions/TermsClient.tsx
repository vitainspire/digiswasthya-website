"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";

export default function TermsAndConditions() {
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
                        Terms of Use
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-primary-100 max-w-2xl mx-auto font-medium"
                    >
                        Review the terms and conditions for using DigiSwasthya Foundation&apos;s services.
                    </motion.p>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-20 bg-white">
                <div className="container max-w-5xl">
                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 max-w-none text-gray-950 font-medium space-y-8 leading-relaxed">

                        <div className="space-y-4">
                            <h2 className="text-3xl font-black text-black uppercase tracking-tight border-b-2 border-primary-100 pb-2">Terms of Use</h2>
                            <div className="space-y-4">
                                <p className="font-bold text-black border-l-4 border-secondary-500 pl-4 py-1">Acceptance of Terms</p>
                                <p>
                                    This Web- Site is offered to the user of the Service (User) on the condition that the User accepts the terms contained herein, without any modification whatsoever. For the purposes of this Terms of Use, ‘Service’ shall mean and include, without limitation, access to all, one or some of the following: – HTML Code, literature, information, software, products, tools and services including tools and information (which help persons take decisions to donate monies and/or give time to non-governmental organizations or for charitable causes), provided or made available on <a href="http://www.digiswasthya.org" className="text-primary-600 hover:underline">www.digiswasthya.org</a> whether pursuant to subscription or otherwise.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-black text-black uppercase">Intellectual Property Rights:( IP)</h3>
                            <p>
                                Digiswasthya hereby grants to the User, the right to use the Service in accordance with these terms, and for no other purpose. Please note that all elements contained on this Web-Site including all individual articles, columns and other elements making up the Service are also Copyrighted works and are owned by Digiswasthya. Digiswasthya and/ or its Suppliers and are protected by Copyright, Service Marks and Trademark laws, International Treaty provisions and/or other proprietary rights under the laws of India and this Terms of Use. Digiswasthya has provided the rights to use all elements of this service protected by copyright, service marks and Trademark laws to Digiswasthya Foundation a charitable organisation. By using the service you agree to abide by all applicable Copyright and other laws as well as any additional Copyright notices or restrictions contained in the Service. Digiswasthya or other third parties including Digiswasthya Foundation shall be entitled to obtain equitable relief for any violation of their IP, over and above all other remedies available to it to protect its interests therein. Violators will be liable to be prosecuted to the maximum extent possible. Copying for reproduction, for redistribution or other purpose of the web site or any part thereof including but not limited to text content and graphics to any other server or location including caching of any kind is expressly prohibited. The Service is licensed to the User not sold to him. Digiswasthya owns the Service, its applications and Trademarks.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-black text-black uppercase">Links to third Party Sites:</h3>
                            <p>
                                This Web- Site may contain links to Web Sites operated by parties other than Digiswasthya . The links in this Site will let the User leave <a href="http://www.digiswasthya.org" className="text-primary-600 hover:underline">www.digiswasthya.org</a> and proceed to the linked site. The User’s use of each such site is also subject to these Terms of Use and other terms of use, if any, contained within each such site. In the event that any of the Terms contained herein conflict with the terms of use contained within any such site, then the terms of use for such site shall prevail. The linked Sites are not under the control of Digiswasthya and Digiswasthya is not responsible for the contents of any linked Site or any link contained in a linked Site, or any changes or updates to such sites. Digiswasthyawill not directly or indirectly be liable for any loss that may arise to the User as a result of his accessing the linked Sites.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-black text-black uppercase">Access Restriction/Fees:</h3>
                            <p>
                                Digiswasthya reserves the right to deny, in its sole discretion, any User access to this Web Site or any portion thereof without notice or justification. Further Digiswasthya reserves the right at any time to charge fees for access to any service provided by it. It shall put up a notice to this effect with necessary details at the relevant point of time.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-black text-black uppercase">Limits on Personal and Non-Commercial Use:</h3>
                            <p>
                                The User expressly agrees to use the Service strictly for personal purpose. The User shall not recompile, disassemble, copy, modify, distribute, transmit, display, perform, reproduce, publish or create derivative works from, transfer, or sell any information, software, products, tools or services accessed from this web site. The User may not rent, lease, sell, sublicense, lend or in any manner allow any other party to use the Service, with or without consideration.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-black text-black uppercase">Privacy</h3>
                            <p>
                                The User represents that he is aware that in the process of subscribing to the Service or parts of it, Digiswasthya may obtain information relating to the User, including that of a confidential nature. This information will be used by Digiswasthya for its internal purposes and will be kept confidential. Notwithstanding anything contained above, Digiswasthya reserves the right to disclose personal information where it believes in good faith that such disclosure is required by law, to perform necessary credit checks or collect or report debts owed to Digiswasthya, to protect Digiswasthya’s rights or property or for other bonafide uses. The User agrees and warrants that all information that may possess or may obtain pursuant to the use of Service has been possessed or obtained with the permission of the User.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-black text-black uppercase">Modification of these terms and conditions</h3>
                            <p>
                                Digiswasthya reserves the right to change, without notice, this Terms of Use under which the Service is offered. The User’s continued use of the Service will be subject to the Terms of Use in force at the time of the Use.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-black text-black uppercase">Indemnification</h3>
                            <p>
                                The User agrees to indemnify, defend and hold harmless Digiswasthya, its officers, directors, employees, representatives and agents, any third party providers, distributors from and against any cause of action ,claim or demand, including without limitation any reasonable legal, accounting or other professional fees, brought by or on the user’s behalf in excess of the liability described herein or by / on account of a third party due to or arising out of User’s use of this Web site, the Service contained herein, the violation of any intellectual property or any other right of any person or entity.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-black text-black uppercase">Disclaimer of warranties</h3>
                            <div className="space-y-4">
                                <p>
                                    Digiswasthya warrants that it does not provide any Professional Financial advice on this web site.<br />
                                    The User warrants that it shall obtain independent advice before making any any Financial or other decision based on the service provided through this website.
                                </p>
                                <p>
                                    Digiswasthya expressly disclaims all warranties and conditions of any kind , whether express, implied or statutory pertaining to the Services provided by it including but not limited to implied warranties and conditions of merchantability, fitness for a particular purpose, data accuracy and completeness and any warranties relating to viruses and non-infringement in the Service and provision of service free from disruption or interruption.
                                </p>
                                <p>
                                    The Service should not be construed to be an advertisement for solicitation for Donations for non-governmental organizations or other charitable organizations listed in this website.
                                </p>
                                <p>
                                    Digiswasthya shall not be responsible for any loss or liability incurred to the user as a consequence of his or any other person on his behalf taking any financial, investment or other decisions based on the information, research reports, analysis, etc. provided on the web site.
                                </p>
                                <p>
                                    Digiswasthya shall also not be liable for errors, omissions or typographical errors, disruption delay, interruption, failure, deletion or defect of/in the Service provided by it.
                                </p>
                                <p>
                                    Digiswasthya shall not be liable, directly or indirectly, to the User or any third party, as a consequence of the failure of its equipment, howsoever defined, or that of Internet Service Provider, User or any third party to function in such manner as is reasonably expected of such equipment. Digiswasthya shall not be responsible for any downtime of such equipment.
                                </p>
                                <p>
                                    Digiswasthya makes no representations or warranties, either express or implied that the research, development, marketing, distribution, use or provision of the Service will not infringe any patent, copyright or other right of any third party.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-black text-black uppercase">Limitation of liability</h3>
                            <div className="space-y-4">
                                <p>
                                    The User agrees that neither Digiswasthya nor its directors or employees shall be liable for any direct, indirect, incidental, special or consequential damages, resulting from the use/delivery/performance or the inability to use/deliver/perform the Service or for cost of procurement of substitute goods and repair & correction services or resulting from the Services subscribed to or obtained or messages received or transactions entered into through or of User’s transmissions or data, even if Digiswasthya or its employees have been advised of the possibility of such damages.
                                </p>
                                <p>
                                    The User further agrees that Digiswasthya shall not be liable for any damages arising from interruption, suspension or termination of Service, whether such interruption, suspension or termination was justified or not, negligent or intentional, inadvertent or advertent
                                </p>
                                <p>
                                    The User also agrees that his sole remedy under this Terms of Use is cancellation of the Service.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-black text-black uppercase">Submissions</h3>
                            <p>
                                Visitor agrees as a condition of viewing, that any communication between Visitor and Website is deemed a submission. All submissions, including any data, queries, feedback, ideas, comments or suggestion shall become the exclusive property of the Website or its affiliates and may be used, without further permission, for commercial use without additional consideration of any kind.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-black text-black uppercase">Monitoring</h3>
                            <p>
                                We have the right, but not the obligation, to monitor any activity and content associated with the website(s) and/or the services. We may investigate any reported violation of these Conditions or complaints and take any action that we deem appropriate (which may include, but is not limited to, issuing warnings, suspending, terminating or attaching conditions to your access and/or removing any materials on the website(s) and/or the services.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-black text-black uppercase">NGO Listing</h3>
                            <p>
                                Digiswasthya reserves the right to list, deny listing, or delist any NGO on the <a href="http://www.digiswasthya.org" className="text-primary-600 hover:underline">www.digiswasthya.org</a> website. Submission of documents by a NGO does not in itself guarantee automatic listing. Digiswasthya shall not be liable, directly or indirectly, to the NGO or any third party, as a consequence of listing, denying listing, or delisting of any NGO.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-black text-black uppercase">Governing Law and Jurisdiction</h3>
                            <p>
                                This Terms of Use is governed by the laws of the Republic of India. The User hereby consents and submits to the exclusive jurisdiction and venue of Courts in Mumbai, India in all disputes arising out of or relating to the use of this Web site or Service.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-black text-black uppercase">General</h3>
                            <div className="space-y-4">
                                <p>
                                    Nothing contained in this Terms of Use is in derogation of Digiswasthya’s right to comply with Governmental, Court and Law enforcement requests or requirements relating to use of this Web site, Service or information provided to or gathered by Digiswasthya with respect to such use.
                                </p>
                                <p>
                                    This Terms of Use constitutes the entire agreement between the User and Digiswasthya with respect to this Web site and the Services provided by Digiswasthya.
                                </p>
                                <p>
                                    If the User violates any term of this Terms of Use, Digiswasthya may terminate the User’s access to this Web -Site, without waiving any other rights. The User would continue to remain liable for any liabilities that may have arisen before the termination.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
