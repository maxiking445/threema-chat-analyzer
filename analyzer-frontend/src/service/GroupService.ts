// services/group-service.ts
import { getZipFile, listFiles } from "./FileService"; 
import Papa from "papaparse"; 
import { loadIdentityByUserID } from "./IdentityService";
import { ModelsGroup, ModelsGroupMember } from "@/models";

interface GroupMessageRow {
  groupUID: string;
  identity: string;
  timestamp: Date;
}

export async function loadGroupsWithMessageCounts(
  groupsFilename: string,
): Promise<ModelsGroup[]> {
  const groupsFile = getZipFile(groupsFilename);
  if (!groupsFile) {
    throw new Error(`Groups file "${groupsFilename}" not found`);
  }

  const groups = await loadGroupsFromCSV(groupsFile.content);

  const messageFiles = listFiles().filter(
    (f) => f.startsWith("group_message_") && f.endsWith(".csv"),
  );

  let allMessages: GroupMessageRow[] = [];

  // 3. Alle Message Files laden
  for (const filename of messageFiles) {
    console.log("Analyse Group File:", filename);
    const fileContent = getZipFile(filename);
    if (fileContent) {
      const messages = await loadGroupMessagesFromCSV(
        fileContent.content,
        filename,
      );
      allMessages.push(...messages);
    }
  }

  // 4. Nach GroupUID + Identity zählen
  const groupByUID = countIdentitiesPerGroup(allMessages);
  console.log("GroupByUID:", groupByUID);

  for (const g of groups) {
    const m = groupByUID[g.groupUid?.toString() || ""];
    if (!m) continue;

    for (const identityId in m) {
      const groupMember: ModelsGroupMember = {
        messageCount: m[identityId],
        identity: await loadIdentityByUserID(identityId),
      };
      g.groupMember?.push(groupMember);
    }
  }

  // 6. Total MessageCount berechnen
  for (const group of groups) {
    group.messageCount =
      group.groupMember?.reduce((sum, m) => sum + (m.messageCount || 0), 0) ||
      0;
  }

  return groups;
}

function countIdentitiesPerGroup(
  rows: GroupMessageRow[],
): Record<string, Record<string, number>> {
  const result: Record<string, Record<string, number>> = {};

  for (const row of rows) {
    if (!result[row.groupUID]) {
      result[row.groupUID] = {};
    }
    result[row.groupUID][row.identity] =
      (result[row.groupUID][row.identity] || 0) + 1;
  }

  return result;
}

async function loadGroupsFromCSV(fileContent: Blob): Promise<ModelsGroup[]> {
  const text = await fileContent.text();
  const records = Papa.parse(text, { header: false, skipEmptyLines: true })
    .data as string[][];

  if (records.length <= 1) return [];

  const groups: ModelsGroup[] = [];
  for (let i = 1; i < records.length; i++) {
    // Skip header
    const r = records[i];
    if (r.length < 11) continue;

    const archived = r[6] === "true" || r[6] === "1";

    groups.push({
      id: r[0],
      creator: r[1],
      groupName: r[2],
      archived,
      groupUid: r[9],
      messageCount: 0,
      groupMember: [],
    });
  }

  return groups;
}

async function loadGroupMessagesFromCSV(
  fileContent: Blob,
  filename: string,
): Promise<GroupMessageRow[]> {
  const text = await fileContent.text();
  const records = Papa.parse(text, { header: false, skipEmptyLines: true })
    .data as string[][];

  if (records.length <= 1) return [];

  const base = filename.replace(/^group_message_/, "").replace(".csv", "");
  const rows: GroupMessageRow[] = [];

  for (let i = 1; i < records.length; i++) {
    // Skip header
    const r = records[i];
    if (r.length < 12 || r[10] !== "TEXT") continue;

    const createdAtMillis = parseInt(r[7], 10);
    if (isNaN(createdAtMillis)) continue;

    const identity = r[2] || "";

    rows.push({
      groupUID: base,
      identity,
      timestamp: new Date(createdAtMillis),
    });
  }

  return rows;
}
