import { type Resource } from "./resource";

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
