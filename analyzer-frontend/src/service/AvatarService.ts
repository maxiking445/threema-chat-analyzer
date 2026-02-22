import { getZipFile } from "./FileService";
// @ts-ignore
import placeholderImageUrl from "../assets/placeholder_avatar.jpg";
import { AvatarIdGetTypeEnum } from "../models/AvatarIdGetTypeEnum";

const ProfilePicContact = "contact_profile_pic_";
const ProfilePicGroup = "group_avatar_";
const ProfilePicAvatar = "contact_avatar_me";

export async function getAvatar(
  type: AvatarIdGetTypeEnum,
  id: string,
): Promise<Blob> {
  const readFile = async (path: string): Promise<Blob> => {
    try {
      const file = await getZipFile(path);
      if (!file || !file.content) {
        return new Blob();
      }
      return new Blob([file.content], { type: "image/jpeg" });
    } catch (error) {
      return new Blob();
    }
  };

  const getAvatarPath = (type: AvatarIdGetTypeEnum, id: string): string => {
    switch (type) {
      case AvatarIdGetTypeEnum.Contact:
        return `${ProfilePicContact}${id}`;
      case AvatarIdGetTypeEnum.Group:
        return `${ProfilePicGroup}${id}`;
      case AvatarIdGetTypeEnum.Avatar:
        return ProfilePicAvatar;
      default:
        throw new Error("Invalid avatar type");
    }
  };

  const avatarPath = getAvatarPath(type, id);
  let avatarData = await readFile(avatarPath);

  if (!avatarData || avatarData.size === 0) {
    const response = await fetch(placeholderImageUrl);
    avatarData = await response.blob();
  }

  return avatarData;
}
