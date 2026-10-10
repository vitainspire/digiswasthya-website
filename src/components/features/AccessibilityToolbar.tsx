"use client";

import { useState } from "react";
import { Settings, ZoomIn, ZoomOut, Eye, Sun, Moon, Type, RefreshCcw, Underline } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AccessibilityToolbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeFeatures, setActiveFeatures] = useState<string[]>([]);

    const toggleFeature = (featureClass: string) => {
        const html = document.documentElement;
        if (activeFeatures.includes(featureClass)) {
            html.classList.remove(featureClass);
            setActiveFeatures(prev => prev.filter(f => f !== featureClass));
        } else {
            // Logic to handle mutually exclusive features if needed (e.g. text sizes)
            if (featureClass === 'acc-text-lg') {
                html.classList.remove('acc-text-xl');
                setActiveFeatures(prev => [...prev.filter(f => f !== 'acc-text-xl'), featureClass]);
            } else if (featureClass === 'acc-text-xl') {
                html.classList.remove('acc-text-lg');
                setActiveFeatures(prev => [...prev.filter(f => f !== 'acc-text-lg'), featureClass]);
            } else {
                setActiveFeatures(prev => [...prev, featureClass]);
            }
            html.classList.add(featureClass);
        }
    };

    const resetAll = () => {
        const html = document.documentElement;
        activeFeatures.forEach(cls => html.classList.remove(cls));
        setActiveFeatures([]);
    };

    return (
        <div className="fixed right-0 top-1/2 -translate-y-1/2 z-30 flex items-center">
            <Button
                variant="primary"
                size="icon"
                className="rounded-l-md rounded-r-none shadow-lg bg-primary-600 hover:bg-primary-700 h-10 w-10 sm:h-12 sm:w-12"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Accessibility Tools"
            >
                <Settings className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </Button>

            {isOpen && (
                <div className="bg-white border rounded-l-xl shadow-2xl p-3 sm:p-4 w-[calc(100vw-3rem)] max-w-[260px] mr-1 sm:mr-2 grid grid-cols-2 gap-1.5 sm:gap-2 absolute right-10 sm:right-12 top-0 -translate-y-[40%]">
                    <div className="col-span-2 text-sm font-bold text-gray-700 mb-2 border-b pb-1">Accessibility Tools</div>

                    <ToolBtn
                        icon={<ZoomIn className="h-4 w-4" />}
                        label="Increase Text"
                        isActive={activeFeatures.includes('acc-text-lg')}
                        onClick={() => toggleFeature('acc-text-lg')}
                    />
                    <ToolBtn
                        icon={<ZoomIn className="h-4 w-4" />}
                        label="Large Text"
                        isActive={activeFeatures.includes('acc-text-xl')}
                        onClick={() => toggleFeature('acc-text-xl')}
                    />
                    <ToolBtn
                        icon={<ZoomOut className="h-4 w-4" />}
                        label="Reset Text"
                        isActive={false}
                        onClick={() => {
                            document.documentElement.classList.remove('acc-text-lg', 'acc-text-xl');
                            setActiveFeatures(prev => prev.filter(f => !['acc-text-lg', 'acc-text-xl'].includes(f)));
                        }}
                    />
                    <ToolBtn
                        icon={<Eye className="h-4 w-4" />}
                        label="Grayscale"
                        isActive={activeFeatures.includes('acc-grayscale')}
                        onClick={() => toggleFeature('acc-grayscale')}
                    />
                    <ToolBtn
                        icon={<Sun className="h-4 w-4" />}
                        label="High Contrast"
                        isActive={activeFeatures.includes('acc-high-contrast')}
                        onClick={() => toggleFeature('acc-high-contrast')}
                    />
                    <ToolBtn
                        icon={<Moon className="h-4 w-4" />}
                        label="Negative"
                        isActive={activeFeatures.includes('acc-negative-contrast')}
                        onClick={() => toggleFeature('acc-negative-contrast')}
                    />
                    <ToolBtn
                        icon={<Sun className="h-4 w-4" />}
                        label="Light Bg"
                        isActive={activeFeatures.includes('acc-light-bg')}
                        onClick={() => toggleFeature('acc-light-bg')}
                    />
                    <ToolBtn
                        icon={<Underline className="h-4 w-4" />}
                        label="Links Underline"
                        isActive={activeFeatures.includes('acc-links-underline')}
                        onClick={() => toggleFeature('acc-links-underline')}
                    />
                    <ToolBtn
                        icon={<Type className="h-4 w-4" />}
                        label="Readable Font"
                        isActive={activeFeatures.includes('acc-readable-font')}
                        onClick={() => toggleFeature('acc-readable-font')}
                    />

                    <Button
                        variant="secondary"
                        size="sm"
                        className="col-span-2 mt-2 gap-2"
                        onClick={resetAll}
                    >
                        <RefreshCcw className="h-3 w-3" /> Reset All
                    </Button>
                </div>
            )}
        </div>
    );
}

function ToolBtn({ icon, label, onClick, isActive }: { icon: React.ReactNode, label: string, onClick: () => void, isActive: boolean }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex flex-col items-center justify-center p-2 rounded border text-[10px] gap-1 transition-all hover:bg-gray-50",
                isActive ? "bg-primary-50 border-primary-500 text-primary-700" : "bg-white border-gray-200 text-gray-600"
            )}
        >
            {icon}
            <span>{label}</span>
        </button>
    );
}
