import {
  GraphQLScalarType,
  GraphQLString,
  GraphQLFloat,
  GraphQLType,
  GraphQLNonNull,
  GraphQLList,
  GraphQLBoolean,
} from "graphql";

import { TypeOptions } from "../types/decorators";
import { SchemaGenerator } from "../schema/schema-generator";
import { GraphQLTimestampScalar } from "../scalars/timestamp";
import { GraphQLISODateScalar } from "../scalars/isodate";

export function convertTypeIfScalar(type: any): GraphQLScalarType | undefined {
  if (type instanceof GraphQLScalarType) {
    return type;
  }
  const scalarType = SchemaGenerator.scalarsMap.find(it => it.type === type);
  if (scalarType) {
    return scalarType.scalar;
  }

  switch (type) {
    case String:
      return GraphQLString;
    case Boolean:
      return GraphQLBoolean;
    case Number:
      return GraphQLFloat;
    case Date:
      return SchemaGenerator.dateScalarMode === "isoDate"
        ? GraphQLISODateScalar
        : GraphQLTimestampScalar;
    default:
      return undefined;
  }
}

export function wrapWithTypeOptions<T extends GraphQLType>(
  type: T,
  typeOptions: TypeOptions = {},
): T {
  let gqlType: GraphQLType = type;
  if (!typeOptions.nullable) {
    gqlType = new GraphQLNonNull(gqlType);
  }
  if (typeOptions.array) {
    gqlType = new GraphQLNonNull(new GraphQLList(gqlType));
  }
  return gqlType as T;
}
