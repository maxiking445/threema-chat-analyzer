export interface ModelsContactStats {
  sentCount: number;
  receivedCount: number;
  imageCount: number;
  videoCount: number;
  voiceMessageCount: number;
  firstMessageDate: Date | null;
  lastMessageDate: Date | null;
  avgMessagesPerDay: number;
  avgResponseTimeMs: number | null;
  totalDays: number;
}
