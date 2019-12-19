import {
  ResolverClassMetadata,
  BaseResolverMetadata,
  MiddlewareMetadata,
  FieldResolverMetadata,
} from "./definitions";
import { Middleware } from "../interfaces/Middleware";
import { isThrowing } from "../helpers/isThrowing";
import { ReflectMetadataMissingError } from "../errors";

export function mapSuperResolverHandlers<T extends BaseResolverMetadata>(
  definitions: T[],
  superResolver: Function,
  resolverMetadata: ResolverClassMetadata,
): T[] {
  const superMetadata = definitions.filter(subscription => subscription.target === superResolver);

  // modify objects by reference so as not to create duplicates
  superMetadata.forEach(metadata => {
    metadata.target = resolverMetadata.target;
    metadata.resolverClassMetadata = resolverMetadata;
  });
  return superMetadata;
}

export function mapSuperFieldResolverHandlers(
  definitions: FieldResolverMetadata[],
  superResolver: Function,
  resolverMetadata: ResolverClassMetadata,
) {
  const superMetadata = mapSuperResolverHandlers(definitions, superResolver, resolverMetadata);

  superMetadata.forEach(metadata => {
    metadata.getObjectType = isThrowing(metadata.getObjectType!)
      ? resolverMetadata.getObjectType
      : metadata.getObjectType;
  });
}

export function mapMiddlewareMetadataToArray(
  metadata: MiddlewareMetadata[],
): Array<Middleware<any>> {
  return metadata
    .map(m => m.middlewares)
    .reduce<Array<Middleware<any>>>(
      (middlewares, resultArray) => resultArray.concat(middlewares),
      [],
    );
}

export function ensureReflectMetadataExists() {
  if (
    typeof Reflect !== "object" ||
    typeof Reflect.decorate !== "function" ||
    typeof Reflect.metadata !== "function"
  ) {
    throw new ReflectMetadataMissingError();
  }
}
