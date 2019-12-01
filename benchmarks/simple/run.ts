import { GraphQLSchema, execute } from "graphql";
import { gql } from "apollo-server";

const BENCHMARK_ITERATIONS = 100000;

export async function runBenchmark(schema: GraphQLSchema) {
  const singleObjectQuery = gql`
    query {
      singleObject {
        sampleField
      }
    }
  `;
  console.time("singleObject");
  for (let i = 0; i < BENCHMARK_ITERATIONS; i++) {
    const result = await execute({ schema, document: singleObjectQuery });
    console.assert(result.data !== undefined, "result data is undefined");
    console.assert(result.data!.singleObject !== undefined, "data singleObject is undefined");
  }
  console.timeEnd("singleObject");

  const nestedObjectQuery = gql`
    query {
      nestedObject {
        sampleField
        nestedField {
          sampleField
          nestedField {
            sampleField
            nestedField {
              sampleField
              nestedField {
                sampleField
              }
            }
          }
        }
      }
    }
  `;
  console.time("nestedObject");
  for (let i = 0; i < BENCHMARK_ITERATIONS; i++) {
    const result = await execute({ schema, document: nestedObjectQuery });
    console.assert(result.data !== undefined, "result data is undefined");
    console.assert(
      result.data!.nestedObject.nestedField.nestedField.nestedField.nestedField.sampleField !==
        undefined,
      "data nestedField are incorrect",
    );
  }
  console.timeEnd("nestedObject");
}
