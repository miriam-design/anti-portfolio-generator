The Anti-Portfolio Generator 🧠

"The interviewer that knows you better than you know yourself."

This is the Generation Tool for the Anti-Portfolio project.It is an AI-powered web application built with Next.js and Google Gemini API that conducts a "psychological interview" with the user to distill their professional essence into a unique digital DNA.

The Output: A dna.json file that acts as the "soul" for the 3D Rendering Engine.

⚡ Prerequisites
Before you start, you need two things
1. Node.js 18+ installed on your machine.
2. A Google Gemini API Key (It's free).

How to get your Free API Key
1. Go to Google AI Studio.
2. Log in with your Google account.
3. Click "Create API Key".
4. Copy the key string (it starts with AIza...).

🛠️ Installation & Setup
Clone the repository:
git clone [https://github.com/miriam-design/anti-portfolio-generator.git](https://github.com/miriam-design/anti-portfolio-generator.git)
cd anti-portfolio-generator

Install dependencies:
npm install

Configure the Environment (Crucial Step):
- Create a new file in the root folder named .env.local.
- Open it and paste your API key like this:
GEMINI_API_KEY=Paste_Your_Key_Here_Without_Quotes

- Note: Never commit this file to GitHub! It is already in .gitignore for your safety.

Run the Generator:
npm run dev

Open http://localhost:3000 in your browser.

🧬 How to Use
1. Start the Interview: Click "Forge Your Anti-Portfolio" on the landing page.
2. The Inputs:You will be asked unconventional questions. Be honest.
    Context: Paste your raw CV or LinkedIn bio. The AI reads it to extract facts.
    The Hate: What industry trends annoy you? This defines your "Anti" stance.
    The Love: What are your obsessions? This defines your 3D visual style.
3. The Generation: Click "Generate". The tool will call Google Gemini to analyze your psychological profile and construct your Visual DNA.
4. The Export:Once you see your 3D preview, click the "SHIP IT / EXPORT" button in the top right corner.This will download a dna.json file.

🚀 What to do with the dna.json?
This file is your portable portfolio cartridge.To publish your site:
1. Clone the Anti-Portfolio Engine repository (the viewer).
2. Place your dna.json into the public/ folder of that engine.
3. Deploy the engine to Vercel/Netlify.
(See the Engine repository README for detailed deployment instructions)

🤖 AI Logic & Models
This tool uses a sophisticated "Chain of Thought" prompt to map semantic concepts to visual 3D parameters.
Current Model: gemma-3-12b-it
Why? This model offers significantly higher rate limits (30 RPM) on the free tier compared to standard Gemini Flash models.

🔄 How to Change the Model
You can easily switch to other models (like gemini-1.5-flash or gemini-2.0-flash-exp) by editing the code:
1. Open app/api/generate/route.ts.
2. Locate the genAI.getGenerativeModel configuration.
3. Change the model string:
const model = genAI.getGenerativeModel({
  // Change this string to "gemini-1.5-flash" or "gemini-2.0-flash-exp"
  model: "gemma-3-12b-it", 
});

Visual Logic
- Empathetic/Creative profiles → Round shapes, Glass/Liquid materials.
- Analytical/Dev profiles → Sharp shapes, Wireframe/Metal materials.
- High Energy/Chaos → Distorted textures, Holographic materials.

📄 License
MIT License. Built for the Vibe Coding Hackathon.