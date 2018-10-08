import { getMetadataStorage } from "../metadata/getMetadataStorage";
import { MethodAndPropDecorator } from "./types";

export interface Metadata {
  [index: string]: any;
}

export function Metadata(data: Metadata): ClassDecorator | MethodAndPropDecorator | any {
  return (
    targetOrPrototype: Function | Object,
    propertyKey?: string | symbol,
    descriptor?: any,
  ): void => {
    if (typeof targetOrPrototype === "function") {
      getMetadataStorage().collectAdditionalObjectTypeMetadata({
        target: targetOrPrototype,
        data,
      });
    } else if (propertyKey !== undefined) {
      getMetadataStorage().collectAdditionalFieldMetadata({
        name: propertyKey,
        target: targetOrPrototype.constructor,
        data,
      });
    }
  };
}
