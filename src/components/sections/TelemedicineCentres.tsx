import { MapPin, ExternalLink, Navigation, Phone, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const centres = [
    {
        name: "Sant Kabir Nagar (DS 1)",
        address: "Kali Road, Kathaicha Chauraha, Nath Nagar, Sant Kabir Nagar, Uttar Pradesh - 272176",
        link: "https://maps.app.goo.gl/4gydYNL5zncHEfbVA",
        type: "Flagship Centre",
        phone: "+91 83184 24800"
    },
    {
        name: "Muzaffarpur (DS 2)",
        address: "Deoria Road, Nawanagar Nizamat, Sahebganj, Muzaffarpur, Bihar - 843125",
        link: "https://maps.app.goo.gl/d8C46korjVmwhAE6A",
        type: "Regional Unit",
        phone: "+91 83184 24800"
    },
    {
        name: "Pune (DS 3)",
        address: "Bhawadi, Ambegaon, Distt. Pune, Maharashtra - 410512",
        link: "https://maps.app.goo.gl/p8pZsGphmd76zhrc6",
        type: "Community Unit",
        phone: "+91 83184 24800"
    },
    {
        name: "Palghar (DS 4)",
        address: "407, A wing, Sadiya Apartment, 90th Ft. Rd. Oswal Nagari, Nalasopara East, Palghar, MH- 401209",
        link: "https://maps.app.goo.gl/szyf7NfRfzfHNhV28",
        type: "Regional Hub",
        phone: "+91 83184 24800"
    },
    {
        name: "Asharafpur (DS 5)",
        address: "Near Bharat Gas Agency, Asharafpur, Uttar Pradesh 272162",
        link: "https://maps.app.goo.gl/v4DK68qZuXnsaBpF9",
        type: "Village Unit",
        phone: "+91 83184 24800"
    },
];

export function TelemedicineCentres() {
    return (
        <section className="py-24 bg-[#eef4f8] relative overflow-hidden">
            {/* Subtle background element */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: `radial-gradient(#0d9488 0.5px, transparent 0.5px)`, backgroundSize: '32px 32px' }} />

            <div className="container relative z-10 px-4">
                <div className="max-w-3xl mx-auto text-center mb-20">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-[10px] font-bold uppercase tracking-widest mb-6 border border-primary-100 shadow-sm">
                        <Navigation className="h-3 w-3" />
                        Our Network
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight mb-6">
                        Find <span className="text-primary-600">DigiSwasthya</span> Telemedicine Centre Nearby
                    </h2>
                    <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto font-medium">
                        Bringing quality healthcare closer to your home. Locate our technology-enabled health centres across India.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {centres.map((centre, i) => (
                        <div
                            key={i}
                            className="group relative bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(var(--primary-rgb,13,148,136),0.12)] hover:border-primary-200 transition-all duration-500 flex flex-col h-full"
                        >
                            {/* Accent indicator */}
                            <div className="absolute top-8 right-8 flex items-center gap-1.5 bg-white px-2 py-1 rounded-full border border-[#d5e5f0]">
                                <span className="relative flex h-1.5 w-1.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                                </span>
                                <span className="text-[9px] font-black text-gray-500 uppercase tracking-wider">Active</span>
                            </div>

                            <div className="mb-6 p-2.5 bg-primary-50 w-fit rounded-xl group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
                                <MapPin className="h-4 w-4 text-primary-600 group-hover:text-white transition-colors" />
                            </div>

                            <div className="flex-grow">
                                <div className="flex flex-col gap-1 mb-5">
                                    <span className="text-[10px] font-black text-primary-600/60 uppercase tracking-widest">
                                        {centre.type}
                                    </span>
                                    <h4 className="text-xl font-bold text-gray-900 leading-tight">
                                        {centre.name}
                                    </h4>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 flex-shrink-0 p-1 bg-[#eef4f8] rounded-md">
                                            <MapPin className="h-3.5 w-3.5 text-gray-400" />
                                        </div>
                                        <p className="text-gray-600 text-sm leading-relaxed">
                                            {centre.address}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex-shrink-0 p-1 bg-[#eef4f8] rounded-md">
                                            <Phone className="h-3.5 w-3.5 text-gray-400" />
                                        </div>
                                        <span className="text-sm text-gray-500 font-medium">{centre.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-500">
                                        <div className="flex-shrink-0 p-1 bg-[#eef4f8] rounded-md">
                                            <Clock className="h-3.5 w-3.5 text-gray-400" />
                                        </div>
                                        <span className="text-sm text-gray-500 font-medium">9:00 AM - 6:00 PM</span>
                                    </div>
                                </div>
                            </div>

                            <Button
                                asChild
                                variant="outline"
                                className="w-full h-13 rounded-2xl border-gray-200 hover:border-primary-600 hover:bg-primary-600 hover:text-white transition-all duration-300 font-black group/btn shadow-sm text-xs uppercase tracking-widest"
                            >
                                <a href={centre.link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                                    View Location
                                    <ExternalLink className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                                </a>
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

