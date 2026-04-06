import { test, expect } from "@playwright/test";
import { INDEX_FILE } from "./constants";
import { Body, Dic, DicJSON, PlaylistJSON } from "./types";

test.describe("Contract tests", () => {
  test.describe.configure({ mode: 'default' });

  let body: Body;
  let dics: Dic[];

  test.beforeAll(async({request}) => {
    // Step 1: Send GET request to the entry point URL
    const response = await request.get(INDEX_FILE);

    // Step 2: Parse the response body as JSON
    body = await response.json() as Body;
    dics = body.dics;
    expect(Array.isArray(body.dics) && body.dics.length > 0).toBeTruthy();
  });

  test("GET entry point returns status 200 and valid JSON", async ({
    request,
  }) => {
    expect('language' in body && typeof body.language === 'string' && body.language.length > 0).toBeTruthy();
    body?.repository && expect(typeof body.repository === 'string').toBeTruthy();
    expect(new Date(body.created_at.toString())).not.toBe('Invalid Date');
    expect(new Date(body.updated_at.toString())).not.toBe('Invalid Date');

    for (const dic of body.dics) {
      expect(typeof dic.id === 'string' && dic.id.length > 0).toBeTruthy();
      expect(typeof dic.title === 'string' && dic.title.length > 0).toBeTruthy();
      expect(typeof dic.level === 'string' && dic.level.length > 0).toBeTruthy();
      expect(typeof dic.sentences === 'number' && dic.sentences > 0 && (Math.trunc(dic.sentences) === dic.sentences)).toBeTruthy();
      expect(typeof dic.duration_sec === 'number' && dic.duration_sec > 0).toBeTruthy();
      expect('tags' in dic).toBeTruthy();
      expect('features' in dic).toBeTruthy();
      expect('type' in dic).toBeTruthy();
    }
  });

  test("TC-DA-0003 — API: Validate individual dictation (dic.json) structure", async ({ request }) => {
    for (const item of dics) {
      const res = await request.get(`${item.id}/dic.json`);
      expect(res.status()).toBe(200);

      const dic = await res.json() as DicJSON;

      expect(typeof dic.id, `${dic.id}: id should be string`).toBe('string');
      expect(typeof dic.title, `${dic.id}: title should be string`).toBe('string');
      expect(typeof dic.level, `${dic.id}: level should be string`).toBe('string');
      expect(typeof dic.sentences, `${dic.id}: sentences should be number`).toBe('number');
      expect(typeof dic.duration_sec, `${dic.id}: duration_sec should be number`).toBe('number');

      expect(typeof dic.voice, `${dic.id}: voice should be object`).toBe('object');
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

  test("TC-DA-0004 — API: Validate playlist.json structure for each dictation", async ({ request }) => {
    for (const item of dics) {
      const res = await request.get(`${item.id}/playlist.json`);
      expect(res.status()).toBe(200);

      const playlist = await res.json() as PlaylistJSON;
      expect(Array.isArray(playlist), `${item.id}: playlist should be an array`).toBeTruthy();
      expect(playlist.length > 0, `${item.id}: playlist should not be empty`).toBeTruthy();

      for (const entry of playlist) {
        expect(typeof entry.id, `${entry.id}: entry.id should be a number`).toBe('number');
        expect(typeof entry.text, `${entry.text}: entry.text should be a string`).toBe('string');
        expect(typeof entry.audio, `${entry.audio}: entry.audio should be a string`).toBe('string');
        expect(typeof entry.duration_sec, `${entry.duration_sec}: entry.duration_sec should be a number`).toBe('number');
      }
    }
  });
});
