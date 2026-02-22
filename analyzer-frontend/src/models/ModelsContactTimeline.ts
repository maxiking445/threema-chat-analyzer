import type { ModelsDayCount } from './ModelsDayCount';
import type { ModelsIdentity } from './ModelsIdentity';

export interface ModelsContactTimeline {
  identity: ModelsIdentity;
  timeline: Array<ModelsDayCount>;
}
