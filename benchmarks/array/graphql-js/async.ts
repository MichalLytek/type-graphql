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
      resolve: async source => source.stringField,
    },
    numberField: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: async source => source.numberField,
    },
    booleanField: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: async source => source.booleanField,
    },
    nestedField: {
      type: SampleObjectType,
      resolve: async source => source.nestedField,
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
