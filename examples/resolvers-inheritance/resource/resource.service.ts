import { Service } from "typedi";
import type { Resource } from "./resource";

// we need to use factory as we need separate instance of service for each generic
@Service()
export class ResourceServiceFactory {
  create<TResource extends Resource>(resources?: TResource[]) {
    return new ResourceService(resources);
  }
}

export class ResourceService<TResource extends Resource> {
  constructor(protected resources: TResource[] = []) {}

  getOne(id: number): TResource | undefined {
    return this.resources.find(res => res.id === id);
  }

  getAll(skip: number, take: number): TResource[] {
    const start: number = skip;
    const end: number = skip + take;
    return this.resources.slice(start, end);
  }
}
