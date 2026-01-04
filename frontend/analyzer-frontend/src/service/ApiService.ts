import { Configuration, DefaultApi } from "@/generated/api";
import { ModelsWordCount, ModelsGroupTimeline, ModelsContact } from "@/generated/api/models";

const configuration = new Configuration({
  basePath: "/api",
});

const defaultApi = new DefaultApi(configuration);

export async function loadGroupTimeline(
  groupName: string
): Promise<ModelsGroupTimeline[]> {
  console.log("Loading timeline data for group:", groupName);

  try {
    const response = await defaultApi.groupsTimelineGet({ group: groupName });
    return response;
  } catch (err) {
    console.error("Error loading timeline:", err);
    return [];
  }
}

export async function loadWordCloudData(): Promise<ModelsWordCount[]> {
  return await defaultApi.wordcloudGet();
}

export async function loadContacts(): Promise<ModelsContact[]> {
  try {
    const response = await fetch('http://localhost:8080/contacts');
    console.log("Contacts response:", response);
    return response.json();
  } catch (err) {
    console.error("Error loading contacts:", err);
    return [];
  }
}
