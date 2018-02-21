import { GraphQLScalarType, Kind } from "graphql";

export const GraphQLISODateTime = new GraphQLScalarType({
  name: "DateTime",
  description:
    "The javascript `Date` as string. Type represents date and time as the ISO Date string.",
  parseValue(value: string) {
    return new Date(value);
  },
  serialize(value: Date) {
    if (value instanceof Date) {
      return value.toISOString();
    }
    return null;
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  },
});
