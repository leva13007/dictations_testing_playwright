import { test, expect } from "@playwright/test";
import { INDEX_FILE } from "./constants";
import { Body, Dic, DicJSON, PlaylistJSON } from "./types";

test.describe("Integrity tests", () => {

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

  test("TC-DA-0005 — API: Sentence count and duration consistency between dic.json and playlist.json", async ({ request }) => {
    for (const item of dics) {
      const resDic = await request.get(`${item.id}/dic.json`);
      const resPlaylist = await request.get(`${item.id}/playlist.json`);

      expect(resDic.status()).toBe(200);
      expect(resPlaylist.status()).toBe(200);

      const dic = await resDic.json() as DicJSON;
      const playlist = await resPlaylist.json() as PlaylistJSON;

      expect(dic.sentences === playlist.length, `${item.id}: sentence count mismatch`).toBeTruthy();

      let sumDuration = 0;
      for (const entry of playlist) {
        expect(entry.duration_sec, `${item.id} | ${entry.duration_sec}: entry.duration_sec should be greater than 0`).toBeGreaterThan(0);
        sumDuration += entry.duration_sec;
      }
      expect(sumDuration > 0, `${item.id}: duration_sec sum should be computed`).toBeTruthy();
      expect(sumDuration, `${item.id}: duration_sec sum mismatch`).toBeCloseTo(dic.duration_sec, 1);
    }
  });

  test("TC-DA-0008 — API: Index metadata should match dic.json", async ({ request }) => {
    for (const item of dics) {
      const resDic = await request.get(`${item.id}/dic.json`);
      expect(resDic.status()).toBe(200);
      const dic = await resDic.json() as DicJSON;

      expect(dic.id, `${item.id}: id mismatch`).toBe(item.id);
      expect(dic.title, `${item.title}: title mismatch`).toBe(item.title);
      expect(dic.level, `${item.level}: level mismatch`).toBe(item.level);
      expect(dic.sentences, `${item.sentences}: sentences mismatch`).toBe(item.sentences);
      expect(dic.duration_sec, `${item.duration_sec}: duration_sec mismatch`).toBe(item.duration_sec);
      expect(dic.tags, `${item.tags}: tags mismatch`).toEqual(item.tags);
      expect(dic.features, `${item.features}: features mismatch`).toEqual(item.features);
    }
  });

  test("TC-DA-0011 — API: No duplicate dictation IDs in index", async ({ request }) => {
    const uniqueIds = new Set(dics.map(el => el.id));
    expect(dics.length, `Duplicates dictations IDs found`).toBe(uniqueIds.size)
  });
});
