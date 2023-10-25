import { ReflectMetadataMissingError } from "@/errors";
import { isThrowing } from "@/helpers/isThrowing";
import { type Middleware } from "@/typings/middleware";
import {
  type BaseResolverMetadata,
  type FieldResolverMetadata,
  type MiddlewareMetadata,
  type ResolverClassMetadata,
} from "./definitions";

export function mapSuperResolverHandlers<T extends BaseResolverMetadata>(
  definitions: T[],
  superResolver: Function,
  resolverMetadata: ResolverClassMetadata,
): T[] {
  return definitions.map(metadata =>
    metadata.target === superResolver
      ? {
          ...metadata,
          target: resolverMetadata.target,
          resolverClassMetadata: resolverMetadata,
        }
      : metadata,
  );
}

export function mapSuperFieldResolverHandlers(
  definitions: FieldResolverMetadata[],
  superResolver: Function,
  resolverMetadata: ResolverClassMetadata,
) {
  const superMetadata = mapSuperResolverHandlers(definitions, superResolver, resolverMetadata);

  return superMetadata.map(metadata =>
    metadata.target === superResolver
      ? {
          ...metadata,
          getObjectType: isThrowing(metadata.getObjectType!)
            ? resolverMetadata.getObjectType
            : metadata.getObjectType,
        }
      : metadata,
  );
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
