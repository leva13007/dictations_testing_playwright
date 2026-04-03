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

test.describe("TC-DA-0007 — API: Sentences should not be empty", () => {
  test("All playlist `text` fields are non-empty and length > 3", async ({request}) => {
    // Step 1: Send GET request to the entry point URL
    const response = await request.get(FILE_NAME);

    // Step 2: Parse the response body as JSON
    const { dics } = await response.json() as Body;
    for (const item of dics){
      const resPlaylist = await request.get(`${item.id}/playlist.json`);
      expect(resPlaylist.status()).toBe(200);
      const playlist = await resPlaylist.json() as PlaylistJSON;
      for(const entry of playlist){
        const trimmed = entry.text.trim();
        expect(trimmed.length, `${item.id}: sentence ${entry.id} shouldn't be empty`).toBeGreaterThan(0);
        expect(trimmed.length, `${item.id}: sentence ${entry.id} length is not greater than 3, actual length is: ${trimmed.length}`).toBeGreaterThan(3);
      }
    }
  });
});
