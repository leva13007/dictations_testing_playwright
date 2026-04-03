import { test, expect } from "@playwright/test";

const FILE_NAME = "index.json";

type Voice = {
  voice_name?: string;
  voice_id?: string;
  provider?: "ElevenLabs";
  type: 'man' | 'woman';
}

type DicJSON = {
  "id": string;
  "title": string;
  "level": string;
  "sentences": number;
  "duration_sec": number;
  "tags": any;
  "features": any;
  voice: Voice;
  video?: string;
  created_at: string;
}

type Dic = {
  "id": string;
  "title": string;
  "level": string;
  "sentences": number;
  "duration_sec": number;
  "tags": any;
  "features": any;
  "type": any;
  "has_video"?: string;
}

type Body = {
  "language": string;
  "repository"?: string;
  "created_at": string;
  "updated_at": string;
  "dics": Dic[]
}

type Playlist = {
  "id": number,
  "text": string,
  "audio": string,
  "duration_sec": number
}

type PlaylistJSON = Playlist[];

test.describe("TC-DA-0010 — API: Audio file names follow naming convention", () => {
  test("Audio file names match {dicId}-{sentenceNum}.mp3 patern", async ({ request }) => {
    // Step 1: Send GET request to the entry point URL
    const response = await request.get(FILE_NAME);

    // Step 2: Parse the response body as JSON
    const { dics } = await response.json() as Body;
    for (const item of dics) {
      const resPlaylist = await request.get(`${item.id}/playlist.json`);
      expect(resPlaylist.status()).toBe(200);
      const playlist = await resPlaylist.json() as PlaylistJSON;

      let i = 1;
      for (const entry of playlist) {
        expect(entry.audio).toMatch(/^\d{4}-\d{2}\.mp3$/);
        const [dicId, sentenceId] = entry.audio.replace(".mp3","").split("-");
        expect(item.id, `${item.id}: dic ID part in the file name is mismatch`).toBe(dicId);
        expect(sentenceId, `${item.id}: ${entry.audio} has wrong sentence ID, should be ${String(i).padStart(2, "0")}`).toBe(String(i).padStart(2, "0"));
        i++;
      }
    }
  });
});
