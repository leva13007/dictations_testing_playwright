import { expect } from "@playwright/test";
import type { Voice, PlaylistItem } from "./types";

/** Validate Voice object schema */
export function expectValidVoice(voice: Voice, dicId: string) {
  expect(typeof voice, `${dicId}: voice`).toBe("object");
  expect(
    voice.voice_name === null || typeof voice.voice_name === "string",
    `${dicId}: voice_name`
  ).toBeTruthy();
  expect(
    voice.voice_id === null || typeof voice.voice_id === "string",
    `${dicId}: voice_id`
  ).toBeTruthy();
  expect(
    voice.provider === "ElevenLabs" || voice.provider === null,
    `${dicId}: voice.provider`
  ).toBeTruthy();
  expect(
    voice.type === "man" || voice.type === "woman",
    `${dicId}: voice.type`
  ).toBeTruthy();
}

/** Validate PlaylistItem schema */
export function expectValidPlaylistItem(entry: PlaylistItem, dicId: string) {
  expect(typeof entry.id, `${dicId}: item.id`).toBe("number");
  expect(typeof entry.text, `${dicId}: item.text`).toBe("string");
  expect(typeof entry.audio, `${dicId}: item.audio`).toBe("string");
  expect(typeof entry.duration_sec, `${dicId}: item.duration_sec`).toBe("number");
}
