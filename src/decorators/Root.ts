import { MetadataStorage } from "../metadata/metadata-storage";
import { findType } from "../helpers/findType";
import { TypeValueResolver } from "../types/decorators";

export function Root(): ParameterDecorator {
  return (prototype, propertyKey, parameterIndex) => {
    if (typeof propertyKey === "symbol") {
      throw new Error("Symbol keys are not supported yet!");
    }

    let getType: TypeValueResolver | undefined;
    try {
      const typeInfo = findType({
        metadataKey: "design:paramtypes",
        prototype,
        propertyKey,
        parameterIndex,
      });
      getType = typeInfo.getType;
    } catch {
      // tslint:disable-next-line:no-empty
    }

    MetadataStorage.registerHandlerParam({
      kind: "root",
      target: prototype.constructor,
      methodName: propertyKey,
      index: parameterIndex,
      getType,
    });
  };
}
