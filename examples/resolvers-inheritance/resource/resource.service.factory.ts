import { Service } from "typedi";
import { type Resource } from "./resource";
import { ResourceService } from "./resource.service";

// Use factory to separate instance of service for each generic
@Service()
export class ResourceServiceFactory {
  create<TResource extends Resource>(resources?: TResource[]) {
    return new ResourceService(resources);
  }
}
