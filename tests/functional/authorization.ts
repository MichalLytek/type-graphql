import "reflect-metadata";
import { GraphQLSchema } from "graphql";

import { MetadataStorage } from "../../src/metadata/metadata-storage";
import {
  Field,
  GraphQLObjectType,
  Ctx,
  Authorized,
  Query,
  GraphQLResolver,
  buildSchema,
} from "../../src";
import { HandlerDefinition } from "../../src/metadata/definition-interfaces";

describe("Authorization", () => {
  let schema: GraphQLSchema;

  beforeAll(async () => {
    MetadataStorage.clear();

    @GraphQLObjectType()
    class SampleObject {
      @Field() normalField: string;

      @Field()
      @Authorized()
      authedField: string;

      @Field()
      @Authorized("ADMIN")
      adminField: string;
    }

    @GraphQLResolver()
    class SampleResolver {
      @Query()
      normalQuery(): boolean {
        return true;
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
    }

    schema = await buildSchema({
      resolvers: [SampleResolver],
    });
  });

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
