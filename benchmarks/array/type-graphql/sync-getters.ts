import "reflect-metadata";
import { Field, Int, ObjectType, Query, Resolver, buildSchema } from "type-graphql";
import { ARRAY_ITEMS, runBenchmark } from "../run";

@ObjectType()
class SampleObject {
  stringField!: string;

  @Field({ name: "stringField" })
  get getStringField(): string {
    return this.stringField;
  }

  numberField!: number;

  @Field(() => Int, { name: "numberField" })
  get getNumberField(): number {
    return this.numberField;
  }

  booleanField!: boolean;

  @Field({ name: "booleanField" })
  get getBooleanField(): boolean {
    return this.booleanField;
  }

  nestedField?: SampleObject;

  @Field(() => SampleObject, { name: "nestedField", nullable: true })
  get getNestedField(): SampleObject | undefined {
    return this.nestedField;
  }
}

@Resolver(SampleObject)
class SampleResolver {
  @Query(() => [SampleObject])
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
        }) as SampleObject,
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
