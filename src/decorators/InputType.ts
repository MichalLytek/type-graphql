import { getMetadataStorage } from "~/metadata/getMetadataStorage";
import { getNameDecoratorParams } from "~/helpers/decorators";
import { DescriptionOptions, AbstractClassOptions } from "./types";

export type InputTypeOptions = DescriptionOptions & AbstractClassOptions;

export function InputType(): ClassDecorator;
export function InputType(options: InputTypeOptions): ClassDecorator;
export function InputType(name: string, options?: InputTypeOptions): ClassDecorator;
export function InputType(
  nameOrOptions?: string | InputTypeOptions,
  maybeOptions?: InputTypeOptions,
): ClassDecorator {
  const { name, options } = getNameDecoratorParams(nameOrOptions, maybeOptions);
  return target => {
    getMetadataStorage().collectInputMetadata({
      name: name || target.name,
      target,
      description: options.description,
      isAbstract: options.isAbstract,
    });
  };
}
