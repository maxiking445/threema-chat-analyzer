import type { ModelsIdentity } from './ModelsIdentity';

export interface ModelsContact {
  contactMessageCount: number;
  identity: ModelsIdentity;
  totalMessageCount: number;
  yourMessageCount: number;
}
