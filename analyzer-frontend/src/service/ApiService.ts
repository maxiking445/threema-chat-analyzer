import { toast } from "vue3-toastify";
import * as groupService from "./GroupService";
import * as AvatarService from "./AvatarService";
import * as WordCloudService from "./WordCloudService";
import * as ContactService from "./ContactService";
import * as FileService from "./FileService";
import * as GroupTimelineService from "./GroupTimelineService";
import * as ContactTimelineService from "./ContactTimelineService";
import { AvatarIdGetTypeEnum } from "../models/AvatarIdGetTypeEnum";
import { ModelsContactTimeline } from "@/models/ModelsContactTimeline";
import { ModelsContact, ModelsGroup, ModelsGroupTimeline, ModelsWordCount } from "@/models";

export async function loadGroupTimeline(
  groupName: string,
): Promise<ModelsGroupTimeline[]> {
  try {
    return await GroupTimelineService.getGroupTimeline(groupName);
  } catch (err) {
    toast.error(`Failed to load group timeline for "${groupName}"`);
    console.error(err);
    return [];
  }
}

export async function loadContactTimeline(
  userId: string,
): Promise<ModelsContactTimeline[]> {
  try {
    return await ContactTimelineService.getContactTimeline(userId);
  } catch (err) {
    toast.error(`Failed to load contact timeline for user "${userId}"`);
    console.error(err);
    return [];
  }
}

export async function loadWordCloudData(): Promise<ModelsWordCount[]> {
  try {
    return await WordCloudService.getWordCount(100);
  } catch (err) {
    toast.error("Failed to load word cloud data");
    console.error(err);
    return [];
  }
}

export async function loadContacts(): Promise<ModelsContact[]> {
  try {
    return await ContactService.loadContacts();
  } catch (err) {
    toast.error("Failed to load contacts");
    console.error(err);
    return [];
  }
}

export async function loadAvatar(
  avatarType: AvatarIdGetTypeEnum,
  imageID: string,
): Promise<Blob> {
  try {
    return await AvatarService.getAvatar(avatarType, imageID);
  } catch (err) {
    toast.error(`Failed to load avatar ${imageID}`);
    console.error(err);
    throw err;
  }
}

export async function loadGroups(): Promise<Array<ModelsGroup>> {
  try {
    var result = await groupService.loadGroupsWithMessageCounts("groups.csv");
    console.info(result);
    return result;
  } catch (err) {
    toast.error("Failed to load groups");
    console.error(err);
    return [];
  }
}

export async function uploadZip(
  selectedFile: any,
  password: string,
): Promise<void> {
  try {
    await FileService.handleZipUpload(selectedFile, password);
  } catch (err) {
    toast.error("Failed to upload ZIP file");
    console.error(err);
    throw err;
  }
}
