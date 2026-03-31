import { test, expect } from "@playwright/test";

const INDEX = "index.json";

test.describe("TC-DA-0007 — API: Sentences should not be empty", () => {
  test("All playlist text fields are non-empty and length > 3", async ({ request }) => {
    const indexRes = await request.get(INDEX);
    expect(indexRes.status()).toBe(200);
    const { dics } = await indexRes.json();
    expect(Array.isArray(dics) && dics.length > 0).toBeTruthy();

    for (const item of dics) {
      const plRes = await request.get(`${item.id}/playlist.json`);
      expect(plRes.status(), `playlist.json for ${item.id}`).toBe(200);
      const playlist: { id: number; text: string }[] = await plRes.json();

      for (const entry of playlist) {
        const trimmed = (entry.text ?? "").trim();
        expect(
          trimmed.length,
          `${item.id} sentence ${entry.id}: text should not be empty`
        ).toBeGreaterThan(0);
        expect(
          trimmed.length,
          `${item.id} sentence ${entry.id}: text length should be > 3`
        ).toBeGreaterThan(3);
      }
    }
  });
});
