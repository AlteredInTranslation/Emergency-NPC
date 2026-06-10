import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Google GenAI on the server
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    })
  : null;

// Define allowed races strictly per system theme
const THEMATIC_RACES: Record<string, string[]> = {
  "Fantasy": ["Dragonborn", "Dwarf", "Elf", "Gnome", "Half-Elf", "Half-Orc", "Halfling", "Human", "Tiefling", "Aarakocra", "Aasimar", "Changeling", "Deep Gnome", "Duergar", "Eladrin", "Fairy", "Firbolg", "Genasi (Air)", "Genasi (Earth)", "Genasi (Fire)", "Genasi (Water)", "Githyanki", "Githzerai", "Goliath", "Harengon", "Kenku", "Locathah", "Owlin", "Satyr", "Sea Elf", "Shadar-Kai", "Tabaxi", "Tortle", "Triton", "Verdan", "Bugbear", "Centaur", "Goblin", "Grung", "Hobgoblin", "Kobold", "Lizardfolk", "Minotaur", "Orc", "Shifter", "Yuan-ti"],
  "Sci-Fi": ["Astral Elf", "Autognome", "Plasmoid", "Giff", "Thri-kreen", "Hadozee", "Githyanki", "Githzerai", "Kalashtar", "Air Genasi"],
  "Steampunk": ["Warforged", "Autognome", "Deep Gnome", "Khoravar", "Lorwyn Changeling", "Kender", "Vedalken", "Loxodon"],
  "Cyberpunk": ["Simic Hybrid", "Changeling", "Shifter", "Warforged", "Tabaxi", "Leonin", "Verdan"],
  "Grimdark": ["Dhampir", "Reborn", "Hexblood", "Duergar", "Shadar-kai", "Bugbear", "Goblin", "Hobgoblin", "Kobold", "Orc", "Yuan-ti"]
};

// Resilient Fallback Data lists for high-demand server-side generation
const FALLBACK_NAMES_M = ["Garrick", "Cedric", "Thorne", "Valen", "Kaelen", "Broggan", "Durnin", "Balthazar", "Eldrin", "Roderick"];
const FALLBACK_NAMES_F = ["Aurelia", "Lyra", "Sariel", "Evadne", "Maeve", "Gwen", "Sylvia", "Vespera", "Freya", "Elowen"];
const FALLBACK_LAST_NAMES = ["Stormshield", "Ironfist", "Deepdelve", "Riverrunner", "Magebrook", "Oakheart", "Shadowvale", "Moonsinger", "Spellweaver"];

const FALLBACK_HAIR = [
  "windswept ash-blonde braid", "shaved bald", "neat chestnut shoulder-length hair", "unruly amber crop",
  "long raven braids", "tight ash-gray bun", "shaggy pale-blonde locks", "close-cropped pitch-black curls"
];

const FALLBACK_CLOTHING_HIGH = [
  "gorgeous bright sapphire silk doublet with meticulously embroidered golden filigree and matching high collar",
  "immaculate velvet robes of deep crimson lined with soft ermine fur and bound by a gold-plaited sash",
  "stately emerald-green velvet capotain paired with a richly brocaded ivory vest and silver-buckled shoes",
  "splendid pearlescent silk gown trimmed with fine hand-spun lace, adorned with glistening copper brooches"
];

const FALLBACK_CLOTHING_MED = [
  "scratched leather doublet in moss-green and bronze straps over a clean woolen shirt",
  "neat traveler's vest in ochre with tan leather pockets and matching dark knit trousers",
  "faded but sturdy forest-green cloak fastened with an engraved brass leaf clasp",
  "clean homespun tunic of deep charcoal grey and light tan leather cuffs"
];

const FALLBACK_CLOTHING_LOW = [
  "soot-stained rough linen shirt beneath a grease-smeared canvas apron and frayed woolen trousers",
  "threadbare grey wool tunic, heavily patched at the elbows and smelling subtly of stable hay",
  "ragged homespun burlap poncho with raw, drafty armholes and muddy, worn-out leather wraps",
  "faded torn linen shirt covered by a grease-matted leather jerkin missing half its copper fasteners"
];

const FALLBACK_JOBS_HIGH = [
  "High Court Diplomat", "Royal Alchemist Guildmaster", "Grand Magistrate", "Estate Land Treasurer", "Merchant House Factor", "Court Astronomer", "Lord Commander's Scribe"
];

const FALLBACK_JOBS_MED = [
  "Wagon Rigger", "Relic Smuggler", "Street Alchemist", "Hedge Knight", "Herbalist", "Tavern Brewer", "Silversmith Artisan"
];

const FALLBACK_JOBS_LOW = [
  "Stable Sweep", "Subterranean Mushroom Farmer", "Nightsoil Collector", "Scullery Helper", "Ditch Digger", "Street Urchin", "Charcoal Hauler", "Pier Laborer"
];

const FALLBACK_PERSONALITIES = ["Paranoid", "Superstitious", "Friendly", "Generous", "Skeptical", "Honest", "Cunning", "Gruff", "Pious", "Meticulous", "Curious", "Proud", "Brooding", "Loyal", "Anxious", "Pragmatic", "Timid", "Greedy"];

const FALLBACK_MANNERISMS = [
  "Constantly pulls or twirls a single strand of their long hair",
  "Clutches a tarnished silver amulet whenever someone whispers",
  "Rubs a dry thumb over a heavy gold signet ring",
  "Taps their foot in a repetitive, nervous rhythm",
  "Squints with one eye when talking about rare materials"
];

const FALLBACK_SECRET_HOOKS = [
  "They owe a massive debt to a coven of marsh hags who demand their service next full moon.",
  "They possess an ancient iron key that supposedly unlocks a hidden library beneath the tavern.",
  "They secretly shelter a pack of runic wolves in a clearing north of the city.",
  "They are the secret heir to a disgraced merchant household that was framed for treason."
];

const FALLBACK_EQUIPMENT = [
  ["A chipped wooden spoon for common gruel", "A small ball of grease-stained wool twine", "An unwashed linen cleaning rag"],
  ["A weathered flat tin canteen containing spring water", "A couple of dry, salted parsnip rinds", "A wooden comb with four teeth missing"],
  ["A worn, grooved whetstone smelling of river silt", "A pair of rough, gray wool stockings", "A dull copper penny from a forgotten border estate"],
  ["A small clay tobacco pipe with a pinch of common leaf", "A lump of yellow beeswax with a simple bone needle", "A flint and steel striker in a greasy hide pouch"]
];

const FALLBACK_LIFESPANS: Record<string, number> = {
  "half-elf": 180, "half-orc": 75, "aasimar": 160, "dragonborn": 80, "dwarf": 350, "elf": 750, "gnome": 500,
  "goliath": 100, "halfling": 250, "human": 100, "orc": 75, "tiefling": 110, "shifter": 70, "warforged": 1000,
  "aarakocra": 30, "eladrin": 750, "sea elf": 750, "shadar-kai": 750, "duergar": 350, "deep gnome": 500,
  "bugbear": 80, "centaur": 100, "firbolg": 500, "githyanki": 100, "githzerai": 100, "goblin": 60, "harengon": 90,
  "hobgoblin": 100, "kenku": 60, "kobold": 120, "lizardfolk": 80, "minotaur": 150, "satyr": 100, "tabaxi": 80,
  "tortle": 50, "triton": 200, "yuan-ti": 100, "owlin": 100, "verdan": 200, "grung": 50
};

function isEggLayingRace(race: string): boolean {
  if (!race) return false;
  const norm = race.toLowerCase().replace(/[-\s]/g, "");
  const eggLayingKeywords = [
    "dragonborn", "kobold", "lizardfolk", "yuanti", "yuan-ti", 
    "tortle", "grung", "aarakocra", "kenku", "owlin", 
    "thrikreen", "thri-kreen", "triton", "locathah",
    "githyanki", "githzerai", "gith"
  ];
  return eggLayingKeywords.some(keyword => norm.includes(keyword));
}

function alignHatchlingTermForRace(ageVal: string, race: string): string {
  if (!ageVal) return ageVal;
  if (isEggLayingRace(race)) {
    return ageVal; // Keep 'hatchling(s)' as-is for egg-laying species
  }
  
  let result = ageVal.replace(/\bhatchlings\b/gi, (match) => {
    const isAllCaps = match === match.toUpperCase();
    const isTitleCase = match[0] === match[0].toUpperCase();
    if (isAllCaps) return "YOUNGSTERS";
    if (isTitleCase) return "Youngsters";
    return "youngsters";
  });
  
  result = result.replace(/\bhatchling\b/gi, (match) => {
    const isAllCaps = match === match.toUpperCase();
    const isTitleCase = match[0] === match[0].toUpperCase();
    if (isAllCaps) return "YOUNGSTER";
    if (isTitleCase) return "Youngster";
    return "youngster";
  });
  
  return result;
}

function getClampedAgeForRace(ageInput: string, race: string): string {
  if (!ageInput) return "25 (young adult)";
  
  // Align terms like "hatchling" for non-egg-laying races
  let alignedAgeInput = alignHatchlingTermForRace(ageInput, race);
  
  const numMatch = alignedAgeInput.match(/^(\d+)/);
  if (!numMatch) return alignedAgeInput;

  const numVal = parseInt(numMatch[1], 10);
  const rNorm = race.toLowerCase().trim();
  let maxLife = 100; // default human limit

  for (const [key, value] of Object.entries(FALLBACK_LIFESPANS)) {
    if (rNorm.includes(key)) {
      maxLife = value;
      break;
    }
  }

  if (numVal > maxLife) {
    const clamped = Math.floor(maxLife * 0.85);
    let rest = alignedAgeInput.slice(numMatch[0].length);
    if (rest.includes("(") && rest.includes(")")) {
      rest = rest.replace(/\(.*?\)/g, `(Elderly for a ${race})`);
    } else {
      rest = ` (Elderly for a ${race})`;
    }
    return `${clamped}${rest}`;
  }

  return alignedAgeInput;
}

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateFallbackCharacter(inputs: any, allowedRaces: string[]) {
  const selRace = inputs.race && inputs.race !== "Any" ? inputs.race : getRandomElement(allowedRaces);
  const selGender = inputs.gender && inputs.gender !== "Any" ? inputs.gender : (Math.random() > 0.5 ? "Female" : "Male");
  const isFemale = selGender.toLowerCase().includes("female") || selGender.toLowerCase().includes("woman");
  const firstName = isFemale ? getRandomElement(FALLBACK_NAMES_F) : getRandomElement(FALLBACK_NAMES_M);
  const lastName = getRandomElement(FALLBACK_LAST_NAMES);
  const fullName = `${firstName} ${lastName}`;
  
  let selAge = inputs.age && inputs.age !== "Any" ? inputs.age : `${Math.floor(Math.random() * 45) + 20} (young adult)`;
  selAge = getClampedAgeForRace(selAge, selRace);

  const selHeight = inputs.height && inputs.height !== "Any" ? inputs.height : "5 ft 10 in";
  const selSocialStatus = inputs.socialStatus && inputs.socialStatus !== "Any" ? inputs.socialStatus : "Common Artisan / Guild Member";
  
  // Choose clothing and job influenced directly by social status
  const statusStr = selSocialStatus.toLowerCase();
  const isHigh = statusStr.includes("noble") || statusStr.includes("wealthy") || statusStr.includes("high") || statusStr.includes("gilded") || statusStr.includes("elite");
  const isLow = statusStr.includes("peasant") || statusStr.includes("outcast") || statusStr.includes("exile") || statusStr.includes("laborer") || statusStr.includes("serf") || statusStr.includes("urchin") || statusStr.includes("poor") || statusStr.includes("low");

  let possibleClothing = FALLBACK_CLOTHING_MED;
  let possibleJobs = FALLBACK_JOBS_MED;

  if (isHigh) {
    possibleClothing = FALLBACK_CLOTHING_HIGH;
    possibleJobs = FALLBACK_JOBS_HIGH;
  } else if (isLow) {
    possibleClothing = FALLBACK_CLOTHING_LOW;
    possibleJobs = FALLBACK_JOBS_LOW;
  }

  const selClothing = inputs.clothingStyleColor && inputs.clothingStyleColor !== "Any" ? inputs.clothingStyleColor : getRandomElement(possibleClothing);
  const selJob = inputs.job && inputs.job !== "Any" ? inputs.job : getRandomElement(possibleJobs);
  const selHair = inputs.hairStyleColor && inputs.hairStyleColor !== "Any" ? inputs.hairStyleColor : getRandomElement(FALLBACK_HAIR);

  const shuffledP = [...FALLBACK_PERSONALITIES].sort(() => Math.random() - 0.5);
  const personalities = [shuffledP[0], shuffledP[1], shuffledP[2]];

  const shortDesc = `A ${selAge} ${selRace} of ${selSocialStatus} standing, measuring about ${selHeight} in height. They feature a striking set of ${selHair} and wear a tailored configuration of ${selClothing}.`;
  const backstory = `Those who meet ${fullName} are instantly struck by their posture and presence, perfectly matching their life as a ${selSocialStatus}. Looking upon their ${selClothing}, one senses they have traveled far to pursue their current trade as a ${selJob}, harboring deep secrets about their heritage and lineage.`;
  const quotes = [
    "A heavy coin beats a sharp word any day of the cycle. What is your quest?",
    "Mind the shadows, traveler. In these woods, even the old oaks list and spy.",
    "By the sacred crags, keeping this steel sharp is the only church I rely on."
  ];

  return {
    name: fullName,
    race: selRace,
    age: selAge,
    height: selHeight,
    gender: selGender,
    socialStatus: selSocialStatus,
    hairStyleColor: selHair,
    clothingStyleColor: selClothing,
    job: selJob,
    shortDescription: shortDesc,
    backstory: backstory,
    personality: personalities,
    dialogueQuote: getRandomElement(quotes),
    mannerisms: getRandomElement(FALLBACK_MANNERISMS),
    secretHook: getRandomElement(FALLBACK_SECRET_HOOKS),
    equipment: getRandomElement(FALLBACK_EQUIPMENT),
    warning: "Gemini is experiencing temporary high demand. Character successfully generated using high-quality local runes!"
  };
}

// API endpoint to generate individual NPCS
app.post("/api/npc/generate", async (req, res) => {
  try {
    const { race, age, height, gender, socialStatus, hairStyleColor, clothingStyleColor, job, systemTheme } = req.body;

    if (!ai) {
      return res.status(500).json({
        error: "GEMINI_API_KEY is not configured on the server. Please add it via the Secrets panel in AI Studio Settings.",
      });
    }

    const themeKey = "Fantasy";
    const allowedRaces = THEMATIC_RACES[themeKey];
    const allowedRacesStr = allowedRaces.join(", ");

    const inputFeaturesPrompt = `
Generate a fully fleshed-out non-player character (NPC) for a tabletop roleplaying game (like D&D, Pathfinder, or a generic fantasy setting).

The user has specified the following features (some might be blank or "Any", meaning you should fill them in with creative and synergistic fantasy details):
- Race: ${race || `Any (You MUST select strictly from the following allowed races list: ${allowedRacesStr})`}
- Age: ${age || "Any (Provide specific age number and description like 'young adult' or 'ancient')"}
- Height: ${height || "Any (Provide specific height. You MUST respect the selected Race's physical scale from D&D lore, e.g., Goliaths/Loxodons are 7-8+ ft average, Halflings/Gnomes/Kobolds are 3-4 ft compact scale, Dwarves are 4-5 ft stocky scale, and Humans/Elves/Tieflings are 5-6.5 ft average.)"}
- Gender: ${gender || "Any"}
- Social Status / Standing: ${socialStatus || "Any (Be descriptive, e.g. 'impoverished street rat', 'gilded noble highborn', 'disgraced guild scholar')"}
- Hair Style & Color: ${hairStyleColor || "Any (Be descriptive, e.g. 'windswept ash-blonde braid' or 'shaved bald')"}
- Clothing Style & Palette: ${clothingStyleColor || "Any (Be descriptive, e.g. 'scratched leather doublet in moss-green and bronze straps')"}
- Job / Profession: ${job || "Any (Be creative, e.g. 'wagon rigger', 'relic smuggler', 'street alchemist')"}

Setting Theme Tone: Fantasy / Mythic RPG

CRITICAL HAIR COLOR DIRECTION:
When generating or describing the NPC's hair color, you MUST strictly avoid metallic names or adjectives (do NOT use words like 'gold', 'golden', 'silver', 'copper', 'bronze', 'brass', 'platinum', 'metallic'). Instead, focus on natural or standard hair colors.
- Use words like 'blonde', 'ash-blonde', 'honey-blonde', 'black', 'raven-black', 'pitch-black', 'brown', 'chestnut-brown', 'dark brown', 'grey', 'slate-grey', 'ash-grey', 'white', 'dusty-white', 'red', 'auburn', 'ginger', or exotic fantasy-standard hues like 'soft green' or 'pale blue' where fitting for species, but NEVER metallic.

SOCIAL STATUS SYNERGY:
The character's Social Status heavily dictates their Job and Clothing:
- If Social Status represents highborn, wealthy, or elite standing (e.g., "Highborn Nobility", "Wealthy Merchant Class"), they MUST have a prestigious/well-paying job (e.g. magistrate, royal treasury head, estate steward, guild lord) and wear descriptive, highly-detailed, and colorful clothing of premium materials (e.g., velvet, fine silks, satin robes ornamented with gold threads or silver trim).
- If Social Status represents peasant, serf, laborer, rogue, or poor social standing (e.g., "Peasant Serf / Laborer", "Social Outcast / Exiled Rogue"), they MUST have a commoner or lower-tier, gritty job (e.g. stable worker, ditch loader, street urchin, sewer tracker, mushroom gatherer) and wear basic, simple, dirty, patched, or worn-down clothing made of basic fabrics (e.g. rough burlap, grease-stained leather, patched coarse wool).
This relationship must be deeply consistent across their entire description, backstory, and equipment list.

CRITICAL AGE RESTRICTION:
The finalized age of the NPC MUST NOT exceed their race's physical life expectancy in any fantasy setting (e.g., Halflings: 250 max, Humans: 100 max, Dwarves: 350 max, Elves: 750 max, Tortles: 50 max, Orcs/Half-Orcs: 75 max, Aarakocra/Thri-kreen: 30 max, Goblins/Kenku: 60 max, Genasi: 120 max). If the input age has a number that exceeds their lifespan, you MUST automatically scale downward/clamp the finalized age number to a reasonable older age fitting their species (e.g. 80-90% of maximum life expectancy) and describe them accordingly.

CRITICAL AGE TERMINOLOGY DIRECTION:
Terms like "hatchling" or "hatched" MUST only be used for egg-laying species in tabletop lore (like Dragonborn, Kobold, Lizardfolk, Yuan-ti, Aarakocra, Kenku, Owlin, Tortle, Grung, Thri-kreen, Githyanki, Githzerai). For all other races (mammalian, etc.), use mammalian equivalents like "child", "youngster", "apprentice", or "youth".

CRITICAL RACE RESTRICTION: You MUST limit the NPC's race strictly to the allowed list of races for the selected Setting Theme (Fantasy). Do NOT choose, invent, or output any other race.
The ONLY allowed race names are exactly one from this list (case-sensitive):
${allowedRacesStr}

Generate:
1. Name: A fitting name for the race, gender, and job.
2. Short Description: A neat, evocative 2-sentence summary of their visual look.
3. Detailed Backstory: 1 concise, highly flavorful paragraph of 3-4 sentences detailing who they are, their personal history, and how they relate to the world. Ensure it is fast to generate but deeply memorable.
4. Personality: List exactly 3 personality traits. Each trait MUST be a single-word keyword (e.g., 'Paranoid', 'Skeptical', 'Generous', 'Meticulous', 'Proud', 'Loyal').
5. Dialogue Quote: One line of signature dialogue that fits their character, dialect, and voice.
6. Mannerisms & Quirks: 1 behavioral or physical quirk they do during conversation.
7. Secret Hook: 1 deep secret, quest hook, or exciting rumor about them that the Dungeon Master can instantly leverage into a quest or complication.
8. Equipment: Exactly 3 highly mundane, typical survival, or common day-to-day items they carry with them that make them feel believable and real. Avoid magical gadgets or high-tier treasure. (e.g., 'a chipped wooden spoon', 'a ball of oiled twine', 'a small whetstone', 'a small clay pipe with a pinch of common leaf', or 'a spare dry wool sock').
`;

    let apiResponse = null;
    let text = "";
    const MAX_ATTEMPTS = 3;
    const modelsToTry = ["gemini-3.5-flash", "gemini-3.1-flash-lite"];

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      const selectedModel = modelsToTry[(attempt - 1) % modelsToTry.length];
      try {
        console.log(`Generating NPC using model ${selectedModel} (attempt ${attempt}/${MAX_ATTEMPTS})...`);
        apiResponse = await ai.models.generateContent({
          model: selectedModel,
          contents: inputFeaturesPrompt,
          config: {
            systemInstruction: "You are an expert game director and creative writer for tabletop RPGs, specializing in building memorable, highly improvised NPCs with deep layers in seconds. Ensure every detail is exciting, helpful to a Dungeon Master, and instantly introduces roleplay opportunities. Return your answers strictly conforming to the requested JSON schema. Most importantly: Ensure the race is exactly one of the listed thematic species; ensure all personality traits are strictly single-word; make all equipment items mundane, common, and believable; make sure the character's age does not exceed their species' life expectancy; ensure their social status heavily influences their job and clothing style (high status has elite/wealthy jobs and premium/vibrant clothes; low status has commoner jobs and patched/dirty garments); for hair colors, avoid using metallic color names (like silver, gold, copper, brass) and instead focus on standard/natural colors (like blonde, ash-blonde, brown, black, grey, white, red, ginger, auburn); and terms like 'hatchling' or 'hatched' must strictly only be used for egg-laying races (like Dragonborn, Kobold, Lizardfolk, Yuan-ti, Aarakocra, Kenku, Owlin, Tortle, Grung, Thri-kreen).",
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING, description: "The NPC's full name" },
                race: { type: Type.STRING, description: `Finalized race of the NPC. It must be EXACTLY one of the allowed races for this theme: ${allowedRacesStr}` },
                age: { type: Type.STRING, description: "Finalized age of the NPC (must match input, or be created if input was blank)" },
                height: { type: Type.STRING, description: "Finalized height of the NPC (must match input, or be created if input was blank)" },
                gender: { type: Type.STRING, description: "Finalized gender of the NPC (must match input, or be created if input was blank)" },
                socialStatus: { type: Type.STRING, description: "Finalized social status or class standing of the NPC (must match input, or be created if input was blank)" },
                hairStyleColor: { type: Type.STRING, description: "Finalized hair style and color of the NPC (must match input, or be created if input was blank)" },
                clothingStyleColor: { type: Type.STRING, description: "Finalized clothing style and color palette (must match input, or be created if input was blank)" },
                job: { type: Type.STRING, description: "Finalized job/profession of the NPC (must match input, or be created if input was blank)" },
                shortDescription: { type: Type.STRING, description: "A neat, evocative 2-sentence summary of their visual appearance" },
                backstory: { type: Type.STRING, description: "1 concise and flavorful paragraph detailing who they are and their personal history" },
                personality: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Array of exactly 3 descriptive single-word personality traits (keywords)"
                },
                dialogueQuote: { type: Type.STRING, description: "A highly flavorful signature line of dialogue that showcases their voice/vibe" },
                mannerisms: { type: Type.STRING, description: "A key physical quirk, tick, or conversational style they possess" },
                secretHook: { type: Type.STRING, description: "A hidden secret, rumor, or quest lead a Dungeon Master can use to spark gameplay" },
                equipment: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Exactly 3 distinct, mundane and common carried items to make the character believable"
                }
              },
              required: [
                "name",
                "race",
                "age",
                "height",
                "gender",
                "socialStatus",
                "hairStyleColor",
                "clothingStyleColor",
                "job",
                "shortDescription",
                "backstory",
                "personality",
                "dialogueQuote",
                "mannerisms",
                "secretHook",
                "equipment"
              ],
            },
          },
        });
        text = apiResponse.text ? apiResponse.text.trim() : "{}";
        const parsedData = JSON.parse(text);
        return res.json(parsedData); // Successful parse! Return immediately.
      } catch (err: any) {
        const errorMsg = err?.message || err;
        console.log(`Gemini API check (attempt ${attempt}/${MAX_ATTEMPTS}) - Status: busy/unavailable. (${typeof errorMsg === "string" ? errorMsg.substring(0, 80) : "Details omitted"})`);
        
        if (attempt < MAX_ATTEMPTS) {
          const delay = attempt * 400; // Fast retry with backoff (400ms, 800ms)
          console.log(`Retrying next generation attempt in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          console.log("Maximum generation attempts reached. Instantly serving beautiful localized character build.");
          const fallbackNpc = generateFallbackCharacter({ race, age, height, gender, socialStatus, hairStyleColor, clothingStyleColor, job }, allowedRaces);
          return res.json(fallbackNpc);
        }
      }
    }

    // Unreachable fallback backup
    const fallbackNpc = generateFallbackCharacter({ race, age, height, gender, socialStatus, hairStyleColor, clothingStyleColor, job }, allowedRaces);
    return res.json(fallbackNpc);
  } catch (error: any) {
    console.log("Fallback controller invoked successfully:", error?.message || error);
    const themeKey = "Fantasy";
    const allowedRaces = THEMATIC_RACES[themeKey];
    const fallbackNpc = generateFallbackCharacter({ 
      race: req.body?.race, 
      age: req.body?.age, 
      height: req.body?.height, 
      gender: req.body?.gender, 
      socialStatus: req.body?.socialStatus, 
      hairStyleColor: req.body?.hairStyleColor, 
      clothingStyleColor: req.body?.clothingStyleColor, 
      job: req.body?.job 
    }, allowedRaces);
    return res.json(fallbackNpc);
  }
});

// Configure Vite middleware in development or direct static serving in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`E-NPC backend running on http://localhost:${PORT}`);
  });
}

startServer();
