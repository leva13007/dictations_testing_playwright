/** Check that an array of numeric IDs is sequential: 1, 2, 3, … */
export function isSequential(ids: number[]): boolean {
  return ids.every((id, i) => id === i + 1);
}

/** Extract filename from a path like "dics/0001/sounds/0001-01.mp3" → "0001-01.mp3" */
export function extractFilename(path: string): string {
  return path.includes("/") ? path.split("/").pop()! : path;
}

/** Resolve audio field value to a URL relative to baseURL */
export function resolveAudioUrl(audioField: string, dicId: string): string {
  return audioField.startsWith("dics/")
    ? audioField.replace(/^dics\//, "")
    : `${dicId}/sounds/${audioField}`;
}

/** Expected audio filename pattern: XXXX-YY.mp3 */
export const AUDIO_FILENAME_PATTERN = /^\d{4}-\d{2}\.mp3$/;
