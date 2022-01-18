import { Kind, GraphQLScalarType } from "graphql";

function convertTimestampToDate(value: number) {
  try {
    return new Date(value);
  } catch (err) {
    throw new Error("Provided date numeric value is invalid and cannot be parsed");
  }
}

export const GraphQLTimestamp = new GraphQLScalarType<Date, number>({
  name: "Timestamp",
  description:
    "The javascript `Date` as integer. " +
    "Type represents date and time as number of milliseconds from start of UNIX epoch.",
  serialize(value: unknown) {
    if (!(value instanceof Date)) {
      throw new Error(`Unable to serialize value '${value}' as it's not an instance of 'Date'`);
    }
    return value.getTime();
  },
  parseValue(value: unknown) {
    if (typeof value !== "number") {
      throw new Error(
        `Unable to parse value '${value}' as GraphQLTimestamp scalar supports only number values`,
      );
    }

    return convertTimestampToDate(value);
  },
  parseLiteral(ast) {
    if (ast.kind !== Kind.INT) {
      throw new Error(
        `Unable to parse literal value of kind '${ast.kind}' as GraphQLTimestamp scalar supports only '${Kind.INT}' ones`,
      );
    }

    const num = Number.parseInt(ast.value, 10);
    return convertTimestampToDate(num);
  },
});
