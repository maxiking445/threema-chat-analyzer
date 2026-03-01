import { ModelsIdentity } from "./ModelsIdentity";

export interface ChatMessage {
    sender: ModelsIdentity;
    text: string;
    date: string;
}

export interface ModelsChat {
    id: string;
    messages: ChatMessage[];
}
