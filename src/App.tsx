/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Dices,
  Volume2,
  VolumeX,
  Bookmark,
  Copy,
  Trash2,
  Shuffle,
  Eye,
  EyeOff,
  BookOpen,
  User,
  Wand2,
  ShieldAlert,
  Check,
  Briefcase,
  Layers,
  HelpCircle,
} from "lucide-react";

import { SettingTheme, NpcInputs, GeneratedNpc, BookmarkedNpc } from "./types";
import { THEMES, REELS_DATA, getRandomElement, getRandomInputs, getHeightsForRace, formatAgeWithLifeExpectancy, formatHeightWithAverage, getRacesForTheme, getRandomWeightedRace } from "./data";
import { NpcAvatar } from "./components/NpcAvatar";
import { synth } from "./utils/audio";

export function splitStyleAndPalette(text: string, defaultPalette: string): { style: string; palette: string } {
  if (!text) {
    return { style: "Not specified", palette: defaultPalette };
  }
  
  // Common specific color names used in fantasy character designs
  const colorTerms = [
    "forest green", "moss green", "pearl white", "fiery red", "raven black", "sandy blonde",
    "golden", "gold", "silver", "blue", "red", "raven", "black", "gray", "grey", "burgundy",
    "crimson", "indigo", "white", "emerald", "amber", "bronze", "brass", "copper", "rust",
    "ash", "charcoal", "obsidian", "brown", "ochre", "saffron", "yellow", "orange", "violet", "purple", "rose",
    "chestnut", "auburn", "blonde", "brunette", "sandy", "pale", "dark", "pitch", "tan"
  ];
  
  const textLower = text.toLowerCase();
  const foundColors: string[] = [];
  
  for (const term of colorTerms) {
    const regex = new RegExp(`\\b${term}\\b`, 'i');
    if (regex.test(textLower)) {
      foundColors.push(term);
    }
  }
  
  let renovatedStyle = text;
  for (const color of foundColors) {
    const rx = new RegExp(`\\b${color}\\b\\s*(and|or|with|in)?\\s*`, 'gi');
    renovatedStyle = renovatedStyle.replace(rx, "");
  }
  
  // Clean up punctuation, repeated spaces and connecting words
  renovatedStyle = renovatedStyle
    .replace(/\s+/g, " ")
    .replace(/\s+in\s+with\b/gi, " with")
    .replace(/\s+in\s+and\b/gi, " and")
    .replace(/\b(in|of|and|with)\s*(?:and|with|in)?\s*$/gi, "")
    .replace(/,\s*,/g, ",")
    .replace(/^\s*,\s*|\s*,\s*$/g, "")
    .trim();
  
  if (renovatedStyle.length > 0) {
    renovatedStyle = renovatedStyle.charAt(0).toUpperCase() + renovatedStyle.slice(1);
    if (renovatedStyle.length < 3) {
      renovatedStyle = text;
    }
  } else {
    renovatedStyle = text;
  }
  
  let palette = defaultPalette;
  if (foundColors.length > 0) {
    // Unique list
    const uniqueColors = Array.from(new Set(foundColors));
    // Capitalize and format nicely
    const capped = uniqueColors.map(c => 
      c.split(/\s+/)
       .map(word => word.charAt(0).toUpperCase() + word.slice(1))
       .join(" ")
    );
    if (capped.length > 1) {
      const last = capped.pop();
      palette = capped.join(", ") + " and " + last;
    } else {
      palette = capped[0];
    }
  }
  
  // Enforce max 5 words limit
  const words = palette.split(/\s+/);
  if (words.length > 5) {
    palette = words.slice(0, 5).join(" ");
  }
  
  return { style: renovatedStyle, palette };
}

export default function App() {
  // Theme Selection
  const [theme, setTheme] = useState<SettingTheme>("Fantasy");
  
  // Custom user trait inputs
  const [inputs, setInputs] = useState<NpcInputs>({
    race: "",
    age: "",
    height: "",
    gender: "",
    socialStatus: "",
    hairStyleColor: "",
    clothingStyleColor: "",
    job: "",
  });

  // Main generated NPC state (null initially, mock or generated thereafter)
  const [currentNpc, setCurrentNpc] = useState<GeneratedNpc | null>(null);
  
  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [showExtraDetails, setShowExtraDetails] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showRaceDropdown, setShowRaceDropdown] = useState(false);
  const raceDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (raceDropdownRef.current && !raceDropdownRef.current.contains(event.target as Node)) {
        setShowRaceDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [apiWarning, setApiWarning] = useState<string | null>(null);
  
  // Bookmarks persistence
  const [codex, setCodex] = useState<BookmarkedNpc[]>([]);
  const [selectedCodexId, setSelectedCodexId] = useState<string | null>(null);
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState("");

  // Load Codex bookmarks from LocalStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("enpc_codex");
      if (saved) {
        setCodex(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load codex:", e);
    }
  }, []);

  // Save Codex to LocalStorage
  const saveCodexToStorage = (updated: BookmarkedNpc[]) => {
    try {
      localStorage.setItem("enpc_codex", JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save codex:", e);
    }
  };

  // Sound triggering functions wrapped under toggle
  const playSound = (type: "dice" | "success" | "chime" | "whisper") => {
    if (!soundEnabled) return;
    if (type === "dice") synth.playDiceRoll();
    else if (type === "success") synth.playMusterSuccess();
    else if (type === "chime") synth.playSingleChime();
    else if (type === "whisper") synth.playWhisper();
  };

  // Helper names catalog for local fallbacks in case of missing API keys
  const getFallbackNPCName = (t: SettingTheme, genderInput: string): string => {
    const isFemale = genderInput.toLowerCase().includes("female") || genderInput.toLowerCase().includes("woman") || Math.random() > 0.5;
    
    const fantasyFirstM = ["Garrick", "Elenor", "Cedric", "Thorne", "Valen", "Kaelen", "Broggan", "Durnin", "Balthazar"];
    const fantasyFirstF = ["Aurelia", "Lyra", "Sariel", "Evadne", "Maeve", "Gwen", "Sylvia", "Vespera", "Freya"];
    const fantasyLast = ["Stormshield", "Ironfist", "Deepdelve", "Riverrunner", "Magebrook", "Oakheart", "Shadowvale", "Moonsinger"];

    const scifiFirst = ["Nexus-4", "Kaelen-7", "Cpt. Vance", "Dr. Aris", "Zola", "Orion", "T-89", "Spike", "Sari-Tek"];
    const scifiLast = ["Vecter", "Prime", "Synapse", "Voidwalker", "Starborn", "Cyber-V", "Redacted", "Holophrase"];

    const steamFirst = ["William", "Archibald", "Bartholomew", "Beatrix", "Clementine", "Edison", "Fiona", "Sprocket", "Tesla"];
    const steamLast = ["Geargrinder", "Boilerplate", "Sootspinner", "Brassington", "Tinkerton", "Copperfield", "Aetherglove"];

    const cyberFirst = ["Neon", "Spike", "Cipher", "Slick", "Vector", "Echo", "Hex", "Viper", "Zero", "Glitch", "Aura"];
    const cyberLast = ["Null", "Daemon", "Stack", "Chroma", "Syn", "Proxy", "Signal", "Glitch", "Kowalski"];

    const grimFirst = ["Uldor", "Vardus", "Corvus", "Morrigan", "Mirela", "Griswold", "Oswald", "Kriemhild", "Sybil"];
    const grimLast = ["The Gallows", "Cinderheart", "Gravewalker", "Weaver", "Soot-brand", "Crow", "Ratface", "Blight"];

    const themeFirstNames = (() => {
      switch (t) {
        case "Sci-Fi": return scifiFirst;
        case "Steampunk": return steamFirst;
        case "Cyberpunk": return cyberFirst;
        case "Grimdark": return grimFirst;
        default: return isFemale ? fantasyFirstF : fantasyFirstM;
      }
    })();

    const themeLastNames = (() => {
      switch (t) {
        case "Sci-Fi": return scifiLast;
        case "Steampunk": return steamLast;
        case "Cyberpunk": return cyberLast;
        case "Grimdark": return grimLast;
        default: return fantasyLast;
      }
    })();

    return `${getRandomElement(themeFirstNames)} ${getRandomElement(themeLastNames)}`;
  };

  // Substantial fallback text-generator to ensure 100% flawless functionality when API key isn't provided or fails
  const generateFallbackNpc = (inputsToUse: NpcInputs, settingTheme: SettingTheme): GeneratedNpc => {
    const presetData = REELS_DATA[settingTheme];
    
    // Resolve empty inputs with random items from themes
    const finalRace = inputsToUse.race.trim() || getRandomWeightedRace(settingTheme);
    const finalGender = inputsToUse.gender.trim() || getRandomElement(presetData.genders);
    const rawAge = inputsToUse.age.trim() || getRandomElement(presetData.ages);
    const finalAge = formatAgeWithLifeExpectancy(rawAge, finalRace);
    const rawHeight = inputsToUse.height.trim() || getRandomElement(getHeightsForRace(finalRace, settingTheme));
    const finalHeight = formatHeightWithAverage(rawHeight, finalRace, settingTheme);
    const finalSocialStatus = inputsToUse.socialStatus.trim() || getRandomElement(presetData.socialStatuses);
    const finalHair = inputsToUse.hairStyleColor.trim() || getRandomElement(presetData.hairStyles);
    const finalClothing = inputsToUse.clothingStyleColor.trim() || getRandomElement(presetData.clothingStyles);
    const finalJob = inputsToUse.job.trim() || getRandomElement(presetData.jobs);

    const name = getFallbackNPCName(settingTheme, finalGender);

    // Build creative detailed sentences
    const shortDesc = `A ${finalAge} ${finalRace} with eye-catching details, measuring about ${finalHeight} in height. They feature a striking set of ${finalHair} and wear a tailored configuration of ${finalClothing}.`;

    const physicalDsc = `Those who meet ${name} are instantly struck by their posture and presence. Looking upon their ${finalClothing}, one senses they have traveled far to pursue their current trade as a ${finalJob}.`;
    
    const mentalDsc = `Beneath the surface, they harbor deep concerns about their livelihood, with a focus that pivots between sharp professionalism and a guarded instinct for survival. They have spent years refining their craft, and are known to be particularly active within specialized circles.`;

    const historyDsc = `Rumor says they once crossed paths with influential figures, bearing scars or gifts obtained from those encounters. Today, they prefer to keep details vague, preferring to stay in the shadows of local taverns or high halls, depending on who is asking.`;

    const dialogOptions: Record<SettingTheme, string[]> = {
      Fantasy: [
        "A heavy coin beats a sharp word any day of the cycle. What is your quest?",
        "Mind the shadows, traveler. In these woods, even the old oaks list and spy.",
        "By the sacred crags, keeping this steel sharp is the only church I rely on."
      ],
      "Sci-Fi": [
        "Data stream loaded. Be direct, citizen, my processor cycles are expensive.",
        "The stars are silent, but this plasma regulator is screaming. What do you need?",
        "Don't talk to me about megacorps. They bought my home block three cycles ago."
      ],
      Steampunk: [
        "Tinkering, always tinkering! Give me five gears, and I will conquer the world.",
        "Careful around the boiler gauge! Pressure has a nasty habit of speaking loudly.",
        "Skyways are crowded with vultures today. Let's make this transaction swift."
      ],
      Cyberpunk: [
        "I can read your firewall signature from here. Make a clean offer or clear the line.",
        "Nothing in the Grid is free. You want information, you pay in cold hard credits.",
        "The sky's the color of a dead screen, but this neon is still warm."
      ],
      Grimdark: [
        "We are all soot in the wind anyway. Speak your piece before the crows gather.",
        "Another soul seeking redemption? There is none left in this cursed mud.",
        "Watch your neck. The executioner has been working overtime this season."
      ]
    };

    const personalityTraits: Record<SettingTheme, string[]> = {
      Fantasy: ["Paranoid", "Superstitious", "Friendly", "Generous", "Skeptical", "Honest", "Cunning", "Gruff", "Pious", "Meticulous", "Curious", "Proud", "Brooding", "Loyal", "Anxious", "Pragmatic", "Timid", "Greedy"],
      "Sci-Fi": ["Analytical"],
      Steampunk: ["Punctual"],
      Cyberpunk: ["Ruthless"],
      Grimdark: ["Traumatized"]
    };

    const mannerismOptionsList: Record<SettingTheme, string[]> = {
      Fantasy: [
        "Constantly pulls or twirls a single strand of their long hair",
        "Clutches a tarnished silver amulet whenever someone whispers",
        "Rubs a dry thumb over a heavy gold signet ring"
      ],
      "Sci-Fi": [
        "Taps an interface key on their forearm"
      ],
      Steampunk: [
        "Cleans a brass gear with a silk rag"
      ],
      Cyberpunk: [
        "Flicks a holographic lighter on and off"
      ],
      Grimdark: [
        "Coughs softly into a black cloth"
      ]
    };

    const secretHooks: Record<SettingTheme, string[]> = {
      Fantasy: [
        "They possess a cracked dragon egg wrapped in wool, waiting for a spark of pure fire.",
        "They carry a key to a royal archive containing evidence of a falsified king's lineage.",
        "They owe a massive debt to a coven of marsh hags who demand their service next full moon."
      ],
      "Sci-Fi": [
        "They have a neural drive storing an encrypted payload."
      ],
      Steampunk: [
        "Their clockwork lungs are running on stolen royal gas."
      ],
      Cyberpunk: [
        "They are hosting an outlaw AI program inside their brain cortex."
      ],
      Grimdark: [
        "They are secretly bitten by a swamp-leech."
      ]
    };

    const equipmentOptions: Record<SettingTheme, string[][]> = {
      Fantasy: [
        ["A chipped wooden spoon for common gruel", "A small ball of grease-stained wool twine", "An unwashed linen cleaning rag"],
        ["A weathered flat tin canteen containing spring water", "A couple of dry, salted parsnip rinds", "A wooden comb with four teeth missing"],
        ["A worn, grooved whetstone smelling of river silt", "A pair of rough, gray wool stockings", "A dull copper penny from a forgotten border estate"],
        ["A small clay tobacco pipe with a pinch of common leaf", "A lump of yellow beeswax with a simple bone needle", "A flint and steel striker in a greasy hide pouch"]
      ],
      "Sci-Fi": [
        ["A simple metallic bolt", "A plastic canteen", "A piece of grease rag"]
      ],
      Steampunk: [
        ["A rusty copper turn-screw", "A simple grease tin", "A worn lens cloth"]
      ],
      Cyberpunk: [
        ["A blank micro-card", "A piece of wire", "A synthetic cleaning cloth"]
      ],
      Grimdark: [
        ["A chipped bone fragment", "A stub of shadow candle", "A piece of coarse bandage"]
      ]
    };

    const selectedDialogue = getRandomElement(dialogOptions[settingTheme]);
    const themeTraits = personalityTraits[settingTheme];
    // Pick 3 unique random traits from the array
    const shuffledTraits = [...themeTraits].sort(() => Math.random() - 0.5);
    const selectedTraits = shuffledTraits.slice(0, 3);

    const selectedMannerism = getRandomElement(mannerismOptionsList[settingTheme]);
    const selectedSecretHook = getRandomElement(secretHooks[settingTheme]);
    const finalEquipChoices = getRandomElement(equipmentOptions[settingTheme]);

    return {
      name,
      race: finalRace,
      age: finalAge,
      height: finalHeight,
      gender: finalGender,
      socialStatus: finalSocialStatus,
      hairStyleColor: finalHair,
      clothingStyleColor: finalClothing,
      job: finalJob,
      shortDescription: shortDesc,
      backstory: `${physicalDsc} ${mentalDsc}\n\n${historyDsc}`,
      personality: selectedTraits,
      dialogueQuote: `"${selectedDialogue}"`,
      mannerisms: selectedMannerism,
      secretHook: selectedSecretHook,
      equipment: finalEquipChoices,
      theme: settingTheme,
      generatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };
  };

  // Perform Gemini-driven API RPC or use beautiful Local Fallback instantly
  const handleGenerate = async () => {
    setIsLoading(true);
    setShowSecret(false); // Reset secret reveal State
    playSound("dice");
    setApiWarning(null);

    // Call actual server endpoint
    try {
      const response = await fetch("/api/npc/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          race: inputs.race,
          age: inputs.age,
          height: inputs.height,
          gender: inputs.gender,
          socialStatus: inputs.socialStatus,
          hairStyleColor: inputs.hairStyleColor,
          clothingStyleColor: inputs.clothingStyleColor,
          job: inputs.job,
          systemTheme: theme,
        }),
      });

      if (!response.ok) {
        throw new Error("HTTP error: " + response.status);
      }

      const data = await response.json();
      
      if (data.error) {
        // Log details but use majestic local generator immediately to keep flow
        console.warn("API Error Response:", data.error);
        setApiWarning(data.error);
        const fbNpc = generateFallbackNpc(inputs, theme);
        setCurrentNpc(fbNpc);
      } else {
        // Success with actual server model!
        // Format theme onto the returned object
        const finalNpc: GeneratedNpc = {
          ...data,
          theme: theme,
          age: formatAgeWithLifeExpectancy(data.age, data.race),
          height: formatHeightWithAverage(data.height, data.race, theme),
          generatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        };
        setCurrentNpc(finalNpc);
        playSound("success");
      }
    } catch (e: any) {
      console.warn("API request failed, initiating local fallback generator:", e);
      setApiWarning("API key not fully configured or server timeout. Active offline fallback mode successfully triggered.");
      
      // Resilient flow: instantly trigger premium local fallback generator
      const fbNpc = generateFallbackNpc(inputs, theme);
      setCurrentNpc(fbNpc);
      playSound("success");
    } finally {
      setIsLoading(false);
    }
  };

  // Populate ALL input fields randomly based on current active presets & trigger success sounds
  const handleRandomizeAllInputs = () => {
    const randomSet = getRandomInputs(theme);
    randomSet.age = formatAgeWithLifeExpectancy(randomSet.age, randomSet.race);
    randomSet.height = formatHeightWithAverage(randomSet.height, randomSet.race, theme);
    setInputs(randomSet);
    playSound("dice");
  };

  // Clear all form inputs
  const handleClearAllFields = () => {
    setInputs({
      race: "",
      age: "",
      height: "",
      gender: "",
      socialStatus: "",
      hairStyleColor: "",
      clothingStyleColor: "",
      job: "",
    });
    playSound("whisper");
  };

  // Direct roll helper for a single field
  const handleRandomizeSingleField = (field: keyof NpcInputs) => {
    const themePresets = REELS_DATA[theme];
    let rolledVal = "";

    switch (field) {
      case "race":
        const newRace = getRandomWeightedRace(theme);
        setInputs((prev) => {
          const updated = { ...prev, race: newRace };
          if (prev.age) {
            updated.age = formatAgeWithLifeExpectancy(prev.age as string, newRace);
          }
          if (prev.height) {
            updated.height = formatHeightWithAverage(prev.height as string, newRace, theme);
          }
          return updated;
        });
        playSound("chime");
        return;
      case "age":
        rolledVal = formatAgeWithLifeExpectancy(getRandomElement(themePresets.ages), inputs.race || "Human");
        break;
      case "height":
        rolledVal = formatHeightWithAverage(getRandomElement(getHeightsForRace(inputs.race, theme)), inputs.race || "Human", theme);
        break;
      case "gender":
        rolledVal = getRandomElement(themePresets.genders);
        break;
      case "socialStatus":
        rolledVal = getRandomElement(themePresets.socialStatuses);
        break;
      case "hairStyleColor":
        rolledVal = getRandomElement(themePresets.hairStyles);
        break;
      case "clothingStyleColor":
        rolledVal = getRandomElement(themePresets.clothingStyles);
        break;
      case "job":
        rolledVal = getRandomElement(themePresets.jobs);
        break;
    }

    setInputs((prev) => ({
      ...prev,
      [field]: rolledVal,
    }));
    playSound("chime");
  };

  // Add the currently displayed NPC to Saved Codex bookmarks
  const handleBookmarkNpc = () => {
    if (!currentNpc) return;
    
    // Check if already in Codex to avoid duplicates
    const alreadySaved = codex.some(
      (item) => item.name === currentNpc.name && item.race === currentNpc.race
    );

    if (alreadySaved) {
      playSound("whisper");
      return;
    }

    const newBookmark: BookmarkedNpc = {
      ...currentNpc,
      id: crypto.randomUUID(),
      notes: "",
    };

    const updated = [newBookmark, ...codex];
    setCodex(updated);
    setSelectedCodexId(newBookmark.id);
    saveCodexToStorage(updated);
    playSound("success");
  };

  // Load a saved Codex NPC onto the active preview card
  const handleLoadCodexNpc = (npc: BookmarkedNpc) => {
    setCurrentNpc(npc);
    setTheme(npc.theme);
    setSelectedCodexId(npc.id);
    
    // Preset inputs to match the loaded NPC for potential edits
    setInputs({
      race: npc.race,
      age: npc.age,
      height: npc.height || "",
      gender: npc.gender,
      socialStatus: npc.socialStatus || "",
      hairStyleColor: npc.hairStyleColor,
      clothingStyleColor: npc.clothingStyleColor,
      job: npc.job,
    });
    
    playSound("whisper");
  };

  // Delete a Codex saved item
  const handleDeleteCodexNpc = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering loading click
    const updated = codex.filter((item) => item.id !== id);
    setCodex(updated);
    if (selectedCodexId === id) {
      setSelectedCodexId(null);
    }
    saveCodexToStorage(updated);
    playSound("whisper");
  };

  // Update Codex Notes for a specific NPC
  const handleSaveNotes = (id: string) => {
    const updated = codex.map((item) => {
      if (item.id === id) {
        return { ...item, notes: tempNotes };
      }
      return item;
    });
    setCodex(updated);
    saveCodexToStorage(updated);
    setEditingNotesId(null);
    playSound("chime");

    // Sync active view NPC note if it belongs to Codex
    if (currentNpc && selectedCodexId === id) {
      setCurrentNpc({
        ...currentNpc,
        notes: tempNotes,
      } as any);
    }
  };

  // Copy full formatted NPC description and stats to clipboard for instant use in Roll20/WorldAnvil list
  const handleCopyToClipboard = () => {
    if (!currentNpc) return;

    const formattedText = `
=== EMERGENCY NPC: ${currentNpc.name.toUpperCase()} ===
Theme: ${currentNpc.theme}
Race: ${currentNpc.race}
Age: ${currentNpc.age}
Height: ${currentNpc.height || "Unknown"}
Gender: ${currentNpc.gender}
Social Status: ${currentNpc.socialStatus || "Unknown"}
Hair Stylings: ${currentNpc.hairStyleColor}
Clothing Stylings: ${currentNpc.clothingStyleColor}
Job/Profession: ${currentNpc.job}

[Visual Summary]
${currentNpc.shortDescription}

[Personality Traits]
${currentNpc.personality.join(", ")}

[Signature Mannerisms]
${currentNpc.mannerisms}

[Dungeon Master's Secret Hook]
${currentNpc.secretHook}

[Carried Items / Equipment]
${currentNpc.equipment.map((item, idx) => `${idx + 1}. ${item}`).join("\n")}
====================================
`;

    navigator.clipboard.writeText(formattedText.trim());
    setCopied(true);
    playSound("chime");
    setTimeout(() => setCopied(false), 2000);
  };

  // Beautiful Read Aloud Vocalization using speech synthesis
  const handleSpeakDialog = () => {
    if (!currentNpc) return;
    
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Clean voice quotes clean of quotation marks
    const pureMessage = currentNpc.dialogueQuote.replace(/["']/g, "");
    const utterance = new SpeechSynthesisUtterance(pureMessage);
    
    // Choose appropriate pitch or speed depending on Theme characteristics
    if (currentNpc.theme === "Grimdark") {
      utterance.pitch = 0.5;
      utterance.rate = 0.8;
    } else if (currentNpc.theme === "Sci-Fi") {
      utterance.rate = 1.05;
      utterance.pitch = 0.95;
    } else if (currentNpc.theme === "Steampunk") {
      utterance.pitch = 1.1;
      utterance.rate = 0.95;
    }

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
    playSound("whisper");
  };

  // Trigger an initial NPC automatically on mount so the user isn't faced with a blank card!
  useEffect(() => {
    const initialSet = getRandomInputs("Fantasy");
    const initNpc = generateFallbackNpc(initialSet, "Fantasy");
    setCurrentNpc(initNpc);
  }, []);

  const racesWithTags = getRacesForTheme(theme);
  // Filter races by search query safely
  const filteredRaces = inputs.race.trim()
    ? racesWithTags.filter(r => r.name.toLowerCase().includes(inputs.race.toLowerCase()))
    : racesWithTags;
  const commonRaces = filteredRaces.filter(r => r.tag === "Common");
  const exoticRaces = filteredRaces.filter(r => r.tag === "Exotic");
  const monstrousRaces = filteredRaces.filter(r => r.tag === "Monstrous");

  return (
    <div id="enpc-app-root" className="min-h-screen text-[#e0e0e0] font-sans flex flex-col overflow-x-hidden" style={{
      background: "radial-gradient(circle at 50% 10%, #1c1c1c 0%, #080808 100%)"
    }}>
      
      {/* Top Premium Grimoire Navigation Header */}
      <header id="enpc-header" className="border-b border-[#333333] px-6 py-4 bg-[#0a0a0a]/90 backdrop-blur-md sticky top-0 z-40 transition-all duration-300 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          
          <div className="flex items-center gap-3">
            <div className="bg-[#1c1917] p-2 rounded-lg border border-[#c5a059]/40 shadow-inner">
              <Sparkles className="h-6 w-6 text-[#c5a059] animate-pulse" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-[#c5a059] font-medium font-serif">Emergency NPC System</div>
              <h1 className="text-2xl font-normal font-serif text-white tracking-tight flex items-center gap-2">
                E-NPC Grimoire <span className="text-[11px] opacity-40 font-mono">v4.2</span>
              </h1>
            </div>
          </div>

          {/* Settings bar */}
          <div className="flex flex-wrap items-center gap-2 justify-center">
            <span className="text-[10px] font-mono uppercase tracking-[0.1em] bg-[#1a1510] border border-[#c5a059]/30 text-[#c5a059] px-3 py-1.5 rounded-md font-semibold select-none flex items-center gap-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
              Fantasy Mode
            </span>

            {/* Audio Toggle Indicator */}
            <button
              id="sound-toggle-btn"
              onClick={() => {
                const updated = !soundEnabled;
                setSoundEnabled(updated);
                // Trigger quick chime if turning on
                if (updated) {
                  setTimeout(() => synth.playSingleChime(), 100);
                }
              }}
              title={soundEnabled ? "Mute interface synth sounds" : "Unmute interface synth sounds"}
              className="p-2 rounded-lg border border-[#2a2a2a] bg-[#131313] hover:border-[#c5a059]/50 transition-colors text-gray-400 hover:text-white"
            >
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4 text-red-400" />}
            </button>
          </div>

        </div>
      </header>

      {/* API Warning notification panel if Gemini key is unset */}
      {apiWarning && (
        <div id="enpc-api-warning" className="bg-[#c5a059]/10 border-b border-[#c5a059]/30 text-xs px-6 py-2">
          <div className="max-w-7xl mx-auto flex items-center gap-2 text-[#c5a059]">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>
              <strong>Note:</strong> Standard interactive offline simulator is currently active. To experience full infinite-diversity AI narrations, paste your <strong>GEMINI_API_KEY</strong> via the Settings model.
            </span>
          </div>
        </div>
      )}

      {/* Main Container Layout */}
      <main id="enpc-main" className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN (Form Config): 4 cols */}
        <section id="npc-builder-panel" className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Card Frame wrapping inputs */}
          <div className="bg-[#111111] border border-[#222222] rounded-xl p-5 shadow-2xl relative">
            
            {/* Corner styling accents */}
            <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-[#c5a059]/30"></div>
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-[#c5a059]/30"></div>

            <div className="flex justify-between items-center mb-4 border-b border-[#222222] pb-3">
              <h2 className="font-serif font-semibold text-white tracking-wide flex items-center gap-2 text-md">
                <Wand2 className="h-4 w-4 text-[#c5a059]" /> Character Blueprint
              </h2>
              <span className="text-[10px] font-mono uppercase bg-[#1a1a1a] border border-[#2a2a2a] px-2 py-0.5 rounded text-[#888]">
                {theme} Presets
              </span>
            </div>

            <p className="text-xs text-[#888] mb-4">
              Type custom values to lock specific visual qualities, or leave empty to allow the AI (or randomizer) to roll ideas. Focus dice buttons (🎲) roll individual attributes!
            </p>

            {/* Input Groups Column */}
            <div className="flex flex-col gap-4">
              
              {/* Field: Race */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <label htmlFor="input-race" className="text-[10px] uppercase tracking-wider text-[#999] font-semibold">Race / Bloodline</label>
                  <button
                    onClick={() => handleRandomizeSingleField("race")}
                    type="button"
                    title="Roll random race from theme"
                    className="text-gray-500 hover:text-[#c5a059] transition-colors p-0.5"
                  >
                    <Dices className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="relative" ref={raceDropdownRef}>
                  <input
                    id="input-race"
                    type="text"
                    value={inputs.race}
                    onFocus={() => setShowRaceDropdown(true)}
                    onChange={(e) => {
                      setInputs({ ...inputs, race: e.target.value });
                      setShowRaceDropdown(true);
                    }}
                    onBlur={() => {
                      setTimeout(() => {
                        setInputs(prev => {
                          const val = prev.race.trim();
                          if (!val) return prev;
                          const match = racesWithTags.find(r => r.name.toLowerCase() === val.toLowerCase());
                          if (match) {
                            return { ...prev, race: match.name };
                          } else {
                            return { ...prev, race: "" };
                          }
                        });
                      }, 250);
                    }}
                    placeholder="e.g. Tiefling, Dragonborn, Gnome..."
                    className="w-full bg-[#151515] border border-[#2a2a2a] rounded p-2 text-xs text-white focus:outline-none focus:border-[#c5a059] placeholder-gray-600 transition-colors"
                  />
                  {showRaceDropdown && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-[#121212] border border-[#2c2b29] rounded shadow-2xl z-50 p-2.5 max-h-72 overflow-y-auto font-sans text-xs scrollbar-thin scrollbar-thumb-gray-800">
                      <div className="space-y-3">
                        {commonRaces.length === 0 && exoticRaces.length === 0 && monstrousRaces.length === 0 && (
                          <div className="text-center py-4 text-gray-400 font-sans text-[11px] leading-relaxed">
                            No matching races found in {theme} theme.<br />
                            <span className="text-[#c5a059] italic font-semibold">Please select from the allowed list!</span>
                          </div>
                        )}

                        {/* Section: Common */}
                        {commonRaces.length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 text-[10px] tracking-wider uppercase font-bold text-[#c5a059] mb-1.5 px-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059] animate-pulse"></span>
                              <span>Common</span>
                            </div>
                            <div className="pl-2 border-l border-[#2d2922] space-y-0.5">
                              {commonRaces.map((item) => (
                                <button
                                  key={item.name}
                                  type="button"
                                  onClick={() => {
                                    setInputs(prev => {
                                      const updated = { ...prev, race: item.name };
                                      if (prev.age) {
                                        updated.age = formatAgeWithLifeExpectancy(prev.age as string, item.name);
                                      }
                                      if (prev.height) {
                                        updated.height = formatHeightWithAverage(prev.height as string, item.name, theme);
                                      }
                                      return updated;
                                    });
                                    setShowRaceDropdown(false);
                                    playSound("chime");
                                  }}
                                  className="w-full text-left text-xs py-1 px-2 rounded-sm text-gray-300 hover:text-white hover:bg-[#1a1917] hover:border hover:border-[#403622] border border-transparent transition-all flex items-center justify-between"
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="text-[9px] text-gray-650">•</span>
                                    <span>{item.name}</span>
                                  </div>
                                  <span className="text-[9px] uppercase font-semibold text-[#888] bg-[#1a1a1a] px-1 rounded-sm border border-[#222]">Common</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Section: Exotic */}
                        {exoticRaces.length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 text-[10px] tracking-wider uppercase font-bold text-[#c5a059] mb-1.5 px-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059] animate-pulse"></span>
                              <span>Exotic</span>
                            </div>
                            <div className="pl-2 border-l border-[#2d2922] space-y-0.5">
                              {exoticRaces.map((item) => (
                                <button
                                  key={item.name}
                                  type="button"
                                  onClick={() => {
                                    setInputs(prev => {
                                      const updated = { ...prev, race: item.name };
                                      if (prev.age) {
                                        updated.age = formatAgeWithLifeExpectancy(prev.age as string, item.name);
                                      }
                                      if (prev.height) {
                                        updated.height = formatHeightWithAverage(prev.height as string, item.name, theme);
                                      }
                                      return updated;
                                    });
                                    setShowRaceDropdown(false);
                                    playSound("chime");
                                  }}
                                  className="w-full text-left text-xs py-1 px-2 rounded-sm text-gray-300 hover:text-white hover:bg-[#1a1917] hover:border hover:border-[#403622] border border-transparent transition-all flex items-center justify-between"
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="text-[9px] text-gray-650">•</span>
                                    <span>{item.name}</span>
                                  </div>
                                  <span className="text-[9px] uppercase font-semibold text-[#c5a059] bg-[#1d1810] px-1 rounded-sm border border-[#403622]">Exotic</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Section: Monstrous */}
                        {monstrousRaces.length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 text-[10px] tracking-wider uppercase font-bold text-red-500 mb-1.5 px-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                              <span>Monstrous</span>
                            </div>
                            <div className="pl-2 border-l border-red-950 space-y-0.5">
                              {monstrousRaces.map((item) => (
                                <button
                                  key={item.name}
                                  type="button"
                                  onClick={() => {
                                    setInputs(prev => {
                                      const updated = { ...prev, race: item.name };
                                      if (prev.age) {
                                        updated.age = formatAgeWithLifeExpectancy(prev.age as string, item.name);
                                      }
                                      if (prev.height) {
                                        updated.height = formatHeightWithAverage(prev.height as string, item.name, theme);
                                      }
                                      return updated;
                                    });
                                    setShowRaceDropdown(false);
                                    playSound("chime");
                                  }}
                                  className="w-full text-left text-xs py-1 px-2 rounded-sm text-gray-300 hover:text-white hover:bg-red-950/20 hover:border hover:border-red-900 border border-transparent transition-all flex items-center justify-between"
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="text-[9px] text-gray-650">•</span>
                                    <span>{item.name}</span>
                                  </div>
                                  <span className="text-[9px] uppercase font-semibold text-red-400 bg-red-950/40 px-1 rounded-sm border border-red-900/60 font-mono text-[9px]">Monstrous</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {inputs.race && (
                    <button 
                      onClick={() => setInputs({...inputs, race: ""})}
                      className="absolute right-2.5 top-2.5 text-[10px] text-gray-500 hover:text-gray-300"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Field: Age */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <label htmlFor="input-age" className="text-[10px] uppercase tracking-wider text-[#999] font-semibold">Age Bracket</label>
                  <button
                    onClick={() => handleRandomizeSingleField("age")}
                    type="button"
                    title="Roll random age"
                    className="text-gray-500 hover:text-[#c5a059] transition-colors p-0.5"
                  >
                    <Dices className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="input-age"
                    type="text"
                    value={inputs.age}
                    onChange={(e) => setInputs({ ...inputs, age: e.target.value })}
                    placeholder="e.g. 72 (Grizzled), Elder, 19 (Impulsive)..."
                    className="w-full bg-[#151515] border border-[#2a2a2a] rounded p-2 text-xs text-white focus:outline-none focus:border-[#c5a059] placeholder-gray-600 transition-colors"
                  />
                  {inputs.age && (
                    <button 
                      onClick={() => setInputs({...inputs, age: ""})}
                      className="absolute right-2.5 top-2.5 text-[10px] text-gray-500 hover:text-gray-300"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Field: Height */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <label htmlFor="input-height" className="text-[10px] uppercase tracking-wider text-[#999] font-semibold">Height / Stature</label>
                  <button
                    onClick={() => handleRandomizeSingleField("height")}
                    type="button"
                    title="Roll random height"
                    className="text-gray-500 hover:text-[#c5a059] transition-colors p-0.5"
                  >
                    <Dices className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="input-height"
                    type="text"
                    list="height-options"
                    value={inputs.height}
                    onChange={(e) => setInputs({ ...inputs, height: e.target.value })}
                    placeholder="e.g. 5'6 (Average), 178 cm, Petite..."
                    className="w-full bg-[#151515] border border-[#2a2a2a] rounded p-2 text-xs text-white focus:outline-none focus:border-[#c5a059] placeholder-gray-600 transition-colors"
                  />
                  <datalist id="height-options">
                    {getHeightsForRace(inputs.race, theme).map((h) => (
                      <option key={h} value={h} />
                    ))}
                  </datalist>
                  {inputs.height && (
                    <button 
                      onClick={() => setInputs({...inputs, height: ""})}
                      className="absolute right-2.5 top-2.5 text-[10px] text-gray-500 hover:text-gray-300"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Field: Gender */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <label htmlFor="input-gender" className="text-[10px] uppercase tracking-wider text-[#999] font-semibold">Gender Identity</label>
                  <button
                    onClick={() => handleRandomizeSingleField("gender")}
                    type="button"
                    title="Roll random gender"
                    className="text-gray-500 hover:text-[#c5a059] transition-colors p-0.5"
                  >
                    <Dices className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="input-gender"
                    type="text"
                    value={inputs.gender}
                    onChange={(e) => setInputs({ ...inputs, gender: e.target.value })}
                    placeholder="e.g. Non-binary Ranger, Matriarch, Female..."
                    className="w-full bg-[#151515] border border-[#2a2a2a] rounded p-2 text-xs text-white focus:outline-none focus:border-[#c5a059] placeholder-gray-600 transition-colors"
                  />
                  {inputs.gender && (
                    <button 
                      onClick={() => setInputs({...inputs, gender: ""})}
                      className="absolute right-2.5 top-2.5 text-[10px] text-gray-500 hover:text-gray-300"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Field: Social Status */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <label htmlFor="input-social-status" className="text-[10px] uppercase tracking-wider text-[#999] font-semibold">Social Status / Standing</label>
                  <button
                    onClick={() => handleRandomizeSingleField("socialStatus")}
                    type="button"
                    title="Roll random social status"
                    className="text-gray-500 hover:text-[#c5a059] transition-colors p-0.5"
                  >
                    <Dices className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="input-social-status"
                    type="text"
                    list="social-status-options"
                    value={inputs.socialStatus}
                    onChange={(e) => setInputs({ ...inputs, socialStatus: e.target.value })}
                    placeholder="e.g. Imperial Highborn, Slum Resident, Guild Artisan..."
                    className="w-full bg-[#151515] border border-[#2a2a2a] rounded p-2 text-xs text-white focus:outline-none focus:border-[#c5a059] placeholder-gray-600 transition-colors"
                  />
                  <datalist id="social-status-options">
                    {REELS_DATA[theme].socialStatuses.map((s) => (
                      <option key={s} value={s} />
                    ))}
                  </datalist>
                  {inputs.socialStatus && (
                    <button 
                      onClick={() => setInputs({...inputs, socialStatus: ""})}
                      className="absolute right-2.5 top-2.5 text-[10px] text-gray-500 hover:text-gray-300"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Field: Hair Style / Color */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <label htmlFor="input-hair" className="text-[10px] uppercase tracking-wider text-[#999] font-semibold">Hair Cut & Color</label>
                  <button
                    onClick={() => handleRandomizeSingleField("hairStyleColor")}
                    type="button"
                    title="Roll random hair option"
                    className="text-gray-500 hover:text-[#c5a059] transition-colors p-0.5"
                  >
                    <Dices className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="input-hair"
                    type="text"
                    value={inputs.hairStyleColor}
                    onChange={(e) => setInputs({ ...inputs, hairStyleColor: e.target.value })}
                    placeholder="e.g. Braided silver mane, Shaved with neon runic..."
                    className="w-full bg-[#151515] border border-[#2a2a2a] rounded p-2 text-xs text-white focus:outline-none focus:border-[#c5a059] placeholder-gray-600 transition-colors"
                  />
                  {inputs.hairStyleColor && (
                    <button 
                      onClick={() => setInputs({...inputs, hairStyleColor: ""})}
                      className="absolute right-2.5 top-2.5 text-[10px] text-gray-500 hover:text-gray-300"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Field: Clothing Style & Colors */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <label htmlFor="input-clothing" className="text-[10px] uppercase tracking-wider text-[#999] font-semibold">Clothing Style / Color Palette</label>
                  <button
                    onClick={() => handleRandomizeSingleField("clothingStyleColor")}
                    type="button"
                    title="Roll random clothing option"
                    className="text-gray-500 hover:text-[#c5a059] transition-colors p-0.5"
                  >
                    <Dices className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="input-clothing"
                    type="text"
                    value={inputs.clothingStyleColor}
                    onChange={(e) => setInputs({ ...inputs, clothingStyleColor: e.target.value })}
                    placeholder="e.g. Moss-green traveler cowl with brass scales..."
                    className="w-full bg-[#151515] border border-[#2a2a2a] rounded p-2 text-xs text-white focus:outline-none focus:border-[#c5a059] placeholder-gray-600 transition-colors"
                  />
                  {inputs.clothingStyleColor && (
                    <button 
                      onClick={() => setInputs({...inputs, clothingStyleColor: ""})}
                      className="absolute right-2.5 top-2.5 text-[10px] text-gray-500 hover:text-gray-300"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Field: Job */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <label htmlFor="input-job" className="text-[10px] uppercase tracking-wider text-[#999] font-semibold">Profession / Role</label>
                  <button
                    onClick={() => handleRandomizeSingleField("job")}
                    type="button"
                    title="Roll random job"
                    className="text-gray-500 hover:text-[#c5a059] transition-colors p-0.5"
                  >
                    <Dices className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="input-job"
                    type="text"
                    value={inputs.job}
                    onChange={(e) => setInputs({ ...inputs, job: e.target.value })}
                    placeholder="e.g. Master Cartographer, Airship Boiler Soker..."
                    className="w-full bg-[#151515] border border-[#2a2a2a] rounded p-2 text-xs text-white focus:outline-none focus:border-[#c5a059] placeholder-gray-600 transition-colors"
                  />
                  {inputs.job && (
                    <button 
                      onClick={() => setInputs({...inputs, job: ""})}
                      className="absolute right-2.5 top-2.5 text-[10px] text-gray-500 hover:text-gray-300"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

            </div>

            {/* Quick action buttons row */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              
              <button
                id="clear-all-btn"
                onClick={handleClearAllFields}
                type="button"
                className="py-2.5 border border-[#333333] hover:border-red-900/40 text-gray-400 hover:text-orange-200 text-xs font-serif rounded transition-all duration-200 bg-[#131313] hover:bg-red-950/10"
              >
                Clear All
              </button>

              <button
                id="randomize-all-btn"
                onClick={handleRandomizeAllInputs}
                type="button"
                className="py-2.5 border border-[#333333] hover:border-[#c5a059]/40 text-gray-400 hover:text-[#c5a059] text-xs font-serif rounded transition-all duration-200 flex justify-center items-center gap-1 bg-[#131313]"
              >
                <Shuffle className="h-3.5 w-3.5 text-[#c5a059]" /> Chaos Roll All
              </button>

            </div>

            {/* Massive generator button */}
            <button
              id="generate-npc-btn"
              onClick={handleGenerate}
              disabled={isLoading}
              className={`w-full mt-4 py-3 bg-[#c5a059] text-[#0a0a0a] hover:bg-[#d6b26d] font-bold text-xs uppercase tracking-widest rounded-md shadow-lg transition-all duration-300 flex justify-center items-center gap-2 ${
                isLoading ? "opacity-60 cursor-not-allowed animate-pulse" : "cursor-pointer"
              }`}
            >
              <Sparkles className="h-4 w-4 shrink-0" />
              {isLoading ? "Channeling the Ether..." : "Improvise & Summon NPC"}
            </button>

          </div>

          {/* QUICK REFERENCE CODEX SECTION: Save lists */}
          <div className="bg-[#111111] border border-[#222222] rounded-xl p-5 shadow-2xl flex-1 flex flex-col min-h-[220px]">
            
            <div className="flex justify-between items-center border-b border-[#222222] pb-3 mb-3">
              <h3 className="font-serif font-semibold text-white tracking-wide text-xs flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-[#c5a059]" /> Session Codex ({codex.length})
              </h3>
              {codex.length > 0 && (
                <button
                  onClick={() => {
                    if (confirm("Are you sure you want to purge the current Session Codex?")) {
                      setCodex([]);
                      setSelectedCodexId(null);
                      saveCodexToStorage([]);
                      playSound("whisper");
                    }
                  }}
                  className="text-[10px] text-red-500 hover:text-red-400 hover:underline"
                >
                  Purge List
                </button>
              )}
            </div>

            {codex.length === 0 ? (
              <div className="flex-1 flex flex-col justify-center items-center text-center p-6 border-2 border-dashed border-[#1f1f1f] rounded-lg">
                <Bookmark className="h-7 w-7 text-gray-700 mb-2 stroke-1" />
                <p className="text-[11px] text-[#666] font-serif">
                  No bookmarked NPCs in this grimoire yet. Tap <strong className="text-gray-400">Save to Codex</strong> on any generation to keep them ready!
                </p>
              </div>
            ) : (
              <div id="codex-scroll-list" className="flex-grow overflow-y-auto max-h-[280px] custom-scrollbar space-y-2 pr-1">
                {codex.map((item) => {
                  const isSelected = selectedCodexId === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleLoadCodexNpc(item)}
                      className={`group p-2.5 rounded border text-left cursor-pointer transition-all duration-300 relative ${
                        isSelected
                          ? "bg-[#1f1a14] border-[#c5a059]/60 text-white"
                          : "bg-[#141414] border-[#222222] hover:border-[#444] text-[#888] hover:text-[#ccc]"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className={`font-serif text-xs font-semibold ${isSelected ? "text-[#c5a059]" : "text-gray-300"}`}>
                            {item.name}
                          </p>
                          <p className="text-[10px] opacity-70 mt-0.5 line-clamp-1">
                            {item.race} • {item.job}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => handleDeleteCodexNpc(item.id, e)}
                            title="Remove from grimoire"
                            className="text-gray-500 hover:text-red-400 p-0.5"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>

                      {/* Small Inline Notes Section */}
                      {isSelected && (
                        <div className="mt-2 pt-2 border-t border-[#c5a059]/20" onClick={(e) => e.stopPropagation()}>
                          {editingNotesId === item.id ? (
                            <div className="flex flex-col gap-1.5">
                              <textarea
                                value={tempNotes}
                                onChange={(e) => setTempNotes(e.target.value)}
                                placeholder="Add DM campaign notes (e.g., 'Currently residing in Iron Crag inn, friendly to wizard players...')"
                                className="w-full bg-[#101010] border border-[#c5a059]/30 rounded p-1 text-[11px] text-white focus:outline-none"
                                rows={2}
                              />
                              <div className="flex justify-end gap-1.5">
                                <button
                                  onClick={() => setEditingNotesId(null)}
                                  className="text-[9px] text-gray-500 hover:text-gray-300 px-1.5 py-0.5 border border-[#333] rounded"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleSaveNotes(item.id)}
                                  className="text-[9px] bg-[#c5a059] text-black px-1.5 py-0.5 rounded font-bold"
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="text-[10px] text-gray-400 italic flex justify-between items-start gap-1">
                              <span className="flex-1 line-clamp-2">
                                {item.notes || "No DM notes yet. Click edit..."}
                              </span>
                              <button
                                onClick={() => {
                                  setEditingNotesId(item.id);
                                  setTempNotes(item.notes || "");
                                  playSound("whisper");
                                }}
                                className="text-[#c5a059] hover:underline shrink-0 text-[10px] font-serif ml-1"
                              >
                                Edit Notes
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

          </div>

        </section>

        {/* RIGHT COLUMN (Golden Preview Card Display): 8 cols */}
        <section id="npc-display-panel" className="lg:col-span-8 flex flex-col justify-start">
          
          {currentNpc ? (
            <div className="flex flex-col gap-4">
              
              {/* Main Imposing Codex Preview Card styled with elegant gold margins */}
              <div className="bg-[#111111] border border-[#222222] rounded-xl p-6 md:p-8 relative shadow-2xl transition-all duration-300">
                
                {/* Vintage gold ornamental framing corners */}
                <div className="absolute top-4 right-4 w-6 h-6 border-t border-r border-[#c5a059]"></div>
                <div className="absolute top-4 left-4 w-6 h-6 border-t border-l border-[#c5a059]/30"></div>
                <div className="absolute bottom-4 right-4 w-6 h-6 border-b border-r border-[#c5a059]/30"></div>
                <div className="absolute bottom-4 left-4 w-6 h-6 border-b border-l border-[#c5a059]"></div>

                {/* Badge Header & Time generated */}
                <div className="flex justify-between items-center mb-6 pl-2 pr-2">
                  <div className="inline-block px-3 py-1 border border-[#c5a059] text-[9px] font-medium tracking-[0.2em] uppercase text-[#c5a059]">
                    Fantasy Codex Output
                  </div>
                  <div className="text-right text-[10px] font-mono text-gray-600">
                    Muster Engine • {currentNpc.generatedAt}
                  </div>
                </div>

                {/* Major Container combining key description headers (portrait sketch was removed as requested) */}
                <div className="pb-6 border-b border-[#222222]">
                  
                  {/* Title & Attributes takes full width */}
                  <div className="w-full flex flex-col justify-center">
                    
                    <h2 id="npc-display-name" className="text-3xl md:text-4xl font-normal font-serif text-white tracking-tight mb-2 leading-none">
                      {currentNpc.name}
                    </h2>
                    
                    {/* Profession Title strip */}
                    <div className="flex items-center gap-2 mb-4">
                      <Briefcase className="h-3.5 w-3.5 text-[#c5a059]" />
                      <span className="text-xs uppercase tracking-wider text-[#c5a059] font-semibold">{currentNpc.job}</span>
                    </div>

                    {/* Compact, Scan-Friendly Bulleted Properties List */}
                    <div className="bg-[#141414] border border-[#222] rounded-xl p-5 mb-4 text-xs font-mono space-y-2.5">
                      <div className="flex items-center gap-2 pb-2 border-b border-[#222] text-[#c5a059] font-sans font-semibold tracking-wider uppercase text-[10px]">
                        <User className="h-3.5 w-3.5" /> Character Quick Profile
                      </div>
                      <ul className="space-y-3 text-gray-300">
                        <li className="flex flex-col sm:flex-row sm:items-baseline gap-1">
                          <span className="text-gray-500 font-sans uppercase text-[9px] tracking-wider min-w-[150px] shrink-0 font-medium font-semibold">Race / Species:</span>
                          <span className="text-white text-[13px] font-serif">{currentNpc.race}</span>
                        </li>
                        <li className="flex flex-col sm:flex-row sm:items-baseline gap-1">
                          <span className="text-gray-500 font-sans uppercase text-[9px] tracking-wider min-w-[150px] shrink-0 font-medium font-semibold">Current Age:</span>
                          <span className="text-white text-[13px] font-serif">{currentNpc.age || "Unknown"}</span>
                        </li>
                        <li className="flex flex-col sm:flex-row sm:items-baseline gap-1">
                          <span className="text-gray-500 font-sans uppercase text-[9px] tracking-wider min-w-[150px] shrink-0 font-medium font-semibold">Height / Stature:</span>
                          <span className="text-white text-[13px] font-serif">{currentNpc.height || "Unknown"}</span>
                        </li>
                        <li className="flex flex-col sm:flex-row sm:items-baseline gap-1">
                          <span className="text-gray-500 font-sans uppercase text-[9px] tracking-wider min-w-[150px] shrink-0 font-medium font-semibold">Gender:</span>
                          <span className="text-white text-[13px] font-serif">{currentNpc.gender || "Fluid"}</span>
                        </li>
                        <li className="flex flex-col sm:flex-row sm:items-baseline gap-1">
                          <span className="text-gray-500 font-sans uppercase text-[9px] tracking-wider min-w-[150px] shrink-0 font-medium font-semibold">Social Status:</span>
                          <span className="text-white text-[13px] font-serif">{currentNpc.socialStatus || "Middle Class"}</span>
                        </li>
                        <li className="flex flex-col gap-1.5 pt-1 border-t border-[#222222]/60 mt-1 pl-1">
                          <span className="text-gray-500 font-sans uppercase text-[9px] tracking-wider font-semibold">Hair Style:</span>
                          <ul className="space-y-1 pl-3 border-l border-[#c5a059]/30">
                            {(() => {
                              const hairDetails = splitStyleAndPalette(currentNpc.hairStyleColor, "Silver and Black");
                              return (
                                <>
                                  <li className="flex items-start gap-1.5 text-xs font-serif text-gray-300">
                                    <span className="text-[#c5a059]/70 select-none text-[10px]">•</span>
                                    <span>
                                      <span className="text-gray-500 font-sans uppercase text-[8px] tracking-wide font-semibold block sm:inline mr-1">Description:</span>
                                      <span className="text-gray-200">{hairDetails.style}</span>
                                    </span>
                                  </li>
                                  <li className="flex items-start gap-1.5 text-xs font-serif text-gray-300">
                                    <span className="text-[#c5a059]/70 select-none text-[10px]">•</span>
                                    <span>
                                      <span className="text-gray-500 font-sans uppercase text-[8px] tracking-wide font-semibold block sm:inline mr-1">Color Palette:</span>
                                      <span className="text-[#c5a059] font-medium">{hairDetails.palette}</span>
                                    </span>
                                  </li>
                                </>
                              );
                            })()}
                          </ul>
                        </li>
                        <li className="flex flex-col gap-1.5 pt-1.5 pl-1">
                          <span className="text-gray-500 font-sans uppercase text-[9px] tracking-wider font-semibold">Clothing & Garb:</span>
                          <ul className="space-y-1 pl-3 border-l border-[#c5a059]/30">
                            {(() => {
                              const clothingDetails = splitStyleAndPalette(currentNpc.clothingStyleColor, "Brown and Charcoal");
                              return (
                                <>
                                  <li className="flex items-start gap-1.5 text-xs font-serif text-gray-300">
                                    <span className="text-[#c5a059]/70 select-none text-[10px]">•</span>
                                    <span>
                                      <span className="text-gray-500 font-sans uppercase text-[8px] tracking-wide font-semibold block sm:inline mr-1">Description:</span>
                                      <span className="text-gray-200">{clothingDetails.style}</span>
                                    </span>
                                  </li>
                                  <li className="flex items-start gap-1.5 text-xs font-serif text-gray-300">
                                    <span className="text-[#c5a059]/70 select-none text-[10px]">•</span>
                                    <span>
                                      <span className="text-gray-500 font-sans uppercase text-[8px] tracking-wide font-semibold block sm:inline mr-1">Color Palette:</span>
                                      <span className="text-[#c5a059] font-medium">{clothingDetails.palette}</span>
                                    </span>
                                  </li>
                                </>
                              );
                            })()}
                          </ul>
                        </li>
                        <li className="flex flex-col sm:flex-row sm:items-baseline gap-1">
                          <span className="text-gray-500 font-sans uppercase text-[9px] tracking-wider min-w-[150px] shrink-0 font-medium font-semibold">Job / Role:</span>
                          <span className="text-amber-100/90 text-[13px] font-serif font-semibold">{currentNpc.job}</span>
                        </li>
                        
                        {/* Break down visual summary into quickly digestable bullet points */}
                        <li className="flex flex-col gap-2 pt-3 border-t border-[#1d1d1d]">
                          <span className="text-gray-500 font-sans uppercase text-[9px] tracking-wider font-semibold">Visual Summary Overview:</span>
                          <ul className="space-y-2 pl-3 border-l-2 border-[#c5a059]/40 mt-1">
                            {currentNpc.shortDescription
                              .replace(/([.!?])\s+/g, "$1|")
                              .split("|")
                              .map(s => s.trim())
                              .filter(s => s.length > 0)
                              .map((sentence, idx) => (
                                <li key={idx} className="text-gray-300 text-[12px] font-serif flex items-start gap-2 leading-relaxed">
                                  <span className="text-[#c5a059] mt-1 shrink-0 text-[11px]">♦</span>
                                  <span>{sentence}</span>
                                </li>
                              ))}
                          </ul>
                        </li>
                      </ul>
                    </div>
 
                  </div>
 
                </div>

                {/* Collapsible Panel for Campaign Details & DM Lore */}
                <div className="mt-6 border-t border-[#1e1e1e] pt-5">
                  <button
                    onClick={() => {
                      setShowExtraDetails(!showExtraDetails);
                      playSound("chime");
                    }}
                    id="toggle-extra-details-btn"
                    className="w-full flex justify-between items-center py-3 px-4 bg-[#141414] hover:bg-[#1a1a1a] border border-[#222] rounded-lg transition-all duration-200 text-xs uppercase tracking-wider font-semibold text-[#c5a059]"
                  >
                    <span className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      {showExtraDetails ? "Hide Expanded Campaign Details" : "Show Expanded Campaign Details & Secrets"}
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono">
                      {showExtraDetails ? "Collapse ▾" : "Expand ▴"}
                    </span>
                  </button>

                  {showExtraDetails && (
                    <div className="mt-6 space-y-6 pt-2 animate-fade-in">
                      
                      {/* Quirk / Mannerism and Personality in grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        {/* Quirk / Mannerism item */}
                        <div className="bg-[#141414] border border-[#222] rounded-xl p-4.5">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-orange-400 font-sans block mb-1.5">
                            Mannerisms & Gestures
                          </span>
                          <p id="npc-mannerism-text" className="text-xs text-gray-300 leading-relaxed font-serif">
                            {currentNpc.mannerisms || "No particular quirks noted."}
                          </p>
                        </div>

                        {/* Personality Indicators bullet list */}
                        <div className="bg-[#141414] border border-[#222] rounded-xl p-4.5 flex flex-col justify-start">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-[#c5a059] font-sans block mb-2.5">
                            Personality Disposition
                          </span>
                          <ul className="space-y-1.5 mt-1 list-none pl-1">
                            {currentNpc.personality.map((trait, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-xs font-serif text-gray-300">
                                <span className="text-[#c5a059] text-[9px] select-none">•</span>
                                <span className="font-mono text-[11px] uppercase tracking-wide text-amber-500/90 font-medium">{trait}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                      </div>

                      {/* Carried Equipment / Small Inventory Slot grid */}
                      <div className="bg-[#131313]/50 border border-[#1e1e1e] rounded-xl p-5">
                        <h3 className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-3">
                          Carried Equipment & Curiosities (Inventory)
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {currentNpc.equipment.map((item, idx) => (
                            <div key={idx} className="bg-[#121212]/90 border border-dashed border-[#222] p-2.5 rounded flex items-start gap-2 text-xs font-serif text-gray-300">
                              <span className="bg-[#1c1c1c] w-5 h-5 rounded-full flex items-center justify-center font-mono text-[9px] text-[#c5a059] border border-[#2d2d2d] shrink-0">
                                {idx + 1}
                              </span>
                              <p>{item}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  )}
                </div>

                {/* Card controls row bookmark/copy */}
                <div className="mt-8 flex flex-col sm:flex-row justify-between items-center bg-[#0d0d0d] border border-[#222] px-4 py-3 rounded-lg gap-4">
                  <div className="text-[11px] text-gray-500 font-serif">
                    Save this generated character sheet to prevent losing it on the next click.
                  </div>
                  <div className="flex gap-2.5 w-full sm:w-auto">
                    
                    <button
                      id="copy-clipboard-btn"
                      onClick={handleCopyToClipboard}
                      className="flex-1 sm:flex-none px-4 py-2 bg-[#171717] border border-[#2a2a2a] hover:border-[#444] text-xs text-gray-300 font-serif hover:text-white rounded flex justify-center items-center gap-1.5 active:bg-[#1a1a1a]"
                    >
                      {copied ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-green-500" /> Copied Text
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5 text-gray-400" /> Copy Text Sheet
                        </>
                      )}
                    </button>

                    <button
                      id="save-codex-btn"
                      onClick={handleBookmarkNpc}
                      className="flex-1 sm:flex-none px-4 py-2 bg-[#1c1917] border border-[#c5a059]/40 hover:border-[#c5a059] text-xs text-[#c5a059] font-serif font-medium hover:text-white hover:bg-[#2e261d] rounded flex justify-center items-center gap-1.5"
                    >
                      <Bookmark className="h-3.5 w-3.5" /> Save to Codex
                    </button>

                  </div>
                </div>

              </div>

            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-center items-center text-center p-12 border-2 border-dashed border-[#222] rounded-xl bg-[#0d0d0d]">
              <Wand2 className="h-12 w-12 text-[#c5a059] mb-4 animate-pulse stroke-1" />
              <h2 className="text-xl font-serif text-white mb-2">Ready to Improvise</h2>
              <p className="text-sm text-gray-500 max-w-sm font-serif">
                Select your parameters in the left panel or click Chaos Roll and hit Summon to materialize a fully generated character here!
              </p>
            </div>
          )}

        </section>

      </main>

      {/* Elegant minimalist footer section */}
      <footer id="enpc-footer" className="bg-[#070707] border-t border-[#1a1a1a] py-6 px-6 mt-12 text-center text-xs text-gray-600 font-serif">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 E-NPC Grimoire — Improvisational tool for Tabletop Dungeon Masters.</p>
          <div className="flex gap-4">
            <span className="text-gray-500">Theme: Elegant Dark</span>
            <span className="text-[#c5a059]">Active Session: Iron Crags</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
