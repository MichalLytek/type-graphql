import { GraphQLScalarType } from "graphql";
import { GraphQLDateTime as GraphQLDateTimeScalar } from "graphql-scalars";

// workaround for `graphql-scalars` issue:
// https://github.com/Urigo/graphql-scalars/pull/1641
const GraphQLISODateTime = new GraphQLScalarType({
  ...GraphQLDateTimeScalar.toConfig(),
  serialize: value => {
    const coercedValue = GraphQLDateTimeScalar.serialize(value);
    return coercedValue ? coercedValue.toISOString() : null;
  },
});

export default GraphQLISODateTime;
