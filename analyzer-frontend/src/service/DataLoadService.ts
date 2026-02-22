import {
  AvatarIdGetTypeEnum,
} from "@/generated/api";
import {
  ModelsWordCount,
  ModelsGroupTimeline,
  ModelsContact,
  ModelsContactTimeline,
  ModelsGroup,
} from "@/generated/api/models";

import {
  loadGroups,
  loadGroupTimeline,
  loadContacts,
  loadContactTimeline,
  loadAvatar,
  loadWordCloudData,
} from "./ApiService"; 

export interface LoadedData {
  groups: ModelsGroup[];
  groupTimelines: ModelsGroupTimeline[];
  contacts: ModelsContact[];
  contactTimelines: ModelsContactTimeline[];
  avatars: Map<string, Blob>;
  wordCloud: ModelsWordCount[];
}

class DataCache {
  private _isLoaded = false;
  private _data: LoadedData = {
    groups: [],
    groupTimelines: [],
    contacts: [],
    contactTimelines: [],
    avatars: new Map(),
    wordCloud: [],
  };

  public async loadGroupsOnly(): Promise<void> {
    console.info("DataCache: Loading groups...");
    this._data.groups = await loadGroups();
  }

public async loadGroupTimelinesOnly(): Promise<void> {
  const groupIds = this._data.groups
    .map((g) => g.groupUid || g.id)
    .filter((id): id is string => !!id);
  
  this._data.groupTimelines = (
    await Promise.all(groupIds.map((id) => loadGroupTimeline(id)))
  ).flat();
}

  public async loadContactsOnly(): Promise<void> {
    console.info("DataCache: Loading contacts...");
    this._data.contacts = await loadContacts();
  }

  public async loadContactTimelinesOnly(): Promise<void> {
    const contactIds = this._data.contacts
      .map((c) => c.identity?.identityID)
      .filter((id): id is string => !!id);
    
    this._data.contactTimelines = (
      await Promise.all(contactIds.map(loadContactTimeline))
    ).flat();
  }

  public async loadAvatarsOnly(): Promise<void> {
    const avatars = new Map<string, Blob>();
    const contactIds = this._data.contacts
      .map((c) => c.identity?.identityID)
      .filter((id): id is string => !!id);
    const groupIds = this._data.groups
      .map((g) => g.groupUid || g.id)
      .filter((id): id is string => !!id);

    console.info("DataCache: Loading avatars...");

    // Contact-Avatars
    await Promise.all(
      contactIds.map(async (id) => {
        try {
          const blob = await loadAvatar(AvatarIdGetTypeEnum.Contact, id);
          avatars.set(`contact:${id}`, blob);
        } catch {}
      }),
    );

    // Group-Avatars
    await Promise.all(
      groupIds.map(async (id) => {
        try {
          const blob = await loadAvatar(AvatarIdGetTypeEnum.Group, id);
          avatars.set(`group:${id}`, blob);
        } catch {}
      }),
    );

    this._data.avatars = avatars;
  }

  private async loadWordCloudOnly(): Promise<void> {
    this._data.wordCloud = await loadWordCloudData();
  }

  async getGroupTimeline(groupName: string): Promise<ModelsGroupTimeline[]> {
    console.log(`DataCache: Fetching group timeline for "${groupName}" from cache...`);
    console.log("Available group timelines:", this._data.groupTimelines);
    return this._data.groupTimelines.filter((t) => t.group === groupName);
  }

  async getContactTimeline(userId: string): Promise<ModelsContactTimeline[]> {
    return this._data.contactTimelines.filter((t) => t.identity?.identity === userId);
  }

  async getWordCount(limit: number): Promise<ModelsWordCount[]> {
    return this._data.wordCloud.slice(0, limit);
  }

  async loadContacts(): Promise<ModelsContact[]> {
    return this._data.contacts;
  }

  async getAvatar(
    avatarType: AvatarIdGetTypeEnum,
    imageID: string,
  ): Promise<Blob | null> {
    const key = `${avatarType === AvatarIdGetTypeEnum.Contact ? 'contact' : 'group'}:${imageID}`;
    return this._data.avatars.get(key) || null;
  }

  async loadGroups(): Promise<ModelsGroup[]> {
    return this._data.groups;
  }

  isLoaded(): boolean {
    return this._isLoaded;
  }

  clear(): void {
    this._isLoaded = false;
    this._data = {
      groups: [],
      groupTimelines: [],
      contacts: [],
      contactTimelines: [],
      avatars: new Map(),
      wordCloud: [],
    };
  }
}

export const dataCache = new DataCache();
