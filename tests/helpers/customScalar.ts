import { GraphQLScalarType } from "graphql";

export const CustomScalar = new GraphQLScalarType({
  name: "Custom",
  parseLiteral: () => "TypeGraphQL parseLiteral",
  parseValue: () => "TypeGraphQL parseValue",
  serialize: () => "TypeGraphQL serialize",
});
export class CustomType {}
