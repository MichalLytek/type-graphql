import { SymbolKeysNotSupportedError } from "@/errors";
import { findType } from "@/helpers/findType";
import { getMetadataStorage } from "@/metadata/getMetadataStorage";
import { type ParameterDecorator } from "@/typings";
import { type TypeValueThunk } from "./types";

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
      /* empty */
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
