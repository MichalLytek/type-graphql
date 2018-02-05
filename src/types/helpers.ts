import {
  GraphQLScalarType,
  GraphQLString,
  GraphQLFloat,
  GraphQLType,
  GraphQLNonNull,
  GraphQLList,
  GraphQLBoolean,
} from "graphql";

import { TypeOptions } from "./decorators";
import GraphQLTimestampType from "./date.scalar";

export function convertTypeIfScalar(type: any): GraphQLScalarType | undefined {
  if (type instanceof GraphQLScalarType) {
    return type;
  }
  switch (type) {
    case String:
      return GraphQLString;
    case Boolean:
      return GraphQLBoolean;
    case Number:
      return GraphQLFloat;
      case Date:
      return GraphQLTimestampType;
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
