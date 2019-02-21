import { getMetadataStorage } from "../metadata/getMetadataStorage";
import { getNameDecoratorParams } from "../helpers/decorators";
import { DescriptionOptions, AbstractClassOptions } from "./types";

export type InterfaceOptions = DescriptionOptions & AbstractClassOptions;

export function InterfaceType(): ClassDecorator;
export function InterfaceType(options: InterfaceOptions): ClassDecorator;
export function InterfaceType(name: string, options?: InterfaceOptions): ClassDecorator;
export function InterfaceType(
  nameOrOptions?: string | InterfaceOptions,
  maybeOptions?: InterfaceOptions,
): ClassDecorator {
  const { name, options } = getNameDecoratorParams(nameOrOptions, maybeOptions);
  return target => {
    getMetadataStorage().collectInterfaceMetadata({
      name: name || target.name,
      target,
      description: options.description,
      isAbstract: options.isAbstract,
    });
  };
}
