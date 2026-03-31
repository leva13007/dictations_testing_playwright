import { test, expect } from "@playwright/test";

const INDEX = "index.json";

type PlaylistItem = {
  id: number;
  text: string;
  audio: string;
  duration_sec: number;
};

test.describe("TC-DA-0004 — API: Validate playlist.json structure for each dictation", () => {
  test("Each playlist.json is a valid non-empty array with correct item schema", async ({ request }) => {
    const indexRes = await request.get(INDEX);
    expect(indexRes.status()).toBe(200);
    const { dics } = await indexRes.json();
    expect(Array.isArray(dics) && dics.length > 0).toBeTruthy();

    for (const item of dics) {
      const res = await request.get(`${item.id}/playlist.json`);
      expect(res.status(), `playlist.json for ${item.id} should return 200`).toBe(200);

      const playlist: PlaylistItem[] = await res.json();
      expect(Array.isArray(playlist), `${item.id}: playlist should be an array`).toBeTruthy();
      expect(playlist.length, `${item.id}: playlist should not be empty`).toBeGreaterThan(0);

      for (const entry of playlist) {
        expect(typeof entry.id, `${item.id}: item.id should be number`).toBe("number");
        expect(typeof entry.text, `${item.id}: item.text should be string`).toBe("string");
        expect(typeof entry.audio, `${item.id}: item.audio should be string`).toBe("string");
        expect(typeof entry.duration_sec, `${item.id}: item.duration_sec should be number`).toBe("number");
      }
    }
  });
});
