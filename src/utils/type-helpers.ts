import {
  GraphQLScalarType,
  GraphQLString,
  GraphQLFloat,
  GraphQLInt,
  GraphQLID,
  GraphQLType,
  GraphQLNonNull,
  GraphQLList,
  GraphQLBoolean,
} from "graphql";

import { Float, Int, ID } from "../scalars";
import { TypeOptions } from "../types";

export function convertTypeIfScalar(type: any): GraphQLScalarType | undefined {
  switch (type) {
    case String:
      return GraphQLString;
    case Boolean:
      return GraphQLBoolean;
    case Number:
    case Float:
      return GraphQLFloat;
    case Int:
      return GraphQLInt;
    case ID:
      return GraphQLID;
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
