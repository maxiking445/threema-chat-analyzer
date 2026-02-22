import Papa from "papaparse";
import { getZipFile } from "./FileService";
import { loadIdentitiesFromCache } from "./IdentityService";
import { ModelsContact } from "@/models";

const USER_MESSAGE_PATH = "message_";

async function countTotalMessagesInCSV(identityID: string): Promise<number> {
  const file = getZipFile(`${USER_MESSAGE_PATH}${identityID}.csv`);
  if (!file) return 0;

  const text = await file.content.text();
  const { data } = Papa.parse<string[]>(text, { skipEmptyLines: true });

  return Math.max(0, data.length - 1);
}

async function countMessagesFrom(
  identityID: string,
): Promise<{ contactMessageCount: number; yourMessageCount: number }> {
  const file = getZipFile(`${USER_MESSAGE_PATH}${identityID}.csv`);
  if (!file) return { contactMessageCount: 0, yourMessageCount: 0 };

  const text = await file.content.text();
  const { data } = Papa.parse<string[]>(text, { skipEmptyLines: true });

  if (data.length <= 1) return { contactMessageCount: 0, yourMessageCount: 0 };

  let yourMessageCount = 0;
  let contactMessageCount = 0;

  for (const row of data.slice(1)) {
    if (row.length < 6) continue;

    if (row[5] === "READ") {
      yourMessageCount++;
    } else {
      contactMessageCount++;
    }
  }

  return { contactMessageCount, yourMessageCount };
}

export async function loadContacts(): Promise<ModelsContact[]> {
  const identities = await loadIdentitiesFromCache();
  const contacts: ModelsContact[] = [];

  for (const identity of identities) {
    if (!identity.identityID) continue;

    const [totalMessageCount, { contactMessageCount, yourMessageCount }] =
      await Promise.all([
        countTotalMessagesInCSV(identity.identityID),
        countMessagesFrom(identity.identityID),
      ]);

    contacts.push({
      identity,
      totalMessageCount,
      contactMessageCount,
      yourMessageCount,
    });
  }

  return contacts;
}