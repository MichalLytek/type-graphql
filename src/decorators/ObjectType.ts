import { getNameDecoratorParams } from "@/helpers/decorators";
import { getMetadataStorage } from "@/metadata/getMetadataStorage";
import { DescriptionOptions, ImplementsClassOptions } from "./types";

export type ObjectTypeOptions = DescriptionOptions &
  ImplementsClassOptions & {
    /** Set to `true` to disable auth and all middlewares stack for all this Object Type fields resolvers */
    simpleResolvers?: boolean;
  };

export function ObjectType(): ClassDecorator;
export function ObjectType(options: ObjectTypeOptions): ClassDecorator;
export function ObjectType(name: string, options?: ObjectTypeOptions): ClassDecorator;
export function ObjectType(
  nameOrOptions?: string | ObjectTypeOptions,
  maybeOptions?: ObjectTypeOptions,
): ClassDecorator {
  const { name, options } = getNameDecoratorParams(nameOrOptions, maybeOptions);
  const interfaceClasses = options.implements && ([] as Function[]).concat(options.implements);

  return target => {
    getMetadataStorage().collectObjectMetadata({
      name: name || target.name,
      target,
      description: options.description,
      interfaceClasses,
      simpleResolvers: options.simpleResolvers,
    });
  };
}
