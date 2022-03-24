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
      // eslint-disable-next-line no-empty,no-empty-function,@typescript-eslint/no-empty-function
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
