import type { GraphQLSchema } from "graphql";
import { execute } from "graphql";
import { gql } from "graphql-tag";

const BENCHMARK_ITERATIONS = 50;
export const ARRAY_ITEMS = 25000;

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
  for (let i = 0; i < BENCHMARK_ITERATIONS; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const result = await execute({ schema, document: multipleNestedObjectsQuery });
    console.assert(result.data !== undefined, "result data is undefined");
    console.assert(
      (result.data?.multipleNestedObjects as Array<unknown>).length === ARRAY_ITEMS,
      "result data is not a proper array",
    );
    console.assert(
      (result.data?.multipleNestedObjects as Array<any>)[0].nestedField.booleanField === true,
      "data nestedField are incorrect",
    );
  }
  console.timeEnd("multipleNestedObjects");
}
