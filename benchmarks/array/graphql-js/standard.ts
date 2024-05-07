import {
  GraphQLBoolean,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from "graphql";
import { ARRAY_ITEMS, runBenchmark } from "../run";

const SampleObjectType: GraphQLObjectType = new GraphQLObjectType({
  name: "SampleObject",
  fields: () => ({
    stringField: {
      type: new GraphQLNonNull(GraphQLString),
    },
    numberField: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    booleanField: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
    nestedField: {
      type: SampleObjectType,
    },
  }),
});

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "Query",
    fields: {
      multipleNestedObjects: {
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(SampleObjectType))),
        resolve: () =>
          Array.from({ length: ARRAY_ITEMS }, (_, index) => ({
            stringField: "stringField",
            booleanField: true,
            numberField: index,
            nestedField: {
              stringField: "stringField",
              booleanField: true,
              numberField: index,
            },
          })),
      },
    },
  }),
});

runBenchmark(schema).catch(console.error);
