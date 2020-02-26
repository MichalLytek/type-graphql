import { Kind, GraphQLScalarType } from "graphql";

function parseValue(value: string | null) {
  if (value === null) {
    return null;
  }
  try {
    return new Date(value);
  } catch (err) {
    return null;
  }
}

export const GraphQLTimestamp = new GraphQLScalarType({
  name: "Timestamp",
  description:
    "The javascript `Date` as integer. " +
    "Type represents date and time as number of milliseconds from start of UNIX epoch.",
  serialize(value: Date) {
    if (!(value instanceof Date)) {
      throw new Error(`Unable to serialize value '${value}' as it's not instance of 'Date'`);
    }
    return value.getTime();
  },
  parseValue,
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      const num = parseInt(ast.value, 10);
      return new Date(num);
    } else if (ast.kind === Kind.STRING) {
      return parseValue(ast.value);
    }
    return null;
  },
});
