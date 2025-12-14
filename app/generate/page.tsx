"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

// Types
// Types
interface FormData {
    fullName: string;
    tagline: string;
    // bio: string; // Removed in favor of cvContext
    cvContext: string; // New
    hatedTrends: string;
    interests: string; // New
    superpower: string;
    projects: string; // New
    methodology: string;
    majorFailure: string;
    lessonLearned: string;
}

const INITIAL_DATA: FormData = {
    fullName: "",
    tagline: "",
    cvContext: "",
    hatedTrends: "",
    interests: "",
    superpower: "",
    projects: "",
    methodology: "",
    majorFailure: "",
    lessonLearned: "",
};

export default function GeneratePage() {
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState<FormData>(INITIAL_DATA);
    const [isGenerating, setIsGenerating] = useState(false);

    // Clear previous data on mount
    useEffect(() => {
        localStorage.removeItem('portfolioData');
    }, []);

    // Constants
    const TOTAL_STEPS = 5;
    const PROGRESS = ((step + 1) / TOTAL_STEPS) * 100;

    // Handlers
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleNext = () => {
        if (step < TOTAL_STEPS - 1) {
            setStep((prev) => prev + 1);
        } else {
            handleGenerate();
        }
    };

    const handleBack = () => {
        if (step > 0) {
            setStep((prev) => prev - 1);
        }
    };

    const router = useRouter();

    const handleGenerate = async () => {
        setIsGenerating(true);
        console.log("Generating Anti-Portfolio with data:", formData);

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to generate portfolio');
            }

            const data = await response.json();

            // Store data for the preview page
            localStorage.setItem('portfolioData', JSON.stringify(data));

            // Redirect to preview
            router.push('/p/preview');

        } catch (error) {
            console.error("Error:", error);
            alert("Failed to generate Anti-Portfolio. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    // Variants for Framer Motion
    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 50 : -50,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 50 : -50,
            opacity: 0,
        }),
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">

            {/* Progress Bar */}
            <div className="w-full max-w-2xl mb-8">
                <div className="flex justify-between text-sm font-bold font-mono mb-2 uppercase tracking-widest text-muted-foreground">
                    <span>Step {step + 1} of {TOTAL_STEPS}</span>
                    <span>{Math.round(PROGRESS)}% Complete</span>
                </div>
                <div className="h-4 w-full bg-muted border border-border relative overflow-hidden">
                    <motion.div
                        className="h-full bg-accent"
                        initial={{ width: 0 }}
                        animate={{ width: `${PROGRESS}%` }}
                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    />
                </div>
            </div>

            {/* Main Card */}
            <Card className="w-full max-w-2xl border-4 border-black dark:border-white rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] bg-card overflow-hidden">
                <CardContent className="p-6 sm:p-10">
                    <AnimatePresence mode="wait" custom={1}>
                        <motion.div
                            key={step}
                            custom={1}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="space-y-6"
                        >
                            {/* STEP 0: THE CONTEXT */}
                            {step === 0 && (
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <h2 className="text-3xl font-serif font-bold">The Context</h2>
                                        <p className="text-muted-foreground">Feed the machine. We need raw data to distill your essence.</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="fullName" className="text-base font-bold uppercase tracking-wider">Codename / Name</Label>
                                            <Input
                                                id="fullName"
                                                name="fullName"
                                                placeholder="e.g. Alex Chen"
                                                className="h-12 border-2 border-black rounded-none focus-visible:ring-accent focus-visible:ring-offset-0 font-medium bg-background text-lg"
                                                value={formData.fullName}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="tagline" className="text-base font-bold uppercase tracking-wider">Tagline</Label>
                                            <Input
                                                id="tagline"
                                                name="tagline"
                                                placeholder="e.g. Designer who hates Figma"
                                                className="h-12 border-2 border-black rounded-none focus-visible:ring-accent focus-visible:ring-offset-0 font-medium bg-background"
                                                value={formData.tagline}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="cvContext" className="text-base font-bold uppercase tracking-wider">Raw Context</Label>
                                            <Textarea
                                                id="cvContext"
                                                name="cvContext"
                                                placeholder="Paste your CV, LinkedIn bio, or summary here. The AI will use this for facts."
                                                className="min-h-[150px] border-2 border-black rounded-none focus-visible:ring-accent focus-visible:ring-offset-0 font-medium bg-background resize-none text-sm leading-relaxed"
                                                value={formData.cvContext}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* STEP 1: THE PASSION & THE HATE */}
                            {step === 1 && (
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <h2 className="text-3xl font-serif font-bold">The Passion & The Hate</h2>
                                        <p className="text-muted-foreground">Polarity creates identity. What do you love? What do you destroy?</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="hatedTrends" className="text-base font-bold uppercase tracking-wider">What industry "standard" is garbage?</Label>
                                            <Textarea
                                                id="hatedTrends"
                                                name="hatedTrends"
                                                placeholder="e.g. Daily standups, Pixel perfection, 10x Engineers..."
                                                className="min-h-[80px] border-2 border-black rounded-none focus-visible:ring-accent focus-visible:ring-offset-0 font-medium bg-background resize-none"
                                                value={formData.hatedTrends}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="interests" className="text-base font-bold uppercase tracking-wider">What lights you up?</Label>
                                            <Input
                                                id="interests"
                                                name="interests"
                                                placeholder="Hobbies, obsessions, topics (e.g. brutalist architecture, ramen)"
                                                className="h-12 border-2 border-black rounded-none focus-visible:ring-accent focus-visible:ring-offset-0 font-medium bg-background"
                                                value={formData.interests}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="superpower" className="text-base font-bold uppercase tracking-wider">What is your unfair advantage?</Label>
                                            <Input
                                                id="superpower"
                                                name="superpower"
                                                placeholder="e.g. Debugging legacy code without crying"
                                                className="h-12 border-2 border-black rounded-none focus-visible:ring-accent focus-visible:ring-offset-0 font-medium bg-background"
                                                value={formData.superpower}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* STEP 2: PROOF OF WORK */}
                            {step === 2 && (
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <h2 className="text-3xl font-serif font-bold">Proof of Work</h2>
                                        <p className="text-muted-foreground">Talk is cheap. Show me what you've built (or broken).</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="projects" className="text-base font-bold uppercase tracking-wider">Key Projects & Links</Label>
                                            <Textarea
                                                id="projects"
                                                name="projects"
                                                placeholder="Drop GitHub/Behance links or describe 1 defining case study."
                                                className="min-h-[200px] border-2 border-black rounded-none focus-visible:ring-accent focus-visible:ring-offset-0 font-medium bg-background resize-none"
                                                value={formData.projects}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* STEP 3: THE METHOD (Formerly Step 2/3) */}
                            {step === 3 && (
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <h2 className="text-3xl font-serif font-bold">The Method</h2>
                                        <p className="text-muted-foreground">How do you turn chaos into order?</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="methodology" className="text-base font-bold uppercase tracking-wider">Describe your process</Label>
                                            <Textarea
                                                id="methodology"
                                                name="methodology"
                                                placeholder="1. Audit... 2. Deconstruct... 3. Rebuild..."
                                                className="min-h-[200px] border-2 border-black rounded-none focus-visible:ring-accent focus-visible:ring-offset-0 font-medium bg-background resize-none text-lg leading-relaxed"
                                                value={formData.methodology}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* STEP 4: THE SCARS (Formerly Step 2) */}
                            {step === 4 && (
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <h2 className="text-3xl font-serif font-bold">The Scars</h2>
                                        <p className="text-muted-foreground">Show me your scars. Trust is built on vulnerability.</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="majorFailure" className="text-base font-bold uppercase tracking-wider">Major Failure</Label>
                                            <Textarea
                                                id="majorFailure"
                                                name="majorFailure"
                                                placeholder="Describe a time you failed spectacularly."
                                                className="min-h-[100px] border-2 border-black rounded-none focus-visible:ring-accent focus-visible:ring-offset-0 font-medium bg-background resize-none"
                                                value={formData.majorFailure}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="lessonLearned" className="text-base font-bold uppercase tracking-wider">Lesson Learned</Label>
                                            <Textarea
                                                id="lessonLearned"
                                                name="lessonLearned"
                                                placeholder="What did you learn from the ashes?"
                                                className="min-h-[100px] border-2 border-black rounded-none focus-visible:ring-accent focus-visible:ring-offset-0 font-medium bg-background resize-none"
                                                value={formData.lessonLearned}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Actions */}
                    <div className="flex justify-between mt-10 pt-6 border-t border-border/50">
                        <Button
                            variant="ghost"
                            onClick={handleBack}
                            disabled={step === 0}
                            className={cn(
                                "text-lg font-bold hover:bg-transparent hover:text-accent disabled:opacity-0 transition-opacity",
                                step === 0 && "cursor-default"
                            )}
                        >
                            <ArrowLeft className="mr-2 h-5 w-5" />
                            Back
                        </Button>

                        <Button
                            onClick={handleNext}
                            disabled={isGenerating}
                            className="h-12 px-8 text-lg bg-foreground text-background hover:bg-foreground/90 rounded-none border-2 border-transparent hover:border-accent transition-all font-bold tracking-wide shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
                        >
                            {step === TOTAL_STEPS - 1 ? (
                                <>
                                    {isGenerating ? "Generating..." : "Generate Anti-Portfolio"}
                                    {!isGenerating && <Sparkles className="ml-2 h-5 w-5" />}
                                </>
                            ) : (
                                <>
                                    Next
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
