/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { SettingTheme } from "../types";

interface NpcAvatarProps {
  name: string;
  race: string;
  gender: string;
  hairStyleColor: string;
  clothingStyleColor: string;
  theme: SettingTheme;
}

// Simple color helper that checks text keywords to match colors dynamically
function parseColor(text: string, defaultColor: string): string {
  const t = text.toLowerCase();
  if (t.includes("pink") || t.includes("magenta")) return "#ec4899";
  if (t.includes("lime") || t.includes("neon-green") || t.includes("green")) {
    if (t.includes("lime")) return "#84cc16";
    if (t.includes("forest") || t.includes("moss") || t.includes("emerald")) return "#065f46";
    return "#10b981";
  }
  if (t.includes("red") || t.includes("crimson") || t.includes("fiery") || t.includes("burgundy")) return "#dc2626";
  if (t.includes("orange") || t.includes("copper") || t.includes("auburn")) return "#ea580c";
  if (t.includes("gold") || t.includes("yellow") || t.includes("golden")) return "#eab308";
  if (t.includes("silver") || t.includes("ash") || t.includes("gray") || t.includes("grey") || t.includes("steel")) return "#9ca3af";
  if (t.includes("blue") || t.includes("cyan") || t.includes("teal") || t.includes("indigo")) {
    if (t.includes("teal")) return "#14b8a6";
    if (t.includes("indigo")) return "#6366f1";
    return "#3b82f6";
  }
  if (t.includes("purple") || t.includes("violet") || t.includes("plum")) return "#a855f7";
  if (t.includes("black") || t.includes("charcoal") || t.includes("dark") || t.includes("obsidian")) return "#1f2937";
  if (t.includes("white") || t.includes("pearl")) return "#f9fafb";
  if (t.includes("brown") || t.includes("leather") || t.includes("earth")) return "#78350f";

  return defaultColor;
}

export const NpcAvatar: React.FC<NpcAvatarProps> = ({
  name,
  race,
  gender,
  hairStyleColor,
  clothingStyleColor,
  theme
}) => {
  const lowercaseRace = race.toLowerCase();
  
  // Decide colors based on descriptive keywords or fallback
  const hairColor = parseColor(hairStyleColor, "#f59e0b"); // default golden
  const clothingColor = parseColor(clothingStyleColor, "#374151"); // default grey slate
  
  // Theme Background Gradients
  const getThemeGradient = (t: SettingTheme) => {
    switch (t) {
      case "Fantasy":
        return { start: "#7c2d12", end: "#0f172a", border: "#f59e0b" }; // Warm firey slate
      case "Sci-Fi":
        return { start: "#1e1b4b", end: "#0f172a", border: "#3b82f6" }; // Dark cobalt deep space
      case "Steampunk":
        return { start: "#78350f", end: "#1c1917", border: "#ca8a04" }; // Brass copper brown
      case "Cyberpunk":
        return { start: "#581c87", end: "#090514", border: "#ec4899" }; // Neon magenta purple
      case "Grimdark":
        return { start: "#1c1c1c", end: "#020202", border: "#4b5563" }; // Cold ash gray black
    }
  };

  const bgSpec = getThemeGradient(theme);

  // Features based on Race
  const isElf = lowercaseRace.includes("elf") || lowercaseRace.includes("gnome") || lowercaseRace.includes("gith") || lowercaseRace.includes("shadar") || lowercaseRace.includes("eladrin") || lowercaseRace.includes("kender") || lowercaseRace.includes("tiefling") || lowercaseRace.includes("aasimar");
  const isDwarf = lowercaseRace.includes("dwarf") || lowercaseRace.includes("orc") || lowercaseRace.includes("goblin") || lowercaseRace.includes("bugbear") || lowercaseRace.includes("kobold") || lowercaseRace.includes("duergar") || lowercaseRace.includes("goliath") || lowercaseRace.includes("lizardfolk") || lowercaseRace.includes("giff") || lowercaseRace.includes("loxodon");
  const isRobot = lowercaseRace.includes("android") || lowercaseRace.includes("golem") || lowercaseRace.includes("synthetic") || lowercaseRace.includes("machine") || lowercaseRace.includes("gilded") || lowercaseRace.includes("warforged") || lowercaseRace.includes("autognome");

  // Determine avatar head shape / ears
  const headWidth = 100;
  const headHeight = 110;

  return (
    <svg
      id={`avatar-${name.replace(/\s+/g, "-").toLowerCase()}`}
      viewBox="0 0 240 240"
      className="w-full h-full max-w-[200px] max-h-[200px] border-2 rounded-xl shadow-inner mx-auto bg-slate-900 transition-all duration-300"
      style={{ borderColor: bgSpec.border }}
    >
      <defs>
        {/* Radial Background Gradient */}
        <radialGradient id={`bgGrad-${name}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={bgSpec.start} />
          <stop offset="100%" stopColor={bgSpec.end} />
        </radialGradient>
        {/* Hair gradient */}
        <linearGradient id={`hairGrad-${name}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={hairColor} />
          <stop offset="100%" stopColor={hairColor} stopOpacity={0.7} />
        </linearGradient>
        {/* Metal gradient for robots */}
        <linearGradient id={`metalGrad-${name}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#d1d5db" />
          <stop offset="50%" stopColor="#9ca3af" />
          <stop offset="100%" stopColor="#4b5563" />
        </linearGradient>
        {/* Clothes gradient */}
        <linearGradient id={`clothingGrad-${name}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={clothingColor} />
          <stop offset="100%" stopColor={clothingColor} stopOpacity={0.6} />
        </linearGradient>
      </defs>

      {/* Background Crest */}
      <circle cx="120" cy="120" r="110" fill={`url(#bgGrad-${name})`} />

      {/* Cyber Grid/Scanning Overlay if Cyberpunk/Sci-Fi */}
      {(theme === "Cyberpunk" || theme === "Sci-Fi") && (
        <g opacity="0.15">
          <line x1="10" y1="40" x2="230" y2="40" stroke="#00ffff" strokeWidth="0.5" />
          <line x1="10" y1="80" x2="230" y2="80" stroke="#00ffff" strokeWidth="0.5" />
          <line x1="10" y1="120" x2="230" y2="120" stroke="#00ffff" strokeWidth="0.5" />
          <line x1="10" y1="160" x2="230" y2="160" stroke="#00ffff" strokeWidth="0.5" />
          <line x1="10" y1="200" x2="230" y2="200" stroke="#00ffff" strokeWidth="0.5" />
          <circle cx="120" cy="120" r="80" stroke="#00ffff" strokeWidth="0.5" fill="none" strokeDasharray="4 4" />
        </g>
      )}

      {/* Steampunk Brass Goggles / Gears or Alchemy Circles */}
      {theme === "Steampunk" && (
        <g opacity="0.1" stroke="#ca8a04" strokeWidth="1" fill="none">
          <circle cx="120" cy="120" r="100" />
          <circle cx="120" cy="120" r="95" strokeDasharray="3 3" />
          <line x1="120" y1="10" x2="120" y2="230" />
          <line x1="10" y1="120" x2="230" y2="120" />
        </g>
      )}

      {/* Fantasy sigil or runic circle */}
      {theme === "Fantasy" && (
        <g opacity="0.1" stroke="#f59e0b" strokeWidth="1" fill="none">
          <polygon points="120,20 205,170 35,170" />
          <circle cx="120" cy="120" r="90" />
        </g>
      )}

      {/* Grimdark ritual dust or broken shield shards */}
      {theme === "Grimdark" && (
        <g opacity="0.2" fill="none" stroke="#4b5563" strokeWidth="1">
          <path d="M 40,40 L 45,90 L 20,120" />
          <path d="M 200,40 L 195,90 L 220,120" />
          <path d="M 120,10 L 120,30" />
          <path d="M 120,230 L 120,210" />
        </g>
      )}

      {/* Shoulder/Torso (Clothing) */}
      <path
        d="M 50,220 C 50,165 90,165 120,165 C 150,165 190,165 190,220 Z"
        fill={`url(#clothingGrad-${name})`}
        stroke={bgSpec.border}
        strokeWidth="1.5"
      />

      {/* Neck */}
      <rect
        x="105"
        y="140"
        width="30"
        height="30"
        fill={isRobot ? "url(#metalGrad-" + name + ")" : isDwarf ? "#d8b4fe" : "#fed7aa"}
        opacity={theme === "Grimdark" ? 0.75 : 1}
      />

      {/* Ears - Elven Pointy Ears */}
      {isElf && (
        <g>
          {/* Left pointed ear */}
          <path
            d="M 72,105 Q 40,85 68,115 Z"
            fill={isRobot ? "url(#metalGrad-" + name + ")" : "#fed7aa"}
            stroke="#111827"
            strokeWidth="1"
          />
          {/* Right pointed ear */}
          <path
            d="M 168,105 Q 200,85 172,115 Z"
            fill={isRobot ? "url(#metalGrad-" + name + ")" : "#fed7aa"}
            stroke="#111827"
            strokeWidth="1"
          />
        </g>
      )}

      {/* Ears - Regular/Dwarven round thick ears */}
      {!isElf && (
        <g>
          {/* Left ear */}
          <circle cx="68" cy="115" r="10" fill={isRobot ? "url(#metalGrad-" + name + ")" : "#fed7aa"} stroke="#111827" strokeWidth="1" />
          {/* Right ear */}
          <circle cx="172" cy="115" r="10" fill={isRobot ? "url(#metalGrad-" + name + ")" : "#fed7aa"} stroke="#111827" strokeWidth="1" />
        </g>
      )}

      {/* Head Base */}
      <ellipse
        cx="120"
        cy="110"
        rx="50"
        ry="55"
        fill={isRobot ? "url(#metalGrad-" + name + ")" : "#fed7aa"}
        stroke={theme === "Grimdark" ? "#1f2937" : "#374151"}
        strokeWidth="2"
      />

      {/* Face highlights or metallic plates for robots */}
      {isRobot && (
        <g opacity="0.6" stroke="#00ffff" strokeWidth="1" fill="none">
          <path d="M 90,105 L 150,105" />
          <path d="M 120,65 L 120,150" />
          <ellipse cx="120" cy="110" rx="35" ry="40" strokeDasharray="2 2" />
        </g>
      )}

      {/* Eyes */}
      <g>
        {isRobot ? (
          // Cybernetic glowing eyes
          <>
            <circle cx="100" cy="100" r="5" fill="#00ffff" />
            <circle cx="100" cy="100" r="1.5" fill="#ffffff" />
            <circle cx="140" cy="100" r="5" fill="#00ffff" />
            <circle cx="140" cy="100" r="1.5" fill="#ffffff" />
            {/* Holographic scanner goggles */}
            <rect x="85" y="93" width="70" height="14" rx="2" fill="#00ffff" fillOpacity="0.2" stroke="#00ffff" strokeWidth="0.5" />
          </>
        ) : (
          // Regular eyes
          <>
            {/* Left Eye */}
            <ellipse cx="100" cy="102" rx="7" ry="4" fill="#ffffff" stroke="#111827" strokeWidth="0.75" />
            <circle cx="100" cy="102" r="3" fill="#1e3a8a" />
            <circle cx="101.5" cy="100.5" r="1" fill="#ffffff" />
            
            {/* Right Eye */}
            <ellipse cx="140" cy="102" rx="7" ry="4" fill="#ffffff" stroke="#111827" strokeWidth="0.75" />
            <circle cx="140" cy="102" r="3" fill="#1e3a8a" />
            <circle cx="141.5" cy="100.5" r="1" fill="#ffffff" />
          </>
        )}
      </g>

        {/* Grimdark eye patch or hollow eyes */}
        {theme === "Grimdark" && !isRobot && (
          <g>
            {/* Eye patch on left eye */}
            <path d="M 85,95 L 115,110 M 100,85 L 100,120" stroke="#111827" strokeWidth="2.5" />
            <circle cx="100" cy="102" r="6" fill="#111827" />
          </g>
        )}

        {/* Steampunk Brass Goggles over eyes (pushed up on forehead or worn) */}
        {theme === "Steampunk" && (
          <g>
            {/* Worn or forehead goggles */}
            <g transform="translate(0, -18)"> 
              {/* Strap */}
              <rect x="65" y="94" width="110" height="6" fill="#78350f" rx="1" />
              {/* Left Lens */}
              <circle cx="100" cy="97" r="12" fill="none" stroke="#ca8a04" strokeWidth="3" />
              <circle cx="100" cy="97" r="9" fill="#eab308" fillOpacity="0.3" />
              {/* Right Lens */}
              <circle cx="140" cy="97" r="12" fill="none" stroke="#ca8a04" strokeWidth="3" />
              <circle cx="140" cy="97" r="9" fill="#eab308" fillOpacity="0.3" />
              {/* Bridge */}
              <line x1="112" y1="97" x2="128" y2="97" stroke="#ca8a04" strokeWidth="3" />
            </g>
          </g>
        )}

      {/* Nose */}
      {isRobot ? (
        <path d="M 120,105 L 118,122 L 122,122 Z" fill="#4b5563" />
      ) : (
        <path d="M 120,102 C 117,118 116,120 120,121 C 124,120 123,118 120,102 Z" fill="#fdba74" stroke="#111827" strokeWidth="0.5" />
      )}

      {/* Mouth & Expression */}
      <g>
        {isRobot ? (
          // Cyber line
          <line x1="110" y1="130" x2="130" y2="130" stroke="#00ffff" strokeWidth="2" strokeLinecap="round" />
        ) : theme === "Grimdark" ? (
          // Frown / stitched mouth
          <path d="M 110,135 Q 120,128 130,135" fill="none" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" />
        ) : (
          // Subtle smirk or neutral smile
          <path d="M 110,132 Q 120,138 130,132" fill="none" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" />
        )}
      </g>

      {/* Beard & Facial Hair (If Dwarf / Grizzled or Chosen) */}
      {isDwarf && !isRobot && (
        <g>
          {/* Beautiful flowing beard styled with hair color */}
          <path
            d="M 70,125 C 70,190 120,205 120,205 C 120,205 170,190 170,125 C 160,140 145,145 120,145 C 95,145 80,140 70,125 Z"
            fill={`url(#hairGrad-${name})`}
            stroke="#111827"
            strokeWidth="1.5"
          />
          {/* Mustache detail */}
          <path d="M 105,128 Q 120,134 135,128" fill="none" stroke="#111827" strokeWidth="2" />
        </g>
      )}

      {/* Hair (Layered on top of the head) */}
      {!isRobot && (
        <g>
          {/* Main hair cap */}
          <path
            d="M 68,105 C 55,50 185,50 172,105 C 160,100 150,90 120,95 C 90,90 80,100 68,105 Z"
            fill={`url(#hairGrad-${name})`}
            stroke="#111827"
            strokeWidth="1.5"
          />
          {/* Hair bangs / front locks */}
          <path
            d="M 68,105 C 75,75 105,80 115,95 Q 120,70 145,85 C 155,75 168,90 172,105 Q 155,95 140,100 Q 120,85 100,100 Z"
            fill={`url(#hairGrad-${name})`}
          />
          {/* Highlights */}
          <circle cx="100" cy="70" r="1.5" fill="#ffffff" opacity="0.3" />
          <circle cx="140" cy="75" r="1.5" fill="#ffffff" opacity="0.3" />
        </g>
      )}

      {/* Head accessories / crown / headbands */}
      {theme === "Fantasy" && race.includes("Elf") && (
        <path d="M 85,73 Q 120,60 155,73" fill="none" stroke="#f59e0b" strokeWidth="2.5" />
      )}
    </svg>
  );
};
