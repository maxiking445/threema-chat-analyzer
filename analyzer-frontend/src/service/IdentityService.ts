import Papa from "papaparse";
import { getZipFile } from "./FileService";
import { toast } from "vue3-toastify";
import { ModelsIdentity } from "@/models";

const USER_CONTACTS_FILENAME = "contacts.csv";

// Cache für Identities (Performance)
const identityCache = new Map<string, ModelsIdentity>();

export async function loadIdentityByUserID(
  userID: string,
): Promise<ModelsIdentity> {
  // Special case "You"
  if (!userID || userID === "You") {
    return {
      identity: "You",
      identityID: "You",
      firstName: "You",
    };
  }

  // Cache check
  if (identityCache.has(userID)) {
    return identityCache.get(userID)!;
  }

  // Vollständige Liste laden und suchen
  const identities = await loadIdentitiesFromCache();
  for (const ident of identities) {
    if (ident.identity === userID) {
      identityCache.set(userID, ident);
      return ident;
    }
  }

  return { identity: "", identityID: "", firstName: "" };
}

export async function loadIdentityByUserUUID(
  userID: string,
): Promise<ModelsIdentity> {
  // Special case "You"
  if (!userID || userID === "You") {
    return {
      identity: "You",
      identityID: "You",
      firstName: "You",
    };
  }

  // Cache check
  if (identityCache.has(userID)) {
    return identityCache.get(userID)!;
  }

  // Vollständige Liste laden und suchen
  const identities = await loadIdentitiesFromCache();
  for (const ident of identities) {
    if (ident.identityID === userID) {
      identityCache.set(userID, ident);
      return ident;
    }
  }

  return { identity: "", identityID: "", firstName: "" };
}

let identitiesCache: ModelsIdentity[] = [];
export async function loadIdentitiesFromCache(): Promise<ModelsIdentity[]> {
  // Cache bereits geladen?
  if (identitiesCache.length > 0) {
    return identitiesCache;
  }

  // CSV aus ZIP laden
  const file = getZipFile(USER_CONTACTS_FILENAME);
  if (!file) {
    console.warn(`Identity file "${USER_CONTACTS_FILENAME}" not found`);
    return [];
  }

  try {
    const text = await file.content.text();
    const result = Papa.parse<ModelsIdentity>(text, {
      header: false,
      skipEmptyLines: true,
      delimiter: ",",
    });

    identitiesCache = [];
    // Skip Header (erste Zeile)
    for (let i = 1; i < result.data.length; i++) {
      const row = result.data[i] as any;
      if (row.length < 11) continue;

      const identity: ModelsIdentity = {
        identity: row[0] || "",
        identityID: row[10] || "",
        firstName: row[4] || "",
        lastName: row[5] || "",
        nickName: row[6] || "",
      };

      identitiesCache.push(identity);
    }

    return identitiesCache;
  } catch (error) {
    toast.error("Fehler beim Laden der Kontakte");
    console.error("CSV Parse Error:", error);
    return [];
  }
}
