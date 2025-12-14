import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  let formData: any = {};

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    formData = await req.json();

    if (!apiKey) {
      throw new Error("Missing API Key"); // Trigger fallback immediately
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

    // DEBUG: Check API Key presence
    console.log("Using API Key:", apiKey ? "Present (Length: " + apiKey.length + ")" : "Missing");

    const model = genAI.getGenerativeModel({
      model: "gemma-3-12b-it",
      // RIMOSSO generationConfig per evitare errore 400
    });

    // CONSTRUCTING THE FINAL PROMPT
    const systemInstruction = `
    You are the "Anti-Portfolio" Art Director and Generative Artist. Your job is to create a portfolio that is visually striking, cynical, and brutally honest.
    You do not apologize. You do not explain. You simply generate the JSON data that defines this person's digital soul.

    **JSON CONSTRAINTS (CRITICAL):**
    Your JSON output MUST adhere to these strict enums to be rendered correctly.
    
    1. **geometry_type** MUST be exactly one of:
       - 'sphere', 'icosahedron', 'pyramid', 'cluster', 'torus', 'capsule', 'organic-bulb', 'dna-helix', 'fluid-orb', 'knot', 'dodecahedron'

    2. **material_type** MUST be exactly one of:
       - 'wireframe', 'glass', 'metal', 'stone', 'hologram'
       - 'liquid', 'ceramic', 'matte', 'iridescent'

    3. **texture_style** MUST be exactly one of:
       - 'clean', 'distorted', 'rough'

    4. **movement_speed** MUST be exactly one of:
       - 'slow', 'medium', 'fast'

    5. **colors** object MUST include:
       - "bg": Hex code for background (AVOID pure grey #808080. Use deep rich darks or blinding lights).
       - "primary": Hex code for main shape color (High saturation).
       - "secondary": Hex code for details.


    **VISUAL VARIANCE RULES (PRIORITY WATERFALL):**
    Do not just look at the Job Title. Look at the WRITING STYLE (The Vibe). Follow this decision tree step-by-step to determine the final combination.

    **STEP 1: DETERMINE GEOMETRY (Based on Topic & Keywords)**
    Look at the semantic meaning of the inputs (Interests, Projects, Bio).
    - "Systems", "Network", "Architecture", "Backend" -> Prefer 'cluster' or 'dna-helix'.
    - "Chaos", "Viral", "Noise", "Disruption" -> Prefer 'knot' or 'fluid-orb'.
    - "Minimal", "Clean", "Precision", "Design" -> Prefer 'sphere' or 'capsule'.
    - "Empathy", "Human", "Organic", "Care" -> Prefer 'organic-bulb' or 'torus'.
    - "Growth", "Scale", "Solid", "Money" -> Prefer 'pyramid' or 'dodecahedron' or 'icosahedron'.
    *Fallback: If no clear topic, use 'icosahedron'.*

    **STEP 2: DETERMINE MATERIAL (Based on Vibe & Energy)**
    Now look at the writing style and "Heat".
    - High Energy / Excitement / Future -> 'hologram' or 'iridescent'.
    - Aggressive / Direct / Brutal -> 'stone' or 'wireframe' (if tech context).
    - Transparent / Honest / Open -> 'glass' or 'liquid'.
    - Solid / Professional / Grounded -> 'metal' or 'ceramic'.
    - Mysterious / Dark / Hidden -> 'matte' or 'wireframe'.

    **STEP 3: DETERMINE MODIFIERS (Based on Sentence Structure)**
    - Short, punchy sentences? -> Set movement_speed to 'fast', texture_style to 'clean' or 'rough'.
    - Long, poetic, or complex sentences? -> Set movement_speed to 'slow', texture_style to 'distorted'.

    **STEP 4: CROSS-CHECK (The "Remix" Rule)**
    - If you selected a 'sphere' (Soft) but the vibe is Aggressive, keep the sphere but make it 'stone' or 'wireframe' (Heavy).
    - If you selected a 'pyramid' (Sharp) but the vibe is Empathetic, keep the pyramid but make it 'glass' or 'liquid' (Soft).
    - **GOAL:** Create unexpected contrasts.


   **BREAK THE STEREOTYPES:**
       - A "Marketer" isn't always chaotic. If they write precisely, give them a crystal structure.
       - A "Developer" isn't always dark/green. If they love frontend, give them 'hologram' and 'purple'.
    
   **SINGLE TOTEM RULE (CRITICAL)**:
       - The 3D form must ALWAYS be a single, unified object.
       - It is a "Totem" of identity, ONE solid concept.

  **PROFILING EXAMPLES:**

    **Profile: "Creative Designer"**
    { 
      "geometry_type": "organic-bulb", 
      "material_type": "glass", 
      "texture_style": "clean",
      "movement_speed": "slow",
      "colors": { "bg": "#f0f0f0", "primary": "#ff00ff", "secondary": "#00ffff" } 
    }

    **Profile: "Empathetic IT Manager"**
    { 
      "geometry_type": "sphere", 
      "material_type": "wireframe", 
      "texture_style": "rough",
      "movement_speed": "medium",
      "colors": { "bg": "#0a0a0a", "primary": "#00ffcc", "secondary": "#444444" } 
    }

    **Profile: "Chaotic Founder"**
    { 
      "geometry_type": "cluster", 
      "material_type": "metal", 
      "texture_style": "distorted", 
      "movement_speed": "fast",
      "colors": { "bg": "#120024", "primary": "#ffaa00", "secondary": "#ff0000" } 
    }

    Your output MUST be valid JSON. Do not include markdown formatting (like \`\`\`json). Just the raw JSON string.
    `;

    const userContext = `
    USER PROFILE:
    - Name: ${formData.fullName}
    - Tagline/Vibe: ${formData.tagline || "N/A"}
    - Superpower: ${formData.superpower || "N/A"}
    - Interests: ${formData.interests || "N/A"}
    - Hated Trends: ${formData.hatedTrends || "N/A"}
    - Bio/Context: ${formData.cvContext || "N/A"}
    - Raw Projects Data: ${formData.projects || "N/A"}
    - Major Failure: ${formData.majorFailure || "N/A"}
    - Lesson Learned: ${formData.lessonLearned || "N/A"}
    - Methodology: ${formData.methodology || "N/A"}
    `;

    const jsonStructure = `
    REQUIRED JSON STRUCTURE:
    {
      "hero": {
        "headline": "Short, punchy, aggressive or mysterious headline",
        "subheadline": "A subheadline that adds context or insult"
      },
      "about": {
        "story": "A 2-3 sentence bio that cuts through the noise. Third person.",
        "anti_traits": ["Trait 1", "Trait 2", "Trait 3"]
      },
      "projects": [
        {
          "title": "Project Name",
          "description": "Short description focusing on impact or chaos.",
          "link": "URL if found in input, else empty string",
          "tech_or_tools": ["Tool1", "Tool2"]
        }
      ],
      "methodology": {
        "name": "Name of their unique process (e.g. 'The Chaos Engine')",
        "steps": [
          { "title": "Step 1", "description": "..." },
          { "title": "Step 2", "description": "..." },
          { "title": "Step 3", "description": "..." }
        ]
      },
      "failures": {
        "title": "Failures & Lessons",
        "stories": [
          { "failure": "Description of the failure", "lesson": "The brutal lesson learned" }
        ]
      },
      "personal_side": {
        "loves": ["Thing 1", "Thing 2"],
        "hates": ["Thing 1", "Thing 2"]
      },
      "visual_dna": {
        "geometry_type": "'sphere' | 'organic-bulb' | 'tech-pill' | 'icosahedron' | 'pyramid' | 'cluster' | 'dna-helix' | 'fluid-orb'",
        "material_type": "'glass' | 'wireframe' | 'metal' | 'stone' | 'hologram'",
        "texture_style": "'clean' | 'distorted' | 'rough'",
        "movement_speed": "'slow' | 'medium' | 'fast'",
        "colors": {
          "primary": "Hex or HSL string (e.g. 'hsl(200, 100%, 50%)')",
          "secondary": "Hex or HSL string",
          "bg": "Hex or HSL string"
        }
      }
    }
    `;

    const finalPrompt = `${systemInstruction}\n\n${userContext}\n\n${jsonStructure}\n\nGenerate the JSON now.`;

    try {
      console.log("Attempting to generate content with Gemini...");
      const result = await model.generateContent(finalPrompt);
      console.log("Gemini generation successful.");
      let responseText = result.response.text();
      // Pulisci markdown code blocks se presenti
      responseText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
      if (responseText.startsWith('`')) responseText = responseText.slice(1);
      if (responseText.endsWith('`')) responseText = responseText.slice(0, -1);
      const jsonResponse = JSON.parse(responseText);

      // Inject the original full name from input
      jsonResponse.name = formData.fullName;

      return NextResponse.json(jsonResponse);
    } catch (apiError: any) {
      console.error("GEMINI API ERROR DETAILS:", {
        message: apiError.message,
        status: apiError.status,
        statusText: apiError.statusText,
        stack: apiError.stack
      });
      throw apiError; // Re-throw to trigger the outer catch (Fallback)
    }

  } catch (error) {
    console.error("Error generating Anti-Portfolio:", error);
    console.warn("Falling back to SMART MOCK DATA.");

    // SMART FALLBACK LOGIC
    const textDump = ((formData.interests || "") + (formData.hatedTrends || "") + (formData.cvContext || "") + (formData.projects || "")).toLowerCase();

    // 1. Extract Link (Naive Regex)
    const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/g;
    const foundLinks = textDump.match(urlRegex);
    const userLink = foundLinks ? foundLinks[0] : ""; // Default to empty if no link found

    // 2. Generate Hash for Uniqueness (Simple DJB2-ish hash)
    let hash = 0;
    for (let i = 0; i < textDump.length; i++) {
      hash = ((hash << 5) - hash) + textDump.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }
    const seed = Math.abs(hash);

    // 3. Dynamic Visual DNA based on Seed
    const geometryTypes = ['sphere', 'torus', 'icosahedron', 'capsule', 'pyramid', 'cluster', 'dna-helix', 'fluid-orb'];
    const materialTypes = ['glass', 'wireframe', 'metal', 'stone', 'hologram'];
    const textureStyles = ['clean', 'distorted', 'rough'];
    const speeds = ['slow', 'medium', 'fast'];

    const geometryType = geometryTypes[seed % geometryTypes.length];
    const materialType = materialTypes[(seed >> 1) % materialTypes.length];
    const textureStyle = textureStyles[(seed >> 2) % textureStyles.length];
    const movementSpeed = speeds[(seed >> 3) % speeds.length];

    // Generate HSL colors based on seed
    const hue1 = seed % 360;
    const hue2 = (seed + 180) % 360;
    const primaryColor = `hsl(${hue1}, 70%, 50%)`;
    const secondaryColor = `hsl(${hue2}, 80%, 60%)`;
    const bgColor = `hsl(${hue1}, 30%, 10%)`;

    // PROCEDURAL COPY GENERATION (Smart Fallback)
    // We construct the "AI" copy by parsing the raw inputs directly.

    const fallbackHeadline = formData.tagline || `${formData.fullName}'s Anti-Portfolio`;
    const fallbackSubheadline = formData.superpower
      ? `Built on ${formData.superpower}. Allergic to ${formData.hatedTrends ? formData.hatedTrends.split(' ')[0] : "mediocrity"}.`
      : `Operating at the edge of ${formData.interests || "the unknown"}.`;

    const fallbackStory = formData.cvContext
      ? `${formData.fullName || "The Operator"} has a simple philosophy: ${formData.cvContext.substring(0, 100)}...`
      : `${formData.fullName} refuses to fit in the box. Driven by ${formData.interests}, this is a rejection of the standard path.`;

    const mockData = {
      hero: {
        headline: fallbackHeadline,
        subheadline: fallbackSubheadline
      },
      about: {
        story: fallbackStory,
        anti_traits: [
          formData.interests ? formData.interests.split(' ')[0] : "Visionary",
          formData.hatedTrends ? "Anti-" + formData.hatedTrends.split(' ')[0] : "No-Compromise",
          "Unfiltered"
        ]
      },
      projects: [
        {
          "title": "Selected Work",
          "description": formData.projects || "A curated selection of defining projects.",
          "link": userLink,
          "tech_or_tools": ["Concept", "Execution", "Impact"]
        }
      ],
      methodology: {
        name: "The Process",
        steps: [
          { "title": "Input", "description": formData.methodology ? formData.methodology.substring(0, 50) + "..." : "Absorb the raw data." },
          { "title": "Synthesis", "description": "Distill the signal from the noise." },
          { "title": "Output", "description": "Render the truth." }
        ]
      },
      failures: {
        title: "Retrospective",
        stories: [{
          "failure": formData.majorFailure || "Trusted the process too much.",
          "lesson": formData.lessonLearned || "Process is a crutch for the unimaginative."
        }]
      },
      personal_side: {
        "loves": [formData.interests || "Typography"],
        "hates": [formData.hatedTrends || "Comic Sans"]
      },
      visual_dna: {
        geometry_type: geometryType as any,
        material_type: materialType as any,
        texture_style: textureStyle as any,
        movement_speed: movementSpeed as any,
        colors: {
          primary: primaryColor,
          secondary: secondaryColor,
          bg: bgColor
        }
      }
    };

    return NextResponse.json(mockData, { headers: { 'X-Generated-By': 'Procedural-Fallback' } });
  }
}
