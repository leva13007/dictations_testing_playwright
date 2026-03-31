import { test, expect } from "@playwright/test";

const INDEX = "index.json";

test.describe("TC-DA-0005 — API: Sentence count and duration consistency", () => {
  test("dic.json sentences/duration match playlist.json data, all durations > 0", async ({ request }) => {
    const indexRes = await request.get(INDEX);
    expect(indexRes.status()).toBe(200);
    const { dics } = await indexRes.json();
    expect(Array.isArray(dics) && dics.length > 0).toBeTruthy();

    for (const item of dics) {
      const [dicRes, plRes] = await Promise.all([
        request.get(`${item.id}/dic.json`),
        request.get(`${item.id}/playlist.json`),
      ]);
      expect(dicRes.status(), `dic.json for ${item.id}`).toBe(200);
      expect(plRes.status(), `playlist.json for ${item.id}`).toBe(200);

      const dic = await dicRes.json();
      const playlist: { duration_sec: number }[] = await plRes.json();

      // Step 3: each playlist duration > 0
      for (let j = 0; j < playlist.length; j++) {
        expect(
          playlist[j].duration_sec,
          `${item.id}: playlist item ${j + 1} duration_sec should be > 0`
        ).toBeGreaterThan(0);
      }

      // Step 4: dic duration > 0
      expect(dic.duration_sec, `${item.id}: dic.json duration_sec should be > 0`).toBeGreaterThan(0);

      // Step 5: sentence count match
      expect(dic.sentences, `${item.id}: sentences count mismatch`).toBe(playlist.length);

      // Steps 6-7: duration sum match
      const sum = playlist.reduce((acc, e) => acc + e.duration_sec, 0);
      expect(dic.duration_sec, `${item.id}: duration_sec sum mismatch`).toBeCloseTo(sum, 1);
    }
  });
});
