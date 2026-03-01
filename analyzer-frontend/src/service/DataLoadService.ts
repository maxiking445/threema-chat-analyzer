import {
  loadGroups,
  loadGroupTimeline,
  loadContacts,
  loadContactTimeline,
  loadAvatar,
  loadWordCloudData,
  loadAllChats,
} from "./ApiService";
import { AvatarIdGetTypeEnum } from "../models/AvatarIdGetTypeEnum";
import { ModelsContactTimeline } from "@/models/ModelsContactTimeline";
import { t } from "vue-router/dist/index-DFCq6eJK.js";
import { ModelsWordCount } from "@/models/ModelsWordCount";
import { ModelsContact } from "@/models/ModelsContact";
import { ModelsGroup } from "@/models/ModelsGroup";
import { ModelsGroupTimeline } from "@/models/ModelsGroupTimeline";
import { ModelsChat } from "@/models/ModelsChat";

export interface LoadedData {
  groups: ModelsGroup[];
  groupTimelines: ModelsGroupTimeline[];
  contacts: ModelsContact[];
  contactTimelines: ModelsContactTimeline[][];
  avatars: Map<string, Blob>;
  wordCloud: ModelsWordCount[];
  chat: ModelsChat[];
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
    chat: [],
  };

  public async loadAllChats(): Promise<void> {
    console.info("DataCache: Loading all chats...");
    this._data.chat = await loadAllChats();
  }

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

    var contactTimelines: ModelsContactTimeline[][] = await Promise.all(
      contactIds.map(loadContactTimeline),
    );
    this._data.contactTimelines = contactTimelines;
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
    console.log(
      `DataCache: Fetching group timeline for "${groupName}" from cache...`,
    );
    console.log("Available group timelines:", this._data.groupTimelines);
    return this._data.groupTimelines.filter((t) => t.group === groupName);
  }

  async getContactTimeline(userId: string): Promise<ModelsContactTimeline[]> {
    const contactsTimelines: ModelsContactTimeline[] | undefined =
      this._data.contactTimelines.find((list: ModelsContactTimeline[]) =>
        list.some(
          (timeline: ModelsContactTimeline) =>
            timeline.identity.identity === userId,
        ),
      );
    return contactsTimelines || [];
  }

  async getWordCount(limit: number): Promise<ModelsWordCount[]> {
    return this._data.wordCloud.slice(0, limit);
  }

  async loadContacts(): Promise<ModelsContact[]> {
    return this._data.contacts;
  }

  async loadChats(userId: string): Promise<ModelsChat> {
    return this._data.chat.filter((chat) => chat.id === userId)[0];
  }

  async getAvatar(
    avatarType: AvatarIdGetTypeEnum,
    imageID: string,
  ): Promise<Blob | null> {
    const key = `${avatarType === AvatarIdGetTypeEnum.Contact ? "contact" : "group"}:${imageID}`;
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
