import type { ModelsDayCount } from './ModelsDayCount';
import type { ModelsIdentity } from './ModelsIdentity';

export interface ModelsGroupTimeline {
  group: string;
  identity: ModelsIdentity;
  timeline: Array<ModelsDayCount>;
}
