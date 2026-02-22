import type { ModelsGroupMember } from './ModelsGroupMember';

export interface ModelsGroup {
  archived: boolean;
  creator: string;
  groupMember: Array<ModelsGroupMember>;
  groupName: string;
  groupUid: string;
  id: string;
  messageCount: number;
}