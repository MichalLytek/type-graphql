import "reflect-metadata";
import {
  Field,
  FieldResolver,
  Int,
  ObjectType,
  Query,
  Resolver,
  Root,
  buildSchema,
} from "type-graphql";
import { ARRAY_ITEMS, runBenchmark } from "../run";

@ObjectType()
class SampleObject {
  @Field()
  stringField!: string;

  @Field(() => Int)
  numberField!: number;

  @Field()
  booleanField!: boolean;

  @Field({ nullable: true })
  nestedField?: SampleObject;
}

@Resolver(SampleObject)
class SampleResolver {
  @Query(() => [SampleObject])
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

  @FieldResolver()
  stringField(@Root() source: SampleObject) {
    return source.stringField;
  }

  @FieldResolver()
  numberField(@Root() source: SampleObject) {
    return source.numberField;
  }

  @FieldResolver()
  booleanField(@Root() source: SampleObject) {
    return source.booleanField;
  }

  @FieldResolver()
  nestedField(@Root() source: SampleObject) {
    return source.nestedField;
  }
}

async function main() {
  const schema = await buildSchema({
    resolvers: [SampleResolver],
  });

  await runBenchmark(schema);
}

main().catch(console.error);
