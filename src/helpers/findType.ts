import {
  RecursiveArray,
  ReturnTypeFunc,
  TypeOptions,
  TypeValue,
  TypeValueThunk,
} from "@/decorators/types";
import { NoExplicitTypeError } from "@/errors";
import { bannedTypes } from "./returnTypes";

export type MetadataKey = "design:type" | "design:returntype" | "design:paramtypes";

export interface TypeInfo {
  getType: TypeValueThunk;
  typeOptions: TypeOptions;
}

export interface GetTypeParams {
  metadataKey: MetadataKey;
  prototype: Object;
  propertyKey: string;
  parameterIndex?: number;
  argName?: string;
  returnTypeFunc?: ReturnTypeFunc;
  typeOptions?: TypeOptions;
}
export function findType({
  metadataKey,
  prototype,
  propertyKey,
  parameterIndex,
  argName,
  returnTypeFunc,
  typeOptions = {},
}: GetTypeParams): TypeInfo {
  const options: TypeOptions = { ...typeOptions };
  let metadataDesignType: Function | undefined;
  const reflectedType: Function[] | Function | undefined = Reflect.getMetadata(
    metadataKey,
    prototype,
    propertyKey,
  );
  if (reflectedType) {
    if (metadataKey === "design:paramtypes") {
      metadataDesignType = (reflectedType as Function[])[parameterIndex!];
    } else {
      metadataDesignType = reflectedType as Function;
    }
  }

  if (!returnTypeFunc && (!metadataDesignType || bannedTypes.includes(metadataDesignType))) {
    throw new NoExplicitTypeError(prototype.constructor.name, propertyKey, parameterIndex, argName);
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
  }
  if (metadataDesignType) {
    return {
      getType: () => metadataDesignType!,
      typeOptions: options,
    };
  }
  throw new Error("Ops... this should never happen :)");
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
