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

test.describe("TC-DA-0003 — API: Validate individual dictation (dic.json) structure", () => {
  test("Each dic.json has a valid structure", async ({request}) => {
    // Step 1: Send GET request to the entry point URL
    const response = await request.get(FILE_NAME);

    // Step 2: Parse the response body as JSON
    const { dics } = await response.json() as Body;
    for (const item of dics){
      const res = await request.get(`${item.id}/dic.json`);
      expect(res.status()).toBe(200);

      const dic = await res.json() as DicJSON;

      expect(typeof dic.id, `${dic.id}: id should be string`).toBe('string');
      expect(typeof dic.title, `${dic.title}: id should be string`).toBe('string');
      expect(typeof dic.level, `${dic.level}: id should be string`).toBe('string');
      expect(typeof dic.sentences, `${dic.sentences}: id should be number`).toBe('number');
      expect(typeof dic.duration_sec, `${dic.duration_sec}: id should be number`).toBe('number');

      expect(typeof dic.voice, `${dic.voice}: id should be object`).toBe('object');
      expect(dic.voice.voice_name === null || typeof dic.voice.voice_name === 'string', `${dic.id}: voice_name should be string`).toBeTruthy();
      expect(dic.voice.voice_id === null || typeof dic.voice.voice_id === 'string', `${dic.id}: voice_id should be string`).toBeTruthy();
      expect(dic.voice.provider === null || dic.voice.provider === 'ElevenLabs', `${dic.id}: provider should be ElevenLabs`).toBeTruthy();
      expect(dic.voice.type === 'man' || dic.voice.type === 'woman', `${dic.id}: type should be man or woman`).toBeTruthy();

      expect('features' in dic, `${dic.id}: features should exist`).toBeTruthy();
      expect('tags' in dic, `${dic.id}: tags should exist`).toBeTruthy();
      expect(dic.video === null || typeof dic.video === 'string', `${dic.id}: video should be string`).toBeTruthy();
      expect(typeof dic.created_at === 'string', `${dic.id}: created_at should be string`).toBeTruthy();
    }
  });
});