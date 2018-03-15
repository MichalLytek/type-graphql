import { ReturnTypeFunc, TypeOptions, TypeValueThunk, TypeValue } from "../types/decorators";
import { bannedTypes } from "./returnTypes";
import { NoExplicitTypeError, CannotDetermineTypeError } from "../errors";

export interface TypeInfo {
  getType: TypeValueThunk;
  typeOptions: TypeOptions;
}

export interface GetTypeParams {
  metadataKey: "design:type" | "design:returntype" | "design:paramtypes";
  prototype: Object;
  propertyKey: string;
  returnTypeFunc?: ReturnTypeFunc;
  typeOptions?: TypeOptions;
  parameterIndex?: number;
}
export function findType({
  metadataKey,
  prototype,
  propertyKey,
  returnTypeFunc,
  typeOptions = {},
  parameterIndex,
}: GetTypeParams): TypeInfo {
  const options: TypeOptions = { ...typeOptions };
  let metadataDesignType: Function | undefined;
  const reflectedType: Function[] | Function | undefined = Reflect.getMetadata(
    metadataKey,
    prototype,
    propertyKey,
  );
  if (metadataKey === "design:paramtypes") {
    metadataDesignType = (reflectedType as Function[])[parameterIndex!];
  } else {
    metadataDesignType = reflectedType as Function | undefined;
  }

  if (metadataDesignType && bannedTypes.includes(metadataDesignType)) {
    if (!returnTypeFunc) {
      throw new NoExplicitTypeError(prototype.constructor.name, propertyKey, parameterIndex);
    }
    if (metadataDesignType === Array) {
      options.array = true;
    }
  }

  if (returnTypeFunc && Array.isArray(returnTypeFunc())) {
    options.array = true;
  }

  if (returnTypeFunc) {
    const getType = Array.isArray(returnTypeFunc())
      ? () => (returnTypeFunc() as [TypeValue])[0]
      : (returnTypeFunc as TypeValueThunk);
    return {
      getType,
      typeOptions: options,
    };
  } else if (metadataDesignType) {
    return {
      getType: () => metadataDesignType!,
      typeOptions: options,
    };
  } else {
    throw new CannotDetermineTypeError(prototype.constructor.name, propertyKey, parameterIndex);
  }
}
