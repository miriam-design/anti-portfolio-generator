"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Terminal, Globe } from "lucide-react";
import { IdentityManifest } from "@/lib/types";

interface DeployModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: IdentityManifest;
}

export function DeployModal({ isOpen, onClose, data }: DeployModalProps) {

    const handleDownload = () => {
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "dna.json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-black text-green-500 border-green-500/50 font-mono shadow-[0_0_20px_rgba(0,255,0,0.2)] max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl uppercase tracking-widest flex items-center gap-2">
                        <Terminal className="w-6 h-6" />
                        DEPLOY_SEQUENCE_INIT
                    </DialogTitle>
                    <DialogDescription className="text-green-500/70">
                        Take control. Own your data. Host anywhere.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 mt-4">

                    {/* STEP 1: DOWNLOAD */}
                    <div className="border border-green-500/30 p-4 relative">
                        <div className="absolute -top-3 left-4 bg-black px-2 text-xs uppercase font-bold">Step 01: Extract DNA</div>
                        <p className="text-sm opacity-80 mb-4">
                            Download your unique portfolio configuration file. This contains your visual DNA, stories, and projects.
                        </p>
                        <Button
                            onClick={handleDownload}
                            className="w-full bg-green-500 text-black hover:bg-green-400 font-bold uppercase tracking-wider"
                        >
                            <Download className="mr-2 h-4 w-4" />
                            Download dna.json
                        </Button>
                    </div>

                    {/* STEP 2: DEPLOY */}
                    <div className="border border-green-500/30 p-4 relative">
                        <div className="absolute -top-3 left-4 bg-black px-2 text-xs uppercase font-bold">Step 02: Hijack the Engine</div>
                        <div className="space-y-3 text-sm">
                            <div className="flex gap-2 items-start">
                                <span className="opacity-50">1.</span>
                                <span>Fork the <strong>Anti-Portfolio Engine</strong> repo.</span>
                            </div>
                            <div className="flex gap-2 items-start">
                                <span className="opacity-50">2.</span>
                                <span>Replace <code className="bg-green-500/10 px-1">public/data.json</code> with your downloaded file.</span>
                            </div>
                            <div className="flex gap-2 items-start">
                                <span className="opacity-50">3.</span>
                                <span>Deploy to Vercel, Netlify, or your own server.</span>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-green-500/20 text-center">
                            <a
                                href="https://github.com/miriamabbate/anti-portfolio-engine" // Dummy link as requested
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center hover:underline uppercase text-xs font-bold"
                            >
                                <Globe className="w-3 h-3 mr-1" />
                                Access Engine Repository
                            </a>
                        </div>
                    </div>

                </div>
            </DialogContent>
        </Dialog>
    );
}
