import { test, expect } from "@playwright/test";
import { INDEX_FILE } from "./constants";
import { DictationAPI } from "../utils/api-client";

test.describe("Smoke tests", () => {
  test(`TC-DA-0001 — API: Open Entry Point and fetch ${INDEX_FILE}`, async({request}) => {
    const api = new DictationAPI(request);
    const body = await api.getIndex();
    expect(body).toBeTruthy();
    expect(typeof body).toBe("object");
  });
});
