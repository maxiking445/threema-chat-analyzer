export const AvatarIdGetTypeEnum = {
    Contact: 'CONTACT',
    Group: 'GROUP',
    Avatar: 'AVATAR'
} as const;
export type AvatarIdGetTypeEnum = typeof AvatarIdGetTypeEnum[keyof typeof AvatarIdGetTypeEnum];
