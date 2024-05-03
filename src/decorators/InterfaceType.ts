import { getNameDecoratorParams } from "@/helpers/decorators";
import { getMetadataStorage } from "@/metadata/getMetadataStorage";
import {
  type DescriptionOptions,
  type ImplementsClassOptions,
  type ResolveTypeOptions,
} from "./types";

export type InterfaceTypeOptions = DescriptionOptions &
  ResolveTypeOptions &
  ImplementsClassOptions & {
    /**
     * Set to false to prevent emitting in schema all object types
     * that implements this interface type.
     */
    autoRegisterImplementations?: boolean;
  };

export function InterfaceType(): ClassDecorator;
export function InterfaceType(options: InterfaceTypeOptions): ClassDecorator;
export function InterfaceType(name: string, options?: InterfaceTypeOptions): ClassDecorator;
export function InterfaceType(
  nameOrOptions?: string | InterfaceTypeOptions,
  maybeOptions?: InterfaceTypeOptions,
): ClassDecorator {
  const { name, options } = getNameDecoratorParams(nameOrOptions, maybeOptions);
  const interfaceClasses = options.implements && ([] as Function[]).concat(options.implements);
  return target => {
    getMetadataStorage().collectInterfaceMetadata({
      name: name || target.name,
      target,
      interfaceClasses,
      autoRegisteringDisabled: options.autoRegisterImplementations === false,
      ...options,
    });
  };
}
