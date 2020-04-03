import { getMetadataStorage } from "../metadata/getMetadataStorage";
import { getNameDecoratorParams } from "../helpers/decorators";
import { DescriptionOptions, AbstractClassOptions, ResolveTypeOptions } from "./types";

export type InterfaceTypeOptions = DescriptionOptions &
  AbstractClassOptions &
  ResolveTypeOptions & {
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
  return target => {
    getMetadataStorage().collectInterfaceMetadata({
      name: name || target.name,
      target,
      autoRegisteringDisabled: options.autoRegisterImplementations === false,
      ...options,
    });
  };
}
