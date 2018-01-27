import { ReturnTypeFunc, TypeOptions, ClassType } from "../types";
import { getTypeFromFunc } from "./getTypeFromFunc";
import { bannedTypes } from "./returnTypes";

export interface TypeInfo {
  type: Function;
  typeOptions: TypeOptions;
}

export interface GetTypeParams {
  metadataKey: "design:type" | "design:returntype" | "design:paramtypes";
  prototype: Object;
  propertyKey: string;
  returnTypeOrFunc?: ReturnTypeFunc | ClassType;
  typeOptions?: TypeOptions;
  parameterIndex?: number;
}
export function getType({
  metadataKey,
  prototype,
  propertyKey,
  returnTypeOrFunc,
  typeOptions = {},
  parameterIndex,
}: GetTypeParams): TypeInfo {
  const options: TypeOptions = { ...typeOptions };
  const designType = returnTypeOrFunc && getTypeFromFunc(returnTypeOrFunc);
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
    if (!designType) {
      console.error(
        `You need to provide explicit type for ${prototype.constructor.name}#${propertyKey}.`,
      );
    }
    if (metadataDesignType === Array) {
      options.array = true;
    }
  }

  if (designType) {
    return {
      type: designType,
      typeOptions: options,
    };
  } else if (metadataDesignType) {
    return {
      type: metadataDesignType,
      typeOptions: options,
    };
  } else {
    throw new Error(`Cannot determine type for ${prototype.constructor.name}#${propertyKey} !`);
  }
}
