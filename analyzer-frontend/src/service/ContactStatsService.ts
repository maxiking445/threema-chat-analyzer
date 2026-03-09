import Papa from "papaparse";
import { getZipFile } from "./FileService";
import { ModelsContactStats } from "@/models/ModelsContactStats";

const USER_MESSAGE_PATH = "message_";

export async function loadContactStats(
  identityID: string,
): Promise<ModelsContactStats> {
  console.warn("[ContactStats] called with identityID:", identityID);
  const filename = `${USER_MESSAGE_PATH}${identityID}.csv`;
  console.warn("[ContactStats] looking for file:", filename);
  const file = getZipFile(filename);
  if (!file) {
    console.warn("[ContactStats] file NOT found!");
    return emptyStats();
  }
  console.warn("[ContactStats] file found, size:", file.size);

  const text = await file.content.text();
  const parsed = Papa.parse(text, {
    header: true,
    skipEmptyLines: true,
  });

  const rows = parsed.data as any[];
  if (rows.length === 0) return emptyStats();

  // Debug: log first row's keys and type value to diagnose column names
  if (rows.length > 0) {
    console.debug("[ContactStats] CSV columns:", Object.keys(rows[0]));
    console.debug("[ContactStats] Sample row:", JSON.stringify(rows[0]));
  }

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

    // Try multiple possible column names for message type
    const typeRaw = row.type || row.message_type || row.messagetype || "";
    const type = String(typeRaw).toUpperCase().trim();

    if (isOutbox) {
      sentCount++;
    } else {
      receivedCount++;
    }

    if (type === "IMAGE") imageCount++;
    else if (type === "VIDEO") videoCount++;
    else if (type === "VOICEMESSAGE" || type === "VOICE" || type === "AUDIO") voiceMessageCount++;

    if (ts < firstTs) firstTs = ts;
    if (ts > lastTs) lastTs = ts;

    timestamps.push({ ts, isOutbox });
  }

  const totalMessages = sentCount + receivedCount;
  if (totalMessages === 0) return emptyStats();

  console.debug(`[ContactStats] ${identityID}: total=${totalMessages}, images=${imageCount}, videos=${videoCount}, voice=${voiceMessageCount}`);

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
