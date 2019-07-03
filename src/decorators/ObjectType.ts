import { getMetadataStorage } from "../metadata/getMetadataStorage";
import { getNameDecoratorParams } from "../helpers/decorators";
import { DescriptionOptions, AbstractClassOptions } from "./types";
import { ObjectClassMetadata } from "../metadata/definitions/object-class-metdata";

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
  const interfaceClasses = options.implements && ([] as Function[]).concat(options.implements);

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
