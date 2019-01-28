import { getMetadataStorage } from "../metadata/getMetadataStorage";

export function Model(): ClassDecorator;
export function Model(models: any[]): ClassDecorator;
export function Model(models: any[], name: Function): ClassDecorator;
export function Model(models?: any[], name?: Function): ClassDecorator {
  return target => {
    getMetadataStorage().collectModelMetadata({
      name: () => `${target.name}Args`,
      models: models || [],
      target,
    });
  };
}
