/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type SettingTheme = "Fantasy" | "Sci-Fi" | "Steampunk" | "Cyberpunk" | "Grimdark";

export interface NpcInputs {
  race: string;
  age: string;
  height: string;
  gender: string;
  socialStatus: string;
  hairStyleColor: string;
  clothingStyleColor: string;
  job: string;
}

export interface GeneratedNpc {
  name: string;
  race: string;
  age: string;
  height: string;
  gender: string;
  socialStatus: string;
  hairStyleColor: string;
  clothingStyleColor: string;
  job: string;
  shortDescription: string;
  backstory: string;
  personality: string[];
  dialogueQuote: string;
  mannerisms: string;
  secretHook: string;
  equipment: string[];
  theme: SettingTheme;
  generatedAt: string;
}

export interface BookmarkedNpc extends GeneratedNpc {
  id: string;
  notes?: string;
}
