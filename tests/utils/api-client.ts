import { APIRequestContext, expect } from "@playwright/test";
import type { IndexBody, Dic, DicJson, PlaylistItem } from "./types";

export class DictationAPI {
  private indexCache: IndexBody | null = null;
  private dicCache = new Map<string, DicJson>();
  private playlistCache = new Map<string, PlaylistItem[]>();

  constructor(private request: APIRequestContext) {}

  async getIndex(): Promise<IndexBody> {
    if (this.indexCache) return this.indexCache;
    const res = await this.request.get("index.json");
    expect(res.status()).toBe(200);
    this.indexCache = await res.json();
    return this.indexCache!;
  }

  async getDics(): Promise<Dic[]> {
    const index = await this.getIndex();
    expect(Array.isArray(index.dics) && index.dics.length > 0).toBeTruthy();
    return index.dics;
  }

  async getDicJson(id: string): Promise<DicJson> {
    if (this.dicCache.has(id)) return this.dicCache.get(id)!;
    const res = await this.request.get(`${id}/dic.json`);
    expect(res.status(), `dic.json for ${id} should return 200`).toBe(200);
    const dic: DicJson = await res.json();
    this.dicCache.set(id, dic);
    return dic;
  }

  async getPlaylist(id: string): Promise<PlaylistItem[]> {
    if (this.playlistCache.has(id)) return this.playlistCache.get(id)!;
    const res = await this.request.get(`${id}/playlist.json`);
    expect(res.status(), `playlist.json for ${id} should return 200`).toBe(200);
    const playlist: PlaylistItem[] = await res.json();
    this.playlistCache.set(id, playlist);
    return playlist;
  }

  async getTextMd(id: string): Promise<string> {
    const res = await this.request.get(`${id}/Text.md`);
    expect(res.status(), `Text.md for ${id} should return 200`).toBe(200);
    return res.text();
  }

  async headAudio(url: string): Promise<{ status: number; contentType: string }> {
    const res = await this.request.fetch(url, { method: "HEAD" });
    return {
      status: res.status(),
      contentType: res.headers()["content-type"] ?? "",
    };
  }
}
