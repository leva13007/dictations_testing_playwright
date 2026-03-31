import { test, expect } from "@playwright/test";

/**
 * Integrity tests — verify cross-resource consistency.
 * Data in one file must match data in another.
 */

type Dic = { id: string; title: string; level: string; sentences: number; duration_sec: number; tags: any; features: any };

let dics: Dic[];

test.beforeAll(async ({ request }) => {
  const res = await request.get("index.json");
  expect(res.status()).toBe(200);
  const body = await res.json();
  dics = body.dics;
  expect(Array.isArray(dics) && dics.length > 0).toBeTruthy();
});

test.describe("Integrity — index ↔ dic.json", () => {
  test("TC-DA-0008: Shared fields between index.json items and dic.json are identical", async ({ request }) => {
    for (const item of dics) {
      const res = await request.get(`${item.id}/dic.json`);
      expect(res.status(), `dic.json for ${item.id}`).toBe(200);
      const dic = await res.json();

      expect(dic.id, `${item.id}: id mismatch`).toBe(item.id);
      expect(dic.title, `${item.id}: title mismatch`).toBe(item.title);
      expect(dic.level, `${item.id}: level mismatch`).toBe(item.level);
      expect(dic.sentences, `${item.id}: sentences mismatch`).toBe(item.sentences);
      expect(dic.duration_sec, `${item.id}: duration_sec mismatch`).toBe(item.duration_sec);
      expect(dic.tags, `${item.id}: tags mismatch`).toEqual(item.tags);
      expect(dic.features, `${item.id}: features mismatch`).toEqual(item.features);
    }
  });
});

test.describe("Integrity — dic.json ↔ playlist.json", () => {
  test("TC-DA-0005: Sentence count, duration consistency, all durations > 0", async ({ request }) => {
    for (const item of dics) {
      const [dicRes, plRes] = await Promise.all([
        request.get(`${item.id}/dic.json`),
        request.get(`${item.id}/playlist.json`),
      ]);
      expect(dicRes.status(), `dic.json for ${item.id}`).toBe(200);
      expect(plRes.status(), `playlist.json for ${item.id}`).toBe(200);

      const dic = await dicRes.json();
      const playlist: { duration_sec: number }[] = await plRes.json();

      for (let j = 0; j < playlist.length; j++) {
        expect(
          playlist[j].duration_sec,
          `${item.id}: playlist item ${j + 1} duration_sec should be > 0`
        ).toBeGreaterThan(0);
      }

      expect(dic.duration_sec, `${item.id}: dic.json duration_sec should be > 0`).toBeGreaterThan(0);
      expect(dic.sentences, `${item.id}: sentences count mismatch`).toBe(playlist.length);

      const sum = playlist.reduce((acc, e) => acc + e.duration_sec, 0);
      expect(dic.duration_sec, `${item.id}: duration_sec sum mismatch`).toBeCloseTo(sum, 1);
    }
  });
});

test.describe("Integrity — unique IDs", () => {
  test("TC-DA-0011: All dics[].id values in index.json are unique", async () => {
    const ids = dics.map((d) => d.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size, "Duplicate dictation IDs found").toBe(ids.length);
  });
});
