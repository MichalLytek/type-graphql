import { getMetadataStorage } from "../metadata/getMetadataStorage";
import { getNameDecoratorParams } from "../helpers/decorators";
import { DescriptionOptions, AbstractClassOptions } from "./types";
import { ClassType } from "../interfaces";

export type ObjectOptions = DescriptionOptions &
  AbstractClassOptions & {
    implements?: Function | Function[];
  };

export function ObjectType(): ClassDecorator;
export function ObjectType(options: ObjectOptions): ClassDecorator;
export function ObjectType(name: string, options?: ObjectOptions): ClassDecorator;
export function ObjectType(
  nameOrOptions?: string | ObjectOptions,
  maybeOptions?: ObjectOptions,
): ClassDecorator {
  const { name, options } = getNameDecoratorParams(nameOrOptions, maybeOptions);
  const interfaceClasses: ClassType[] | undefined =
    options.implements && [].concat(options.implements as any);

  return target => {
    getMetadataStorage().collectObjectMetadata({
      name: name || target.name,
      target,
      description: options.description,
      interfaceClasses,
      isAbstract: options.isAbstract,
    });
  };
}
