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
    return await defaultApi.contactsGet();
  } catch (err) {
    return [];
  }
}

export async function loadAvatar(
  avatarType: AvatarIdGetTypeEnum,
  imageID: string
): Promise<Blob> {
  var params: AvatarIdGetRequest = { type: avatarType, id: imageID };
  return await defaultApi.avatarIdGet(params);
}

export async function loadGroups(): Promise<Array<ModelsGroup>> {
  return await defaultApi.groupsGet();
}

export async function uploadZip(
  selectedFile,
  password: string
): Promise<string> {
  return uploadApi.uploadZipPost({
    file: selectedFile,
    xZipPassword: password,
  });
}
