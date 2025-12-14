"use client";

import { Canvas } from "@react-three/fiber";
import {
    OrbitControls,
    Float,
    PerspectiveCamera,
    Sphere,
    TorusKnot,
    Icosahedron,
    Capsule,
    Cone,
    Cylinder,
    Box,
    MeshTransmissionMaterial,
    MeshDistortMaterial,
    Environment,
    Cloud,
    Stars
} from "@react-three/drei";
import { useState, useEffect } from "react";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown, ExternalLink, Rocket, Heart, ThumbsDown } from "lucide-react";
import { IdentityManifest } from "@/lib/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { DeployModal } from "@/components/anti-ui/DeployModal";
import { Button } from "@/components/ui/button";

// --- 3D COMPONENTS ---
const TotemComposer = ({ dna, hoveredSection }: { dna: IdentityManifest['visual_dna'], hoveredSection: string | null }) => {

    // 1. Data Normalization (Crucial for robust rendering)
    const safeDNA = {
        geometry: (dna?.geometry_type || 'sphere').toLowerCase(),
        material: (dna?.material_type || 'glass').toLowerCase(),
        color: dna?.colors?.primary || '#6d28d9',
        bg: dna?.colors?.bg || '#000000',
        speed: dna?.movement_speed === 'fast' ? 5
            : dna?.movement_speed === 'slow' ? 1.0
                : 2.5, // Medium speed optimized
        roughness: 0.2 // default shiny
    };

    // Animation Settings
    const floatSpeed = safeDNA.speed;
    const rotationIntensity = hoveredSection ? 2 : 0.5;

    // Material Props
    // We explicitly use the safely parsed colors for the 3D materials to avoid "black/grey" issues
    const primaryColor = safeDNA.color;
    const secondaryColor = dna?.colors?.secondary || safeDNA.color; // Fallback to primary if secondary missing
    const activeColor = hoveredSection ? secondaryColor : primaryColor;

    // Helper to render the hybrid material based on logic
    const renderMaterial = () => {
        // Hybrid Logic: Always use high-end shaders, just tweak parameters
        if (safeDNA.material === 'wireframe') {
            return (
                <MeshDistortMaterial
                    color={primaryColor}
                    emissive={secondaryColor}
                    emissiveIntensity={2}
                    wireframe={true}
                    distort={0.4}
                    speed={floatSpeed}
                    roughness={0.1}
                />
            );
        }

        if (safeDNA.material === 'glass') {
            return (
                <MeshTransmissionMaterial
                    background={new THREE.Color(safeDNA.bg)}
                    color={primaryColor}
                    thickness={2}
                    roughness={0}
                    chromaticAberration={1}
                    distortion={1.5}
                    anisotropy={0.5}
                />
            );
        }

        if (safeDNA.material === 'metal') {
            return (
                <meshStandardMaterial
                    color={primaryColor}
                    metalness={0.6} // Reduced from 1.0 to let color show through
                    roughness={0.2}
                    emissive={primaryColor} // Self-illuminate with main color
                    emissiveIntensity={0.2}
                    envMapIntensity={1.5}
                />
            );
        }

        if (safeDNA.material === 'hologram') {
            return (
                <MeshTransmissionMaterial
                    distortion={0.5}
                    temporalDistortion={0.5}
                    thickness={1}
                    transmission={1}
                    chromaticAberration={2}
                    color={primaryColor}
                    emissive={primaryColor}
                    emissiveIntensity={1.5}
                    toneMapped={false}
                />
            );
        }

        if (safeDNA.material === 'stone') {
            return (
                <meshStandardMaterial
                    color={primaryColor}
                    roughness={0.9}
                    metalness={0.1}
                />
            );
        }

        if (safeDNA.material === 'liquid') {
            return (
                <MeshDistortMaterial
                    color={primaryColor}
                    speed={2}
                    distort={0.6}
                    radius={1}
                    metalness={0.9} // Liquid metal
                    roughness={0.1}
                    envMapIntensity={2}
                />
            );
        }

        if (safeDNA.material === 'ceramic') {
            return (
                <meshStandardMaterial
                    color={primaryColor}
                    roughness={0.2} // Smooth and shiny
                    metalness={0} // Not metallic
                    envMapIntensity={1}
                />
            );
        }

        if (safeDNA.material === 'matte') {
            return (
                <meshStandardMaterial
                    color={primaryColor}
                    roughness={1} // Totally flat
                    metalness={0}
                    flatShading={true} // Brutalist look
                />
            );
        }

        if (safeDNA.material === 'iridescent') {
            return (
                <meshPhysicalMaterial
                    color={primaryColor}
                    roughness={0.2}
                    metalness={0.1}
                    transmission={0.2} // Slight see-through
                    iridescence={1}
                    iridescenceIOR={1.8}
                    iridescenceThicknessRange={[100, 400]}
                    emissive={secondaryColor}
                    emissiveIntensity={0.2}
                />
            );
        }

        // Default Fallback
        return (
            <meshStandardMaterial
                color={primaryColor}
                roughness={0.5}
                metalness={0.5}
            />
        );
    };

    // Render Logic wrapped in Float
    return (
        <Float
            speed={floatSpeed}
            rotationIntensity={rotationIntensity}
            floatIntensity={hoveredSection ? 1.5 : 0.5}
        >
            {/* Conditional Geometry Rendering */}

            {/* STANDARD BASICS */}
            {safeDNA.geometry === 'sphere' && <Sphere args={[1.5, 64, 64]}>{renderMaterial()}</Sphere>}
            {safeDNA.geometry === 'torus' && <TorusKnot args={[1, 0.3, 128, 16]}>{renderMaterial()}</TorusKnot>}
            {safeDNA.geometry === 'icosahedron' && <Icosahedron args={[1.5, 0]}>{renderMaterial()}</Icosahedron>}
            {safeDNA.geometry === 'capsule' && <Capsule args={[0.7, 1.5, 4, 8]}>{renderMaterial()}</Capsule>}
            {safeDNA.geometry === 'pyramid' && <Cone args={[1.5, 2.5, 4]}>{renderMaterial()}</Cone>}

            {/* NEW ORGANIC / TECH SHAPES */}

            {/* Organic Bulb: High res sphere */}
            {safeDNA.geometry === 'organic-bulb' && (
                <Sphere args={[1.4, 128, 128]}>
                    <MeshDistortMaterial
                        color={primaryColor}
                        emissive={secondaryColor}
                        emissiveIntensity={0.5}
                        distort={0.4}
                        speed={2}
                        roughness={0.1}
                    />
                </Sphere>
            )}

            {/* Tech Pill */}
            {safeDNA.geometry === 'tech-pill' && (
                <Capsule args={[0.6, 1.8, 8, 16]}>
                    {renderMaterial()}
                </Capsule>
            )}

            {/* Matrix Cloud */}
            {safeDNA.geometry === 'matrix-cloud' && (
                <group>
                    <Cloud opacity={0.5} speed={0.4} segments={20} bounds={[2, 2, 2]} volume={1} />
                    {/* Add some solid bits in the cloud */}
                    <Float speed={10} rotationIntensity={5} floatIntensity={5}>
                        <Sphere args={[0.2, 16, 16]} position={[1, 0, 0]}>
                            <meshStandardMaterial color={activeColor} emissive={activeColor} emissiveIntensity={2} />
                        </Sphere>
                        <Sphere args={[0.3, 16, 16]} position={[-1, 0.5, 0.5]}>
                            <meshBasicMaterial color="white" wireframe />
                        </Sphere>
                    </Float>
                </group>
            )}

            {/* Cluster (Enhanced) */}
            {safeDNA.geometry === 'cluster' && (
                <group>
                    <Box args={[1, 1, 1]} position={[-0.5, 0, 0]} rotation={[0.5, 0.5, 0]}>{renderMaterial()}</Box>
                    <Box args={[0.8, 0.8, 0.8]} position={[0.8, 0.5, 0.5]} rotation={[0, 1, 0.5]}>{renderMaterial()}</Box>
                    <Box args={[0.5, 0.5, 0.5]} position={[0.2, -0.8, -0.2]} rotation={[1, 0, 0]}>{renderMaterial()}</Box>
                    <Icosahedron args={[0.4, 0]} position={[0, 0, 1.2]}>{renderMaterial()}</Icosahedron>
                </group>
            )}

            {/* DNA Helix (Enhanced) */}
            {safeDNA.geometry === 'dna-helix' && (
                <group rotation={[0, 0, 0.5]}>
                    <Cylinder args={[0.2, 0.2, 4, 16]} position={[0.5, 0, 0]} >{renderMaterial()}</Cylinder>
                    <Cylinder args={[0.2, 0.2, 4, 16]} position={[-0.5, 0, 0]} >{renderMaterial()}</Cylinder>
                    {/* Cross-links simplified */}
                    {[...Array(5)].map((_, i) => (
                        <Box key={i} args={[1.2, 0.1, 0.1]} position={[0, (i - 2) * 0.8, 0]} rotation={[0, i * 0.5, 0]}>
                            <meshBasicMaterial color={activeColor} />
                        </Box>
                    ))}
                </group>
            )}

            {safeDNA.geometry === 'fluid-orb' && (
                <Sphere args={[1.4, 128, 128]}>
                    <MeshDistortMaterial
                        color={activeColor}
                        distort={0.8}
                        speed={3}
                        roughness={0.1}
                        metalness={1}
                    />
                </Sphere>
            )}
        </Float>
    );
};

// --- MAIN PAGE ---

export default function PreviewPage() {
    const [data, setData] = useState<IdentityManifest | null>(null);
    const [hoveredSection, setHoveredSection] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeModal, setActiveModal] = useState<string | null>(null);
    const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);

    useEffect(() => {
        async function loadData() {
            try {
                // 1. Try to fetch static data (Engine Mode)
                const response = await fetch('/data.json');
                if (response.ok) {
                    const jsonData = await response.json();
                    setData(jsonData);
                    setLoading(false);
                    return;
                }
            } catch (e) {
                // Silent failure on fetch, proceed to fallback
            }

            // 2. Fallback to localStorage (Builder Mode)
            const stored = localStorage.getItem('portfolioData');
            if (stored) {
                try {
                    setData(JSON.parse(stored));
                } catch (e) {
                    console.error("Failed to parse portfolio data", e);
                }
            }
            setLoading(false);
        }

        loadData();
    }, []);

    // Loading State
    if (loading || !data) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-black text-white font-mono">
                <p className="animate-pulse">INITIALIZING NEURAL LINK...</p>
            </div>
        );
    }

    const { visual_dna, hero, about, projects, failures, methodology, personal_side } = data;

    // Safety Fallback for Colors - Redundant but keeps UI code clean if accessed directly
    const safeColors = visual_dna.colors || {
        primary: (visual_dna as any).main_color || '#ffffff',
        secondary: (visual_dna as any).accent_color || '#888888',
        bg: (visual_dna as any).main_color || '#000000'
    };

    // Calculate background darkness for Stars
    const isDarkBg = safeColors.bg.startsWith('#') && parseInt(safeColors.bg.replace('#', ''), 16) < 0x444444;

    // Dynamic Styles for Container
    const containerStyle = {
        // We let Canvas handle the background color now for 3D consistency,
        // but keep this for UI transition reference if needed or fallback
        backgroundColor: safeColors.bg,
        color: isDarkBg ? 'white' : 'black', // Default to white text for contrast on dark "anti-portfolios"
    };

    return (
        <div className="relative w-full h-screen overflow-hidden transition-colors duration-1000" style={containerStyle}>

            {/* 3D SCENE */}
            <div className="absolute inset-0 z-0">
                <Canvas dpr={[1, 2]}>
                    <color attach="background" args={[safeColors.bg]} />
                    {/* Add Stars if dark background for depth */}
                    {isDarkBg && <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />}

                    <PerspectiveCamera makeDefault position={[0, 0, 5]} />
                    <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 1.5} minPolarAngle={Math.PI / 3} />

                    {/* Lighting - IMPROVED FOR VISIBILITY */}
                    <ambientLight intensity={0.5} />
                    <spotLight position={[10, 10, 10]} angle={0.25} penumbra={1} intensity={1.5} color={safeColors.primary} />
                    <pointLight position={[-10, -10, -10]} intensity={1} color="white" />

                    {/* Environment for Reflections (Critical for Metal/Glass) */}
                    <Environment preset="city" />

                    {/* The Soul Component */}
                    <TotemComposer dna={visual_dna} hoveredSection={hoveredSection} />
                </Canvas>
            </div>

            {/* UI OVERLAY */}
            <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-8 md:p-12">

                {/* Header */}
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase font-serif">
                            {hero.headline}
                        </h1>
                        <p className="text-sm md:text-base font-mono opacity-70 mt-2 max-w-md">
                            {hero.subheadline}
                        </p>
                    </div>
                    <div className="text-right pointer-events-auto flex items-start gap-4">

                        {/* SHIP IT BUTTON */}
                        <Button
                            onClick={() => setIsDeployModalOpen(true)}
                            className="bg-green-500 hover:bg-green-400 text-black font-mono font-bold uppercase tracking-widest hidden md:flex items-center gap-2"
                        >
                            <Rocket className="w-4 h-4" />
                            Ship It / Export
                        </Button>

                        <div>
                            <div className="text-xs font-mono opacity-50 mb-1">VISUAL DNA</div>
                            <div className="flex gap-2 justify-end">
                                {/* Dot 1: Background Color */}
                                <div className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: safeColors.bg }} title="Background"></div>
                                {/* Dot 2: Shape/Primary Color */}
                                <div className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: safeColors.primary }} title="Soul Shape"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Areas */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-10">

                    {/* Bottom Left: Identity */}
                    <div className="pointer-events-auto">
                        <div className="text-xs font-mono opacity-50 mb-2">OPERATOR</div>
                        <h2 className="text-2xl font-bold uppercase">{data.name || about.story.split(' ')[0]}</h2>
                        <div className="flex flex-col gap-2 mt-3">
                            {/* LOVES */}
                            <div className="flex flex-wrap gap-2 items-center">
                                <Heart className="w-3 h-3 md:w-4 md:h-4 text-red-500 fill-current" />
                                {personal_side?.loves?.slice(0, 3).map((love, i) => (
                                    <span key={i} className="px-2 py-0.5 border border-current text-[10px] md:text-xs font-bold uppercase rounded-full">
                                        {love}
                                    </span>
                                ))}
                            </div>

                            {/* HATES */}
                            <div className="flex flex-wrap gap-2 items-center opacity-70">
                                <ThumbsDown className="w-3 h-3 md:w-4 md:h-4" />
                                {personal_side?.hates?.slice(0, 3).map((hate, i) => (
                                    <span key={i} className="px-2 py-0.5 border border-current bg-current/10 text-[10px] md:text-xs font-bold uppercase rounded-full line-through decoration-1">
                                        {hate}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Bottom Right: Navigation / Details */}
                    <div className="pointer-events-auto max-w-md w-full">
                        <div className="space-y-4 text-right">

                            {/* Section: Methodology (Philosophy) */}
                            <div
                                className="group cursor-pointer"
                                onMouseEnter={() => setHoveredSection("philosophy")}
                                onMouseLeave={() => setHoveredSection(null)}
                                onClick={() => setActiveModal("philosophy")}
                            >
                                <h3 className="text-xl font-bold uppercase opacity-50 group-hover:opacity-100 transition-opacity">
                                    01. Philosophy
                                </h3>
                                {hoveredSection === "philosophy" && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-sm mt-2 font-mono border-r-2 border-current pr-4 py-2"
                                    >
                                        <p className="font-bold">{methodology.name}</p>
                                        <p className="opacity-80 mt-1">{methodology.steps[0]?.description}</p>
                                        <p className="text-[10px] mt-2 uppercase tracking-widest opacity-60">Click to expand</p>
                                    </motion.div>
                                )}
                            </div>

                            {/* Section: Output (Projects) */}
                            <div
                                className="group cursor-pointer"
                                onMouseEnter={() => setHoveredSection("work")}
                                onMouseLeave={() => setHoveredSection(null)}
                                onClick={() => setActiveModal("work")}
                            >
                                <h3 className="text-xl font-bold uppercase opacity-50 group-hover:opacity-100 transition-opacity">
                                    02. Output
                                </h3>
                                {hoveredSection === "work" && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-sm mt-2 font-mono border-r-2 border-current pr-4 py-2"
                                    >
                                        {projects.slice(0, 2).map((p, i) => (
                                            <div key={i} className="mb-2">
                                                <p className="font-bold">{p.title}</p>
                                                <p className="opacity-70 text-xs">{p.description.substring(0, 60)}...</p>
                                            </div>
                                        ))}
                                        <p className="text-[10px] mt-2 uppercase tracking-widest opacity-60">Click to expand</p>
                                    </motion.div>
                                )}
                            </div>

                            {/* Section: Failures (Data) */}
                            <div
                                className="group cursor-pointer"
                                onMouseEnter={() => setHoveredSection("failures")}
                                onMouseLeave={() => setHoveredSection(null)}
                                onClick={() => setActiveModal("failures")}
                            >
                                <h3 className="text-xl font-bold uppercase opacity-50 group-hover:opacity-100 transition-opacity">
                                    03. Failures
                                </h3>
                                {hoveredSection === "failures" && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-sm mt-2 font-mono border-r-2 border-current pr-4 py-2"
                                    >
                                        <p className="font-bold">{failures.title}</p>
                                        <p className="opacity-80 italic">"{failures.stories[0]?.lesson}"</p>
                                        <p className="text-[10px] mt-2 uppercase tracking-widest opacity-60">Click to expand</p>
                                    </motion.div>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* MODALS */}
            <DeployModal
                isOpen={isDeployModalOpen}
                onClose={() => setIsDeployModalOpen(false)}
                data={data}
            />

            <Dialog open={!!activeModal} onOpenChange={() => setActiveModal(null)}>
                <DialogContent className={`max-w-2xl border-2 ${isDarkBg ? 'bg-black text-white border-white' : 'bg-white text-black border-black'}`}>
                    <DialogHeader>
                        <DialogTitle className="text-3xl font-serif font-bold uppercase mb-4">
                            {activeModal === 'philosophy' && methodology.name}
                            {activeModal === 'work' && "Selected Works"}
                            {activeModal === 'failures' && failures.title}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="max-h-[60vh] overflow-y-auto pr-4 space-y-6">
                        {/* PHILOSOPHY MODAL */}
                        {activeModal === 'philosophy' && (
                            <div className="space-y-6">
                                {methodology.steps.map((step, i) => (
                                    <div key={i} className="border-l-2 border-current pl-4">
                                        <h4 className="text-lg font-bold uppercase">{`0${i + 1}. ${step.title}`}</h4>
                                        <p className="opacity-80 mt-1 leading-relaxed">{step.description}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* WORK MODAL */}
                        {activeModal === 'work' && (
                            <div className="grid grid-cols-1 gap-6">
                                {projects.map((p, i) => (
                                    <div key={i} className="p-4 border border-current/20 hover:border-current transition-colors">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="text-xl font-bold">{p.title}</h4>
                                            {p.link && (
                                                <a
                                                    href={p.link.startsWith('http') ? p.link : `https://${p.link}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center text-xs uppercase font-bold border border-current px-2 py-1 hover:bg-current hover:text-inherit transition-colors"
                                                    style={{
                                                        color: isDarkBg ? 'white' : 'black',
                                                        backgroundColor: 'transparent'
                                                    }}
                                                >
                                                    Visit <ExternalLink className="ml-1 w-3 h-3" />
                                                </a>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {p.tech_or_tools.map((t, ti) => (
                                                <span key={ti} className="text-[10px] uppercase tracking-wider opacity-60 bg-current/10 px-1">{t}</span>
                                            ))}
                                        </div>
                                        <p className="opacity-80 text-sm leading-relaxed">{p.description}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* FAILURES MODAL */}
                        {activeModal === 'failures' && (
                            <div className="space-y-8">
                                {failures.stories.map((story, i) => (
                                    <div key={i} className="relative">
                                        <div className="absolute -left-4 top-0 text-4xl opacity-10">"{i + 1}</div>
                                        <h4 className="text-lg font-bold mb-2">The Incident</h4>
                                        <p className="opacity-80 mb-4 font-mono text-sm">{story.failure}</p>
                                        <div className="bg-current/5 p-4 border-l-4 border-current">
                                            <h5 className="text-xs uppercase font-bold mb-1 opacity-50">The Lesson</h5>
                                            <p className="italic font-serif text-lg">"{story.lesson}"</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

        </div>
    );
}
