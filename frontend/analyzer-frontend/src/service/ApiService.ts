import { Configuration, DefaultApi } from "@/generated/api";
import {
  ModelsWordCount,
  ModelsGroupTimeline,
  ModelsContact,
  ModelsContactTimeline,
} from "@/generated/api/models";

const configuration = new Configuration({
  basePath: "/api",
});

const defaultApi = new DefaultApi(configuration);

export async function loadGroupTimeline(
  groupName: string
): Promise<ModelsGroupTimeline[]> {
  try {
    const response = await defaultApi.groupsTimelineGet({ group: groupName });
    return response;
  } catch (err) {
    return [];
  }
}

export async function loadContactTimeline(
  userId: string
): Promise<ModelsContactTimeline[]> {
  try {
    const response = await defaultApi.contactsTimelineGet({
      userId: userId,
    });
    return response;
  } catch (err) {
    return [];
  }
}

export async function loadWordCloudData(): Promise<ModelsWordCount[]> {
  return await defaultApi.wordcloudGet();
}

export async function loadContacts(): Promise<ModelsContact[]> {
  try {
    const response = await fetch("http://localhost:8080/contacts");
    return response.json();
  } catch (err) {
    return [];
  }
}
