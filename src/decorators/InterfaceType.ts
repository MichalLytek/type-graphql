import { getMetadataStorage } from "../metadata/getMetadataStorage";
import { getNameDecoratorParams } from "../helpers/decorators";
import { DescriptionOptions, AbstractClassOptions, ResolveTypeOptions } from "./types";

export type InterfaceTypeOptions = DescriptionOptions & AbstractClassOptions & ResolveTypeOptions;

export function InterfaceType(): ClassDecorator;
export function InterfaceType(options: InterfaceTypeOptions): ClassDecorator;
export function InterfaceType(name: string, options?: InterfaceTypeOptions): ClassDecorator;
export function InterfaceType(
  nameOrOptions?: string | InterfaceTypeOptions,
  maybeOptions?: InterfaceTypeOptions,
): ClassDecorator {
  const { name, options } = getNameDecoratorParams(nameOrOptions, maybeOptions);
  return target => {
    getMetadataStorage().collectInterfaceMetadata({
      name: name || target.name,
      target,
      ...options,
    });
  };
}
