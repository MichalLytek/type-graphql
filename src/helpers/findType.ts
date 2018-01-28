import { ReturnTypeFunc, TypeOptions, ClassType, TypeValueResolver } from "../types";
import { bannedTypes } from "./returnTypes";

export interface TypeInfo {
  getType: TypeValueResolver;
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
    prototype.constructor.prototype,
    propertyKey,
  );
  if (metadataKey === "design:paramtypes") {
    metadataDesignType = (reflectedType as Function[])[parameterIndex!];
  } else {
    metadataDesignType = reflectedType as Function | undefined;
  }

  if (metadataDesignType && bannedTypes.includes(metadataDesignType)) {
    if (!returnTypeFunc) {
      throw new Error(
        `You need to provide explicit type for ${prototype.constructor.name}#${propertyKey}.`,
      );
    }
    if (metadataDesignType === Array) {
      options.array = true;
    }
  }

  if (returnTypeFunc) {
    return {
      getType: returnTypeFunc as TypeValueResolver,
      typeOptions: options,
    };
  } else if (metadataDesignType) {
    return {
      getType: () => metadataDesignType!,
      typeOptions: options,
    };
  } else {
    throw new Error(`Cannot determine type for ${prototype.constructor.name}#${propertyKey} !`);
  }
}
