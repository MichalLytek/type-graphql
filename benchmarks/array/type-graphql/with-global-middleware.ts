import "reflect-metadata";
import type { MiddlewareFn } from "type-graphql";
import { Field, Int, ObjectType, Query, Resolver, buildSchema } from "type-graphql";
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

@Resolver()
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
}

const log = (..._: unknown[]) => undefined; // noop

const loggingMiddleware: MiddlewareFn = ({ info }, next) => {
  log(`${info.parentType.name}.${info.fieldName} accessed`);
  return next();
};

async function main() {
  const schema = await buildSchema({
    resolvers: [SampleResolver],
    globalMiddlewares: [loggingMiddleware],
  });

  await runBenchmark(schema);
}

main().catch(console.error);
