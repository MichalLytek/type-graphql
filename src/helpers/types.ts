import {
  GraphQLScalarType,
  GraphQLString,
  GraphQLFloat,
  GraphQLType,
  GraphQLNonNull,
  GraphQLList,
  GraphQLBoolean,
} from "graphql";

import { TypeOptions } from "../decorators/types";
import { GraphQLTimestamp } from "../scalars/timestamp";
import { GraphQLISODateTime } from "../scalars/isodate";
import { BuildContext } from "../schema/build-context";
import { WrongNullableListOptionError, ConflictingDefaultWithNullableError } from "../errors";

export function convertTypeIfScalar(type: any): GraphQLScalarType | undefined {
  if (type instanceof GraphQLScalarType) {
    return type;
  }
  const scalarMap = BuildContext.scalarsMaps.find(it => it.type === type);
  if (scalarMap) {
    return scalarMap.scalar;
  }

  switch (type) {
    case String:
      return GraphQLString;
    case Boolean:
      return GraphQLBoolean;
    case Number:
      return GraphQLFloat;
    case Date:
      return BuildContext.dateScalarMode === "isoDate" ? GraphQLISODateTime : GraphQLTimestamp;
    default:
      return undefined;
  }
}

export function wrapWithTypeOptions<T extends GraphQLType>(
  typeOwnerName: string,
  type: T,
  typeOptions: TypeOptions = {},
): T {
  if (
    !typeOptions.array &&
    (typeOptions.nullable === "items" || typeOptions.nullable === "itemsAndList")
  ) {
    throw new WrongNullableListOptionError(typeOwnerName, typeOptions.nullable);
  }
  if (
    typeOptions.defaultValue !== undefined &&
    (typeOptions.nullable === false || typeOptions.nullable === "items")
  ) {
    throw new ConflictingDefaultWithNullableError(
      typeOwnerName,
      typeOptions.defaultValue,
      typeOptions.nullable,
    );
  }

  let gqlType: GraphQLType = type;
  if (typeOptions.array) {
    if (typeOptions.nullable === "items" || typeOptions.nullable === "itemsAndList") {
      gqlType = new GraphQLList(gqlType);
    } else {
      gqlType = new GraphQLList(new GraphQLNonNull(gqlType));
    }
  }
  if (
    typeOptions.defaultValue === undefined &&
    (!typeOptions.nullable || typeOptions.nullable === "items")
  ) {
    gqlType = new GraphQLNonNull(gqlType);
  }
  return gqlType as T;
}

const simpleTypes: Function[] = [String, Boolean, Number, Date, Array, Promise];
export function convertToType(Target: any, data?: object): object | undefined {
  // skip converting undefined and null
  if (data == null) {
    return;
  }
  // Prevent unecessary conversion
  if (data instanceof Target) {
    return data;
  }
  // skip converting scalars (object scalar mostly)
  if (Target instanceof GraphQLScalarType) {
    return data;
  }
  // skip converting simple types
  if (simpleTypes.includes(data.constructor)) {
    return data;
  }

  return Object.assign(new Target(), data);
}

export function getEnumValuesMap<T extends object>(enumObject: T) {
  const enumKeys = Object.keys(enumObject).filter(key => isNaN(parseInt(key, 10)));
  const enumMap = enumKeys.reduce<any>((map, key) => {
    map[key] = enumObject[key as keyof T];
    return map;
  }, {});
  return enumMap;
}
