import { MetadataStorage } from "../metadata/metadata-storage";

export function Root(): ParameterDecorator {
  return (prototype, propertyKey, parameterIndex) => {
    if (typeof propertyKey === "symbol") {
      throw new Error("Symbol keys are not supported yet!");
    }

    MetadataStorage.registerHandlerParam({
      kind: "root",
      target: prototype.constructor,
      methodName: propertyKey,
      index: parameterIndex,
    });
  };
}
