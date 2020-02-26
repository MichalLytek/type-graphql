import { GraphQLScalarType, Kind } from "graphql";

export const GraphQLISODateTime = new GraphQLScalarType({
  name: "DateTime",
  description:
    "The javascript `Date` as string. Type represents date and time as the ISO Date string.",
  parseValue(value: string) {
    return new Date(value);
  },
  serialize(value: Date) {
    if (!(value instanceof Date)) {
      throw new Error(`Unable to serialize value '${value}' as it's not instance of 'Date'`);
    }
    return value.toISOString();
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  },
});
