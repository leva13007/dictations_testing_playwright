import { test, expect } from "@playwright/test";

const INDEX = "index.json";

type Voice = {
  voice_name: string | null;
  voice_id: string | null;
  provider: string | null;
  type: string;
};

type DicJson = {
  id: string;
  title: string;
  level: string;
  sentences: number;
  duration_sec: number;
  voice: Voice;
  features: any;
  tags: any;
  video: string | null;
  created_at: string;
};

test.describe("TC-DA-0003 — API: Validate individual dictation (dic.json) structure", () => {
  test("Each dic.json has valid structure", async ({ request }) => {
    const indexRes = await request.get(INDEX);
    expect(indexRes.status()).toBe(200);
    const { dics } = await indexRes.json();
    expect(Array.isArray(dics) && dics.length > 0).toBeTruthy();

    for (const item of dics) {
      const res = await request.get(`${item.id}/dic.json`);
      expect(res.status(), `dic.json for ${item.id} should return 200`).toBe(200);

      const dic: DicJson = await res.json();

      // Basic fields
      expect(typeof dic.id, `${item.id}: id should be string`).toBe("string");
      expect(typeof dic.title, `${item.id}: title should be string`).toBe("string");
      expect(typeof dic.level, `${item.id}: level should be string`).toBe("string");
      expect(typeof dic.sentences, `${item.id}: sentences should be number`).toBe("number");
      expect(typeof dic.duration_sec, `${item.id}: duration_sec should be number`).toBe("number");

      // Voice object
      expect(typeof dic.voice, `${item.id}: voice should be object`).toBe("object");
      expect(
        dic.voice.voice_name === null || typeof dic.voice.voice_name === "string",
        `${item.id}: voice_name should be null or string`
      ).toBeTruthy();
      expect(
        dic.voice.voice_id === null || typeof dic.voice.voice_id === "string",
        `${item.id}: voice_id should be null or string`
      ).toBeTruthy();
      expect(
        dic.voice.provider === "ElevenLabs" || dic.voice.provider === null,
        `${item.id}: voice.provider should be "ElevenLabs" or null`
      ).toBeTruthy();
      expect(
        dic.voice.type === "man" || dic.voice.type === "woman",
        `${item.id}: voice.type should be "man" or "woman"`
      ).toBeTruthy();

      // Other fields
      expect("features" in dic, `${item.id}: features should exist`).toBeTruthy();
      expect("tags" in dic, `${item.id}: tags should exist`).toBeTruthy();
      expect(
        dic.video === null || typeof dic.video === "string",
        `${item.id}: video should be null or string`
      ).toBeTruthy();
      expect(
        !isNaN(Date.parse(dic.created_at)),
        `${item.id}: created_at should be a valid date`
      ).toBeTruthy();
    }
  });
});
