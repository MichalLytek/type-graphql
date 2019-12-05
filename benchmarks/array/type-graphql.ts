import "reflect-metadata";
import { buildSchema, Field, ObjectType, Resolver, Query, Int } from "../../build/package";

import { runBenchmark, ARRAY_ITEMS } from "./run";

@ObjectType({ simpleResolvers: true })
class SampleObject {
  @Field()
  stringField!: string;

  @Field(type => Int)
  numberField!: number;

  @Field()
  booleanField!: boolean;

  @Field({ nullable: true })
  nestedField?: SampleObject;
}

@Resolver()
class SampleResolver {
  @Query(returns => [SampleObject])
  multipleNestedObjects(): SampleObject[] {
    return Array.from(
      { length: ARRAY_ITEMS },
      (_, index): SampleObject => ({
        stringField: "stringField",
        booleanField: true,
        numberField: index,
        nestedField: {
          stringField: "stringField",
          booleanField: true,
          numberField: index,
        },
      }),
    );
  }
}

async function main() {
  const schema = await buildSchema({
    resolvers: [SampleResolver],
  });

  await runBenchmark(schema);
}

main().catch(console.error);
