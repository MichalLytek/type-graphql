import { GraphQLSchema, execute } from "graphql";
import { gql } from "apollo-server";

const BENCHMARK_ITERATIONS = 100;
export const ARRAY_ITEMS = 5000;

export async function runBenchmark(schema: GraphQLSchema) {
  const multipleNestedObjectsQuery = gql`
    query {
      multipleNestedObjects {
        stringField
        booleanField
        numberField
        nestedField {
          stringField
          booleanField
          numberField
        }
      }
    }
  `;
  console.time("multipleNestedObjects");
  for (let i = 0; i < BENCHMARK_ITERATIONS; i++) {
    const result = await execute({ schema, document: multipleNestedObjectsQuery });
    console.assert(result.data !== undefined, "result data is undefined");
    console.assert(
      result.data!.multipleNestedObjects.length === ARRAY_ITEMS,
      "result data is not a proper array",
    );
    console.assert(
      result.data!.multipleNestedObjects[0].nestedField.booleanField === true,
      "data nestedField are incorrect",
    );
  }
  console.timeEnd("multipleNestedObjects");
}
