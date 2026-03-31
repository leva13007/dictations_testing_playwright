import { test, expect } from "@playwright/test";

/**
 * Contract tests — validate that each resource conforms to its expected schema.
 * One fetch of index.json shared across all tests in this file.
 */

type Dic = {
  id: string;
  title: string;
  level: string;
  sentences: number;
  duration_sec: number;
  tags: any;
  features: any;
  type: any;
  has_video?: string;
};

type IndexBody = {
  language: string;
  repository?: string;
  created_at: string;
  updated_at: string;
  dics: Dic[];
};

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

type PlaylistItem = {
  id: number;
  text: string;
  audio: string;
  duration_sec: number;
};

let indexBody: IndexBody;
let dics: Dic[];

test.beforeAll(async ({ request }) => {
  const res = await request.get("index.json");
  expect(res.status()).toBe(200);
  indexBody = await res.json();
  dics = indexBody.dics;
  expect(Array.isArray(dics) && dics.length > 0).toBeTruthy();
});

test.describe("Contract — index.json structure", () => {
  test("TC-DA-0002: index.json top-level fields and dics items have valid schema", async () => {
    expect(typeof indexBody.language === "string" && indexBody.language.length > 0).toBeTruthy();
    indexBody.repository && expect(typeof indexBody.repository === "string").toBeTruthy();
    expect(new Date(indexBody.created_at.toString())).not.toBe("Invalid Date");
    expect(new Date(indexBody.updated_at.toString())).not.toBe("Invalid Date");

    for (const dic of dics) {
      expect(typeof dic.id === "string" && dic.id.length > 0).toBeTruthy();
      expect(typeof dic.title === "string" && dic.title.length > 0).toBeTruthy();
      expect(typeof dic.level === "string" && dic.level.length > 0).toBeTruthy();
      expect(typeof dic.sentences === "number" && dic.sentences > 0 && Math.trunc(dic.sentences) === dic.sentences).toBeTruthy();
      expect(typeof dic.duration_sec === "number" && dic.duration_sec > 0).toBeTruthy();
      expect("tags" in dic).toBeTruthy();
      expect("features" in dic).toBeTruthy();
      expect("type" in dic).toBeTruthy();
    }
  });
});

test.describe("Contract — dic.json structure", () => {
  test("TC-DA-0003: Each dic.json has valid structure", async ({ request }) => {
    for (const item of dics) {
      const res = await request.get(`${item.id}/dic.json`);
      expect(res.status(), `dic.json for ${item.id} should return 200`).toBe(200);

      const dic: DicJson = await res.json();

      expect(typeof dic.id, `${item.id}: id`).toBe("string");
      expect(typeof dic.title, `${item.id}: title`).toBe("string");
      expect(typeof dic.level, `${item.id}: level`).toBe("string");
      expect(typeof dic.sentences, `${item.id}: sentences`).toBe("number");
      expect(typeof dic.duration_sec, `${item.id}: duration_sec`).toBe("number");

      expect(typeof dic.voice, `${item.id}: voice`).toBe("object");
      expect(
        dic.voice.voice_name === null || typeof dic.voice.voice_name === "string",
        `${item.id}: voice_name`
      ).toBeTruthy();
      expect(
        dic.voice.voice_id === null || typeof dic.voice.voice_id === "string",
        `${item.id}: voice_id`
      ).toBeTruthy();
      expect(
        dic.voice.provider === "ElevenLabs" || dic.voice.provider === null,
        `${item.id}: voice.provider`
      ).toBeTruthy();
      expect(
        dic.voice.type === "man" || dic.voice.type === "woman",
        `${item.id}: voice.type`
      ).toBeTruthy();

      expect("features" in dic, `${item.id}: features`).toBeTruthy();
      expect("tags" in dic, `${item.id}: tags`).toBeTruthy();
      expect(
        dic.video === null || typeof dic.video === "string",
        `${item.id}: video`
      ).toBeTruthy();
      expect(!isNaN(Date.parse(dic.created_at)), `${item.id}: created_at`).toBeTruthy();
    }
  });
});

test.describe("Contract — playlist.json structure", () => {
  test("TC-DA-0004: Each playlist.json is a valid non-empty array with correct item schema", async ({ request }) => {
    for (const item of dics) {
      const res = await request.get(`${item.id}/playlist.json`);
      expect(res.status(), `playlist.json for ${item.id} should return 200`).toBe(200);

      const playlist: PlaylistItem[] = await res.json();
      expect(Array.isArray(playlist), `${item.id}: should be an array`).toBeTruthy();
      expect(playlist.length, `${item.id}: should not be empty`).toBeGreaterThan(0);

      for (const entry of playlist) {
        expect(typeof entry.id, `${item.id}: item.id`).toBe("number");
        expect(typeof entry.text, `${item.id}: item.text`).toBe("string");
        expect(typeof entry.audio, `${item.id}: item.audio`).toBe("string");
        expect(typeof entry.duration_sec, `${item.id}: item.duration_sec`).toBe("number");
      }
    }
  });
});
