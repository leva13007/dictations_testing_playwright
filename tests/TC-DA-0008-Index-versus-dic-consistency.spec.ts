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

test.describe("TC-DA-0008 — API: Index metadata should match dic.json", () => {
  test("Shared fields between index.json items and dic.json are identical", async ({request}) => {
    // Step 1: Send GET request to the entry point URL
    const response = await request.get(FILE_NAME);

    // Step 2: Parse the response body as JSON
    const { dics } = await response.json() as Body;
    for (const item of dics){
      const resDic = await request.get(`${item.id}/dic.json`);
      expect(resDic.status()).toBe(200);
      const dic = await resDic.json() as DicJSON;

      expect(dic.id, `${item.id}: id mismatch`).toBe(item.id);
      expect(dic.title, `${item.title}: title mismatch`).toBe(item.title);
      expect(dic.level, `${item.level}: level mismatch`).toBe(item.level);
      expect(dic.sentences, `${item.sentences}: sentences mismatch`).toBe(item.sentences);
      expect(dic.duration_sec, `${item.duration_sec}: duration_sec mismatch`).toBe(item.duration_sec);
      expect(dic.tags, `${item.tags}: tags mismatch`).toEqual(item.tags);
      expect(dic.features, `${item.features}: features mismatch`).toEqual(item.features);
    }
  });
});
