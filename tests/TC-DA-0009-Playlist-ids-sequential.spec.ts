import { test, expect } from "@playwright/test";

const INDEX = "index.json";

test.describe("TC-DA-0009 — API: Playlist IDs are sequential", () => {
  test("Playlist item IDs form a sequential series 1, 2, 3…", async ({ request }) => {
    const indexRes = await request.get(INDEX);
    expect(indexRes.status()).toBe(200);
    const { dics } = await indexRes.json();
    expect(Array.isArray(dics) && dics.length > 0).toBeTruthy();

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
