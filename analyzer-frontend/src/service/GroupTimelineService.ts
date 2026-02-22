import Papa from "papaparse";
import { getZipFile } from "./FileService";
import { loadIdentityByUserID } from "./IdentityService";
import { ModelsGroupTimeline } from "@/models";
import { ModelsDayCount } from "@/models/ModelsDayCount";


export async function getGroupTimeline(group: string): Promise<ModelsGroupTimeline[]> {
  if (!group) throw new Error("group missing");

  const filename = `group_message_${group}.csv`;
  return await buildGroupTimelinesFromCSV(filename, group);
}

export async function buildGroupTimelinesFromCSV(
  filename: string,
  groupName: string,
): Promise<ModelsGroupTimeline[]> {
  console.log("Analyse Group File:", filename);

  const file = getZipFile(filename);
  if (!file) return [];

  const text = await file.content.text();
  const records = Papa.parse(text, { header: false, skipEmptyLines: true })
    .data as string[][];

  if (records.length <= 1) return [];

  // Map[user][date] = count
  const userDayCounts = new Map<string, Map<string, number>>();

  for (const row of records.slice(1)) {
    if (row.length < 12 || row[10] !== "TEXT") continue;

    const createdAtMillis = parseInt(row[7], 10);
    if (isNaN(createdAtMillis)) continue;

    const user = row[2] || "You";
    const day = new Date(createdAtMillis).toISOString().split("T")[0];

    if (!userDayCounts.has(user)) {
      userDayCounts.set(user, new Map());
    }
    const dayMap = userDayCounts.get(user)!;
    dayMap.set(day, (dayMap.get(day) ?? 0) + 1);
  }

  // Map -> ModelsGroupTimeline[]
  const timelines: ModelsGroupTimeline[] = [];

  for (const [user, dayMap] of userDayCounts) {
    const timeline: ModelsDayCount[] = Array.from(dayMap.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => (a.date ?? "").localeCompare(b.date ?? ""));

    timelines.push({
      group: groupName,
      identity: await loadIdentityByUserID(user),
      timeline,
    });
  }

  return timelines;
}