import Papa from "papaparse";
import { getZipFile } from "./FileService";
import { ModelsContactStats } from "@/models/ModelsContactStats";

const USER_MESSAGE_PATH = "message_";

function detectMediaType(type: string, body: string): "image" | "video" | "voice" | null {
  const upperType = type.toUpperCase().trim();

  if (upperType === "IMAGE") return "image";
  if (upperType === "VIDEO") return "video";
  if (upperType === "VOICEMESSAGE" || upperType === "VOICE" || upperType === "AUDIO") return "voice";

  if (upperType === "FILE" && body) {
    const lower = body.toLowerCase();
    if (lower.includes("image/")) return "image";
    if (lower.includes("video/")) return "video";
    if (lower.includes("audio/")) return "video";
  }

  return null;
}

export async function loadContactStats(
  identityID: string,
): Promise<ModelsContactStats> {
  const file = getZipFile(`${USER_MESSAGE_PATH}${identityID}.csv`);
  if (!file) return emptyStats();

  const text = await file.content.text();
  const parsed = Papa.parse(text, {
    header: true,
    skipEmptyLines: true,
  });

  const rows = parsed.data as any[];
  if (rows.length === 0) return emptyStats();

  let sentCount = 0;
  let receivedCount = 0;
  let imageCount = 0;
  let videoCount = 0;
  let voiceMessageCount = 0;
  let firstTs = Infinity;
  let lastTs = -Infinity;

  const timestamps: { ts: number; isOutbox: boolean }[] = [];

  for (const row of rows) {
    const ts = parseInt(row.posted_at, 10);
    if (isNaN(ts)) continue;

    const isOutbox = row.isoutbox === "1" || row.isoutbox === 1;
    const type = row.type || "";
    const body = row.body || "";

    if (isOutbox) {
      sentCount++;
    } else {
      receivedCount++;
    }

    const media = detectMediaType(type, body);
    if (media === "image") imageCount++;
    else if (media === "video") videoCount++;
    else if (media === "voice") voiceMessageCount++;

    if (ts < firstTs) firstTs = ts;
    if (ts > lastTs) lastTs = ts;

    timestamps.push({ ts, isOutbox });
  }

  const totalMessages = sentCount + receivedCount;
  if (totalMessages === 0) return emptyStats();

  const firstMessageDate = new Date(firstTs);
  const lastMessageDate = new Date(lastTs);
  const totalDays = Math.max(
    1,
    Math.ceil((lastTs - firstTs) / (1000 * 60 * 60 * 24)),
  );
  const avgMessagesPerDay = totalMessages / totalDays;

  // Calculate average response time
  timestamps.sort((a, b) => a.ts - b.ts);
  let responseTimeSum = 0;
  let responseCount = 0;

  for (let i = 0; i < timestamps.length - 1; i++) {
    if (!timestamps[i].isOutbox && timestamps[i + 1].isOutbox) {
      const gap = timestamps[i + 1].ts - timestamps[i].ts;
      if (gap > 0 && gap < 24 * 60 * 60 * 1000) {
        responseTimeSum += gap;
        responseCount++;
      }
    }
  }

  const avgResponseTimeMs =
    responseCount > 0 ? responseTimeSum / responseCount : null;

  return {
    sentCount,
    receivedCount,
    imageCount,
    videoCount,
    voiceMessageCount,
    firstMessageDate,
    lastMessageDate,
    avgMessagesPerDay: Math.round(avgMessagesPerDay * 10) / 10,
    avgResponseTimeMs,
    totalDays,
  };
}

function emptyStats(): ModelsContactStats {
  return {
    sentCount: 0,
    receivedCount: 0,
    imageCount: 0,
    videoCount: 0,
    voiceMessageCount: 0,
    firstMessageDate: null,
    lastMessageDate: null,
    avgMessagesPerDay: 0,
    avgResponseTimeMs: null,
    totalDays: 0,
  };
}
