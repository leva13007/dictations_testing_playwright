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

test.describe("TC-DA-0011 — API: No duplicate dictation IDs in index", () => {
  test("All dics[].id values in indes.json are unique", async ({ request }) => {
    // Step 1: Send GET request to the entry point URL
    const response = await request.get(FILE_NAME);

    // Step 2: Parse the response body as JSON
    const { dics } = await response.json() as Body;
    
    const uniqueIds = new Set(dics.map(el => el.id));
    expect(dics.length, `Duplicates dictations IDs found`).toBe(uniqueIds.size)
  });
});
