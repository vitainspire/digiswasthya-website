"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Milestone, MilestoneCategory } from "@/types/milestone";
import { getPrimaryMilestone, getMilestoneByCategory, LiveImpactData } from "@/data/milestoneEngine";
import { MilestoneCelebrationModal } from "./MilestoneCelebrationModal";
import { MilestoneFloatingPill } from "./MilestoneFloatingPill";

function MilestoneManagerContent() {
    const searchParams = useSearchParams();
    const [activeMilestone, setActiveMilestone] = useState<Milestone | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPillOpen, setIsPillOpen] = useState(false);
    const [liveData, setLiveData] = useState<LiveImpactData | undefined>(undefined);
    const [dataLoaded, setDataLoaded] = useState(false);

    // Step 1: Fetch LIVE data from Firebase via the API route
    useEffect(() => {
        async function fetchLiveData() {
            try {
                const res = await fetch("/api/impact/data", { cache: "no-store" });
                const json = await res.json();
                if (json.success && json.data) {
                    setLiveData(json.data);
                }
            } catch (error) {
                console.warn("[Milestone] Firebase API unavailable, using static fallback:", error);
            } finally {
                setDataLoaded(true);
            }
        }

        fetchLiveData();
    }, []);

    // Step 2: Listen for custom "open-milestone-modal" event (from the Hero live impact badge or elsewhere)
    useEffect(() => {
        const handleOpenEvent = (e: Event) => {
            const customEvent = e as CustomEvent<{ category?: MilestoneCategory }>;
            const category = customEvent.detail?.category;

            let m: Milestone | null = null;
            if (category) {
                m = getMilestoneByCategory(category, liveData);
            } else {
                m = getPrimaryMilestone(liveData);
            }

            if (m) {
                setActiveMilestone(m);
                setIsModalOpen(true);
                setIsPillOpen(false);
            }
        };

        window.addEventListener("open-milestone-modal", handleOpenEvent);
        return () => window.removeEventListener("open-milestone-modal", handleOpenEvent);
    }, [liveData]);

    // Step 3: Handle URL params (for testing/previewing e.g. ?milestone=women_health)
    useEffect(() => {
        if (!dataLoaded) return;

        const paramCategory = searchParams.get("milestone") as MilestoneCategory | null;
        const forcePreview = searchParams.get("preview_milestone") || searchParams.get("test_milestone");

        if (paramCategory || forcePreview) {
            let milestone: Milestone | null = null;
            if (paramCategory) {
                milestone = getMilestoneByCategory(paramCategory, liveData);
            } else {
                milestone = getPrimaryMilestone(liveData);
            }

            if (milestone) {
                setActiveMilestone(milestone);
                setIsModalOpen(true);
            }
        }
    }, [searchParams, dataLoaded, liveData]);

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleDismissPill = () => {
        setIsPillOpen(false);
        if (activeMilestone) {
            localStorage.setItem(`ds_milestone_seen_${activeMilestone.id}`, "true");
        }
    };

    const handleOpenFromPill = () => {
        setIsPillOpen(false);
        setIsModalOpen(true);
    };

    if (!activeMilestone && !isModalOpen) return null;

    return (
        <>
            {/* Celebration Modal with Confetti */}
            {activeMilestone && (
                <MilestoneCelebrationModal
                    milestone={activeMilestone}
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                />
            )}

            {/* Subtle Floating Pill */}
            {activeMilestone && (
                <MilestoneFloatingPill
                    milestone={activeMilestone}
                    isOpen={isPillOpen && !isModalOpen}
                    onOpenModal={handleOpenFromPill}
                    onDismiss={handleDismissPill}
                />
            )}
        </>
    );
}

export function MilestoneManager() {
    return (
        <Suspense fallback={null}>
            <MilestoneManagerContent />
        </Suspense>
    );
}
