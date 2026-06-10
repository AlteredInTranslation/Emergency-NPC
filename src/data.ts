/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SettingTheme, NpcInputs } from "./types";

export interface ThematicPresets {
  races: string[];
  genders: string[];
  ages: string[];
  heights: string[];
  socialStatuses: string[];
  hairStyles: string[];
  clothingStyles: string[];
  jobs: string[];
}

export const THEMES: SettingTheme[] = ["Fantasy"];

export const REELS_DATA: Record<SettingTheme, ThematicPresets> = {
  Fantasy: {
    races: ["Dragonborn", "Dwarf", "Elf", "Gnome", "Half-Elf", "Half-Orc", "Halfling", "Human", "Tiefling", "Aarakocra", "Aasimar", "Changeling", "Deep Gnome", "Duergar", "Eladrin", "Fairy", "Firbolg", "Genasi (Air)", "Genasi (Earth)", "Genasi (Fire)", "Genasi (Water)", "Githyanki", "Githzerai", "Goliath", "Harengon", "Kenku", "Locathah", "Owlin", "Satyr", "Sea Elf", "Shadar-Kai", "Tabaxi", "Tortle", "Triton", "Verdan", "Bugbear", "Centaur", "Goblin", "Grung", "Hobgoblin", "Kobold", "Lizardfolk", "Minotaur", "Orc", "Shifter", "Yuan-ti"],
    genders: ["Female", "Male", "Non-binary", "Genderfluid", "Agender"],
    ages: ["19 (Youthful & Impulsive)", "34 (Aged like steel)", "72 (Grizzled veteran)", "143 (Middle-aged for an elf)", "280 (Ancient & Wise Dwarf)", "8 (Precocious hatchling)"],
    heights: ["3'2\" (Petite Gnome/Halfling scale)", "4'8\" (Short & stocky Dwarf scale)", "5'6\" (Average humanoid height)", "6'2\" (Stately & elegant stature)", "7'4\" (Towering Goliath-like height)"],
    socialStatuses: [
      "Highborn Nobility",
      "Wealthy Merchant Class",
      "Common Artisan / Guild Member",
      "Peasant Serf / Laborer",
      "Social Outcast / Exiled Rogue",
      "Monastic Clergy / Hermit"
    ],
    hairStyles: [
      "Braided deep-blonde crown with emerald beads",
      "Windswept dusty-white mane, unkempt",
      "Shaved head with runic blue tattoos",
      "Fiery red ponytail tied with twine",
      "Curly raven hair decorated with tiny bones",
      "Completely bald, polished with holy oils",
      "Long moss-green locs decorated with small field flowers",
      "Matted gray beard reaching down to the leather belt"
    ],
    clothingStyles: [
      "Faded forest-green tunic, mud-stained boots & worn leather vest",
      "Immaculate velvet wizard robes in burgundy with gold starry lining",
      "Soot-stained blacksmith leather apron over a chainmail undershirt",
      "Scratched iron plate armor covered in a weather-beaten crimson cape",
      "Richly embroidered indigo silk doublet with polished silver spurs",
      "Ragged burlap cowl in earth tones with bird feathers sewn into the shoulders",
      "Gilded ceremonial robes in pearl-white and gold with a heavy sun clasp"
    ],
    jobs: [
      "Hedge Wizard / Potion Seller",
      "Ruin Delver / Tomb Robber",
      "Royal Tax Collector",
      "Disgraced Paladin on a penance quest",
      "Falconer / Wild Tracker",
      "Subterranean Mushroom Farmer",
      "Street Urchin & Lockpicker",
      "Monster Gland Harvester",
      "Tavern Minstrel with a hidden dagger",
      "Gargoyle Sculptor"
    ]
  },
  "Sci-Fi": {
    races: ["Astral Elf", "Autognome", "Plasmoid", "Giff", "Thri-kreen", "Hadozee", "Githyanki", "Githzerai", "Kalashtar", "Air Genasi"],
    genders: ["Male Variant", "Female Variant", "Non-binary System", "None / Unassigned", "Androgynous Model"],
    ages: ["22 (Fresh out of the cryo-pod)", "45 (Veteran of the Rim Wars)", "97 (Sustained by sub-dermal stims)", "5 (Newly booted AI consciousness)", "120 (Cybernetically extended elder)"],
    heights: ["155 cm (Light gravity adapted)", "178 cm (Standard Earth-equivalent)", "192 cm (Tall, thin orbital-born)", "210 cm (Large engineered brute weight class)", "90 cm (Compact drone chassis height)"],
    socialStatuses: [
      "Mega-Corp High Executive",
      "Licensed Deep-Space Citizen",
      "Grid-Worker / Blue Collar Miner",
      "Undocumented Rim-Worlder",
      "Syndicate Underworld Boss",
      "Wandering Frontier Nomad"
    ],
    hairStyles: [
      "Buzzcut with fiber-optic micro-braids that glow soft violet",
      "Shaved bald with a steel brain-interface exhaust port",
      "Spiky neon-pink mohawk that changes hue with body heat",
      "Sleek slate-grey hair tied back with copper wire",
      "None (smooth polished dark skull domes)",
      "Messy teal dreadlocks with copper signal cuffs",
      "Vibrant bright-blonde bob reflecting laser beams"
    ],
    clothingStyles: [
      "Vacuum-sealed neoprene flight suit in solar-yellow with black thruster pads",
      "Heavy armored cargo vest, grease-smeared overalls, and steel-toed boots",
      "Reflective smart-fabric trench coat that shifts color between purple and cyan",
      "Sterile white laboratory smock with rows of active syringe holsters",
      "Reinforced titanium-mesh combat gear painted in digital desert camo",
      "Repurposed space-dock overalls with glowing telemetry strips",
      "Ornate corporate high-collar tunic made of synthetic silk and carbon fibers"
    ],
    jobs: [
      "Asteroid Belt Ice Miner",
      "Cybernetic Organ Smuggler",
      "Quantum Drive Mechanic",
      "Interstellar Cargo Pilot",
      "Decommissioned Combat Android",
      "Xeno-archeologist",
      "Deep Space Salvage Hazard-diver",
      "Neural Net Hacktivist",
      "Cloning Lab Technician",
      "Bounty Hunter for the Megacorps"
    ]
  },
  Steampunk: {
    races: ["Warforged", "Autognome", "Deep Gnome", "Khoravar", "Lorwyn Changeling", "Kender", "Vedalken", "Loxodon"],
    genders: ["Female", "Male", "Androgynous", "Agender / Mechanical", "Non-binary"],
    ages: ["18 (Ambitious Apprentice)", "29 (Slightly singed Inventor)", "52 (Weary airship captain)", "85 (Respected Head Mechanist)", "12 (Automaton activation year)"],
    heights: ["4'5\" (Perfect for boiler-duct crawling)", "5'3\" (Standard street worker height)", "5'11\" (Aristocratic stature)", "6'8\" (Mechanized steam-armor height)", "3'0\" (Automaton pocket model)"],
    socialStatuses: [
      "Gilded Peer of the Realm",
      "Charitable High-Society Patron",
      "Licensed Industrial Engineer",
      "Working-Class Boiler Basin Resident",
      "Unregistered Airship Vagabond",
      "Clockwork Academy Scholar"
    ],
    hairStyles: [
      "Curly auburn locks pinned up with miniaturized brass gear-cogs",
      "Sooty ash-blonde whiskers and a waxed mustache of epic scale",
      "Wild white inventor mane, standing on end with static electricity",
      "Plum-colored waves tucked beneath brass welder goggles",
      "Dark brown hair tied into a greasy mechanic's knot",
      "None (Exposed copper piston assembly spinning slowly)",
      "Slicked-back charcoal hair with amber lacquer grease"
    ],
    clothingStyles: [
      "Heavy leather corset with oil gauges, tweed trousers & copper knee joints",
      "Frock coat in charcoal-grey, brass-buttoned vest, and a leather cylinder hat",
      "Canvas flight jumpsuit with built-in leather holsters for wrench sets",
      "Grease-sputtered linen shirt, suspenders, and an expandable canvas apron",
      "Ornate lace clockwork-dress in steel-blue with copper wire hem reinforcements",
      "Rugged sheepskin flight coat over a stained brocade waistcoat",
      "Mechanized exoskeleton frame worn over standard brown work slacks"
    ],
    jobs: [
      "Airship Boiler Stoker",
      "Aether-Gas Harvester",
      "Clockwork Watchmaker",
      "Automaton Repair Specialist",
      "Gatling-Harpoon Gunner",
      "Noble Patent Investor",
      "Sewer Gas Inspector",
      "Pneumatic Tube Post-courier",
      "Coal-Mine Automaton Supervisor",
      "Sky-Pirate Rigging Navigator"
    ]
  },
  Cyberpunk: {
    races: ["Simic Hybrid", "Changeling", "Shifter", "Warforged", "Tabaxi", "Leonin", "Verdan"],
    genders: ["Fluid", "Neutral ID", "Female Model", "Male Model", "Non-binary Array"],
    ages: ["16 (Street-runner prodigy)", "26 (Corporate drop-out)", "38 (Grizzled fixer)", "54 (Burned-out grid hacker)", "3 (Somatic laboratory-grown clone)"],
    heights: ["162 cm (Sleek street-ninja profile)", "175 cm (Standard civilian height)", "188 cm (Cybernetically elongated limbs)", "225 cm (Massive heavy-solo frame)", "140 cm (Chimeric compact hybrid)"],
    socialStatuses: [
      "Ultra-Privileged Corpo Elite",
      "Sleek Uptown Influencer",
      "Mid-Tier Grid Engineer",
      "Street-Level Cyber-Mercenary",
      "Slum-Dwelling Null-Citizen",
      "Exiled Eco-Sovereign"
    ],
    hairStyles: [
      "Asymmetrical cyber-fringe dyed in alternating laser-lime and pitch-black",
      "Matted violet dreadlock bundle loaded with memory chips",
      "Shaved hair paths highlighting golden skull-implants",
      "Undercut with bright crimson LED fiber-strands pulsing in time with heart",
      "Spiky ash-grey hair stiffened with industrial spray",
      "Sleek obsidian ponytail wrapped in hazard-strip tape",
      "Holographic pixelating hair that occasionally drops frames"
    ],
    clothingStyles: [
      "Oversized black vinyl duster, mirrorshades, and combat-harness undergarms",
      "Inflatable puff jacket in neon yellow, glowing sneakers, and cyber-cargo pants",
      "Immaculate grey corporate smart-suit with active biometric cooling lapels",
      "Ripped heavy-metal tee, carbon-fiber synth-leather jacket, and chain accessories",
      "Fluorescent rain poncho, neon visor, and custom waterproof techwear",
      "Tactical assault vest over fishnet sleeves with wire connectors running down the hands",
      "Sleek dark bodysuit fitted with thermal insulation and modular battery pouch belts"
    ],
    jobs: [
      "Sub-Grid Deck-Decker",
      "Corpo-extraction Specialist",
      "Street Ripperdoc",
      "illegal Cyberware Dealer",
      "Drone Rigger & Delivery Pilot",
      "Synth-Noodle Shop Chef",
      "Neon Billboard Electrician",
      "Corporate Counter-Intelligence Agent",
      "Street Memory-Courier",
      "Black-market Drone Gladiator Gladiator Coach"
    ]
  },
  Grimdark: {
    races: ["Dhampir", "Reborn", "Hexblood", "Duergar", "Shadar-kai", "Bugbear", "Goblin", "Hobgoblin", "Kobold", "Orc", "Yuan-ti"],
    genders: ["Withered Female", "Dread Male", "Nameless Shell", "Non-binary Purified", "Androgynous Shadow"],
    ages: ["24 (Prematurely greyed by trauma)", "48 (Surviving on stale gruel)", "80 (A miracle to reach, heavily scarred)", "400 (Undead / Cursed with longevity)", "7 (Creepy ghost child or young orphan)"],
    heights: ["4'11\" (Hunched & withered)", "5'5\" (Stunted by childhood famine)", "5'9\" (Worn & battle-hardened stature)", "6'4\" (Ominous, shadow-casting tall frame)", "7'1\" (Grotesque mutated colossal height)"],
    socialStatuses: [
      "Corrupt Feudal Landowner",
      "Enforcer of the Sacred Pyre",
      "Taxed-to-Bone Serf",
      "Ostracized Plague Carrier",
      "Heretical Scholar-in-Hiding",
      "Wretched Grave-Robbing Vagrant"
    ],
    hairStyles: [
      "Strings of thin, greasy black hair plastering a pale forehead",
      "Chopped off with a rusty knife, uneven and stained with soot",
      "Pure snow-white hair matching eyes blinded by looking at an eclipse",
      "Tangled nest of reddish-brown curls carrying dead twigs and ash dust",
      "Shaved bald, scarred with ritual brands of the Purifiers",
      "Wiry slate-gray hair caked with bog mud",
      "None (Shed entirely due to a radiation or necrosis curse)"
    ],
    clothingStyles: [
      "Rotting black leather coat, heavy iron leg irons & spiked gauntlets",
      "Blood-flecked executioner's cowl, leather loincloth & bone-carved armguards",
      "Moth-eaten grave shroud wrapped tightly with chains and padlocks",
      "Leathery plague coat with a bird-beak mask stuffed with lavender & charcoal",
      "Tattered inquisitorial tunic in dark gold with ash-stained heraldic shields",
      "Scrap metal bits stitched onto greasy pigskin aprons and leg straps",
      "Simple, dirty hemp grey robe cinched with a coarse hanging hemp rope"
    ],
    jobs: [
      "Cemetery Gravedigger / ghoul catcher",
      "Plague Body Collector",
      "Witch Finder Investigator",
      "Torturer's Assistant",
      "Ruin Scavenger & Teeth-puller",
      "Flagellant Chanting Preacher",
      "Swamp-Leech gatherer",
      "Deserter Mercenary Scout",
      "Mad Alchemist / Flesh Weaver",
      "Reliquary Keeper of Bone Fragments"
    ]
  }
};

// Returns a random element from an array
export function getRandomElement<T>(arr: T[]): T {
  const index = Math.floor(Math.random() * arr.length);
  return arr[index];
}

export interface RaceOption {
  name: string;
  tag: string;
}

export function getRacesForTheme(theme: SettingTheme): RaceOption[] {
  if (theme === "Fantasy") {
    return [
      { name: "Dragonborn", tag: "Common" },
      { name: "Dwarf", tag: "Common" },
      { name: "Elf", tag: "Common" },
      { name: "Gnome", tag: "Common" },
      { name: "Half-Elf", tag: "Common" },
      { name: "Half-Orc", tag: "Common" },
      { name: "Halfling", tag: "Common" },
      { name: "Human", tag: "Common" },
      { name: "Tiefling", tag: "Common" },
      { name: "Aarakocra", tag: "Exotic" },
      { name: "Aasimar", tag: "Exotic" },
      { name: "Changeling", tag: "Exotic" },
      { name: "Deep Gnome", tag: "Exotic" },
      { name: "Duergar", tag: "Exotic" },
      { name: "Eladrin", tag: "Exotic" },
      { name: "Fairy", tag: "Exotic" },
      { name: "Firbolg", tag: "Exotic" },
      { name: "Genasi (Air)", tag: "Exotic" },
      { name: "Genasi (Earth)", tag: "Exotic" },
      { name: "Genasi (Fire)", tag: "Exotic" },
      { name: "Genasi (Water)", tag: "Exotic" },
      { name: "Githyanki", tag: "Exotic" },
      { name: "Githzerai", tag: "Exotic" },
      { name: "Goliath", tag: "Exotic" },
      { name: "Harengon", tag: "Exotic" },
      { name: "Kenku", tag: "Exotic" },
      { name: "Locathah", tag: "Exotic" },
      { name: "Owlin", tag: "Exotic" },
      { name: "Satyr", tag: "Exotic" },
      { name: "Sea Elf", tag: "Exotic" },
      { name: "Shadar-Kai", tag: "Exotic" },
      { name: "Tabaxi", tag: "Exotic" },
      { name: "Tortle", tag: "Exotic" },
      { name: "Triton", tag: "Exotic" },
      { name: "Verdan", tag: "Exotic" },
      { name: "Bugbear", tag: "Monstrous" },
      { name: "Centaur", tag: "Monstrous" },
      { name: "Goblin", tag: "Monstrous" },
      { name: "Grung", tag: "Monstrous" },
      { name: "Hobgoblin", tag: "Monstrous" },
      { name: "Kobold", tag: "Monstrous" },
      { name: "Lizardfolk", tag: "Monstrous" },
      { name: "Minotaur", tag: "Monstrous" },
      { name: "Orc", tag: "Monstrous" },
      { name: "Shifter", tag: "Monstrous" },
      { name: "Yuan-ti", tag: "Monstrous" }
    ];
  } else if (theme === "Sci-Fi") {
    return [
      { name: "Astral Elf", tag: "Common" },
      { name: "Autognome", tag: "Common" },
      { name: "Plasmoid", tag: "Common" },
      { name: "Air Genasi", tag: "Common" },
      { name: "Giff", tag: "Exotic" },
      { name: "Thri-kreen", tag: "Exotic" },
      { name: "Hadozee", tag: "Exotic" },
      { name: "Githyanki", tag: "Exotic" },
      { name: "Githzerai", tag: "Exotic" },
      { name: "Kalashtar", tag: "Exotic" }
    ];
  } else if (theme === "Steampunk") {
    return [
      { name: "Warforged", tag: "Common" },
      { name: "Autognome", tag: "Common" },
      { name: "Deep Gnome", tag: "Common" },
      { name: "Khoravar", tag: "Common" },
      { name: "Lorwyn Changeling", tag: "Exotic" },
      { name: "Kender", tag: "Exotic" },
      { name: "Vedalken", tag: "Exotic" },
      { name: "Loxodon", tag: "Exotic" }
    ];
  } else if (theme === "Cyberpunk") {
    return [
      { name: "Simic Hybrid", tag: "Common" },
      { name: "Changeling", tag: "Common" },
      { name: "Shifter", tag: "Monstrous" },
      { name: "Warforged", tag: "Common" },
      { name: "Tabaxi", tag: "Exotic" },
      { name: "Leonin", tag: "Exotic" },
      { name: "Verdan", tag: "Exotic" }
    ];
  } else { // Grimdark
    return [
      { name: "Dhampir", tag: "Common" },
      { name: "Reborn", tag: "Common" },
      { name: "Hexblood", tag: "Common" },
      { name: "Duergar", tag: "Common" },
      { name: "Shadar-kai", tag: "Exotic" },
      { name: "Bugbear", tag: "Monstrous" },
      { name: "Goblin", tag: "Monstrous" },
      { name: "Hobgoblin", tag: "Monstrous" },
      { name: "Kobold", tag: "Monstrous" },
      { name: "Orc", tag: "Monstrous" },
      { name: "Yuan-ti", tag: "Monstrous" }
    ];
  }
}

export function getRandomWeightedRace(theme: SettingTheme): string {
  const races = getRacesForTheme(theme);
  const commons = races.filter(r => r.tag === "Common");
  const others = races.filter(r => r.tag !== "Common");

  if (commons.length === 0) {
    return getRandomElement(races).name;
  }

  // 75% chance to choose a Common tagged race, 25% chance for others if available
  if (others.length === 0 || Math.random() < 0.75) {
    return getRandomElement(commons).name;
  } else {
    return getRandomElement(others).name;
  }
}

export interface RaceLoreData {
  lifeExpectancy: string;
  avgHeightImperial: string;
  avgHeightMetric: string;
}

export const DND_RACES_LORE: Record<string, RaceLoreData> = {
  halfelf: { lifeExpectancy: "180 years", avgHeightImperial: "5'9\"", avgHeightMetric: "175 cm" },
  halforc: { lifeExpectancy: "75 years", avgHeightImperial: "6'0\"", avgHeightMetric: "183 cm" },
  aasimar: { lifeExpectancy: "160 years", avgHeightImperial: "5'7\"", avgHeightMetric: "170 cm" },
  dragonborn: { lifeExpectancy: "80 years", avgHeightImperial: "6'4\"", avgHeightMetric: "193 cm" },
  dwarf: { lifeExpectancy: "350 years", avgHeightImperial: "4'4\"", avgHeightMetric: "132 cm" },
  elf: { lifeExpectancy: "750 years", avgHeightImperial: "5'6\"", avgHeightMetric: "168 cm" },
  gnome: { lifeExpectancy: "500 years", avgHeightImperial: "3'4\"", avgHeightMetric: "101 cm" },
  goliath: { lifeExpectancy: "100 years", avgHeightImperial: "7'6\"", avgHeightMetric: "228 cm" },
  halfling: { lifeExpectancy: "250 years", avgHeightImperial: "3'0\"", avgHeightMetric: "91 cm" },
  human: { lifeExpectancy: "100 years", avgHeightImperial: "5'8\"", avgHeightMetric: "172 cm" },
  orc: { lifeExpectancy: "75 years", avgHeightImperial: "6'3\"", avgHeightMetric: "190 cm" },
  tiefling: { lifeExpectancy: "110 years", avgHeightImperial: "5'7\"", avgHeightMetric: "170 cm" },
  dhampir: { lifeExpectancy: "Immortal (~1000+ yrs)", avgHeightImperial: "5'8\"", avgHeightMetric: "172 cm" },
  hexblood: { lifeExpectancy: "200+ years", avgHeightImperial: "5'8\"", avgHeightMetric: "172 cm" },
  lupin: { lifeExpectancy: "90 years", avgHeightImperial: "5'10\"", avgHeightMetric: "178 cm" },
  reborn: { lifeExpectancy: "Immortal (~1000+ yrs)", avgHeightImperial: "5'8\"", avgHeightMetric: "172 cm" },
  boggart: { lifeExpectancy: "200 years", avgHeightImperial: "3'2\"", avgHeightMetric: "96 cm" },
  faerie: { lifeExpectancy: "1500 years", avgHeightImperial: "1'3\"", avgHeightMetric: "38 cm" },
  fairy: { lifeExpectancy: "1500 years", avgHeightImperial: "1'3\"", avgHeightMetric: "38 cm" },
  flamekin: { lifeExpectancy: "80 years", avgHeightImperial: "6'0\"", avgHeightMetric: "183 cm" },
  kithkin: { lifeExpectancy: "150 years", avgHeightImperial: "3'6\"", avgHeightMetric: "107 cm" },
  changeling: { lifeExpectancy: "100 years", avgHeightImperial: "5'6\"", avgHeightMetric: "168 cm" },
  kalashtar: { lifeExpectancy: "100 years", avgHeightImperial: "5'6\"", avgHeightMetric: "168 cm" },
  khoravar: { lifeExpectancy: "180 years", avgHeightImperial: "5'8\"", avgHeightMetric: "172 cm" },
  shifter: { lifeExpectancy: "70 years", avgHeightImperial: "5'6\"", avgHeightMetric: "168 cm" },
  warforged: { lifeExpectancy: "Immortal / Infinite", avgHeightImperial: "6'4\"", avgHeightMetric: "193 cm" },
  aarakocra: { lifeExpectancy: "30 years", avgHeightImperial: "5'0\"", avgHeightMetric: "152 cm" },
  eladrin: { lifeExpectancy: "750 years", avgHeightImperial: "5'6\"", avgHeightMetric: "168 cm" },
  seaelf: { lifeExpectancy: "750 years", avgHeightImperial: "5'6\"", avgHeightMetric: "168 cm" },
  shadarkai: { lifeExpectancy: "750 years", avgHeightImperial: "5'8\"", avgHeightMetric: "172 cm" },
  duergar: { lifeExpectancy: "350 years", avgHeightImperial: "4'4\"", avgHeightMetric: "132 cm" },
  deepgnome: { lifeExpectancy: "500 years", avgHeightImperial: "3'4\"", avgHeightMetric: "101 cm" },
  genasi: { lifeExpectancy: "120 years", avgHeightImperial: "5'7\"", avgHeightMetric: "170 cm" },
  bugbear: { lifeExpectancy: "80 years", avgHeightImperial: "6'8\"", avgHeightMetric: "203 cm" },
  centaur: { lifeExpectancy: "100 years", avgHeightImperial: "7'0\"", avgHeightMetric: "213 cm" },
  firbolg: { lifeExpectancy: "500 years", avgHeightImperial: "7'4\"", avgHeightMetric: "223 cm" },
  githyanki: { lifeExpectancy: "100 years", avgHeightImperial: "6'2\"", avgHeightMetric: "188 cm" },
  githzerai: { lifeExpectancy: "100 years", avgHeightImperial: "6'2\"", avgHeightMetric: "188 cm" },
  goblin: { lifeExpectancy: "60 years", avgHeightImperial: "3'6\"", avgHeightMetric: "107 cm" },
  harengon: { lifeExpectancy: "90 years", avgHeightImperial: "5'0\"", avgHeightMetric: "152 cm" },
  hobgoblin: { lifeExpectancy: "100 years", avgHeightImperial: "6'0\"", avgHeightMetric: "183 cm" },
  kenku: { lifeExpectancy: "60 years", avgHeightImperial: "5'0\"", avgHeightMetric: "152 cm" },
  kobold: { lifeExpectancy: "120 years", avgHeightImperial: "2'9\"", avgHeightMetric: "84 cm" },
  lizardfolk: { lifeExpectancy: "80 years", avgHeightImperial: "6'0\"", avgHeightMetric: "183 cm" },
  minotaur: { lifeExpectancy: "150 years", avgHeightImperial: "7'1\"", avgHeightMetric: "216 cm" },
  satyr: { lifeExpectancy: "100 years", avgHeightImperial: "5'0\"", avgHeightMetric: "152 cm" },
  tabaxi: { lifeExpectancy: "80 years", avgHeightImperial: "6'0\"", avgHeightMetric: "183 cm" },
  tortle: { lifeExpectancy: "50 years", avgHeightImperial: "5'6\"", avgHeightMetric: "168 cm" },
  triton: { lifeExpectancy: "200 years", avgHeightImperial: "5'3\"", avgHeightMetric: "160 cm" },
  yuanti: { lifeExpectancy: "100 years", avgHeightImperial: "5'6\"", avgHeightMetric: "168 cm" },
  kender: { lifeExpectancy: "100 years", avgHeightImperial: "3'9\"", avgHeightMetric: "114 cm" },
  autognome: { lifeExpectancy: "Immortal / Infinite", avgHeightImperial: "3'0\"", avgHeightMetric: "91 cm" },
  giff: { lifeExpectancy: "80 years", avgHeightImperial: "7'4\"", avgHeightMetric: "223 cm" },
  hadozee: { lifeExpectancy: "90 years", avgHeightImperial: "5'2\"", avgHeightMetric: "157 cm" },
  plasmoid: { lifeExpectancy: "60 years", avgHeightImperial: "5'6\"", avgHeightMetric: "168 cm" },
  thrikreen: { lifeExpectancy: "30 years", avgHeightImperial: "6'0\"", avgHeightMetric: "183 cm" },
  owlin: { lifeExpectancy: "100 years", avgHeightImperial: "5'0\"", avgHeightMetric: "152 cm" },
  leonin: { lifeExpectancy: "80 years", avgHeightImperial: "6'2\"", avgHeightMetric: "188 cm" },
  verdan: { lifeExpectancy: "200 years", avgHeightImperial: "5'0\"", avgHeightMetric: "152 cm" },
  loxodon: { lifeExpectancy: "450 years", avgHeightImperial: "7'6\"", avgHeightMetric: "228 cm" },
  simichybrid: { lifeExpectancy: "70 years", avgHeightImperial: "5'7\"", avgHeightMetric: "170 cm" },
  vedalken: { lifeExpectancy: "500 years", avgHeightImperial: "6'2\"", avgHeightMetric: "188 cm" },
  locathah: { lifeExpectancy: "80 years", avgHeightImperial: "5'2\"", avgHeightMetric: "157 cm" },
  grung: { lifeExpectancy: "50 years", avgHeightImperial: "3'0\"", avgHeightMetric: "91 cm" },
  hobbit: { lifeExpectancy: "250 years", avgHeightImperial: "3'0\"", avgHeightMetric: "91 cm" }
};

export function getRaceLore(race: string): RaceLoreData {
  const norm = race.toLowerCase().replace(/[^a-z0-9]/g, "");
  // Sort keys descending by length so exact/longer prefix matches are evaluated first ("halfelf" before "elf")
  const sortedKeys = Object.keys(DND_RACES_LORE).sort((a, b) => b.length - a.length);
  for (const key of sortedKeys) {
    if (norm.includes(key)) {
      return DND_RACES_LORE[key];
    }
  }
  // Default fallback is Human
  return DND_RACES_LORE.human;
}

export function isEggLayingRace(race: string): boolean {
  if (!race) return false;
  const norm = race.toLowerCase().replace(/[-\s]/g, "");
  // Standard egg-laying species in tabletop lore (reptilian, avian, insectoid, gith, etc.)
  const eggLayingKeywords = [
    "dragonborn", "kobold", "lizardfolk", "yuanti", "yuan-ti", 
    "tortle", "grung", "aarakocra", "kenku", "owlin", 
    "thrikreen", "thri-kreen", "triton", "locathah",
    "githyanki", "githzerai", "gith"
  ];
  return eggLayingKeywords.some(keyword => norm.includes(keyword));
}

export function alignHatchlingTermForRace(ageVal: string, race: string): string {
  if (!ageVal) return ageVal;
  if (isEggLayingRace(race)) {
    return ageVal; // Keep 'hatchling(s)' as-is for egg-laying species
  }
  
  // Replace "hatchlings" first to avoid partial-matching
  let result = ageVal.replace(/\bhatchlings\b/gi, (match) => {
    const isAllCaps = match === match.toUpperCase();
    const isTitleCase = match[0] === match[0].toUpperCase();
    if (isAllCaps) return "YOUNGSTERS";
    if (isTitleCase) return "Youngsters";
    return "youngsters";
  });
  
  // Replace "hatchling"
  result = result.replace(/\bhatchling\b/gi, (match) => {
    const isAllCaps = match === match.toUpperCase();
    const isTitleCase = match[0] === match[0].toUpperCase();
    if (isAllCaps) return "YOUNGSTER";
    if (isTitleCase) return "Youngster";
    return "youngster";
  });
  
  return result;
}

export function replaceRaceInAgeString(ageVal: string, race: string): string {
  if (!ageVal) return ageVal;

  // Align "hatchling" terms for non-egg-laying races
  ageVal = alignHatchlingTermForRace(ageVal, race);

  // Define standard search pattern for races and their plurals/variants
  const raceWords = [
    "half-elf", "half-orc", "halfelf", "halforc", "aasimar", "dragonborn", 
    "dwarf", "elf", "gnome", "goliath", "halfling", "human", "orc", 
    "tiefling", "dhampir", "hexblood", "lupin", "reborn", "boggart", 
    "faerie", "fairy", "flamekin", "kithkin", "changeling", "kalashtar", 
    "khoravar", "shifter", "warforged", "aarakocra", "eladrin", "seaelf", 
    "sea elf", "shadarkai", "shadar-kai", "duergar", "deepgnome", 
    "deep gnome", "genasi", "bugbear", "centaur", "firbolg", "githyanki", 
    "githzerai", "goblin", "harengon", "hobgoblin", "kenku", "kobold", 
    "lizardfolk", "minotaur", "satyr", "tabaxi", "tortle", "triton", 
    "yuan-ti", "yuanti", "kender", "autognome", "giff", "hadozee", 
    "plasmoid", "thri-kreen", "thrikreen", "owlin", "leonin", "verdan", 
    "loxodon", "simichybrid", "simic hybrid", "vedalken", "locathah", 
    "grung", "hobbit"
  ];

  // Sort by length descending to match longer words first
  const sortedRaceWords = [...raceWords].sort((a, b) => b.length - a.length);
  const racePatternStr = sortedRaceWords.map(word => word.replace(/[-\s]/g, "[- ]?")).join("|");
  
  // 1. Replace indefinite article + race name patterns: "a/an [old_race]"
  const articleRegex = new RegExp(`\\b(an|a)\\s+(${racePatternStr})s?\\b`, "gi");
  const startsWithVowel = /^[aeiouy]/i.test(race);
  
  let result = ageVal.replace(articleRegex, (match, p1, p2) => {
    const correctArticle = p1[0] === p1[0].toUpperCase()
      ? (startsWithVowel ? "An" : "A")
      : (startsWithVowel ? "an" : "a");
    // Match case of the race name if possible
    const isTitleCase = p2[0] === p2[0].toUpperCase();
    const finalRaceStr = isTitleCase ? (race[0].toUpperCase() + race.slice(1)) : race.toLowerCase();
    return `${correctArticle} ${finalRaceStr}`;
  });

  // 2. Replace any standalone occurrences of old race names (e.g. "Ancient & Wise Dwarf")
  const standaloneRegex = new RegExp(`\\b(${racePatternStr})s?\\b`, "gi");
  result = result.replace(standaloneRegex, (match) => {
    if (match.toLowerCase() === race.toLowerCase() || match.toLowerCase() === race.toLowerCase() + "s") {
      return match;
    }
    const isAllCaps = match === match.toUpperCase();
    const isTitleCase = match[0] === match[0].toUpperCase();
    const isPlural = match.toLowerCase().endsWith("s");
    
    let targetRace = race;
    if (isPlural) {
      if (race.toLowerCase().endsWith("f")) {
        targetRace = race.slice(0, -1) + "ves"; // e.g. Dwarf -> Dwarves, Elf -> Elves
      } else {
        targetRace = race + "s";
      }
    }
    
    if (isAllCaps) return targetRace.toUpperCase();
    if (isTitleCase) return targetRace[0].toUpperCase() + targetRace.slice(1);
    return targetRace.toLowerCase();
  });

  return result;
}

export function formatAgeWithLifeExpectancy(ageVal: string, race: string): string {
  if (!ageVal) return "";
  const lore = getRaceLore(race);
  
  // Pre-process age descriptor to match the selected race
  const alignedAgeVal = replaceRaceInAgeString(ageVal, race);
  
  // 1. Get life expectancy and parse maximum allowed age
  const lifeExp = lore.lifeExpectancy; 
  let maxAge = Infinity;
  if (!lifeExp.toLowerCase().includes("immortal") && !lifeExp.toLowerCase().includes("infinite")) {
    const lifeMatch = lifeExp.match(/(\d+)/);
    if (lifeMatch) {
      maxAge = parseInt(lifeMatch[1], 10);
    }
  }

  // 2. Parse current age number
  let finalAgeVal = alignedAgeVal;
  const ageMatch = alignedAgeVal.match(/^(\d+)/);
  if (ageMatch) {
    const currentAge = parseInt(ageMatch[1], 10);
    if (currentAge > maxAge) {
      // Age exceeds life expectancy! Let's clamp it.
      let clampedAge = Math.floor(maxAge * 0.85);
      if (clampedAge < 1) clampedAge = 1;
      
      // Modify the description
      let rest = alignedAgeVal.slice(ageMatch[0].length);
      if (rest.includes("(") && rest.includes(")")) {
        rest = rest.replace(/\(.*?\)/g, `(Elderly for a ${race})`);
      } else if (rest.includes("[") && rest.includes("]")) {
        rest = rest.replace(/\[.*?\]/g, `[Elderly for a ${race}]`);
      } else {
        rest = ` (Elderly for a ${race})`;
      }
      finalAgeVal = `${clampedAge}${rest}`;
    }
  }

  // 3. Prepare the final text string with Life Expectancy injected
  const lifeExpText = `Life Expectancy: ${lifeExp}`;

  // Find braces or brackets and update or insert life expectancy
  if (finalAgeVal.includes("(") && finalAgeVal.includes(")")) {
    if (finalAgeVal.includes("Life Expectancy:")) {
      return finalAgeVal.replace(/Life Expectancy: [^)]+/g, lifeExp);
    }
    const insideMatch = finalAgeVal.match(/\((.*?)\)/);
    if (insideMatch) {
      const insideText = insideMatch[1];
      return finalAgeVal.replace(/\(.*?\)/g, `(${insideText}, ${lifeExpText})`);
    }
    return finalAgeVal.replace(/\(.*?\)/g, `(${lifeExpText})`);
  }
  
  if (finalAgeVal.includes("[") && finalAgeVal.includes("]")) {
    const insideMatch = finalAgeVal.match(/\[(.*?)\]/);
    if (insideMatch) {
      const insideText = insideMatch[1];
      return finalAgeVal.replace(/\[.*?\]/g, `[${insideText}, ${lifeExpText}]`);
    }
    return finalAgeVal.replace(/\[.*?\]/g, `[${lifeExpText}]`);
  }

  return `${finalAgeVal} (${lifeExpText})`;
}

export function formatHeightWithAverage(heightVal: string, race: string, theme: SettingTheme): string {
  if (!heightVal) return "";
  const lore = getRaceLore(race);
  const isMetric = theme === "Sci-Fi" || theme === "Cyberpunk";
  const avgHeight = isMetric ? lore.avgHeightMetric : lore.avgHeightImperial;
  const avgHeightText = `Avg Height: ${avgHeight}`;

  // Find braces or brackets
  if (heightVal.includes("(") && heightVal.includes(")")) {
    return heightVal.replace(/\(.*?\)/g, `(${avgHeightText})`);
  }
  if (heightVal.includes("[") && heightVal.includes("]")) {
    return heightVal.replace(/\[.*?\]/g, `[${avgHeightText}]`);
  }
  return `${heightVal} (${avgHeightText})`;
}

// Map any race to its corresponding height scale based on theme (Sci-Fi/Cyberpunk use metric, other templates use imperial feet/inches)
export function getHeightsForRace(race: string, theme: SettingTheme): string[] {
  const norm = race.toLowerCase().trim();
  const isMetric = theme === "Sci-Fi" || theme === "Cyberpunk";

  if (!norm || norm === "any" || norm === "random") {
    return REELS_DATA[theme].heights;
  }

  // Giant / Colossal (Goliath, Loxodon, Giff, Bugbear)
  if (norm.includes("goliath") || norm.includes("loxodon") || norm.includes("giff") || norm.includes("bugbear")) {
    return isMetric 
      ? ["210 cm (Colossal scale)", "218 cm (Towering stature)", "225 cm (Massive frame)", "232 cm (Heavy solo frame)", "240 cm (Gigantic profile)"]
      : ["7'1\" (Towering Goliath height)", "7'4\" (Massive scale)", "7'8\" (Colossal height)", "8'0\" (Gigantic giantkin stature)", "8'3\" (Monstrously tall scale)"];
  }

  // Tall / Heavy (Orc, Dragonborn, Half-Orc, Warforged, Minotaur, Leonin, Firbolg, Centaur, Vedalken)
  if (
    norm.includes("orc") || 
    norm.includes("dragonborn") || 
    norm.includes("warforged") || 
    norm.includes("minotaur") || 
    norm.includes("leonin") || 
    norm.includes("firbolg") || 
    norm.includes("centaur") || 
    norm.includes("vedalken")
  ) {
    return isMetric
      ? ["185 cm (Tall stature)", "192 cm (Elongated heavy frame)", "198 cm (Stately imposing size)", "205 cm (Large heavy-grade chassis)", "212 cm (Massive heavy-weight model)"]
      : ["6'0\" (Imposing stature)", "6'2\" (Heavy battle prototype)", "6'5\" (Tall imposing height)", "6'8\" (Towering stature)", "7'0\" (Massive heavy-weight stature)"];
  }

  // Dwarf / Stout Short-Medium (Dwarf, Duergar, Hadozee, Verdan)
  if (
    norm.includes("dwarf") || 
    norm.includes("duergar") || 
    norm.includes("hadozee") ||
    norm.includes("verdan")
  ) {
    return isMetric
      ? ["122 cm (Stunted compact style)", "135 cm (Short stocky frame)", "142 cm (Sturdy low-center gravity)", "150 cm (Robust heavy-set chassis)", "158 cm (Compact industrial build)"]
      : ["4'0\" (Squat stocky profile)", "4'3\" (Short robust stature)", "4'6\" (Heavy-set Dwarf scale)", "4'9\" (Stocky & solid stature)", "5'0\" (Sturdy compact height)"];
  }

  // Small / Tiny (Halfling, Gnome, Autognome, Kender, Goblin, Kobold, Boggart, Faerie, Fairy, Grung, Hobbit, Locathah)
  if (
    norm.includes("halfling") || 
    norm.includes("gnome") || 
    norm.includes("autognome") || 
    norm.includes("kender") || 
    norm.includes("goblin") || 
    norm.includes("kobold") || 
    norm.includes("boggart") || 
    norm.includes("faerie") || 
    norm.includes("fairy") || 
    norm.includes("grung") ||
    norm.includes("hobbit") ||
    norm.includes("locathah")
  ) {
    return isMetric
      ? ["80 cm (Microsized compact model)", "90 cm (Compact pocket chassis)", "98 cm (Small standard chassis)", "105 cm (Lithe lightweight frame)", "112 cm (Petite agile profile)"]
      : ["2'8\" (Diminutive pocket height)", "3'0\" (Typical petite scale)", "3'3\" (Small & nimble stature)", "3'6\" (Gnome/Halfling common height)", "3'10\" (Stately heights for small-folk)"];
  }

  // Default Standard Medium (Human, Elf, Tiefling, Aasimar, Changeling, Shifter, Genasi, etc.)
  return isMetric
    ? ["155 cm (Light build profile)", "163 cm (Slim athletic height)", "170 cm (Standard average model)", "176 cm (Balanced civilian height)", "182 cm (Elegant tall-average)"]
    : ["5'2\" (Petite average height)", "5'5\" (Slim athletic stature)", "5'8\" (Standard average height)", "5'11\" (Elegant taller frame)", "6'2\" (Stately taller stature)"];
}

// Generate complete set of randomized inputs based on a specific theme
export function getRandomInputs(theme: SettingTheme): NpcInputs {
  const data = REELS_DATA[theme];
  const race = getRandomWeightedRace(theme);
  const heightOptions = getHeightsForRace(race, theme);
  const height = getRandomElement(heightOptions);

  return {
    race,
    age: getRandomElement(data.ages),
    height,
    gender: getRandomElement(data.genders),
    socialStatus: getRandomElement(data.socialStatuses),
    hairStyleColor: getRandomElement(data.hairStyles),
    clothingStyleColor: getRandomElement(data.clothingStyles),
    job: getRandomElement(data.jobs)
  };
}
