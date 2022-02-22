import "reflect-metadata";
import { GraphQLSchema, graphql } from "graphql";

import { getMetadataStorage } from "../../src/metadata/getMetadataStorage";
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
  AuthCheckerInterface,
  ResolverData,
} from "../../src";

describe("Authorization", () => {
  let schema: GraphQLSchema;
  let sampleResolver: any;

  beforeAll(async () => {
    getMetadataStorage().clear();

    @ObjectType()
    class SampleObject {
      @Field()
      normalField: string;

      @Field()
      @Authorized()
      authedField: string;

      @Field({ nullable: true })
      @Authorized()
      nullableAuthedField: string;

      @Field()
      @Authorized("ADMIN")
      adminField: string;

      @Field()
      normalResolvedField: string;

      @Field()
      authedResolvedField: string;

      @Field()
      @Authorized()
      inlineAuthedResolvedField: string;
    }

    @Resolver(of => SampleObject)
    class SampleResolver {
      @Query()
      normalQuery(): boolean {
        return true;
      }

      @Query()
      normalObjectQuery(): SampleObject {
        return {
          normalField: "normalField",
          authedField: "authedField",
          adminField: "adminField",
        } as SampleObject;
      }

      @Query()
      @Authorized()
      authedQuery(@Ctx() ctx: any): boolean {
        return ctx.user !== undefined;
      }

      @Query(type => Boolean, { nullable: true })
      @Authorized()
      nullableAuthedQuery(@Ctx() ctx: any) {
        return true;
      }

      @Query()
      @Authorized("ADMIN")
      adminQuery(@Ctx() ctx: any): boolean {
        return ctx.user !== undefined;
      }

      @Query()
      @Authorized(["ADMIN", "REGULAR"])
      adminOrRegularQuery(@Ctx() ctx: any): boolean {
        return ctx.user !== undefined;
      }

      @Query()
      @Authorized("ADMIN", "REGULAR")
      adminOrRegularRestQuery(@Ctx() ctx: any): boolean {
        return ctx.user !== undefined;
      }

      @FieldResolver()
      normalResolvedField() {
        return "normalResolvedField";
      }

      @FieldResolver()
      @Authorized()
      authedResolvedField() {
        return "authedResolvedField";
      }

      @FieldResolver()
      inlineAuthedResolvedField() {
        return "inlineAuthedResolvedField";
      }
    }

    sampleResolver = SampleResolver;
    schema = await buildSchema({
      resolvers: [SampleResolver],
      // dummy auth checker
      authChecker: () => false,
    });
  });

  describe("Reflection", () => {
    // helpers
    function findQuery(queryName: string) {
      return getMetadataStorage().queries.find(it => it.methodName === queryName)!;
    }

    it("should build schema without errors", async () => {
      expect(schema).toBeDefined();
    });

    it("should register correct roles for resolvers", async () => {
      const normalQuery = findQuery("normalQuery");
      const authedQuery = findQuery("authedQuery");
      const adminQuery = findQuery("adminQuery");

      expect(normalQuery.roles).toBeUndefined();
      expect(authedQuery.roles).toHaveLength(0);
      expect(adminQuery.roles).toHaveLength(1);
    });

    it("should register correct roles for object type fields", async () => {
      const sampleObject = getMetadataStorage().objectTypes.find(
        type => type.name === "SampleObject",
      )!;
      const normalField = sampleObject.fields!.find(field => field.name === "normalField")!;
      const authedField = sampleObject.fields!.find(field => field.name === "authedField")!;
      const adminField = sampleObject.fields!.find(field => field.name === "adminField")!;

      expect(normalField.roles).toBeUndefined();
      expect(authedField.roles).toHaveLength(0);
      expect(adminField.roles).toEqual(["ADMIN"]);
    });

    it("should register correct roles for every decorator overload", async () => {
      const normalQuery = findQuery("normalQuery");
      const authedQuery = findQuery("authedQuery");
      const adminQuery = findQuery("adminQuery");
      const adminOrRegularQuery = findQuery("adminOrRegularQuery");
      const adminOrRegularRestQuery = findQuery("adminOrRegularRestQuery");

      expect(normalQuery.roles).toBeUndefined();
      expect(authedQuery.roles).toHaveLength(0);
      expect(adminQuery.roles).toEqual(["ADMIN"]);
      expect(adminOrRegularQuery.roles).toEqual(["ADMIN", "REGULAR"]);
      expect(adminOrRegularRestQuery.roles).toEqual(["ADMIN", "REGULAR"]);
    });
  });

  describe("Errors", () => {
    it("should throw error when `@Authorized` is used and no `authChecker` provided", async () => {
      expect.assertions(2);
      try {
        await buildSchema({
          resolvers: [sampleResolver],
        });
      } catch (err) {
        expect(err).toBeDefined();
        expect(err.message).toContain("authChecker");
      }
    });

    // TODO: check for wrong `@Authorized` usage
    it.todo("should throw error when `@Authorized` is used on args, input or interface class");
  });

  describe("Functional", () => {
    it("should allow to register auth checker", async () => {
      const localSchema = await buildSchema({
        resolvers: [sampleResolver],
        authChecker: () => true,
      });

      expect(localSchema).toBeDefined();
    });

    it("should allow to read not guarded query", async () => {
      const query = `query {
        normalQuery
      }`;

      const result: any = await graphql({ schema, source: query });

      expect(result.data!.normalQuery).toEqual(true);
    });

    it("should allow to read not guarded object field", async () => {
      const query = `query {
        normalObjectQuery {
          normalField
        }
      }`;

      const result: any = await graphql({ schema, source: query });

      expect(result.data!.normalObjectQuery.normalField).toEqual("normalField");
    });

    it("should allow to read not guarded object field from resolver", async () => {
      const query = `query {
        normalObjectQuery {
          normalResolvedField
        }
      }`;

      const result: any = await graphql({ schema, source: query });

      expect(result.data!.normalObjectQuery.normalResolvedField).toEqual("normalResolvedField");
    });

    it("should restrict access to authed query", async () => {
      const localSchema = await buildSchema({
        resolvers: [sampleResolver],
        authChecker: () => false,
      });
      const query = `query {
        authedQuery
      }`;

      const result: any = await graphql({ schema: localSchema, source: query });

      expect(result.data).toBeNull();
      expect(result.errors).toBeDefined();
    });

    it("should return null when accessing nullable authed query in null mode", async () => {
      const localSchema = await buildSchema({
        resolvers: [sampleResolver],
        authChecker: () => false,
        authMode: "null",
      });
      const query = `query {
        nullableAuthedQuery
      }`;

      const result: any = await graphql({ schema: localSchema, source: query });

      expect(result.data!.nullableAuthedQuery).toBeNull();
      expect(result.errors).toBeUndefined();
    });

    it("should throw UnauthorizedError when guest accessing authed query", async () => {
      const localSchema = await buildSchema({
        resolvers: [sampleResolver],
        authChecker: () => false,
      });
      const query = `query {
        authedQuery
      }`;

      const result: any = await graphql({ schema: localSchema, source: query });

      expect(result.data).toBeNull();
      expect(result.errors).toHaveLength(1);
      const error = result.errors![0];
      expect(error.originalError).toBeInstanceOf(UnauthorizedError);
      expect(error.path).toContain("authedQuery");
    });

    it("should throw ForbiddenError when guest accessing query authed with roles", async () => {
      const localSchema = await buildSchema({
        resolvers: [sampleResolver],
        authChecker: () => false,
      });
      const query = `query {
        adminQuery
      }`;

      const result: any = await graphql({ schema: localSchema, source: query });

      expect(result.data).toBeNull();
      expect(result.errors).toHaveLength(1);
      const error = result.errors![0];
      expect(error.originalError).toBeInstanceOf(ForbiddenError);
      expect(error.path).toContain("adminQuery");
    });

    it("should allow for access to authed query when `authChecker` returns true", async () => {
      const localSchema = await buildSchema({
        resolvers: [sampleResolver],
        authChecker: () => true,
      });
      const query = `query {
        authedQuery
      }`;

      const result: any = await graphql({ schema: localSchema, source: query, contextValue: {} });

      expect(result.data!.authedQuery).toEqual(false);
    });

    it("should restrict access to authed object field", async () => {
      const localSchema = await buildSchema({
        resolvers: [sampleResolver],
        authChecker: () => false,
      });
      const query = `query {
        normalObjectQuery {
          authedField
        }
      }`;

      const result: any = await graphql({ schema: localSchema, source: query });

      expect(result.data).toBeNull();
    });

    it("should return null while accessing nullable authed object field", async () => {
      const localSchema = await buildSchema({
        resolvers: [sampleResolver],
        authChecker: () => false,
      });
      const query = `query {
        normalObjectQuery {
          nullableAuthedField
        }
      }`;

      const result: any = await graphql({ schema: localSchema, source: query });

      expect(result.data!.normalObjectQuery.nullableAuthedField).toBeNull();
    });

    it("should throw UnauthorizedError when guest accessing autherd object field", async () => {
      const localSchema = await buildSchema({
        resolvers: [sampleResolver],
        authChecker: () => false,
      });
      const query = `query {
        normalObjectQuery {
          authedField
        }
      }`;

      const result: any = await graphql({ schema: localSchema, source: query });

      expect(result.data).toBeNull();
      expect(result.errors).toHaveLength(1);
      const error = result.errors![0];
      expect(error.originalError).toBeInstanceOf(UnauthorizedError);
      expect(error.path).toContain("authedField");
    });

    it("should throw ForbiddenError when guest accessing object field authed with roles", async () => {
      const localSchema = await buildSchema({
        resolvers: [sampleResolver],
        authChecker: () => false,
      });
      const query = `query {
        normalObjectQuery {
          adminField
        }
      }`;

      const result: any = await graphql({ schema: localSchema, source: query });

      expect(result.data).toBeNull();
      expect(result.errors).toHaveLength(1);
      const error = result.errors![0];
      expect(error.originalError).toBeInstanceOf(ForbiddenError);
      expect(error.path).toContain("adminField");
    });

    it("should allow for access to authed object field when `authChecker` returns true", async () => {
      const localSchema = await buildSchema({
        resolvers: [sampleResolver],
        authChecker: () => true,
      });
      const query = `query {
        normalObjectQuery {
          authedField
        }
      }`;

      const result: any = await graphql({ schema: localSchema, source: query, contextValue: {} });

      expect(result.data!.normalObjectQuery.authedField).toEqual("authedField");
    });

    it("should restrict access to authed object field from resolver", async () => {
      const localSchema = await buildSchema({
        resolvers: [sampleResolver],
        authChecker: () => false,
      });
      const query = `query {
        normalObjectQuery {
          authedResolvedField
        }
      }`;

      const result: any = await graphql({ schema: localSchema, source: query });

      expect(result.data).toBeNull();
    });

    it("should restrict access to inline authed object field from resolver", async () => {
      const localSchema = await buildSchema({
        resolvers: [sampleResolver],
        authChecker: () => false,
      });
      const query = `query {
        normalObjectQuery {
          inlineAuthedResolvedField
        }
      }`;

      const result: any = await graphql({ schema: localSchema, source: query });

      expect(result.data).toBeNull();
    });

    it("should allow for access to authed object field from resolver when access granted", async () => {
      const localSchema = await buildSchema({
        resolvers: [sampleResolver],
        authChecker: () => true,
      });
      const query = `query {
        normalObjectQuery {
          inlineAuthedResolvedField
        }
      }`;

      const result: any = await graphql({ schema: localSchema, source: query, contextValue: {} });

      expect(result.data!.normalObjectQuery.inlineAuthedResolvedField).toEqual(
        "inlineAuthedResolvedField",
      );
    });

    it("should pass roles to `authChecker` when checking for access to handler", async () => {
      let authCheckerRoles: string[] | undefined;
      const localSchema = await buildSchema({
        resolvers: [sampleResolver],
        authChecker: (resolverData, roles) => {
          authCheckerRoles = roles;
          return true;
        },
      });
      const query = `query {
        adminOrRegularQuery
      }`;

      const result: any = await graphql({ schema: localSchema, source: query, contextValue: {} });

      expect(result.data!.adminOrRegularQuery).toEqual(false);
      expect(authCheckerRoles).toEqual(["ADMIN", "REGULAR"]);
    });

    it("should pass resolver data to `authChecker` when checking for access to handler", async () => {
      let authCheckerResolverData: any;
      const localSchema = await buildSchema({
        resolvers: [sampleResolver],
        authChecker: resolverData => {
          authCheckerResolverData = resolverData;
          return true;
        },
      });
      const query = `query {
        adminOrRegularQuery
      }`;

      const result: any = await graphql({
        schema: localSchema,
        source: query,
        rootValue: { field: "rootField" },
        contextValue: { field: "contextField" },
      });

      expect(result.data!.adminOrRegularQuery).toEqual(false);
      expect(authCheckerResolverData.root.field).toEqual("rootField");
      expect(authCheckerResolverData.context.field).toEqual("contextField");
      expect(authCheckerResolverData.args).toEqual({});
      expect(authCheckerResolverData.info).toBeDefined();
    });
  });

  describe("with class-based auth checker", () => {
    it("should correctly call auth checker class instance 'check' method", async () => {
      let authCheckerResolverData: any;
      let authCheckerRoles: any;
      class TestAuthChecker implements AuthCheckerInterface {
        check(resolverData: ResolverData, roles: string[]) {
          authCheckerResolverData = resolverData;
          authCheckerRoles = roles;
          return false;
        }
      }
      const localSchema = await buildSchema({
        resolvers: [sampleResolver],
        authChecker: TestAuthChecker,
      });

      const query = /* graphql */ `
        query {
          adminOrRegularQuery
        }
      `;

      const result: any = await graphql({
        schema: localSchema,
        source: query,
        rootValue: { field: "rootField" },
        contextValue: { field: "contextField" },
      });

      expect(result.data).toBeNull();
      expect(result.errors).toMatchInlineSnapshot(`
        Array [
          [GraphQLError: Access denied! You don't have permission for this action!],
        ]
      `);
      expect(authCheckerResolverData.root).toEqual({ field: "rootField" });
      expect(authCheckerResolverData.context).toEqual({ field: "contextField" });
      expect(authCheckerResolverData.args).toEqual({});
      expect(authCheckerResolverData.info).toBeDefined();
      expect(authCheckerRoles).toEqual(["ADMIN", "REGULAR"]);
    });
  });

  describe("with constant readonly array or roles", () => {
    let testResolver: Function;

    beforeAll(() => {
      getMetadataStorage().clear();

      const CONSTANT_ROLES = ["a", "b", "c"] as const;

      @Resolver()
      class TestResolver {
        @Query()
        @Authorized(CONSTANT_ROLES)
        authedQuery(@Ctx() ctx: any): boolean {
          return ctx.user !== undefined;
        }
      }

      testResolver = TestResolver;
    });

    it("should not throw an error", async () => {
      await buildSchema({
        resolvers: [testResolver],
        // dummy auth checker
        authChecker: () => false,
      });
    });
  });
});
