import { getMetadataStorage } from "../metadata/getMetadataStorage";
import { MethodAndPropAndClassDecorator } from "./types";

export function Metadata(data?: any): MethodAndPropAndClassDecorator;
export function Metadata(data = {}): MethodDecorator | PropertyDecorator | ClassDecorator {
  return (prototype, propertyKey, descriptor) => {
    if (typeof prototype === "function") {
      getMetadataStorage().collectAdditionalMetadata({
        target: prototype,
        data,
      });
    } else if (propertyKey !== undefined) {
      getMetadataStorage().collectAdditionalMetadata({
        target: prototype.constructor,
        name: propertyKey.toString(),
        data,
      });
    }
  };
}
