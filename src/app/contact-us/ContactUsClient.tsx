"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import Link from "next/link";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { ContactActions } from "@/components/features/ContactActions";
import { ContactForm } from "@/components/features/ContactForm";

export default function ContactUs() {
    return (
        <main className="min-h-screen bg-white">
            <Navbar />

            <section className="relative bg-gradient-to-br from-slate-900 via-primary-950 to-slate-900 text-white py-16 md:py-20 overflow-hidden">
                {/* Decorative Background Elements */}
                <div className="absolute inset-0 opacity-[0.08] pointer-events-none">
                    <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:28px_28px]" />
                </div>
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[150%] rounded-full bg-primary-500/10 blur-[120px]" />
                    <div className="absolute top-[20%] -left-[10%] w-[40%] h-[100%] rounded-full bg-secondary-400/5 blur-[100px]" />
                </div>
                
                <div className="container relative z-10 mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-6 tracking-tight drop-shadow-lg">
                            Let&apos;s Get in <span className="text-secondary-400 drop-shadow-[0_0_30px_rgba(251,191,36,0.4)]">Touch</span>
                        </h1>
                        <p className="text-lg md:text-xl text-primary-100 max-w-2xl mx-auto font-medium leading-relaxed">
                            &quot;Making healthcare services affordable and accessible for rural communities across India.&quot;
                        </p>
                    </motion.div>
                </div>
            </section>

            <div className="bg-gradient-to-b from-slate-50 to-white">
                <div className="container py-20 px-4">
                    {/* Prominent Contact Actions at the Top */}
                    <div className="mb-16 bg-white p-8 lg:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col md:flex-row items-center md:items-center justify-start gap-6 md:gap-10 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300">
                        <div className="text-center md:text-left">
                            <h2 className="text-2xl font-serif font-bold text-gray-900 tracking-tight mb-1.5">Need Support?</h2>
                            <p className="text-gray-500 font-medium text-sm md:text-base">Chat with us directly on WhatsApp for any healthcare queries.</p>
                        </div>
                        <div className="flex-shrink-0">
                            <ContactActions />
                        </div>
                    </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* General Support */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm"
                    >
                        <h3 className="text-xl font-bold text-gray-900 mb-8 tracking-tight border-b-2 border-primary-100 pb-4 inline-block">General Support</h3>
                        <div className="space-y-6 text-gray-600">
                            <div className="flex items-center gap-4 group">
                                <div className="bg-primary-50 p-3 rounded-full group-hover:bg-primary-100 transition-colors flex-shrink-0">
                                    <Mail className="h-5 w-5 text-primary-600" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-gray-400 uppercase">Email Us</span>
                                    <span className="font-bold text-gray-900">info@digiswasthya.org</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 group">
                                <div className="bg-primary-50 p-3 rounded-full group-hover:bg-primary-100 transition-colors flex-shrink-0">
                                    <Phone className="h-5 w-5 text-primary-600" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-gray-400 uppercase">Call / WhatsApp</span>
                                    <span className="font-bold text-gray-900">+91 83184 24800</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 group">
                                <div className="bg-primary-50 p-3 rounded-full group-hover:bg-primary-100 transition-colors flex-shrink-0">
                                    <MapPin className="h-5 w-5 text-primary-600" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-gray-400 uppercase">Head Office</span>
                                    <span className="font-bold text-gray-900 text-sm leading-relaxed">Kali Road, Kathaicha Chauraha, Nath Nagar, Sant Kabir Nagar, Uttar Pradesh - 272176</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Find a centre near you → Our Network */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <Link
                            href="/network"
                            className="group block h-full bg-slate-900 text-white p-8 sm:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_20px_50px_rgb(0,0,0,0.2)] transition-all duration-300 overflow-hidden relative"
                        >
                            <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl pointer-events-none group-hover:bg-primary-500/30 transition-colors duration-500" />
                            <div className="relative">
                                <div className="bg-white/10 backdrop-blur-md border border-white/10 h-14 w-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
                                    <MapPin className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="text-2xl font-black tracking-tight mb-2">Looking for a centre near you?</h3>
                                <p className="text-primary-100 leading-relaxed mb-6">
                                    We run a growing network of telemedicine centres across Uttar Pradesh, Bihar and Maharashtra. Find your nearest one with directions on the map.
                                </p>
                                <span className="inline-flex items-center gap-2 font-bold text-sm bg-primary-600 text-white px-6 py-3 rounded-xl group-hover:bg-primary-500 transition-colors shadow-md">
                                    Explore Our Network <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                                </span>
                            </div>
                        </Link>
                    </motion.div>
                </div>

                    <div className="mt-24">
                        <ContactForm />
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
