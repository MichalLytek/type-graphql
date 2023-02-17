import "reflect-metadata";
import {
  buildSchema,
  Field,
  ObjectType,
  Resolver,
  Query,
  Int,
  FieldResolver,
  Root,
} from "type-graphql";
import { runBenchmark, ARRAY_ITEMS } from "../run";

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
  async stringField(@Root() source: SampleObject) {
    return source.stringField;
  }

  @FieldResolver()
  async numberField(@Root() source: SampleObject) {
    return source.numberField;
  }

  @FieldResolver()
  async booleanField(@Root() source: SampleObject) {
    return source.booleanField;
  }

  @FieldResolver()
  async nestedField(@Root() source: SampleObject) {
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
