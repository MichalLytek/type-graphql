import { getMetadataStorage } from "../metadata/getMetadataStorage";
import { findType } from "../helpers/findType";
import { TypeValueThunk } from "./types";
import { SymbolKeysNotSupportedError } from "../errors";

export function Root(propertyName?: string): ParameterDecorator {
  return (prototype, propertyKey, parameterIndex) => {
    if (typeof propertyKey === "symbol") {
      throw new SymbolKeysNotSupportedError();
    }

    let getType: TypeValueThunk | undefined;
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

    getMetadataStorage().collectHandlerParamMetadata({
      kind: "root",
      target: prototype.constructor,
      methodName: propertyKey,
      index: parameterIndex,
      propertyName,
      getType,
    });
  };
}
