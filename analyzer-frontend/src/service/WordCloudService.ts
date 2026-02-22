import Papa from "papaparse";
import { listFiles, getZipFile } from "./FileService";
import { ModelsWordCount } from "@/models";

const wordRegexp = /[A-Za-z0-9ÄÖÜäöüß]+/g;
const urlRegexp = /^(https?:\/\/|www\.)\S+$/;
const messageFileRegexp = /^message_.*\.csv$/;

function countWordsInContent(
  content: string,
  wordCounts: Map<string, number>,
  showOnlyUserWords: boolean,
): void {
  const { data: records } = Papa.parse<string[]>(content, {
    skipEmptyLines: true,
  });

  if (records.length === 0) return;

  const header = records[0];
  const bodyIdx = header.indexOf("body");
  if (bodyIdx === -1) return;

  for (const row of records.slice(1)) {
    if (bodyIdx >= row.length) continue;

    const text = row[bodyIdx].toLowerCase();

    if (text.includes("image")) continue;

    if (showOnlyUserWords && row[5]?.includes("READ")) continue;

    if (urlRegexp.test(text)) continue;

    const words = text.match(wordRegexp) ?? [];
    for (const word of words) {
      if (word) {
        wordCounts.set(word, (wordCounts.get(word) ?? 0) + 1);
      }
    }
  }
}

export async function getWordCount(limit: number): Promise<ModelsWordCount[]> {
  const wordCounts = new Map<string, number>();

  const matchingFiles = listFiles().filter((f) => messageFileRegexp.test(f));

  for (const filename of matchingFiles) {
    try {
      const entry = getZipFile(filename);
      if (!entry) continue;

      const content = await entry.content.text();
      countWordsInContent(content, wordCounts, true);
    } catch (error) {
      console.error(`Error reading ${filename}:`, error);
    }
  }

  const results: ModelsWordCount[] = Array.from(wordCounts.entries()).map(
    ([word, count]) => ({ word, count }),
  );

  results.sort((a, b) => {
    if (a.count === b.count) return (a.word ?? "").localeCompare(b.word ?? "");
    return (b.count ?? 0) - (a.count ?? 0);
  });

  return results.slice(0, limit);
}