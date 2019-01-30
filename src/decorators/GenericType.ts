import { GenericTypeOptions } from "./types";
import { getMetadataStorage } from "../metadata/getMetadataStorage";

export function GenericType(options?: GenericTypeOptions): ClassDecorator;
export function GenericType(options?: GenericTypeOptions): ClassDecorator {
  const opts = options || {};
  return target => {
    getMetadataStorage().collectGenericTypeMetadata({
      name: target.name,
      target,
      types: opts.types,
      transformFields: opts.transformFields,
      gqlType: opts.gqlType || "ArgsType",
    });
  };
}
