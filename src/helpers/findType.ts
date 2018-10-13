import { ReturnTypeFunc, TypeOptions, TypeValueThunk, TypeValue } from "../decorators/types";
import { bannedTypes } from "./returnTypes";
import { NoExplicitTypeError, CannotDetermineTypeError } from "../errors";

export type MetadataKey = "design:type" | "design:returntype" | "design:paramtypes";

export interface TypeInfo {
  getType: TypeValueThunk;
  typeOptions: TypeOptions;
}

export interface GetTypeParams {
  metadataKey: MetadataKey;
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

  if (
    !returnTypeFunc &&
    (!metadataDesignType || (metadataDesignType && bannedTypes.includes(metadataDesignType)))
  ) {
    throw new NoExplicitTypeError(prototype.constructor.name, propertyKey, parameterIndex);
  }
  if (metadataDesignType === Array) {
    options.array = true;
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
