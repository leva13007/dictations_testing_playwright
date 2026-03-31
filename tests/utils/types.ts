export type Dic = {
  id: string;
  title: string;
  level: string;
  sentences: number;
  duration_sec: number;
  tags: any;
  features: any;
  type?: any;
  has_video?: string;
};

export type IndexBody = {
  url: string;
  language: string;
  repository?: string;
  created_at: string;
  updated_at: string;
  dics: Dic[];
};

export type Voice = {
  voice_name: string | null;
  voice_id: string | null;
  provider: string | null;
  type: string;
};

export type DicJson = {
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

export type PlaylistItem = {
  id: number;
  text: string;
  audio: string;
  duration_sec: number;
};
