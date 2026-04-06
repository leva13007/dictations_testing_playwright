import { test, expect } from "@playwright/test";
import { INDEX_FILE } from "./constants";
import { Body, Dic, PlaylistJSON } from "./types";

test.describe("Content tests", () => {
  test.describe.configure({ mode: 'default' });

  let body: Body;
  let dics: Dic[];

  test.beforeAll(async ({ request }) => {
    // Step 1: Send GET request to the entry point URL
    const response = await request.get(INDEX_FILE);

    // Step 2: Parse the response body as JSON
    body = await response.json() as Body;
    dics = body.dics;
    expect(Array.isArray(body.dics) && body.dics.length > 0).toBeTruthy();
  });

  test("TC-DA-0006 — API: Each sentence should have a valid audio file", async ({ request }) => {
    for (const item of dics) {
      const resPlaylist = await request.get(`${item.id}/playlist.json`);
      expect(resPlaylist.status()).toBe(200);
      const playlist = await resPlaylist.json() as PlaylistJSON;
      for (const entry of playlist) {
        const audio = await request.get(`${item.id}/sounds/${entry.audio}`);
        expect(audio.status()).toBe(200);

        const contentType = audio.headers()['content-type'];
        expect(contentType, `${item.id}: ${entry.id} content-type should be mp3 but got: ${contentType}`).toBe('audio/mp3');
      }
    }
  });

  test("TC-DA-0007 — API: Sentences should not be empty", async ({ request }) => {
    for (const item of dics) {
      const resPlaylist = await request.get(`${item.id}/playlist.json`);
      expect(resPlaylist.status()).toBe(200);
      const playlist = await resPlaylist.json() as PlaylistJSON;
      for (const entry of playlist) {
        const trimmed = entry.text.trim();
        expect(trimmed.length, `${item.id}: sentence ${entry.id} shouldn't be empty`).toBeGreaterThan(0);
        expect(trimmed.length, `${item.id}: sentence ${entry.id} length is not greater than 3, actual length is: ${trimmed.length}`).toBeGreaterThan(3);
      }
    }
  });

  test("TC-DA-0009 — API: Playlist IDs are sequential", async ({ request }) => {
    for (const item of dics) {
      const resPlaylist = await request.get(`${item.id}/playlist.json`);
      expect(resPlaylist.status()).toBe(200);
      const playlist = await resPlaylist.json() as PlaylistJSON;

      let i = 1;
      for (const entry of playlist) {
        expect(entry.id, `${item.id}: ${entry.id} should have id: ${i}`).toBe(i);
        i++;
      }
    }
  });

  test("TC-DA-0010 — API: Audio file names follow naming convention", async ({ request }) => {
    for (const item of dics) {
      const resPlaylist = await request.get(`${item.id}/playlist.json`);
      expect(resPlaylist.status()).toBe(200);
      const playlist = await resPlaylist.json() as PlaylistJSON;

      let i = 1;
      for (const entry of playlist) {
        expect(entry.audio).toMatch(/^\d{4}-\d{2}\.mp3$/);
        const [dicId, sentenceId] = entry.audio.replace(".mp3", "").split("-");
        expect(item.id, `${item.id}: dic ID part in the file name is mismatch`).toBe(dicId);
        expect(sentenceId, `${item.id}: ${entry.audio} has wrong sentence ID, should be ${String(i).padStart(2, "0")}`).toBe(String(i).padStart(2, "0"));
        i++;
      }
    }
  });

  test("TC-DA-0012 — API: Text.md exists for each dictation", async ({ request }) => {
    for (const item of dics) {
      const res = await request.get(`${item.id}/Text.md`);
      expect(res.status(), `${item.id}: Text.md should return 200`).toBe(200);

      const text = await res.text();
      expect(text.length, `${item.id}: Text.md should be contain more than 3 characters`).toBeGreaterThan(3)
    }
  });
});
