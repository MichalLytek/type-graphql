import { MetadataStorage } from "../metadata/metadata-storage";
import { getNameDecoratorParams } from "../helpers/decorators";
import { DescriptionOptions, ClassType } from "../types/decorators";

export type ObjectOptions = DescriptionOptions & {
  implements?: Function | Function[];
};

export function GraphQLObjectType(options?: ObjectOptions): ClassDecorator;
export function GraphQLObjectType(name: string, options?: ObjectOptions): ClassDecorator;
export function GraphQLObjectType(
  nameOrOptions?: string | ObjectOptions,
  maybeOptions?: ObjectOptions,
): ClassDecorator {
  const { name, options } = getNameDecoratorParams(nameOrOptions, maybeOptions);
  const interfaceClasses: ClassType[] | undefined =
    options.implements && [].concat(options.implements as any);

  return target => {
    MetadataStorage.registerObjectDefinition({
      name: name || target.name,
      target,
      description: options.description,
      interfaceClasses,
    });
  };
}
