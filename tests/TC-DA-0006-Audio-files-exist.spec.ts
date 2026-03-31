import { test, expect } from "@playwright/test";

const INDEX = "index.json";

test.describe("TC-DA-0006 — API: Each sentence should have a valid audio file", () => {
  test("All audio files from playlist.json are reachable", async ({ request }) => {
    const indexRes = await request.get(INDEX);
    expect(indexRes.status()).toBe(200);
    const { dics } = await indexRes.json();
    expect(Array.isArray(dics) && dics.length > 0).toBeTruthy();

    for (const item of dics) {
      const plRes = await request.get(`${item.id}/playlist.json`);
      expect(plRes.status(), `playlist.json for ${item.id}`).toBe(200);
      const playlist: { audio: string }[] = await plRes.json();

      for (const entry of playlist) {
        expect(
          typeof entry.audio === "string" && entry.audio.length > 0,
          `${item.id}: audio field should be a non-empty string`
        ).toBeTruthy();

        // audio field is a full relative path like "dics/0001/sounds/0001-01.mp3"
        const audioUrl = entry.audio.startsWith("dics/")
          ? entry.audio.replace(/^dics\//, "")
          : `${item.id}/sounds/${entry.audio}`;
        const audioRes = await request.fetch(audioUrl, { method: "HEAD" });
        expect(
          audioRes.status(),
          `${item.id}: audio file ${entry.audio} should return 200`
        ).toBe(200);

        const contentType = audioRes.headers()["content-type"] ?? "";
        expect(
          contentType.includes("audio/"),
          `${item.id}: ${entry.audio} content-type should be audio/*, got ${contentType}`
        ).toBeTruthy();
      }
    }
  });
});
