# 🎲 Emergency NPC Gen — Interactive DM Companion

[![React Version](https://img.shields.io/badge/React-19.0-blue?style=flat-square&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.21-lightgrey?style=flat-square&logo=express)](https://expressjs.com/)
[![Gemini API SDK](https://img.shields.io/badge/Google_GenAI_SDK-v2.4-e05397?style=flat-square&logo=google-gemini)](https://ai.google.dev/gemini-api)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)

**Emergency NPC** is a highly interactive, visual, and fast-paced improvised Non-Player Character (NPC) generator designed for Dungeon Masters (DMs) running tabletop rolepaying games. Built on a fully secure, full-stack architecture, it blends real-time client-side interactive widgets with advanced, structured LLM-driven generation and rigorous lore-accurate fallback validation.

This application serves as an exceptional showcase of full-stack engineering, combining secure server-side API proxy architectures, custom esbuild pipeline configurations, strict domain constraint enforcement, and responsive micro-interactions.

---

## 🚀 Key Features

*   **🎬 Dynamic "Slot Reel" Generator:** An immersive, state-driven character selector that delivers visual feedback and dice rolling sounds for randomized presets.
*   **🧠 Secure Intelligent Client-Server Handshake:** Server-side API proxy hides and protects API secrets from client-side vulnerability.
*   **⚡ Double-Tier Failover Engine:** When Generative AI services experience high demand or transient failures, the system seamlessly transitions into a high-fidelity local content builder that instantly compiles logical, theme-integrated characters without interrupting gameplay.
*   **📜 Extensive Lore-Intelligent Guardrails:**
    *   **Species Life Expectancy Scaling:** Synthesizes age inputs with precise D&D race lifespans (clamping unrealistic age limits and modifying descriptions dynamically, e.g., an extremely old Halfling vs. an Elf with a 750-year maximum).
    *   **Thematic Social Synergies:** Enforces logical connections—a wealthy noble always receives tailored premium clothes and esteemed professions, while impoverished commoners are styled in threadbare garments.
    *   **Prohibited Descriptive Attributes:** Avoids low-effort metallic hair generalizations (like gold, silver, bronze) in favor of realistic textures and pigments (ash-blonde, raven-black, titanium-white).
    *   **Selective Biological Terminology:** Restricts specialized reproductive stages like "hatchling" exclusively to reptilian, avian, or amphibious egg-laying races (such as Dragonborn, Kobold, Kenku).
*   **✨ Seamless UX & Micro-Animations:** Motion-driven layout transitions using `motion`, stylized visual selectors, custom theme palettes, and persistent local storage hooks to catalog generated characters in the DM’s ledger.

---

## 🛠️ The Tech Stack

This project is built from scratch utilizing standard production-grade tooling:

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | **React 19 & Vite** | Leveraging standard functional components, hooks, custom state registers, and modern SPA bundling. |
| **Backend Framework** | **Express (Node.js)** | Written directly in TypeScript as a lightweight, clean reverse-routing proxy. |
| **Styling & Assets** | **Tailwind CSS v4 & Lucide React** | Low-overhead utility classes, responsive mobile-first configurations, and clear UI iconography. |
| **Animation Engine** | **Motion** | Fluid transition effects, staggered lists, expanders, and modal animations. |
| **Core AI SDK** | **`@google/genai` (v2.4)** | Modern Google Generative AI integration utilizing strict structural JSON schemas for deterministic parsing. |
| **Compilation** | **esbuild & tsx** | Compiles backend environments into standard, bundled CJS outputs (`dist/server.cjs`) for clean execution on target hosts. |

---

## 🏗️ Architectural Overview

```
                      [ Client-Side App SPA ]
                                 │
                 (React 19 / Tailwind v4 / Motion)
                                 │
           POST /api/npc/generate │ (Custom payload inputs)
                                 ▼
                     [ Express Backend Server ]
               (Securely handles $GEMINI_API_KEY)
                                 │
                     ┌───────────┴───────────┐
                     ▼                       ▼
           [ Google Gemini API ]    [ Local Fallback Builder ]
          (Structured JSON Schema)   (Context-aware lore generator)
                     │                       │
                     └───────────┬───────────┘
                                 ▼
                    [ Structured NPC Profile ]
                     (Returned to Client App)
```

### 🔒 API Secret Securitization (Full-Stack Architecture)
A primary vulnerability of client-only single page applications is exposing sensitive third-party API credentials. This project strictly guarantees API key safety:
1.  All client requests proxy through Express (`/api/npc/generate`).
2.  The Google GenAI client is instantiated **only on the server**, keeping the `GEMINI_API_KEY` masked completely.
3.  Response models are parsed and validated on-the-fly before sending sanitize blocks to downstream browser renderers.

---

## 📝 Script Matrix

The workspace contains optimized tasks designed to ensure seamless developer workflows, bundle speed, and production readiness:

*   `npm run dev`: Bootstraps the development ecosystem using `tsx`, triggering live hot-reloads over port `3000`.
*   `npm run build`: Dual-bundling operation.
    1.  Compiles the static frontend React code using `vite build` into `/dist`.
    2.  Assembles the entire backend TypeScript codebase into a standalone, single-file CommonJS file `/dist/server.cjs` via `esbuild`. This bypasses strict ESM module checks, reduces server startup cold times, and supports seamless container deployments.
*   `npm run start`: Directly boots the production system with Native Node.js via `node dist/server.cjs`.
*   `npm run lint`: Performs rapid TypeScript static type checks with flags mapping non-emitting targets (`tsc --noEmit`).

---

## 🎯 Candidate Highlights (For Recruiters)

If you are reviewing this repository for technical proficiency, please take note of these implementation elements:

*   **Advanced Prompt Engineering & Guardrails**: The server-side Gemini invocation enforces strict, complex D&D tabletop guidelines (e.g., age curves, single-word personality structures, mundane-only starter equipment) returned inside a **strict JSON Schema configuration**. This avoids parser errors and guarantees visual layout matches.
*   **Clean React State & Modularization**: Shared type structures reside securely in `/src/types.ts`. Layout structures are split dynamically between static datasets in `/src/data.ts` and core visual logic.
*   **Zero-Lag Fallback Design**: If the model experiences a 503 "Service Unavailable" spike or rate limits, the app recovers instantly using a recursive fallback model that mirrors exact parameters (race, class, status) using local tabletop databases.
*   **Tailwind v4 Integration**: Leverages `@tailwindcss/vite` configuration for compiling fast stylesheets without external configuration files.
