import { MetadataStorage } from "../metadata/metadata-storage";
import { getNameDecoratorParams } from "../helpers/decorators";
import { DescriptionOptions } from "../types/decorators";

export function GraphQLInputType(options?: DescriptionOptions): ClassDecorator;
export function GraphQLInputType(name: string, options?: DescriptionOptions): ClassDecorator;
export function GraphQLInputType(
  nameOrOptions?: string | DescriptionOptions,
  maybeOptions?: DescriptionOptions,
): ClassDecorator {
  const { name, options } = getNameDecoratorParams(nameOrOptions, maybeOptions);
  return target => {
    MetadataStorage.registerInputDefinition({
      name: name || target.name,
      target,
      description: options.description,
    });
  };
}
