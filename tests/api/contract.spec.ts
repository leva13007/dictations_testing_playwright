import { test, expect } from "@playwright/test";
import { DictationAPI } from "../utils/api-client";
import { expectValidVoice, expectValidPlaylistItem } from "../utils/validators";
import type { Dic, IndexBody } from "../utils/types";

/**
 * Contract tests — validate that each resource conforms to its expected schema.
 */

let indexBody: IndexBody;
let dics: Dic[];

test.beforeAll(async ({ request }) => {
  const api = new DictationAPI(request);
  indexBody = await api.getIndex();
  dics = await api.getDics();
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
    const api = new DictationAPI(request);
    for (const item of dics) {
      const dic = await api.getDicJson(item.id);

      expect(typeof dic.id, `${item.id}: id`).toBe("string");
      expect(typeof dic.title, `${item.id}: title`).toBe("string");
      expect(typeof dic.level, `${item.id}: level`).toBe("string");
      expect(typeof dic.sentences, `${item.id}: sentences`).toBe("number");
      expect(typeof dic.duration_sec, `${item.id}: duration_sec`).toBe("number");

      expectValidVoice(dic.voice, item.id);

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
    const api = new DictationAPI(request);
    for (const item of dics) {
      const playlist = await api.getPlaylist(item.id);
      expect(Array.isArray(playlist), `${item.id}: should be an array`).toBeTruthy();
      expect(playlist.length, `${item.id}: should not be empty`).toBeGreaterThan(0);

      for (const entry of playlist) {
        expectValidPlaylistItem(entry, item.id);
      }
    }
  });
});
