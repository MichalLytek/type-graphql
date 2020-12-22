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
  target: Function,
  propertyName: string,
  type: T,
  typeOptions: TypeOptions,
  nullableByDefault: boolean,
): T {
  if (
    !typeOptions.array &&
    (typeOptions.nullable === "items" || typeOptions.nullable === "itemsAndList")
  ) {
    throw new WrongNullableListOptionError(target.name, propertyName, typeOptions.nullable);
  }
  if (
    typeOptions.defaultValue !== undefined &&
    (typeOptions.nullable === false || typeOptions.nullable === "items")
  ) {
    throw new ConflictingDefaultWithNullableError(
      target.name,
      propertyName,
      typeOptions.defaultValue,
      typeOptions.nullable,
    );
  }

  let gqlType: GraphQLType = type;

  if (typeOptions.array) {
    const isNullableArray =
      typeOptions.nullable === "items" ||
      typeOptions.nullable === "itemsAndList" ||
      (typeOptions.nullable === undefined && nullableByDefault === true);
    gqlType = wrapTypeInNestedList(gqlType, typeOptions.arrayDepth!, isNullableArray);
  }

  if (
    typeOptions.defaultValue === undefined &&
    (typeOptions.nullable === false ||
      (typeOptions.nullable === undefined && nullableByDefault === false) ||
      typeOptions.nullable === "items")
  ) {
    gqlType = new GraphQLNonNull(gqlType);
  }

  return gqlType as T;
}

const simpleTypes: Function[] = [String, Boolean, Number, Date, Array, Promise];
export function convertToType(Target: any, data?: object): object | undefined {
  // skip converting undefined and null
  if (data == null) {
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
  // skip converting already converted types
  if (data instanceof Target) {
    return data;
  }
  // convert array to instances
  if (Array.isArray(data)) {
    return data.map(item => convertToType(Target, item));
  }

  return typeof Target.fromModel === "function"
    ? Target.fromModel(data)
    : Object.assign(new Target(), data);
}

export function getEnumValuesMap<T extends object>(enumObject: T) {
  const enumKeys = Object.keys(enumObject).filter(key => isNaN(parseInt(key, 10)));
  const enumMap = enumKeys.reduce<any>((map, key) => {
    map[key] = enumObject[key as keyof T];
    return map;
  }, {});
  return enumMap;
}

function wrapTypeInNestedList(
  targetType: GraphQLType,
  depth: number,
  nullable: boolean,
): GraphQLList<GraphQLType> {
  const targetTypeNonNull = nullable ? targetType : new GraphQLNonNull(targetType);

  if (depth === 0) {
    return targetType as GraphQLList<GraphQLType>;
  }
  return wrapTypeInNestedList(new GraphQLList(targetTypeNonNull), depth - 1, nullable);
}
