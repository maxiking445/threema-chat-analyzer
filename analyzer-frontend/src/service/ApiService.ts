import {
  AvatarIdGetRequest,
  AvatarIdGetTypeEnum,
  Configuration,
  DefaultApi,
  UploadApi,
} from "@/generated/api";
import {
  ModelsWordCount,
  ModelsGroupTimeline,
  ModelsContact,
  ModelsContactTimeline,
  ModelsGroup,
} from "@/generated/api/models";
import { toast } from 'vue3-toastify'

const configuration = new Configuration({
  basePath: "/api",
});

const defaultApi = new DefaultApi(configuration);
const uploadApi = new UploadApi(configuration);

export async function loadGroupTimeline(
  groupName: string
): Promise<ModelsGroupTimeline[]> {
  try {
    const response = await defaultApi.groupsTimelineGet({ group: groupName });
    return response;
  } catch (err) {
    toast.error(`Failed to load group timeline for "${groupName}"`);
    console.error(err);
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
    toast.error(`Failed to load contact timeline for user "${userId}"`);
    console.error(err);
    return [];
  }
}

export async function loadWordCloudData(): Promise<ModelsWordCount[]> {
  try {
    return await defaultApi.wordcloudGet();
  } catch (err) {
    toast.error('Failed to load word cloud data');
    console.error(err);
    return [];
  }
}

export async function loadContacts(): Promise<ModelsContact[]> {
  try {
    return await defaultApi.contactsGet();
  } catch (err) {
    toast.error('Failed to load contacts');
    console.error(err);
    return [];
  }
}

export async function loadAvatar(
  avatarType: AvatarIdGetTypeEnum,
  imageID: string
): Promise<Blob> {
  try {
    var params: AvatarIdGetRequest = { type: avatarType, id: imageID };
    return await defaultApi.avatarIdGet(params);
  } catch (err) {
    toast.error(`Failed to load avatar ${imageID}`);
    console.error(err);
    throw err; // Re-throw to maintain original behavior
  }
}

export async function loadGroups(): Promise<Array<ModelsGroup>> {
  try {
    return await defaultApi.groupsGet();
  } catch (err) {
    toast.error('Failed to load groups');
    console.error(err);
    return [];
  }
}

export async function uploadZip(
  selectedFile,
  password: string
): Promise<string> {
  try {
    return uploadApi.uploadZipPost({
      file: selectedFile,
      xZipPassword: password,
    });
  } catch (err) {
    toast.error('Failed to upload ZIP file');
    console.error(err);
    throw err; // Re-throw to maintain original behavior
  }
}
