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

test.describe("TC-DA-0012 — API: Text.md exists for each dictation", () => {
  test("Text.md is reachable and non-empty for every dictation", async ({request}) => {
    // Step 1: Send GET request to the entry point URL
    const response = await request.get(FILE_NAME);

    // Step 2: Parse the response body as JSON
    const { dics } = await response.json() as Body;
    for (const item of dics){
      const res = await request.get(`${item.id}/Text.md`);
      expect(res.status(), `${item.id}: Text.md should return 200`).toBe(200);

      const text = await res.text();
      expect(text.length, `${item.id}: Text.md should be contain more than 3 characters`).toBeGreaterThan(3)
    }
  });
});
