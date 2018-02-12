import { GraphQLScalarType, Kind } from "graphql";

export const GraphQLISODateScalar = new GraphQLScalarType({
  name: "Date",
  description:
    "The javascript `Date` as string. " +
    "Type represents date and time as the ISO Date string.",
  parseValue(value: string) {
    return new Date(value);
  },
  serialize(value: Date) {
    return new Date(value).toISOString();
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  },
});
