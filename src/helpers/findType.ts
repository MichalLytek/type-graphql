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

  if (returnTypeFunc) {
    const getType = () => {
      if (Array.isArray(returnTypeFunc())) {
        options.array = true;

        const findArrayDepth = (
          array: unknown[],
          innerDepth = 1,
        ): { depth: number; returnType: TypeValue } => {
          if (Array.isArray(array[0])) {
            return findArrayDepth(array[0] as unknown[], innerDepth + 1);
          } else {
            return { depth: innerDepth, returnType: (array as [TypeValue])[0] };
          }
        };

        const { depth, returnType } = findArrayDepth(returnTypeFunc() as [TypeValue]);
        options.arrayDepth = depth;

        return returnType;
      }
      return returnTypeFunc();
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
