import { test, expect, APIRequestContext } from "@playwright/test";
import { Dic} from "./types";
import { DictationAPI } from "../utils/api-client";
import { AUDIO_FILENAME_PATTERN, getDicAndSentenceIds } from "../utils/helpers";

test.describe("Content tests", () => {
  test.describe.configure({ mode: 'default' });

  let apiContext: APIRequestContext;
  let dics: Dic[];
  let api: DictationAPI;

  test.beforeAll(async ({ playwright }) => {
    apiContext = await playwright.request.newContext();
    api = new DictationAPI(apiContext);
    dics = await api.getDics();
  });

  test.afterAll(async ({ }) => {
    await apiContext.dispose();
  });

  test("TC-DA-0006 — API: Each sentence should have a valid audio file", async () => {
    for (const item of dics) {
      const playlist = await api.getPlaylistJson(item.id);
      for (const entry of playlist) {
        const contentType = (await api.getAudioHeader(`${item.id}/sounds/${entry.audio}`))['content-type'];
        expect(contentType, `${item.id}: ${entry.id} content-type should be mp3 but got: ${contentType}`).toBe('audio/mp3');
      }
    }
  });

  test("TC-DA-0007 — API: Sentences should not be empty", async () => {
    for (const item of dics) {
      const playlist = await api.getPlaylistJson(item.id);
      for (const entry of playlist) {
        const trimmed = entry.text.trim();
        expect(trimmed.length, `${item.id}: sentence ${entry.id} shouldn't be empty`).toBeGreaterThan(0);
        expect(trimmed.length, `${item.id}: sentence ${entry.id} length is not greater than 3, actual length is: ${trimmed.length}`).toBeGreaterThan(3);
      }
    }
  });

  test("TC-DA-0009 — API: Playlist IDs are sequential", async () => {
    for (const item of dics) {
      const playlist = await api.getPlaylistJson(item.id);

      let i = 1;
      for (const entry of playlist) {
        expect(entry.id, `${item.id}: ${entry.id} should have id: ${i}`).toBe(i);
        i++;
      }
    }
  });

  test("TC-DA-0010 — API: Audio file names follow naming convention", async () => {
    for (const item of dics) {
      const playlist = await api.getPlaylistJson(item.id);

      let i = 1;
      for (const entry of playlist) {
        expect(entry.audio).toMatch(AUDIO_FILENAME_PATTERN);
        const [dicId, sentenceId] = getDicAndSentenceIds(entry.audio);
        expect(item.id, `${item.id}: dic ID part in the file name is mismatch`).toBe(dicId);
        expect(sentenceId, `${item.id}: ${entry.audio} has wrong sentence ID, should be ${String(i).padStart(2, "0")}`).toBe(String(i).padStart(2, "0"));
        i++;
      }
    }
  });

  test("TC-DA-0012 — API: Text.md exists for each dictation", async () => {
    for (const item of dics) {
      const text = await api.getTextMd(item.id);
      expect(text.length, `${item.id}: Text.md should be contain more than 3 characters`).toBeGreaterThan(3)
    }
  });
});
