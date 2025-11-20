import "reflect-metadata";
import { type GraphQLSchema, graphql } from "graphql";
import {
  Arg,
  Field,
  FieldResolver,
  type MiddlewareFn,
  type MiddlewareInterface,
  type NextFn,
  ObjectType,
  Query,
  Resolver,
  type ResolverData,
  UseMiddleware,
  buildSchema,
} from "type-graphql";
import { createMethodMiddlewareDecorator } from "@/decorators";
import { getMetadataStorage } from "@/metadata/getMetadataStorage";

describe("Middlewares", () => {
  let schema: GraphQLSchema;
  let sampleResolver: any;
  let middlewareLogs: string[] = [];
  const sleep = (time: number) =>
    new Promise(resolve => {
      setTimeout(resolve, time);
    });

  const resolverMiddleware1: MiddlewareFn = async (_, next) => {
    middlewareLogs.push("resolver middleware1 before");
    const result = await next();
    middlewareLogs.push("resolver middleware1 after");
    return result;
  };

  const resolverMiddleware2: MiddlewareFn = async (_, next) => {
    middlewareLogs.push("resolver middleware2 before");
    const result = await next();
    middlewareLogs.push("resolver middleware2 after");
    return result;
  };

  beforeEach(() => {
    middlewareLogs = [];
  });

  beforeAll(async () => {
    getMetadataStorage().clear();

    const middleware1: MiddlewareFn = async (_, next) => {
      middlewareLogs.push("middleware1 before");
      const result = await next();
      middlewareLogs.push("middleware1 after");
      return result;
    };
    const middleware2: MiddlewareFn = async (_, next) => {
      middlewareLogs.push("middleware2 before");
      const result = await next();
      middlewareLogs.push("middleware2 after");
      return result;
    };
    const middleware3: MiddlewareFn = async (_, next) => {
      middlewareLogs.push("middleware3 before");
      const result = await next();
      middlewareLogs.push("middleware3 after");
      return result;
    };
    const interceptMiddleware: MiddlewareFn = async (_, next) => {
      const result = await next();
      middlewareLogs.push(result);
      return "interceptMiddleware";
    };
    const returnUndefinedMiddleware: MiddlewareFn = async (_, next) => {
      const result = await next();
      middlewareLogs.push(result);
    };
    const errorCatchMiddleware: MiddlewareFn = async (_, next) => {
      try {
        const result = await next();
        return result;
      } catch (err) {
        middlewareLogs.push((err as Error).message);
        return "errorCatchMiddleware";
      }
    };
    const errorThrowAfterMiddleware: MiddlewareFn = async (_, next) => {
      await next();
      middlewareLogs.push("errorThrowAfterMiddleware");
      throw new Error("errorThrowAfterMiddleware");
    };
    const errorThrowMiddleware: MiddlewareFn = async _ => {
      middlewareLogs.push("errorThrowMiddleware");
      throw new Error("errorThrowMiddleware");
    };
    const fieldResolverMiddleware: MiddlewareFn = async (_, next) => {
      middlewareLogs.push("fieldResolverMiddlewareBefore");
      const result = await next();
      middlewareLogs.push("fieldResolverMiddlewareAfter");
      return result;
    };
    const doubleNextMiddleware: MiddlewareFn = async (_, next) => {
      const result1 = await next();
      await next();
      return result1;
    };

    class ClassMiddleware implements MiddlewareInterface {
      private logName = "ClassMiddleware";

      async use(_: ResolverData, next: NextFn) {
        middlewareLogs.push(`${this.logName} before`);
        const result = await next();
        middlewareLogs.push(`${this.logName} after`);
        return result;
      }
    }
    const CustomMethodDecorator = createMethodMiddlewareDecorator(async (_, next) => {
      middlewareLogs.push("CustomMethodDecorator");
      return next();
    });

    @ObjectType()
    class SampleObject {
      @Field()
      normalField!: string;

      @Field()
      resolverField!: string;

      @Field()
      @UseMiddleware(fieldResolverMiddleware)
      middlewareField!: string;
    }

    @Resolver(() => SampleObject)
    class SampleResolver {
      @Query()
      normalQuery(): boolean {
        return true;
      }

      @Query()
      sampleObjectQuery(): SampleObject {
        return {
          normalField: "normalField",
          middlewareField: "middlewareField",
        } as SampleObject;
      }

      @Query(() => String)
      @UseMiddleware(middleware1, middleware2, middleware3)
      async middlewareOrderQuery() {
        middlewareLogs.push("middlewareOrderQuery");
        await sleep(25);
        return "middlewareOrderQueryResult";
      }

      @UseMiddleware(middleware1)
      @UseMiddleware(middleware2)
      @UseMiddleware(middleware3)
      @Query(() => String)
      async multipleMiddlewareDecoratorsQuery() {
        middlewareLogs.push("multipleMiddlewareDecoratorsQuery");
        return "multipleMiddlewareDecoratorsQueryResult";
      }

      @Query()
      @UseMiddleware(interceptMiddleware)
      middlewareInterceptQuery(): string {
        middlewareLogs.push("middlewareInterceptQuery");
        return "middlewareInterceptQueryResult";
      }

      @Query()
      @UseMiddleware(
        returnUndefinedMiddleware,
        returnUndefinedMiddleware,
        returnUndefinedMiddleware,
      )
      middlewareReturnUndefinedQuery(): string {
        middlewareLogs.push("middlewareReturnUndefinedQuery");
        return "middlewareReturnUndefinedQueryResult";
      }

      @Query()
      @UseMiddleware(errorCatchMiddleware)
      middlewareErrorCatchQuery(@Arg("throwError") throwError: boolean): string {
        middlewareLogs.push("middlewareErrorCatchQuery");
        if (throwError) {
          throw new Error("middlewareErrorCatchQueryError");
        }
        return "middlewareErrorCatchQueryResult";
      }

      @Query()
      @UseMiddleware(errorThrowAfterMiddleware)
      middlewareThrowErrorAfterQuery(): string {
        middlewareLogs.push("middlewareThrowErrorAfterQuery");
        return "middlewareThrowErrorAfterQueryResult";
      }

      @Query()
      @UseMiddleware(errorThrowMiddleware)
      middlewareThrowErrorQuery(): string {
        middlewareLogs.push("middlewareThrowErrorQuery");
        return "middlewareThrowErrorQueryResult";
      }

      @Query()
      @UseMiddleware(doubleNextMiddleware)
      doubleNextMiddlewareQuery(): string {
        middlewareLogs.push("doubleNextMiddlewareQuery");
        return "doubleNextMiddlewareQueryResult";
      }

      @Query()
      @UseMiddleware(ClassMiddleware)
      classMiddlewareQuery(): string {
        middlewareLogs.push("classMiddlewareQuery");
        return "classMiddlewareQueryResult";
      }

      @Query()
      @CustomMethodDecorator
      customMethodDecoratorQuery(): string {
        middlewareLogs.push("customMethodDecoratorQuery");
        return "customMethodDecoratorQuery";
      }

      @FieldResolver()
      @UseMiddleware(fieldResolverMiddleware)
      resolverField(): string {
        middlewareLogs.push("resolverField");
        return "resolverField";
      }
    }

    sampleResolver = SampleResolver;
    schema = await buildSchema({
      resolvers: [SampleResolver],
    });
  });

  it("should build the schema without errors", async () => {
    expect(schema).toBeDefined();
  });

  it("should correctly returns value from normal query", async () => {
    const query = `query {
      normalQuery
    }`;

    const { data } = await graphql({ schema, source: query });

    expect((data as any).normalQuery).toEqual(true);
  });

  it("should correctly call middlewares in order", async () => {
    const query = `query {
      middlewareOrderQuery
    }`;

    const { data } = await graphql({ schema, source: query });

    expect((data as any).middlewareOrderQuery).toEqual("middlewareOrderQueryResult");

    expect(middlewareLogs).toHaveLength(7);
    expect(middlewareLogs[0]).toEqual("middleware1 before");
    expect(middlewareLogs[1]).toEqual("middleware2 before");
    expect(middlewareLogs[2]).toEqual("middleware3 before");
    expect(middlewareLogs[3]).toEqual("middlewareOrderQuery");
    expect(middlewareLogs[4]).toEqual("middleware3 after");
    expect(middlewareLogs[5]).toEqual("middleware2 after");
    expect(middlewareLogs[6]).toEqual("middleware1 after");
  });

  it("should correctly call resolver middlewares in order", async () => {
    UseMiddleware(resolverMiddleware1, resolverMiddleware2)(sampleResolver);
    const localSchema = await buildSchema({
      resolvers: [sampleResolver],
    });

    // clear ResolverMiddlewareMetadata for other tests
    getMetadataStorage().resolverMiddlewares = [];
    getMetadataStorage().resolverMiddlewaresByTargetCache = new Map();
    getMetadataStorage().middlewaresByTargetAndFieldCache = new Map();

    const query = `query {
      middlewareOrderQuery
    }`;

    const { data } = await graphql({ schema: localSchema, source: query });

    expect(data!.middlewareOrderQuery).toEqual("middlewareOrderQueryResult");

    expect(middlewareLogs).toHaveLength(11);
    expect(middlewareLogs[0]).toEqual("resolver middleware1 before");
    expect(middlewareLogs[1]).toEqual("resolver middleware2 before");
    expect(middlewareLogs[2]).toEqual("middleware1 before");
    expect(middlewareLogs[3]).toEqual("middleware2 before");
    expect(middlewareLogs[4]).toEqual("middleware3 before");
    expect(middlewareLogs[5]).toEqual("middlewareOrderQuery");
    expect(middlewareLogs[6]).toEqual("middleware3 after");
    expect(middlewareLogs[7]).toEqual("middleware2 after");
    expect(middlewareLogs[8]).toEqual("middleware1 after");
    expect(middlewareLogs[9]).toEqual("resolver middleware2 after");
    expect(middlewareLogs[10]).toEqual("resolver middleware1 after");
  });

  it("should call middlewares in order of multiple decorators", async () => {
    const query = `query {
      multipleMiddlewareDecoratorsQuery
    }`;

    const { data } = await graphql({ schema, source: query });

    expect((data as any).multipleMiddlewareDecoratorsQuery).toEqual(
      "multipleMiddlewareDecoratorsQueryResult",
    );

    expect(middlewareLogs).toHaveLength(7);
    expect(middlewareLogs[0]).toEqual("middleware1 before");
    expect(middlewareLogs[1]).toEqual("middleware2 before");
    expect(middlewareLogs[2]).toEqual("middleware3 before");
    expect(middlewareLogs[3]).toEqual("multipleMiddlewareDecoratorsQuery");
    expect(middlewareLogs[4]).toEqual("middleware3 after");
    expect(middlewareLogs[5]).toEqual("middleware2 after");
    expect(middlewareLogs[6]).toEqual("middleware1 after");
  });

  it("should call resolver middlewares in order of multiple decorators", async () => {
    @UseMiddleware(resolverMiddleware1)
    @UseMiddleware(resolverMiddleware2)
    @Resolver()
    class LocalResolver {
      @Query()
      normalQuery(): boolean {
        middlewareLogs.push("normalQuery");
        return true;
      }
    }
    const localSchema = await buildSchema({
      resolvers: [LocalResolver],
    });
    const query = `query {
      normalQuery
    }`;

    const { data } = await graphql({ schema: localSchema, source: query });

    expect(data!.normalQuery).toEqual(true);

    expect(middlewareLogs).toHaveLength(5);
    expect(middlewareLogs[0]).toEqual("resolver middleware1 before");
    expect(middlewareLogs[1]).toEqual("resolver middleware2 before");
    expect(middlewareLogs[2]).toEqual("normalQuery");
    expect(middlewareLogs[3]).toEqual("resolver middleware2 after");
    expect(middlewareLogs[4]).toEqual("resolver middleware1 after");
  });

  it("should correctly intercept returned value", async () => {
    const query = `query {
      middlewareInterceptQuery
    }`;

    const { data } = await graphql({ schema, source: query });

    expect((data as any).middlewareInterceptQuery).toEqual("interceptMiddleware");
    expect(middlewareLogs).toHaveLength(2);
    expect(middlewareLogs[0]).toEqual("middlewareInterceptQuery");
    expect(middlewareLogs[1]).toEqual("middlewareInterceptQueryResult");
  });

  it("should correctly use next middleware value when undefined returned", async () => {
    const query = `query {
      middlewareReturnUndefinedQuery
    }`;

    const { data } = await graphql({ schema, source: query });

    expect((data as any).middlewareReturnUndefinedQuery).toEqual(
      "middlewareReturnUndefinedQueryResult",
    );
    expect(middlewareLogs).toHaveLength(4);
    expect(middlewareLogs[0]).toEqual("middlewareReturnUndefinedQuery");
    expect(middlewareLogs[1]).toEqual("middlewareReturnUndefinedQueryResult");
    expect(middlewareLogs[2]).toEqual("middlewareReturnUndefinedQueryResult");
    expect(middlewareLogs[3]).toEqual("middlewareReturnUndefinedQueryResult");
  });

  it("should correctly catch error thrown in resolver", async () => {
    const query = `query {
      middlewareErrorCatchQuery(throwError: true)
    }`;

    const { data } = await graphql({ schema, source: query });

    expect((data as any).middlewareErrorCatchQuery).toEqual("errorCatchMiddleware");
    expect(middlewareLogs).toHaveLength(2);
    expect(middlewareLogs[0]).toEqual("middlewareErrorCatchQuery");
    expect(middlewareLogs[1]).toEqual("middlewareErrorCatchQueryError");
  });

  it("should not modify the response if error not thrown", async () => {
    const query = `query {
      middlewareErrorCatchQuery(throwError: false)
    }`;

    const { data } = await graphql({ schema, source: query });

    expect((data as any).middlewareErrorCatchQuery).toEqual("middlewareErrorCatchQueryResult");
  });

  it("should propagate thrown error up to graphql handler", async () => {
    const query = `query {
      middlewareThrowErrorAfterQuery
    }`;

    const { errors } = await graphql({ schema, source: query });

    expect(errors).toHaveLength(1);
    expect(errors![0].message).toEqual("errorThrowAfterMiddleware");
    expect(middlewareLogs).toHaveLength(2);
    expect(middlewareLogs[0]).toEqual("middlewareThrowErrorAfterQuery");
    expect(middlewareLogs[1]).toEqual("errorThrowAfterMiddleware");
  });

  it("should prevent calling handler when `next` not invoked", async () => {
    const query = `query {
      middlewareThrowErrorQuery
    }`;

    const { errors } = await graphql({ schema, source: query });

    expect(errors).toHaveLength(1);
    expect(errors![0].message).toEqual("errorThrowMiddleware");
    expect(middlewareLogs).toHaveLength(1);
    expect(middlewareLogs[0]).toEqual("errorThrowMiddleware");
  });

  it("should call middlewares for field resolver", async () => {
    const query = `query {
      sampleObjectQuery {
        resolverField
      }
    }`;

    const { data } = await graphql({ schema, source: query });

    expect((data as any).sampleObjectQuery.resolverField).toEqual("resolverField");
    expect(middlewareLogs).toHaveLength(3);
    expect(middlewareLogs[0]).toEqual("fieldResolverMiddlewareBefore");
    expect(middlewareLogs[1]).toEqual("resolverField");
    expect(middlewareLogs[2]).toEqual("fieldResolverMiddlewareAfter");
  });

  it("should correctly call class middleware", async () => {
    const query = `query {
      classMiddlewareQuery
    }`;

    const { data } = await graphql({ schema, source: query });

    expect((data as any).classMiddlewareQuery).toEqual("classMiddlewareQueryResult");
    expect(middlewareLogs).toHaveLength(3);
    expect(middlewareLogs[0]).toEqual("ClassMiddleware before");
    expect(middlewareLogs[1]).toEqual("classMiddlewareQuery");
    expect(middlewareLogs[2]).toEqual("ClassMiddleware after");
  });

  it("should correctly call resolver of custom method decorator", async () => {
    const query = `query {
      customMethodDecoratorQuery
    }`;

    const { data } = await graphql({ schema, source: query });

    expect((data as any).customMethodDecoratorQuery).toEqual("customMethodDecoratorQuery");
    expect(middlewareLogs).toHaveLength(2);
    expect(middlewareLogs[0]).toEqual("CustomMethodDecorator");
    expect(middlewareLogs[1]).toEqual("customMethodDecoratorQuery");
  });

  it("should call middlewares for normal field", async () => {
    const query = `query {
      sampleObjectQuery {
        middlewareField
      }
    }`;

    const { data } = await graphql({ schema, source: query });

    expect((data as any).sampleObjectQuery.middlewareField).toEqual("middlewareField");
    expect(middlewareLogs).toHaveLength(2);
    expect(middlewareLogs[0]).toEqual("fieldResolverMiddlewareBefore");
    expect(middlewareLogs[1]).toEqual("fieldResolverMiddlewareAfter");
  });

  it("should throw error if middleware called next more than once", async () => {
    const query = `query {
      doubleNextMiddlewareQuery
    }`;

    const { errors } = await graphql({ schema, source: query });

    expect(errors).toHaveLength(1);
    expect(errors![0].message).toEqual("next() called multiple times");
  });

  it("should correctly call middlewares in the order of global, resolver, field", async () => {
    const globalMiddleware1: MiddlewareFn = async (_, next) => {
      middlewareLogs.push("globalMiddleware1 before");
      const result = await next();
      middlewareLogs.push("globalMiddleware1 after");
      return result;
    };
    const globalMiddleware2: MiddlewareFn = async (_, next) => {
      middlewareLogs.push("globalMiddleware2 before");
      const result = await next();
      middlewareLogs.push("globalMiddleware2 after");
      return result;
    };
    const localSchema = await buildSchema({
      resolvers: [sampleResolver],
      globalMiddlewares: [globalMiddleware1, globalMiddleware2],
    });
    const query = `query {
      middlewareOrderQuery
    }`;

    const { data } = await graphql({ schema: localSchema, source: query });

    expect((data as any).middlewareOrderQuery).toEqual("middlewareOrderQueryResult");
    expect(middlewareLogs).toHaveLength(11);
    expect(middlewareLogs[0]).toEqual("globalMiddleware1 before");
    expect(middlewareLogs[1]).toEqual("globalMiddleware2 before");
    expect(middlewareLogs[2]).toEqual("middleware1 before");
    expect(middlewareLogs[3]).toEqual("middleware2 before");
    expect(middlewareLogs[4]).toEqual("middleware3 before");
    expect(middlewareLogs[5]).toEqual("middlewareOrderQuery");
    expect(middlewareLogs[6]).toEqual("middleware3 after");
    expect(middlewareLogs[7]).toEqual("middleware2 after");
    expect(middlewareLogs[8]).toEqual("middleware1 after");
    expect(middlewareLogs[9]).toEqual("globalMiddleware2 after");
    expect(middlewareLogs[10]).toEqual("globalMiddleware1 after");
  });

  it("should correctly call global middlewares before local ones", async () => {
    UseMiddleware(resolverMiddleware1, resolverMiddleware2)(sampleResolver);
    const globalMiddleware1: MiddlewareFn = async (_, next) => {
      middlewareLogs.push("globalMiddleware1 before");
      const result = await next();
      middlewareLogs.push("globalMiddleware1 after");
      return result;
    };
    const globalMiddleware2: MiddlewareFn = async (_, next) => {
      middlewareLogs.push("globalMiddleware2 before");
      const result = await next();
      middlewareLogs.push("globalMiddleware2 after");
      return result;
    };
    const localSchema = await buildSchema({
      resolvers: [sampleResolver],
      globalMiddlewares: [globalMiddleware1, globalMiddleware2],
    });

    // clear ResolverMiddlewareMetadata for other tests
    getMetadataStorage().resolverMiddlewares = [];

    const query = `query {
      middlewareOrderQuery
    }`;

    const { data } = await graphql({ schema: localSchema, source: query });

    expect(data!.middlewareOrderQuery).toEqual("middlewareOrderQueryResult");

    expect(middlewareLogs).toHaveLength(15);
    expect(middlewareLogs[0]).toEqual("globalMiddleware1 before");
    expect(middlewareLogs[1]).toEqual("globalMiddleware2 before");
    expect(middlewareLogs[2]).toEqual("resolver middleware1 before");
    expect(middlewareLogs[3]).toEqual("resolver middleware2 before");
    expect(middlewareLogs[4]).toEqual("middleware1 before");
    expect(middlewareLogs[5]).toEqual("middleware2 before");
    expect(middlewareLogs[6]).toEqual("middleware3 before");
    expect(middlewareLogs[7]).toEqual("middlewareOrderQuery");
    expect(middlewareLogs[8]).toEqual("middleware3 after");
    expect(middlewareLogs[9]).toEqual("middleware2 after");
    expect(middlewareLogs[10]).toEqual("middleware1 after");
    expect(middlewareLogs[11]).toEqual("resolver middleware2 after");
    expect(middlewareLogs[12]).toEqual("resolver middleware1 after");
    expect(middlewareLogs[13]).toEqual("globalMiddleware2 after");
    expect(middlewareLogs[14]).toEqual("globalMiddleware1 after");
  });
});
