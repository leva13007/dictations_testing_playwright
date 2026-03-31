import { test, expect } from "@playwright/test";

/**
 * Content tests — validate actual content quality, assets, and naming conventions.
 */

const AUDIO_FILENAME_PATTERN = /^\d{4}-\d{2}\.mp3$/;

type Dic = { id: string };

let dics: Dic[];

test.beforeAll(async ({ request }) => {
  const res = await request.get("index.json");
  expect(res.status()).toBe(200);
  const body = await res.json();
  dics = body.dics;
  expect(Array.isArray(dics) && dics.length > 0).toBeTruthy();
});

test.describe("Content — text quality", () => {
  test("TC-DA-0007: Sentences should not be empty (text.trim().length > 3)", async ({ request }) => {
    for (const item of dics) {
      const plRes = await request.get(`${item.id}/playlist.json`);
      expect(plRes.status(), `playlist.json for ${item.id}`).toBe(200);
      const playlist: { id: number; text: string }[] = await plRes.json();

      for (const entry of playlist) {
        const trimmed = (entry.text ?? "").trim();
        expect(trimmed.length, `${item.id} sentence ${entry.id}: text should not be empty`).toBeGreaterThan(0);
        expect(trimmed.length, `${item.id} sentence ${entry.id}: text length should be > 3`).toBeGreaterThan(3);
      }
    }
  });

  test("TC-DA-0009: Playlist IDs are sequential (1, 2, 3…)", async ({ request }) => {
    for (const item of dics) {
      const plRes = await request.get(`${item.id}/playlist.json`);
      expect(plRes.status(), `playlist.json for ${item.id}`).toBe(200);
      const playlist: { id: number }[] = await plRes.json();

      for (let j = 0; j < playlist.length; j++) {
        expect(
          playlist[j].id,
          `${item.id}: playlist item at index ${j} should have id ${j + 1}`
        ).toBe(j + 1);
      }
    }
  });
});

test.describe("Content — audio assets", () => {
  test("TC-DA-0006: Each sentence has a reachable audio file with correct content-type", async ({ request }) => {
    for (const item of dics) {
      const plRes = await request.get(`${item.id}/playlist.json`);
      expect(plRes.status(), `playlist.json for ${item.id}`).toBe(200);
      const playlist: { audio: string }[] = await plRes.json();

      for (const entry of playlist) {
        expect(
          typeof entry.audio === "string" && entry.audio.length > 0,
          `${item.id}: audio field should be a non-empty string`
        ).toBeTruthy();

        const audioUrl = entry.audio.startsWith("dics/")
          ? entry.audio.replace(/^dics\//, "")
          : `${item.id}/sounds/${entry.audio}`;
        const audioRes = await request.fetch(audioUrl, { method: "HEAD" });
        expect(audioRes.status(), `${item.id}: audio file ${entry.audio} should return 200`).toBe(200);

        const contentType = audioRes.headers()["content-type"] ?? "";
        expect(
          contentType.includes("audio/"),
          `${item.id}: ${entry.audio} content-type should be audio/*, got ${contentType}`
        ).toBeTruthy();
      }
    }
  });

  test("TC-DA-0010: Audio filenames follow naming convention {dicId}-{sentenceNum}.mp3", async ({ request }) => {
    for (const item of dics) {
      const plRes = await request.get(`${item.id}/playlist.json`);
      expect(plRes.status(), `playlist.json for ${item.id}`).toBe(200);
      const playlist: { audio: string }[] = await plRes.json();

      for (let j = 0; j < playlist.length; j++) {
        const audioRaw = playlist[j].audio;
        const filename = audioRaw.includes("/") ? audioRaw.split("/").pop()! : audioRaw;

        expect(filename, `${item.id} item ${j + 1}: should match XXXX-YY.mp3`).toMatch(AUDIO_FILENAME_PATTERN);

        const dicIdPart = filename.split("-")[0];
        expect(dicIdPart, `${item.id} item ${j + 1}: dic ID part mismatch`).toBe(item.id);

        const sentenceNum = filename.split("-")[1].replace(".mp3", "");
        const expected = String(j + 1).padStart(2, "0");
        expect(sentenceNum, `${item.id} item ${j + 1}: sentence number mismatch`).toBe(expected);
      }
    }
  });
});

test.describe("Content — source files", () => {
  test("TC-DA-0012: Text.md exists and is non-empty for every dictation", async ({ request }) => {
    for (const item of dics) {
      const res = await request.get(`${item.id}/Text.md`);
      expect(res.status(), `Text.md for ${item.id} should return 200`).toBe(200);

      const body = await res.text();
      expect(body.length, `${item.id}: Text.md should not be empty`).toBeGreaterThan(0);
    }
  });
});
