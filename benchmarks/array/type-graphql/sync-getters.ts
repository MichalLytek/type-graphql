import "reflect-metadata";
import { buildSchema, Field, ObjectType, Resolver, Query, Int } from "../../../build/package/dist";

import { runBenchmark, ARRAY_ITEMS } from "../run";

@ObjectType()
class SampleObject {
  stringField!: string;
  @Field({ name: "stringField" })
  get getStringField(): string {
    return this.stringField;
  }

  numberField!: number;
  @Field(type => Int, { name: "numberField" })
  get getNumberField(): number {
    return this.numberField;
  }

  booleanField!: boolean;
  @Field({ name: "booleanField" })
  get getBooleanField(): boolean {
    return this.booleanField;
  }

  nestedField?: SampleObject;
  @Field(type => SampleObject, { name: "nestedField", nullable: true })
  get getNestedField(): SampleObject | undefined {
    return this.nestedField;
  }
}

@Resolver(SampleObject)
class SampleResolver {
  @Query(returns => [SampleObject])
  multipleNestedObjects(): SampleObject[] {
    return Array.from(
      { length: ARRAY_ITEMS },
      (_, index): SampleObject =>
        ({
          stringField: "stringField",
          booleanField: true,
          numberField: index,
          nestedField: {
            stringField: "stringField",
            booleanField: true,
            numberField: index,
          } as SampleObject,
        } as SampleObject),
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
