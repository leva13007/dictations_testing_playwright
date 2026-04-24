import { APIRequestContext, expect } from "@playwright/test";
import { INDEX_FILE } from "../api/constants";
import { Body, DicJSON, PlaylistJSON } from "../api/types";


export class DictationAPI {
  private indexCache: Body | undefined;
  private dicCache = new Map<string, DicJSON>();
  private playlistCache = new Map<string, PlaylistJSON>();
  constructor(private request: APIRequestContext) {}

  async getIndex(): Promise<Body> {
    if (this.indexCache) return this.indexCache;

    const response = await this.request.get(INDEX_FILE);
    expect(response.status()).toBe(200);
    this.indexCache = await response.json() as Body;
    return this.indexCache;
  }

  async getDics() {
    const index = await this.getIndex();
    expect(Array.isArray(index.dics) && index.dics.length > 0).toBeTruthy();
    return index.dics;
  }

  async getDicJson(id: string): Promise<DicJSON> {
    if (this.dicCache.has(id)) return this.dicCache.get(id)!;
    const response = await this.request.get(`${id}/dic.json`);
    expect(response.status()).toBe(200);
    const dic = await response.json() as DicJSON;
    this.dicCache.set(id, dic);
    return dic;
  }

  async getPlaylistJson(id: string): Promise<PlaylistJSON> {
    if (this.playlistCache.has(id)) return this.playlistCache.get(id)!;
    const response = await this.request.get(`${id}/playlist.json`);
    expect(response.status()).toBe(200);
    const playlist = await response.json() as PlaylistJSON;
    this.playlistCache.set(id, playlist);
    return playlist;
  }

  async getTextMd(id: string): Promise<string> {
    const res = await this.request.get(`${id}/Text.md`);
      expect(res.status(), `${id}: Text.md should return 200`).toBe(200);

      const text = await res.text();
      return text;
  }

  async getAudioHeader(url: string): Promise<{[key: string]: string}> {
    const audio = await this.request.get(url);
    expect(audio.status()).toBe(200);
    return audio.headers();
  }
}