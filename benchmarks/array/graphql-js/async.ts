import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLList,
} from "graphql";
import { runBenchmark, ARRAY_ITEMS } from "../run";

const SampleObjectType: GraphQLObjectType = new GraphQLObjectType({
  name: "SampleObject",
  fields: () => ({
    stringField: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: async source => {
        return source.stringField;
      },
    },
    numberField: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: async source => {
        return source.numberField;
      },
    },
    booleanField: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: async source => {
        return source.booleanField;
      },
    },
    nestedField: {
      type: SampleObjectType,
      resolve: async source => {
        return source.nestedField;
      },
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

// eslint-disable-next-line no-console
runBenchmark(schema).catch(console.error);
