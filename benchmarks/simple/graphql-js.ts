import { GraphQLSchema, GraphQLObjectType, GraphQLString } from "graphql";
import { runBenchmark } from "./run";

const SampleObject: GraphQLObjectType = new GraphQLObjectType({
  name: "SampleObject",
  fields: () => ({
    sampleField: {
      type: GraphQLString,
    },
    nestedField: {
      type: SampleObject,
    },
  }),
});

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "Query",
    fields: {
      singleObject: {
        type: SampleObject,
        resolve: () => ({ sampleField: "sampleField" }),
      },
      nestedObject: {
        type: SampleObject,
        resolve: () => ({
          sampleField: "sampleField",
          nestedField: {
            sampleField: "sampleField",
            nestedField: {
              sampleField: "sampleField",
              nestedField: {
                sampleField: "sampleField",
                nestedField: {
                  sampleField: "sampleField",
                },
              },
            },
          },
        }),
      },
    },
  }),
});

runBenchmark(schema).catch(console.error);
