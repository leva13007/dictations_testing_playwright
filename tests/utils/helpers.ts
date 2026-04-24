
export const AUDIO_FILENAME_PATTERN = /^\d{4}-\d{2}\.mp3$/;

export const getDicAndSentenceIds = (audio: string): [string,string] => {
  const [dicId, sentenceId] = audio.replace(".mp3", "").split("-");
  return [dicId, sentenceId];
}