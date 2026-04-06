
export type Body = {
  "language": string;
  "repository"?: string;
  "created_at": string;
  "updated_at": string;
  "dics": Dic[]
}

export type Dic = {
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

export type Voice = {
  voice_name?: string;
  voice_id?: string;
  provider?: "ElevenLabs";
  type: 'man' | 'woman';
}

export type DicJSON = {
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

export type Playlist = {
  "id": number,
  "text": string,
  "audio": string,
  "duration_sec": number
}

export type PlaylistJSON = Playlist[];