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


test.describe("TC-DA-0004 — API: Validate playlist.json structure for each dictation", () => {
  test("Each playlist.json is a valid non-empty array with correct item schema", async ({request}) => {
    // Step 1: Send GET request to the entry point URL
    const response = await request.get(FILE_NAME);

    // Step 2: Parse the response body as JSON
    const { dics } = await response.json() as Body;
    for (const item of dics){
      const res = await request.get(`${item.id}/playlist.json`);
      expect(res.status()).toBe(200);

      const playlist = await res.json() as PlaylistJSON;
      expect(Array.isArray(playlist), `${item.id}: playlist should be an array`).toBeTruthy();
      expect(playlist.length > 0, `${item.id}: playlist should not be empty`).toBeTruthy();

      for(const entry of playlist){
        expect(typeof entry.id, `${entry.id}: entry.id should be a nuber`).toBe('number');
        expect(typeof entry.text, `${entry.text}: entry.text should be a string`).toBe('string');
        expect(typeof entry.audio, `${entry.audio}: entry.audio should be a string`).toBe('string');
        expect(typeof entry.duration_sec, `${entry.duration_sec}: entry.duration_sec should be a nuber`).toBe('number');
      }
    }
  });
});
