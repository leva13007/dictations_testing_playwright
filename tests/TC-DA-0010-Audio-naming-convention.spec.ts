import { test, expect } from "@playwright/test";

const INDEX = "index.json";
const AUDIO_FILENAME_PATTERN = /^\d{4}-\d{2}\.mp3$/;

test.describe("TC-DA-0010 — API: Audio file names follow naming convention", () => {
  test("Audio filenames match {dicId}-{sentenceNum}.mp3 pattern", async ({ request }) => {
    const indexRes = await request.get(INDEX);
    expect(indexRes.status()).toBe(200);
    const { dics } = await indexRes.json();
    expect(Array.isArray(dics) && dics.length > 0).toBeTruthy();

    for (const item of dics) {
      const plRes = await request.get(`${item.id}/playlist.json`);
      expect(plRes.status(), `playlist.json for ${item.id}`).toBe(200);
      const playlist: { audio: string }[] = await plRes.json();

      for (let j = 0; j < playlist.length; j++) {
        // audio may be a full path like "dics/0001/sounds/0001-01.mp3" — extract filename
        const audioRaw = playlist[j].audio;
        const filename = audioRaw.includes("/") ? audioRaw.split("/").pop()! : audioRaw;

        // Step 3: filename matches regex
        expect(filename, `${item.id} item ${j + 1}: audio should match XXXX-YY.mp3`).toMatch(AUDIO_FILENAME_PATTERN);

        // Step 4: dictation ID part
        const dicIdPart = filename.split("-")[0];
        expect(dicIdPart, `${item.id} item ${j + 1}: dic ID part mismatch`).toBe(item.id);

        // Step 5: sentence number part
        const sentenceNum = filename.split("-")[1].replace(".mp3", "");
        const expected = String(j + 1).padStart(2, "0");
        expect(sentenceNum, `${item.id} item ${j + 1}: sentence number mismatch`).toBe(expected);
      }
    }
  });
});
