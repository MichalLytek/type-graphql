import "reflect-metadata";
import { GraphQLSchema, graphql } from "graphql";

import { MetadataStorage } from "../../src/metadata/metadata-storage";
import {
  Field,
  GraphQLObjectType,
  Ctx,
  Authorized,
  Query,
  GraphQLResolver,
  buildSchema,
  FieldResolver,
} from "../../src";
import { HandlerDefinition } from "../../src/metadata/definition-interfaces";

describe("Authorization", () => {
  let schema: GraphQLSchema;
  let sampleResolver: any;

  beforeAll(async () => {
    MetadataStorage.clear();

    @GraphQLObjectType()
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
    }

    @GraphQLResolver(objectType => SampleObject)
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
    function findQuery(queryName: string): HandlerDefinition {
      return MetadataStorage.queries.find(it => it.methodName === queryName)!;
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
      const sampleObject = MetadataStorage.objectTypes.find(type => type.name === "SampleObject")!;
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
  });
});
