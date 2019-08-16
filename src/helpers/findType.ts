import {
  ReturnTypeFunc,
  TypeOptions,
  TypeValueThunk,
  TypeValue,
  RecursiveArray,
} from "../decorators/types";
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
    options.arrayDepth = 1;
  }

  if (returnTypeFunc) {
    const getType = () => {
      const returnTypeFuncReturnValue = returnTypeFunc();
      if (Array.isArray(returnTypeFuncReturnValue)) {
        const { depth, returnType } = findTypeValueArrayDepth(returnTypeFuncReturnValue);
        options.array = true;
        options.arrayDepth = depth;
        return returnType;
      }
      return returnTypeFuncReturnValue;
    };
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

function findTypeValueArrayDepth(
  [typeValueOrArray]: RecursiveArray<TypeValue>,
  innerDepth = 1,
): { depth: number; returnType: TypeValue } {
  if (!Array.isArray(typeValueOrArray)) {
    return { depth: innerDepth, returnType: typeValueOrArray };
  }
  return findTypeValueArrayDepth(typeValueOrArray, innerDepth + 1);
}
