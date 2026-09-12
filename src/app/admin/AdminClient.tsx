"use client";

import { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Lock, Video, Newspaper, Tent, PlusCircle, Trash2, 
    CheckCircle2, AlertCircle, Eye, RefreshCw, Upload, LogOut, ArrowRight, 
    ShieldCheck, Edit3, X, Tag, Sparkles, AlertTriangle, Check, Images, Calendar
} from "lucide-react";
import Link from "next/link";

type ContentType = "video" | "news" | "field_work";

interface MediaData {
    projectImages: Array<{ title: string; description: string; image: string; category: string; createdAt?: string }>;
    mediaCoverage: Array<{ title: string; description: string; image: string; category: string; createdAt?: string }>;
    videos: Array<{ id: string; title: string; category: string; duration?: string; createdAt?: string }>;
}

interface EditingItem {
    type: ContentType;
    originalIdOrTitle: string;
    title: string;
    category: string;
    description: string;
    videoUrl?: string;
    duration?: string;
    image?: string;
    id?: string;
}

interface DeleteConfirmItem {
    type: ContentType;
    idOrTitle: string;
    title: string;
}

const CATEGORY_PRESETS: Record<ContentType, string[]> = {
    video: ["Documentary", "Patient Story", "Founder Story", "Health Awareness", "Ground Impact"],
    news: ["National News", "TV / Broadcast", "Award & Recognition", "Govt Feature", "Online Article"],
    field_work: ["Rural Health Camp", "Telemedicine Center", "Patient Consultation", "Community Outreach", "Medical Team"]
};

// Clean helper to format dates reliably on mobile & desktop
function formatMediaDate(createdAt?: string, imagePath?: string) {
    if (createdAt) {
        try {
            const d = new Date(createdAt);
            if (!isNaN(d.getTime())) {
                return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
            }
        } catch {
            // fallback
        }
    }
    // Extract timestamp if encoded in image filename
    if (imagePath) {
        const match = imagePath.match(/\/(\d{13})-/);
        if (match) {
            const ts = parseInt(match[1], 10);
            if (!isNaN(ts)) {
                return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
            }
        }
    }
    return "Recent";
}

export default function AdminPage() {
    // Auth State
    const [pin, setPin] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authError, setAuthError] = useState("");

    // Form State (New Item)
    const [contentType, setContentType] = useState<ContentType>("video");
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState(CATEGORY_PRESETS.video[0]);
    const [description, setDescription] = useState("");
    const [videoUrl, setVideoUrl] = useState("");
    const [duration, setDuration] = useState("3 min");
    
    // Multi-Photo Upload State (Feature 5)
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [isFetchingYoutubeTitle, setIsFetchingYoutubeTitle] = useState(false);

    // Editing State (Feature 4)
    const [editingItem, setEditingItem] = useState<EditingItem | null>(null);
    const [editSelectedFile, setEditSelectedFile] = useState<File | null>(null);
    const [editPreviewUrl, setEditPreviewUrl] = useState<string | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);

    // Delete Confirmation State (Safe Delete)
    const [deleteConfirmItem, setDeleteConfirmItem] = useState<DeleteConfirmItem | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Submission & Data State
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [mediaData, setMediaData] = useState<MediaData | null>(null);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const editFileInputRef = useRef<HTMLInputElement>(null);

    // Check existing session
    useEffect(() => {
        const savedPin = sessionStorage.getItem("digiswasthya_admin_pin");
        if (savedPin) {
            setPin(savedPin);
            verifyPin(savedPin);
        }
    }, []);

    // Update default category when switching content type
    const handleTypeChange = (newType: ContentType) => {
        setContentType(newType);
        setCategory(CATEGORY_PRESETS[newType][0]);
        setSelectedFiles([]);
        setPreviewUrls([]);
        if (fileInputRef.current) fileInputRef.current.value = "";
        if (newType === "video") {
            setVideoUrl("");
        }
    };

    const verifyPin = async (pinToTest: string) => {
        setAuthError("");
        try {
            const res = await fetch("/api/admin/verify-pin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pin: pinToTest }),
            });
            if (res.ok) {
                setIsAuthenticated(true);
                fetchCurrentData();
            } else {
                // Stale/invalid session PIN — clear it
                sessionStorage.removeItem("digiswasthya_admin_pin");
            }
        } catch {
            setAuthError("Failed to connect to server.");
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!pin.trim()) {
            setAuthError("Please enter the Admin PIN.");
            return;
        }
        setAuthError("");
        try {
            const res = await fetch("/api/admin/verify-pin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pin: pin.trim() }),
            });

            if (res.status === 401) {
                setAuthError("Invalid Admin PIN. Please check your PIN and try again.");
                return;
            }

            if (!res.ok) {
                setAuthError("Server error. Please try again.");
                return;
            }

            sessionStorage.setItem("digiswasthya_admin_pin", pin.trim());
            setIsAuthenticated(true);
            fetchCurrentData();
        } catch {
            setAuthError("Failed to connect to server. Please try again.");
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem("digiswasthya_admin_pin");
        setIsAuthenticated(false);
        setPin("");
        setEditingItem(null);
        setDeleteConfirmItem(null);
    };

    const fetchCurrentData = async () => {
        setIsLoadingData(true);
        try {
            const res = await fetch("/api/admin/media");
            if (res.ok) {
                const data = await res.json();
                setMediaData(data);
            }
        } catch (err) {
            console.error("Failed to load media data:", err);
        } finally {
            setIsLoadingData(false);
        }
    };

    // Multi-File selection handler
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            setSelectedFiles((prev) => [...prev, ...files]);
            const newUrls = files.map((f) => URL.createObjectURL(f));
            setPreviewUrls((prev) => [...prev, ...newUrls]);
        }
    };

    // Remove single photo from selection
    const handleRemoveFile = (index: number) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
        setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    };

    const handleClearAllFiles = () => {
        setSelectedFiles([]);
        setPreviewUrls([]);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setEditSelectedFile(file);
            const url = URL.createObjectURL(file);
            setEditPreviewUrl(url);
        }
    };

    const extractYouTubeId = (url: string) => {
        if (!url) return null;
        const clean = url.trim();
        if (/^[a-zA-Z0-9_-]{11}$/.test(clean)) return clean;
        const match = clean.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/i);
        return match ? match[1] : null;
    };

    // Auto-fetch YouTube Title from free public oEmbed
    const handleVideoUrlChange = async (url: string) => {
        setVideoUrl(url);
        const videoId = extractYouTubeId(url);
        if (videoId && !title) {
            setIsFetchingYoutubeTitle(true);
            try {
                const res = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.title) {
                        setTitle(data.title);
                    }
                }
            } catch {
                // Silently ignore if network fails
            } finally {
                setIsFetchingYoutubeTitle(false);
            }
        }
    };

    // Handle Create New Content
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFeedbackMessage(null);
        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append("pin", pin || sessionStorage.getItem("digiswasthya_admin_pin") || "");
            formData.append("type", contentType);
            formData.append("title", title);
            formData.append("category", category || CATEGORY_PRESETS[contentType][0]);
            formData.append("description", description);

            if (contentType === "video") {
                formData.append("videoUrl", videoUrl);
                formData.append("duration", duration);
            } else {
                if (selectedFiles.length === 0) {
                    throw new Error("Please select at least one image file to upload.");
                }
                selectedFiles.forEach((file) => {
                    formData.append("images", file);
                });
            }

            const res = await fetch("/api/admin/media", {
                method: "POST",
                body: formData,
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.error || "Failed to publish content.");
            }

            setFeedbackMessage({ type: "success", text: result.message || "Published live to website successfully!" });
            
            // Reset form
            setTitle("");
            setDescription("");
            setVideoUrl("");
            setCategory(CATEGORY_PRESETS[contentType][0]);
            setSelectedFiles([]);
            setPreviewUrls([]);
            if (fileInputRef.current) fileInputRef.current.value = "";

            // Refresh data list
            fetchCurrentData();

        } catch (err: any) {
            setFeedbackMessage({ type: "error", text: err.message || "An unexpected error occurred." });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Open Edit Modal
    const handleStartEdit = (type: ContentType, item: any) => {
        setEditingItem({
            type,
            originalIdOrTitle: type === "video" ? item.id : item.title,
            title: item.title,
            category: item.category || CATEGORY_PRESETS[type][0],
            description: item.description || "",
            videoUrl: type === "video" ? `https://www.youtube.com/watch?v=${item.id}` : undefined,
            duration: item.duration || "3 min",
            image: item.image,
            id: item.id
        });
        setEditSelectedFile(null);
        setEditPreviewUrl(null);
    };

    // Save Edited Item
    const handleSaveEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingItem) return;

        setIsUpdating(true);
        try {
            const formData = new FormData();
            formData.append("pin", pin || sessionStorage.getItem("digiswasthya_admin_pin") || "");
            formData.append("type", editingItem.type);
            formData.append("originalIdOrTitle", editingItem.originalIdOrTitle);
            formData.append("title", editingItem.title);
            formData.append("category", editingItem.category);
            formData.append("description", editingItem.description || "");

            if (editingItem.type === "video") {
                formData.append("videoUrl", editingItem.videoUrl || "");
                formData.append("duration", editingItem.duration || "3 min");
            } else {
                if (editSelectedFile) {
                    formData.append("image", editSelectedFile);
                }
            }

            const res = await fetch("/api/admin/media", {
                method: "PUT",
                body: formData,
            });

            const result = await res.json();
            if (!res.ok) {
                throw new Error(result.error || "Failed to update item.");
            }

            setEditingItem(null);
            setFeedbackMessage({ type: "success", text: "Item updated successfully!" });
            fetchCurrentData();
        } catch (err: any) {
            alert(err.message || "Failed to save edits.");
        } finally {
            setIsUpdating(false);
        }
    };

    // Safe Delete Handler
    const handleConfirmDelete = async () => {
        if (!deleteConfirmItem) return;
        setIsDeleting(true);

        try {
            const currentPin = pin || sessionStorage.getItem("digiswasthya_admin_pin") || "";
            const res = await fetch(
                `/api/admin/media?pin=${encodeURIComponent(currentPin)}&type=${deleteConfirmItem.type}&idOrTitle=${encodeURIComponent(deleteConfirmItem.idOrTitle)}`, 
                { method: "DELETE" }
            );

            if (res.ok) {
                setDeleteConfirmItem(null);
                setFeedbackMessage({ type: "success", text: "Item deleted successfully." });
                fetchCurrentData();
            } else {
                const err = await res.json();
                alert(err.error || "Failed to delete item.");
            }
        } catch {
            alert("Error connecting to server.");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <main className="min-h-screen bg-slate-950 text-white flex flex-col justify-between">
            <Navbar />

            <div className="container mx-auto px-3.5 sm:px-4 py-8 sm:py-12 md:py-16 max-w-5xl flex-grow">
                
                {/* ─── AUTH SCREEN (IF NOT LOGGED IN) ─── */}
                {!isAuthenticated ? (
                    <div className="max-w-md mx-auto my-8 sm:my-16 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
                        <div className="text-center mb-6 sm:mb-8">
                            <div className="inline-flex p-3.5 sm:p-4 rounded-2xl bg-orange-500/10 text-orange-400 border border-orange-500/20 mb-3 sm:mb-4">
                                <Lock className="w-7 h-7 sm:w-8 h-8" />
                            </div>
                            <h1 className="text-2xl font-black text-white">Staff Admin Portal</h1>
                            <p className="text-slate-400 text-xs sm:text-sm mt-2">
                                Enter your DigiSwasthya staff PIN to manage YouTube videos, news coverage, and camp photos.
                            </p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">
                                    Admin Secret PIN / Password
                                </label>
                                <input
                                    type="password"
                                    value={pin}
                                    onChange={(e) => setPin(e.target.value)}
                                    placeholder="Enter secret PIN"
                                    className="w-full bg-slate-800 border-2 border-slate-700 focus:border-orange-500 rounded-2xl p-3.5 sm:p-4 text-white font-bold text-base sm:text-lg outline-none transition-all placeholder:text-slate-500 focus:ring-4 focus:ring-orange-500/10"
                                />
                            </div>

                            {authError && (
                                <p className="text-xs sm:text-sm font-semibold text-red-400 bg-red-950/50 p-3 rounded-xl border border-red-800/50">
                                    {authError}
                                </p>
                            )}

                            <button
                                type="submit"
                                className="w-full py-3.5 sm:py-4 rounded-2xl font-black text-base sm:text-lg bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                            >
                                Login to Dashboard <ArrowRight className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                ) : (
                    /* ─── ADMIN DASHBOARD ─── */
                    <div className="space-y-8 sm:space-y-12">
                        
                        {/* Header Banner */}
                        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800 border border-slate-800 p-5 sm:p-8 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
                            <div>
                                <div className="flex items-center gap-2 text-orange-400 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-1">
                                    <ShieldCheck className="w-4 h-4" /> Authenticated Staff Session
                                </div>
                                <h1 className="text-xl sm:text-3xl font-black text-white">Media & Content Manager</h1>
                                <p className="text-slate-400 text-xs sm:text-sm mt-1">
                                    Publish videos, press features, and camp photos directly to the public website.
                                </p>
                            </div>
                            <div className="flex items-center gap-2.5 w-full sm:w-auto">
                                <Link 
                                    href="/media" 
                                    target="_blank"
                                    className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
                                >
                                    <Eye className="w-4 h-4" /> View Live Page
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="px-3.5 py-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 text-xs font-bold flex items-center gap-1.5 transition-colors border border-red-800/40 cursor-pointer"
                                >
                                    <LogOut className="w-4 h-4" /> Logout
                                </button>
                            </div>
                        </div>

                        {/* ─── OPTION 1: SINGLE CLEAN FORM WITH 3-WAY SELECTOR ─── */}
                        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-8 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-600" />
                            
                            <h2 className="text-lg sm:text-xl font-bold text-white mb-5 flex items-center gap-2.5">
                                <PlusCircle className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" /> Add New Content
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                                
                                {/* 1. The 3-Way Category Selector */}
                                <div>
                                    <label className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-slate-400 block mb-2.5">
                                        Step 1: Choose What You Want to Add
                                    </label>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                                        <button
                                            type="button"
                                            onClick={() => handleTypeChange("video")}
                                            className={`p-3.5 sm:p-4 rounded-2xl border-2 font-bold text-sm flex items-center gap-3 transition-all cursor-pointer ${
                                                contentType === "video"
                                                    ? "bg-orange-500/15 border-orange-500 text-orange-300 shadow-md"
                                                    : "bg-slate-800/60 border-slate-700/80 text-slate-400 hover:border-slate-600"
                                            }`}
                                        >
                                            <Video className="w-5 h-5 text-orange-400 flex-shrink-0" />
                                            <div className="text-left">
                                                <div>YouTube Video</div>
                                                <div className="text-[11px] font-normal text-slate-400">Documentary / Story</div>
                                            </div>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleTypeChange("news")}
                                            className={`p-3.5 sm:p-4 rounded-2xl border-2 font-bold text-sm flex items-center gap-3 transition-all cursor-pointer ${
                                                contentType === "news"
                                                    ? "bg-orange-500/15 border-orange-500 text-orange-300 shadow-md"
                                                    : "bg-slate-800/60 border-slate-700/80 text-slate-400 hover:border-slate-600"
                                            }`}
                                        >
                                            <Newspaper className="w-5 h-5 text-orange-400 flex-shrink-0" />
                                            <div className="text-left">
                                                <div>News & Press</div>
                                                <div className="text-[11px] font-normal text-slate-400">Article / Media</div>
                                            </div>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleTypeChange("field_work")}
                                            className={`p-3.5 sm:p-4 rounded-2xl border-2 font-bold text-sm flex items-center gap-3 transition-all cursor-pointer ${
                                                contentType === "field_work"
                                                    ? "bg-orange-500/15 border-orange-500 text-orange-300 shadow-md"
                                                    : "bg-slate-800/60 border-slate-700/80 text-slate-400 hover:border-slate-600"
                                            }`}
                                        >
                                            <Tent className="w-5 h-5 text-orange-400 flex-shrink-0" />
                                            <div className="text-left">
                                                <div>Field Work Photos</div>
                                                <div className="text-[11px] font-normal text-slate-400">Single or Bulk Photos</div>
                                            </div>
                                        </button>
                                    </div>
                                </div>

                                {/* 2. Title & Smart Category Presets */}
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                                                {contentType === "field_work" && selectedFiles.length > 1 ? "Event / Album Title *" : "Title / Headline *"}
                                            </label>
                                            {isFetchingYoutubeTitle && (
                                                <span className="text-[11px] text-orange-400 flex items-center gap-1">
                                                    <Sparkles className="w-3 h-3 animate-spin" /> Fetching YouTube title...
                                                </span>
                                            )}
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder={
                                                contentType === "video" 
                                                    ? "e.g. Telemedicine Camp in Basti Village" 
                                                    : contentType === "news" 
                                                    ? "e.g. DD News Coverage of DigiSwasthya" 
                                                    : "e.g. Rural Telemedicine Outreach Camp at Basti"
                                            }
                                            className="w-full bg-slate-800 border-2 border-slate-700 focus:border-orange-500 rounded-2xl p-3.5 sm:p-4 text-white font-semibold text-sm outline-none transition-all placeholder:text-slate-500"
                                        />
                                    </div>

                                    {/* Smart Category Quick Pills */}
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2 flex items-center gap-1.5">
                                            <Tag className="w-3.5 h-3.5 text-orange-400" /> Category Tag (1-Click Presets or Custom)
                                        </label>
                                        
                                        {/* Preset Pills */}
                                        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2.5">
                                            {CATEGORY_PRESETS[contentType].map((preset) => (
                                                <button
                                                    key={preset}
                                                    type="button"
                                                    onClick={() => setCategory(preset)}
                                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 border ${
                                                        category === preset
                                                            ? "bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/20"
                                                            : "bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500"
                                                    }`}
                                                >
                                                    {category === preset && <Check className="w-3 h-3" />}
                                                    {preset}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Editable Category text box */}
                                        <input
                                            type="text"
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            placeholder="Or type a custom category..."
                                            className="w-full bg-slate-800 border-2 border-slate-700 focus:border-orange-500 rounded-2xl p-3 text-white font-semibold text-xs outline-none transition-all placeholder:text-slate-500"
                                        />
                                    </div>
                                </div>

                                {/* 3A. Specific Fields for YouTube Video */}
                                {contentType === "video" ? (
                                    <div className="space-y-4 bg-slate-800/40 p-4 sm:p-5 rounded-2xl border border-slate-800">
                                        <div className="grid sm:grid-cols-3 gap-3 sm:gap-4">
                                            <div className="sm:col-span-2">
                                                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">
                                                    Paste YouTube Video Link or ID *
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={videoUrl}
                                                    onChange={(e) => handleVideoUrlChange(e.target.value)}
                                                    placeholder="https://www.youtube.com/watch?v=..."
                                                    className="w-full bg-slate-800 border-2 border-slate-700 focus:border-orange-500 rounded-2xl p-3.5 sm:p-4 text-white font-mono text-sm outline-none transition-all placeholder:text-slate-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">
                                                    Duration (Optional)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={duration}
                                                    onChange={(e) => setDuration(e.target.value)}
                                                    placeholder="e.g. 4 min"
                                                    className="w-full bg-slate-800 border-2 border-slate-700 focus:border-orange-500 rounded-2xl p-3.5 sm:p-4 text-white font-semibold text-sm outline-none transition-all placeholder:text-slate-500"
                                                />
                                            </div>
                                        </div>

                                        {/* Live YouTube Preview Thumbnail */}
                                        {videoUrl && extractYouTubeId(videoUrl) && (
                                            <div className="flex items-center gap-3 bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                                                <img 
                                                    src={`https://img.youtube.com/vi/${extractYouTubeId(videoUrl)}/mqdefault.jpg`} 
                                                    alt="YouTube Preview" 
                                                    className="w-20 sm:w-24 h-12 sm:h-14 object-cover rounded-lg border border-slate-600 flex-shrink-0"
                                                />
                                                <div className="min-w-0 flex-1">
                                                    <span className="text-xs font-bold text-green-400 flex items-center gap-1 truncate">
                                                        <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> YouTube Video Detected
                                                    </span>
                                                    <p className="text-[11px] text-slate-400 font-mono truncate">ID: {extractYouTubeId(videoUrl)}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    /* 3B. Specific Fields for News & Field Work Photos */
                                    <div className="space-y-4 bg-slate-800/40 p-4 sm:p-5 rounded-2xl border border-slate-800">
                                        <div>
                                            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">
                                                Description / Details
                                            </label>
                                            <textarea
                                                rows={2}
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                placeholder={
                                                    contentType === "news" 
                                                        ? "Brief summary of the news coverage..." 
                                                        : "Brief summary of the health camp location or activity..."
                                                }
                                                className="w-full bg-slate-800 border-2 border-slate-700 focus:border-orange-500 rounded-2xl p-3.5 sm:p-4 text-white font-semibold text-sm outline-none transition-all placeholder:text-slate-500 resize-none"
                                            />
                                        </div>

                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                                                    Upload Photos (Single or Multiple) *
                                                </label>
                                                {selectedFiles.length > 0 && (
                                                    <button
                                                        type="button"
                                                        onClick={handleClearAllFiles}
                                                        className="text-[11px] text-red-400 hover:text-red-300 font-semibold cursor-pointer"
                                                    >
                                                        Clear all ({selectedFiles.length})
                                                    </button>
                                                )}
                                            </div>

                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={handleFileChange}
                                                className="hidden"
                                                id="file-upload-input"
                                            />
                                            <label
                                                htmlFor="file-upload-input"
                                                className="flex flex-col sm:flex-row items-center justify-center gap-3 p-5 sm:p-6 rounded-2xl border-2 border-dashed border-slate-700 hover:border-orange-500 bg-slate-800/60 hover:bg-slate-800 cursor-pointer transition-all text-center sm:text-left"
                                            >
                                                <div className="p-3 bg-orange-500/10 rounded-xl text-orange-400 border border-orange-500/20">
                                                    <Images className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <span className="text-sm font-bold text-white block">
                                                        {selectedFiles.length > 0 
                                                            ? `+ Add more photos (${selectedFiles.length} selected)` 
                                                            : "Tap to choose photos from phone gallery or computer"}
                                                    </span>
                                                    <span className="text-xs text-slate-400">
                                                        Single photo or up to 10 photos at once
                                                    </span>
                                                </div>
                                            </label>
                                        </div>

                                        {/* Multi-Photo Preview Grid */}
                                        {selectedFiles.length > 0 && (
                                            <div className="space-y-2 pt-1">
                                                <div className="flex items-center justify-between text-xs text-slate-300 font-bold px-1">
                                                    <span className="flex items-center gap-1 text-emerald-400">
                                                        <CheckCircle2 className="w-3.5 h-3.5" /> {selectedFiles.length} {selectedFiles.length === 1 ? "Photo Ready" : "Photos Ready"}
                                                    </span>
                                                    <span className="text-slate-400 text-[11px] font-normal">Tap ✕ to remove</span>
                                                </div>

                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-slate-800/80 p-2.5 sm:p-3 rounded-2xl border border-slate-700">
                                                    {previewUrls.map((url, index) => (
                                                        <div key={index} className="relative group rounded-xl overflow-hidden border border-slate-700 bg-slate-900 aspect-video flex items-center justify-center">
                                                            <img 
                                                                src={url} 
                                                                alt={`Selected ${index + 1}`} 
                                                                className="w-full h-full object-cover"
                                                            />
                                                            <div className="absolute bottom-0 inset-x-0 bg-black/70 backdrop-blur-xs p-1 text-[9px] sm:text-[10px] text-slate-200 truncate text-center">
                                                                {selectedFiles[index]?.name}
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveFile(index)}
                                                                className="absolute top-1.5 right-1.5 p-1 rounded-full bg-red-600/90 text-white hover:bg-red-500 transition-colors shadow-md cursor-pointer"
                                                                title="Remove this photo"
                                                            >
                                                                <X className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Feedback Alerts */}
                                {feedbackMessage && (
                                    <div className={`p-3.5 sm:p-4 rounded-2xl flex items-center gap-3 border ${
                                        feedbackMessage.type === "success" 
                                            ? "bg-emerald-950/60 border-emerald-800 text-emerald-300" 
                                            : "bg-red-950/60 border-red-800 text-red-300"
                                    }`}>
                                        {feedbackMessage.type === "success" ? (
                                            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                                        ) : (
                                            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                                        )}
                                        <span className="text-xs sm:text-sm font-semibold">{feedbackMessage.text}</span>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-4 sm:py-5 rounded-2xl font-black text-base sm:text-lg bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white shadow-xl shadow-orange-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-[0.99]"
                                >
                                    {isSubmitting ? (
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                    ) : (
                                        <>
                                            {contentType !== "video" && selectedFiles.length > 1
                                                ? `Publish All ${selectedFiles.length} Photos Live`
                                                : "Publish Live to Website"}
                                            <ArrowRight className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* ─── LIVE CONTENT INVENTORY WITH DATES, EDIT & DELETE ─── */}
                        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-8 shadow-xl">
                            <div className="flex items-center justify-between mb-5">
                                <div>
                                    <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2.5">
                                        <Eye className="w-5 h-5 text-orange-400" /> Current Published Items
                                    </h2>
                                    <p className="text-[11px] sm:text-xs text-slate-400 mt-1">
                                        All items sorted with dates • Click <span className="text-orange-400 font-bold">Edit ✏️</span> or <span className="text-red-400 font-bold">Delete 🗑️</span>.
                                    </p>
                                </div>
                                <button
                                    onClick={fetchCurrentData}
                                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                                    title="Refresh Data"
                                >
                                    <RefreshCw className={`w-4 h-4 ${isLoadingData ? "animate-spin" : ""}`} />
                                </button>
                            </div>

                            {mediaData ? (
                                <div className="space-y-6 sm:space-y-8">
                                    
                                    {/* Videos List */}
                                    <div>
                                        <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-orange-400 mb-3 flex items-center gap-2">
                                            <Video className="w-4 h-4" /> YouTube Videos ({mediaData.videos?.length || 0})
                                        </h3>
                                        <div className="grid sm:grid-cols-2 gap-2.5 sm:gap-3">
                                            {mediaData.videos?.map((v, i) => (
                                                <div key={i} className="bg-slate-800/60 border border-slate-700/60 p-3 sm:p-3.5 rounded-2xl flex items-center justify-between gap-2.5 hover:border-slate-600 transition-all">
                                                    <div className="flex items-center gap-3 min-w-0 flex-1">
                                                        <img 
                                                            src={`https://img.youtube.com/vi/${v.id}/default.jpg`} 
                                                            alt={v.title}
                                                            className="w-12 sm:w-14 h-9 sm:h-10 object-cover rounded-lg flex-shrink-0"
                                                        />
                                                        <div className="min-w-0 flex-1">
                                                            <p className="font-bold text-xs text-white truncate">{v.title}</p>
                                                            <p className="text-[10px] text-slate-400 font-mono truncate mt-0.5">
                                                                <span className="text-orange-400 font-semibold">{v.category}</span>
                                                                <span className="text-slate-400"> • 📅 {formatMediaDate(v.createdAt)}</span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1 flex-shrink-0">
                                                        <button
                                                            onClick={() => handleStartEdit("video", v)}
                                                            className="p-2 rounded-xl text-orange-400 hover:bg-orange-500/10 border border-transparent transition-colors cursor-pointer"
                                                            title="Edit Video"
                                                        >
                                                            <Edit3 className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => setDeleteConfirmItem({ type: "video", idOrTitle: v.id, title: v.title })}
                                                            className="p-2 rounded-xl text-red-400 hover:bg-red-950/60 transition-colors cursor-pointer"
                                                            title="Delete Video"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* News & Press List */}
                                    <div>
                                        <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-2">
                                            <Newspaper className="w-4 h-4" /> News & Press Coverage ({mediaData.mediaCoverage?.length || 0})
                                        </h3>
                                        <div className="grid sm:grid-cols-2 gap-2.5 sm:gap-3">
                                            {mediaData.mediaCoverage?.map((n, i) => (
                                                <div key={i} className="bg-slate-800/60 border border-slate-700/60 p-3 sm:p-3.5 rounded-2xl flex items-center justify-between gap-2.5 hover:border-slate-600 transition-all">
                                                    <div className="flex items-center gap-3 min-w-0 flex-1">
                                                        {n.image && (
                                                            <img 
                                                                src={n.image} 
                                                                alt={n.title}
                                                                className="w-12 sm:w-14 h-9 sm:h-10 object-cover rounded-lg flex-shrink-0 border border-slate-700"
                                                            />
                                                        )}
                                                        <div className="min-w-0 flex-1">
                                                            <p className="font-bold text-xs text-white truncate">{n.title}</p>
                                                            <p className="text-[10px] text-slate-400 truncate mt-0.5">
                                                                <span className="text-amber-400 font-semibold">{n.category}</span>
                                                                <span className="text-slate-400"> • 📅 {formatMediaDate(n.createdAt, n.image)}</span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1 flex-shrink-0">
                                                        <button
                                                            onClick={() => handleStartEdit("news", n)}
                                                            className="p-2 rounded-xl text-orange-400 hover:bg-orange-500/10 border border-transparent transition-colors cursor-pointer"
                                                            title="Edit News"
                                                        >
                                                            <Edit3 className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => setDeleteConfirmItem({ type: "news", idOrTitle: n.title, title: n.title })}
                                                            className="p-2 rounded-xl text-red-400 hover:bg-red-950/60 transition-colors cursor-pointer"
                                                            title="Delete News"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Field Work List */}
                                    <div>
                                        <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-2">
                                            <Tent className="w-4 h-4" /> Field Work & Camp Photos ({mediaData.projectImages?.length || 0})
                                        </h3>
                                        <div className="grid sm:grid-cols-2 gap-2.5 sm:gap-3">
                                            {mediaData.projectImages?.map((p, i) => (
                                                <div key={i} className="bg-slate-800/60 border border-slate-700/60 p-3 sm:p-3.5 rounded-2xl flex items-center justify-between gap-2.5 hover:border-slate-600 transition-all">
                                                    <div className="flex items-center gap-3 min-w-0 flex-1">
                                                        {p.image && (
                                                            <img 
                                                                src={p.image} 
                                                                alt={p.title}
                                                                className="w-12 sm:w-14 h-9 sm:h-10 object-cover rounded-lg flex-shrink-0 border border-slate-700"
                                                            />
                                                        )}
                                                        <div className="min-w-0 flex-1">
                                                            <p className="font-bold text-xs text-white truncate">{p.title}</p>
                                                            <p className="text-[10px] text-slate-400 truncate mt-0.5">
                                                                <span className="text-emerald-400 font-semibold">{p.category}</span>
                                                                <span className="text-slate-400"> • 📅 {formatMediaDate(p.createdAt, p.image)}</span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1 flex-shrink-0">
                                                        <button
                                                            onClick={() => handleStartEdit("field_work", p)}
                                                            className="p-2 rounded-xl text-orange-400 hover:bg-orange-500/10 border border-transparent transition-colors cursor-pointer"
                                                            title="Edit Photo"
                                                        >
                                                            <Edit3 className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => setDeleteConfirmItem({ type: "field_work", idOrTitle: p.title, title: p.title })}
                                                            className="p-2 rounded-xl text-red-400 hover:bg-red-950/60 transition-colors cursor-pointer"
                                                            title="Delete Photo"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                </div>
                            ) : (
                                <p className="text-sm text-slate-500">Loading published content...</p>
                            )}
                        </div>

                    </div>
                )}
            </div>

            {/* ─── EDIT MODAL ─── */}
            <AnimatePresence>
                {editingItem && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-black/80 backdrop-blur-md">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 sm:space-y-6 max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex items-center justify-between border-b border-slate-800 pb-3 sm:pb-4">
                                <div className="flex items-center gap-2 text-orange-400 font-bold text-base sm:text-lg">
                                    <Edit3 className="w-5 h-5" /> Edit {editingItem.type === "video" ? "Video" : editingItem.type === "news" ? "News" : "Photo"}
                                </div>
                                <button 
                                    onClick={() => setEditingItem(null)}
                                    className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSaveEdit} className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
                                        Title / Headline *
                                    </label>
                                    <input 
                                        type="text"
                                        required
                                        value={editingItem.title}
                                        onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                                        className="w-full bg-slate-800 border-2 border-slate-700 focus:border-orange-500 rounded-xl p-3 text-white font-semibold text-sm outline-none"
                                    />
                                </div>

                                {/* Category Presets */}
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
                                        Category Tag
                                    </label>
                                    <div className="flex flex-wrap gap-1.5 mb-2">
                                        {CATEGORY_PRESETS[editingItem.type].map((preset) => (
                                            <button
                                                key={preset}
                                                type="button"
                                                onClick={() => setEditingItem({ ...editingItem, category: preset })}
                                                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border ${
                                                    editingItem.category === preset
                                                        ? "bg-orange-500 text-white border-orange-500"
                                                        : "bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500"
                                                }`}
                                            >
                                                {preset}
                                            </button>
                                        ))}
                                    </div>
                                    <input 
                                        type="text"
                                        value={editingItem.category}
                                        onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                                        className="w-full bg-slate-800 border border-slate-700 focus:border-orange-500 rounded-xl p-2.5 text-white font-semibold text-xs outline-none"
                                    />
                                </div>

                                {editingItem.type === "video" ? (
                                    <>
                                        <div>
                                            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
                                                YouTube URL or Video ID
                                            </label>
                                            <input 
                                                type="text"
                                                value={editingItem.videoUrl || ""}
                                                onChange={(e) => setEditingItem({ ...editingItem, videoUrl: e.target.value })}
                                                className="w-full bg-slate-800 border-2 border-slate-700 focus:border-orange-500 rounded-xl p-3 text-white font-mono text-sm outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
                                                Duration (Optional)
                                            </label>
                                            <input 
                                                type="text"
                                                value={editingItem.duration || ""}
                                                onChange={(e) => setEditingItem({ ...editingItem, duration: e.target.value })}
                                                className="w-full bg-slate-800 border-2 border-slate-700 focus:border-orange-500 rounded-xl p-3 text-white text-sm outline-none"
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div>
                                            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
                                                Description / Details
                                            </label>
                                            <textarea 
                                                rows={2}
                                                value={editingItem.description || ""}
                                                onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                                                className="w-full bg-slate-800 border-2 border-slate-700 focus:border-orange-500 rounded-xl p-3 text-white text-sm outline-none resize-none"
                                            />
                                        </div>

                                        {/* Image Swap */}
                                        <div>
                                            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
                                                Replace Image (Optional)
                                            </label>
                                            <input 
                                                ref={editFileInputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={handleEditFileChange}
                                                className="hidden"
                                                id="edit-file-upload-input"
                                            />
                                            <label
                                                htmlFor="edit-file-upload-input"
                                                className="flex items-center justify-between p-3 rounded-xl border border-dashed border-slate-700 hover:border-orange-500 bg-slate-800/60 cursor-pointer text-xs"
                                            >
                                                <span className="truncate text-slate-300">
                                                    {editSelectedFile ? editSelectedFile.name : "Choose new photo to replace existing"}
                                                </span>
                                                <Upload className="w-4 h-4 text-orange-400 flex-shrink-0" />
                                            </label>

                                            {(editPreviewUrl || editingItem.image) && (
                                                <div className="mt-2 flex items-center gap-3">
                                                    <img 
                                                        src={editPreviewUrl || editingItem.image} 
                                                        alt="Preview" 
                                                        className="w-16 h-12 object-cover rounded-lg border border-slate-700"
                                                    />
                                                    <span className="text-[11px] text-slate-400">
                                                        {editPreviewUrl ? "New replacement selected" : "Current image on website"}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}

                                <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-800">
                                    <button
                                        type="button"
                                        onClick={() => setEditingItem(null)}
                                        className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isUpdating}
                                        className="px-5 sm:px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-colors shadow-lg shadow-orange-500/20 cursor-pointer disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {isUpdating ? "Saving..." : "Save Changes"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ─── DELETE CONFIRMATION MODAL ─── */}
            <AnimatePresence>
                {deleteConfirmItem && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-black/80 backdrop-blur-md">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-8 max-w-md w-full shadow-2xl text-center space-y-4 sm:space-y-5"
                        >
                            <div className="inline-flex p-3.5 sm:p-4 rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20">
                                <AlertTriangle className="w-7 h-7 sm:w-8 h-8" />
                            </div>

                            <div>
                                <h3 className="text-lg sm:text-xl font-bold text-white">Delete this item?</h3>
                                <p className="text-slate-400 text-xs mt-1.5 px-2">
                                    Are you sure you want to remove <span className="text-white font-semibold">"{deleteConfirmItem.title}"</span>? This will immediately remove it from the live website.
                                </p>
                            </div>

                            <div className="flex items-center justify-center gap-2.5 pt-2">
                                <button
                                    onClick={() => setDeleteConfirmItem(null)}
                                    disabled={isDeleting}
                                    className="px-4 sm:px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirmDelete}
                                    disabled={isDeleting}
                                    className="px-5 sm:px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors shadow-lg shadow-red-500/20 cursor-pointer flex items-center gap-2 disabled:opacity-50"
                                >
                                    {isDeleting ? "Deleting..." : "Yes, Delete Item"}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <Footer />
        </main>
    );
}
