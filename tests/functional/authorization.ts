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
} from "../../src";

describe("Authorization", () => {
  let schema: GraphQLSchema;
  let sampleResolver: any;

  beforeAll(async () => {
    getMetadataStorage().clear();

    @ObjectType()
    class SampleObject {
      @Field() normalField: string;

      @Field()
      @Authorized()
      authedField: string;

      @Field({ nullable: true })
      @Authorized()
      nullableAuthedField: string;

      @Field()
      @Authorized("ADMIN")
      adminField: string;

      @Field() normalResolvedField: string;

      @Field() authedResolvedField: string;

      @Field()
      @Authorized()
      inlineAuthedResolvedField: string;
    }

    @Resolver(objectType => SampleObject)
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
    // tslint:disable-next-line:max-line-length
    // it("should throw error when `@Authorized` is used on args, input or interface class", async () => {
    // }
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

      const result = await graphql(schema, query);

      expect(result.data!.normalQuery).toEqual(true);
    });

    it("should allow to read not guarded object field", async () => {
      const query = `query {
        normalObjectQuery {
          normalField
        }
      }`;

      const result = await graphql(schema, query);

      expect(result.data!.normalObjectQuery.normalField).toEqual("normalField");
    });

    it("should allow to read not guarded object field from resolver", async () => {
      const query = `query {
        normalObjectQuery {
          normalResolvedField
        }
      }`;

      const result = await graphql(schema, query);

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

      const result = await graphql(localSchema, query);

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

      const result = await graphql(localSchema, query);

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

      const result = await graphql(localSchema, query);

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

      const result = await graphql(localSchema, query);

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

      const result = await graphql(localSchema, query, null, {});

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

      const result = await graphql(localSchema, query);

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

      const result = await graphql(localSchema, query);

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

      const result = await graphql(localSchema, query);

      expect(result.data).toBeNull();
      expect(result.errors).toHaveLength(1);
      const error = result.errors![0];
      expect(error.originalError).toBeInstanceOf(UnauthorizedError);
      expect(error.path).toContain("authedField");
    });

    // tslint:disable-next-line:max-line-length
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

      const result = await graphql(localSchema, query);

      expect(result.data).toBeNull();
      expect(result.errors).toHaveLength(1);
      const error = result.errors![0];
      expect(error.originalError).toBeInstanceOf(ForbiddenError);
      expect(error.path).toContain("adminField");
    });

    // tslint:disable-next-line:max-line-length
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

      const result = await graphql(localSchema, query, null, {});

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

      const result = await graphql(localSchema, query);

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

      const result = await graphql(localSchema, query);

      expect(result.data).toBeNull();
    });

    // tslint:disable-next-line:max-line-length
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

      const result = await graphql(localSchema, query, null, {});

      expect(result.data!.normalObjectQuery.inlineAuthedResolvedField).toEqual(
        "inlineAuthedResolvedField",
      );
    });

    it("should pass roles to `authChecker` when checking for access to handler", async () => {
      let authCheckerRoles: string[] | undefined;
      const localSchema = await buildSchema({
        resolvers: [sampleResolver],
        authChecker: (actionData, roles) => {
          authCheckerRoles = roles;
          return true;
        },
      });
      const query = `query {
        adminOrRegularQuery
      }`;

      const result = await graphql(localSchema, query, null, {});

      expect(result.data!.adminOrRegularQuery).toEqual(false);
      expect(authCheckerRoles).toEqual(["ADMIN", "REGULAR"]);
    });

    it("should pass action data to `authChecker` when checking for access to handler", async () => {
      let authCheckerActionData: any;
      const localSchema = await buildSchema({
        resolvers: [sampleResolver],
        authChecker: actionData => {
          authCheckerActionData = actionData;
          return true;
        },
      });
      const query = `query {
        adminOrRegularQuery
      }`;

      const result = await graphql(
        localSchema,
        query,
        { field: "rootField" },
        { field: "contextField" },
      );

      expect(result.data!.adminOrRegularQuery).toEqual(false);
      expect(authCheckerActionData.root.field).toEqual("rootField");
      expect(authCheckerActionData.context.field).toEqual("contextField");
      expect(authCheckerActionData.args).toEqual({});
      expect(authCheckerActionData.info).toBeDefined();
    });
  });
});
