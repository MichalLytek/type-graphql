import { ModelOptions } from "./types";
import { getMetadataStorage } from "../metadata/getMetadataStorage";

export function Model(options?: Partial<ModelOptions>): ClassDecorator;
export function Model(options?: Partial<ModelOptions>): ClassDecorator {
  const opts = options || {};
  return target => {
    getMetadataStorage().collectModelMetadata({
      name: target.name,
      target,
      models: opts.models,
      transform: opts.transformModel,
      toType: opts.type || "ArgsType",
    });
  };
}
