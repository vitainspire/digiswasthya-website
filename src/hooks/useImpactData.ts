"use client";

import { useState, useEffect, useCallback } from "react";
import { impactData, ImpactPageData } from "@/data/impactData";

/**
 * useImpactData Hook
 *
 * Serves DigiSwasthya's 16 Impact Visualizations.
 * Fetches live 16 metrics from /api/impact/data (populated by Agent 1 & Agent 2 Scraper Pipeline).
 */
export function useImpactData() {
    const [data, setData] = useState<ImpactPageData>(impactData);
    const [rawLiveStore, setRawLiveStore] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(new Date());
    const [isLive, setIsLive] = useState(false);

    const fetchLiveImpactData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/impact/data");
            const json = await res.json();
            
            if (json.success && json.data) {
                const live = json.data;
                setRawLiveStore(live);
                if (live.kpis) {
                    setData((prev) => {
                        const updatedKpis = prev.kpis.map((kpi) => {
                            if (kpi.id === "patients-served" && live.kpis.total_patients) {
                                return { ...kpi, value: live.kpis.total_patients };
                            }
                            if (kpi.id === "expert-doctors" && live.kpis.total_doctors) {
                                return { ...kpi, value: live.kpis.total_doctors };
                            }
                            if (kpi.id === "total-volunteers" && live.kpis.total_volunteers) {
                                return { ...kpi, value: live.kpis.total_volunteers };
                            }
                            if (kpi.id === "partner-hospitals" && live.kpis.total_hospitals) {
                                return { ...kpi, value: live.kpis.total_hospitals };
                            }
                            return kpi;
                        });
                        const updatedRegionalReach = (live.reach && live.reach.district_list)
                            ? live.reach.district_list.map((d: any) => ({
                                district: { en: d.name, hi: d.name },
                                count: d.count
                              }))
                            : prev.regionalReach;

                        return {
                            ...prev,
                            kpis: updatedKpis,
                            regionalReach: updatedRegionalReach
                        };
                    });
                    setIsLive(true);
                }
                setLastUpdated(new Date());
            }
        } catch (error) {
            console.error("Failed to fetch live impact data from agent pipeline:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLiveImpactData();
    }, [fetchLiveImpactData]);

    return { data, rawLiveStore, loading, lastUpdated, isLive, refetch: fetchLiveImpactData };
}
