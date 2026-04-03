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

test.describe("TC-DA-0005 — API: Sentence count and duration consistency between dic.json and playlist.json", () => {
  test("dic.json sentence/diration match playlist.jsno data, all durations > 0", async ({request}) => {
    // Step 1: Send GET request to the entry point URL
    const response = await request.get(FILE_NAME);

    // Step 2: Parse the response body as JSON
    const { dics } = await response.json() as Body;
    for (const item of dics){
      const resDic = await request.get(`${item.id}/dic.json`);
      const resPlaylist = await request.get(`${item.id}/playlist.json`);

      expect(resDic.status()).toBe(200);
      expect(resPlaylist.status()).toBe(200);

      const dic = await resDic.json() as DicJSON;
      const playlist = await resPlaylist.json() as PlaylistJSON;

      expect(dic.sentences === playlist.length, `${item.id}: sentence count mistmach`).toBeTruthy();

      let sumDuration = 0;
      for(const entry of playlist){
        expect(entry.duration_sec, `${item.id} | ${entry.duration_sec}: entry.duration_sec should be greater than 0`).toBeGreaterThan(0);
        sumDuration += entry.duration_sec;
      }
      expect(sumDuration > 0, `${item.id}: duration_sec sum should be computed`).toBeTruthy();
      expect(sumDuration, `${item.id}: duration_sec sum mistmach`).toBeCloseTo(dic.duration_sec, 1);
    }
  });
});
