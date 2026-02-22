import Papa from "papaparse";
import { getZipFile } from "./FileService";
import { loadIdentityByUserUUID } from "./IdentityService";
import { ModelsContactTimeline } from "@/models/ModelsContactTimeline";
import { ModelsDayCount } from "@/models/ModelsDayCount";

interface ContactMessageRow {
  identity: string;
  timestamp: Date;
}

export async function getContactTimeline(userId: string): Promise<ModelsContactTimeline[]> {
  if (!userId) throw new Error("contact missing");

  const identity = await loadIdentityByUserUUID(userId);
  if (!identity.identityID) throw new Error(`Identity not found for userId: ${userId}`);

  const filename = `message_${identity.identityID}.csv`;
  return await buildContactTimelinesFromCSV(filename);
}

async function loadContactMessagesFromCSV(
  filename: string,
): Promise<ContactMessageRow[]> {
  const file = getZipFile(filename);
  if (!file) return [];

  const text = await file.content.text();
  const records = Papa.parse(text, { header: false, skipEmptyLines: true })
    .data as string[][];

  if (records.length <= 1) return [];

  const base = filename.replace(/^message_/, "").replace(/\.csv$/, "");
  const rows: ContactMessageRow[] = [];

  for (const row of records.slice(1)) {
    const createdAtMillis = parseInt(row[7], 10);
    if (isNaN(createdAtMillis)) continue;

    const identity = row[5] === "READ" ? "" : base;

    rows.push({
      identity,
      timestamp: new Date(createdAtMillis),
    });
  }

  return rows;
}

export async function buildContactTimelinesFromCSV(
  filename: string,
): Promise<ModelsContactTimeline[]> {
  const rows = await loadContactMessagesFromCSV(filename);

  // Map[user][date] = count
  const userDayCounts = new Map<string, Map<string, number>>();

  for (const msg of rows) {
    const user = msg.identity || "You";
    const day = msg.timestamp.toISOString().split("T")[0];

    if (!userDayCounts.has(user)) {
      userDayCounts.set(user, new Map());
    }
    const dayMap = userDayCounts.get(user)!;
    dayMap.set(day, (dayMap.get(day) ?? 0) + 1);
  }

  const timelines: ModelsContactTimeline[] = [];

  for (const [user, dayMap] of userDayCounts) {
    const timeline: ModelsDayCount[] = Array.from(dayMap.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => (a.date ?? "").localeCompare(b.date ?? ""));

    timelines.push({
      identity: await loadIdentityByUserUUID(user),
      timeline,
    });
  }

  return timelines;
}