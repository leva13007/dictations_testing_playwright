import { test, expect } from "@playwright/test";

const FILE_NAME = "index.json";

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

test.describe(`TC-DA-0002 — API: Open Entry Point and fetch ${FILE_NAME}`, () => {
  test("GET entry point returns status 200 and valid JSON", async ({
    request,
  }) => {
    // Step 1: Send GET request to the entry point URL
    const response = await request.get(FILE_NAME);

    // Step 2: Parse the response body as JSON
    const body = await response.json() as Body;
    expect('language' in body && typeof body.language === 'string' && body.language.length > 0).toBeTruthy();
    body?.repository && expect(typeof body.repository === 'string').toBeTruthy();
    expect(new Date(body.created_at.toString())).not.toBe('Invalid Date');
    expect(new Date(body.updated_at.toString())).not.toBe('Invalid Date');
    expect(Array.isArray(body.dics) && body.dics.length > 0).toBeTruthy();

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
});
