import { MetadataStorage } from "../metadata/metadata-storage";
import { getNameDecoratorParams } from "../helpers/decorators";
import { DescriptionOptions } from "../types/decorators";

export function GraphQLObjectType(options?: DescriptionOptions): ClassDecorator;
export function GraphQLObjectType(name: string, options?: DescriptionOptions): ClassDecorator;
export function GraphQLObjectType(
  nameOrOptions?: string | DescriptionOptions,
  maybeOptions?: DescriptionOptions,
): ClassDecorator {
  const { name, options } = getNameDecoratorParams(nameOrOptions, maybeOptions);
  return target => {
    MetadataStorage.registerObjectDefinition({
      name: name || target.name,
      target,
      description: options.description,
    });
  };
}
