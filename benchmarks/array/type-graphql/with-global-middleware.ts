import "reflect-metadata";
import { buildSchema, Field, ObjectType, Resolver, Query, Int, MiddlewareFn } from "../../../build";
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const log = (...args: unknown[]) => undefined; // noop

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

// eslint-disable-next-line no-console
main().catch(console.error);
