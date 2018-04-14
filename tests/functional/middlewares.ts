import "reflect-metadata";
import { GraphQLSchema, graphql } from "graphql";

import { MetadataStorage } from "../../src/metadata/metadata-storage";
import {
  Field,
  ObjectType,
  Ctx,
  Authorized,
  Query,
  Resolver,
  buildSchema,
  FieldResolver,
  UnauthorizedError,
  ForbiddenError,
  Middleware,
  UseMiddleware,
  Arg,
} from "../../src";

describe("Middlewares", () => {
  let schema: GraphQLSchema;
  let sampleResolver: any;
  let middlewareLogs: string[] = [];

  beforeEach(() => {
    middlewareLogs = [];
  });

  beforeAll(async () => {
    MetadataStorage.clear();

    const middleware1: Middleware = async ({}, next) => {
      middlewareLogs.push("middleware1 before");
      const result = await next();
      middlewareLogs.push("middleware1 after");
      return result;
    };
    const middleware2: Middleware = async ({}, next) => {
      middlewareLogs.push("middleware2 before");
      const result = await next();
      middlewareLogs.push("middleware2 after");
      return result;
    };
    const middleware3: Middleware = async ({}, next) => {
      middlewareLogs.push("middleware3 before");
      const result = await next();
      middlewareLogs.push("middleware3 after");
      return result;
    };
    const interceptMiddleware: Middleware = async ({}, next) => {
      const result = await next();
      middlewareLogs.push(result);
      return "interceptMiddleware";
    };
    const errorCatchMiddleware: Middleware = async ({}, next) => {
      try {
        return await next();
      } catch (err) {
        middlewareLogs.push(err.message);
        return "errorCatchMiddleware";
      }
    };
    const errorThrowAfterMiddleware: Middleware = async ({}, next) => {
      await next();
      middlewareLogs.push("errorThrowAfterMiddleware");
      throw new Error("errorThrowAfterMiddleware");
    };
    const errorThrowMiddleware: Middleware = async ({}, next) => {
      middlewareLogs.push("errorThrowMiddleware");
      throw new Error("errorThrowMiddleware");
    };
    const fieldResolverMiddleware: Middleware = async ({}, next) => {
      middlewareLogs.push("fieldResolverMiddlewareBefore");
      const result = await next();
      middlewareLogs.push("fieldResolverMiddlewareAfter");
      return result;
    };
    const doubleNextMiddleware: Middleware = async function doubleNextMiddlewareFn({}, next) {
      const result1 = await next();
      const result2 = await next();
      return result1;
    };

    @ObjectType()
    class SampleObject {
      @Field() normalField: string;

      @Field() resolverField: string;

      @Field()
      @UseMiddleware(fieldResolverMiddleware)
      middlewareField: string;
    }

    @Resolver(objectType => SampleObject)
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

      @Query()
      @UseMiddleware(middleware1, middleware2, middleware3)
      middlewareOrderQuery(): string {
        middlewareLogs.push("middlewareOrderQuery");
        return "middlewareOrderQueryResult";
      }

      @Query()
      @UseMiddleware(interceptMiddleware)
      middlewareInterceptQuery(): string {
        middlewareLogs.push("middlewareInterceptQuery");
        return "middlewareInterceptQueryResult";
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

    const { data } = await graphql(schema, query);

    expect(data!.normalQuery).toEqual(true);
  });

  it("should correctly call middlewares in order", async () => {
    const query = `query {
      middlewareOrderQuery
    }`;

    const { data } = await graphql(schema, query);

    expect(data!.middlewareOrderQuery).toEqual("middlewareOrderQueryResult");

    expect(middlewareLogs).toHaveLength(7);
    expect(middlewareLogs[0]).toEqual("middleware1 before");
    expect(middlewareLogs[1]).toEqual("middleware2 before");
    expect(middlewareLogs[2]).toEqual("middleware3 before");
    expect(middlewareLogs[3]).toEqual("middlewareOrderQuery");
    expect(middlewareLogs[4]).toEqual("middleware3 after");
    expect(middlewareLogs[5]).toEqual("middleware2 after");
    expect(middlewareLogs[6]).toEqual("middleware1 after");
  });

  it("should correctly intercept returned value", async () => {
    const query = `query {
      middlewareInterceptQuery
    }`;

    const { data } = await graphql(schema, query);

    expect(data!.middlewareInterceptQuery).toEqual("interceptMiddleware");
    expect(middlewareLogs).toHaveLength(2);
    expect(middlewareLogs[0]).toEqual("middlewareInterceptQuery");
    expect(middlewareLogs[1]).toEqual("middlewareInterceptQueryResult");
  });

  it("should correctly catch error thrown in resolver", async () => {
    const query = `query {
      middlewareErrorCatchQuery(throwError: true)
    }`;

    const { data } = await graphql(schema, query);

    expect(data!.middlewareErrorCatchQuery).toEqual("errorCatchMiddleware");
    expect(middlewareLogs).toHaveLength(2);
    expect(middlewareLogs[0]).toEqual("middlewareErrorCatchQuery");
    expect(middlewareLogs[1]).toEqual("middlewareErrorCatchQueryError");
  });

  it("should not modify the response if error not thrown", async () => {
    const query = `query {
      middlewareErrorCatchQuery(throwError: false)
    }`;

    const { data } = await graphql(schema, query);

    expect(data!.middlewareErrorCatchQuery).toEqual("middlewareErrorCatchQueryResult");
  });

  it("should propagate thrown error up to graphql handler", async () => {
    const query = `query {
      middlewareThrowErrorAfterQuery
    }`;

    const { errors } = await graphql(schema, query);

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

    const { errors } = await graphql(schema, query);

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

    const { data } = await graphql(schema, query);

    expect(data!.sampleObjectQuery.resolverField).toEqual("resolverField");
    expect(middlewareLogs).toHaveLength(3);
    expect(middlewareLogs[0]).toEqual("fieldResolverMiddlewareBefore");
    expect(middlewareLogs[1]).toEqual("resolverField");
    expect(middlewareLogs[2]).toEqual("fieldResolverMiddlewareAfter");
  });

  it("should call middlewares for normal field", async () => {
    const query = `query {
      sampleObjectQuery {
        middlewareField
      }
    }`;

    const { data } = await graphql(schema, query);

    expect(data!.sampleObjectQuery.middlewareField).toEqual("middlewareField");
    expect(middlewareLogs).toHaveLength(2);
    expect(middlewareLogs[0]).toEqual("fieldResolverMiddlewareBefore");
    expect(middlewareLogs[1]).toEqual("fieldResolverMiddlewareAfter");
  });

  it("should throw error if middleware called next more than once", async () => {
    const query = `query {
      doubleNextMiddlewareQuery
    }`;

    const { errors } = await graphql(schema, query);

    expect(errors).toHaveLength(1);
    expect(errors![0].message).toEqual("next() called multiple times");
  });
});
