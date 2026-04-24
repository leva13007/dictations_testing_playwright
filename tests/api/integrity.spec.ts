import { test, expect, APIRequestContext } from "@playwright/test";
import { Dic } from "./types";
import { DictationAPI } from "../utils/api-client";

test.describe("Integrity tests", () => {

  test.describe.configure({ mode: 'default' });

  let apiContext: APIRequestContext;
  let dics: Dic[];
  let api: DictationAPI;

  test.beforeAll(async ({ playwright }) => {
    apiContext = await playwright.request.newContext();
    api = new DictationAPI(apiContext);
    dics = await api.getDics();
  });

  test.afterAll(async ({ }) => {
    await apiContext.dispose();
  });

  test("TC-DA-0005 — API: Sentence count and duration consistency between dic.json and playlist.json", async () => {
    for (const item of dics) {
      const dic = await api.getDicJson(item.id);
      const playlist = await api.getPlaylistJson(item.id);

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

  test("TC-DA-0008 — API: Index metadata should match dic.json", async () => {
    for (const item of dics) {
      const dic = await api.getDicJson(item.id);

      expect(dic.id, `${item.id}: id mismatch`).toBe(item.id);
      expect(dic.title, `${item.title}: title mismatch`).toBe(item.title);
      expect(dic.level, `${item.level}: level mismatch`).toBe(item.level);
      expect(dic.sentences, `${item.sentences}: sentences mismatch`).toBe(item.sentences);
      expect(dic.duration_sec, `${item.duration_sec}: duration_sec mismatch`).toBe(item.duration_sec);
      expect(dic.tags, `${item.tags}: tags mismatch`).toEqual(item.tags);
      expect(dic.features, `${item.features}: features mismatch`).toEqual(item.features);
    }
  });

  test("TC-DA-0011 — API: No duplicate dictation IDs in index", async () => {
    const uniqueIds = new Set(dics.map(el => el.id));
    expect(dics.length, `Duplicates dictations IDs found`).toBe(uniqueIds.size)
  });
});
