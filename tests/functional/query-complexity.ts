import "reflect-metadata";
import type { GraphQLSchema } from "graphql";
import { parse } from "graphql";
import { fieldExtensionsEstimator, getComplexity, simpleEstimator } from "graphql-query-complexity";
import type { ClassType } from "type-graphql";
import { Arg, Field, ObjectType, Query, Resolver, Subscription, buildSchema } from "type-graphql";
import { getMetadataStorage } from "@/metadata/getMetadataStorage";
import { getSchemaInfo } from "../helpers/getSchemaInfo";

// Helpers
function calculateComplexityPoints(query: string, schema: GraphQLSchema) {
  const complexityPoints = getComplexity({
    query: parse(query),
    schema,
    estimators: [fieldExtensionsEstimator(), simpleEstimator({ defaultComplexity: 1 })],
  });

  return complexityPoints;
}

describe("Query complexity", () => {
  describe("Queries", () => {
    let schema: GraphQLSchema;

    beforeAll(async () => {
      getMetadataStorage().clear();

      @ObjectType()
      class SampleObject {
        @Field({ complexity: 10 })
        complexResolverMethod: number;
      }

      @Resolver(() => SampleObject)
      class SampleResolver {
        @Query()
        sampleQuery(): SampleObject {
          const obj = new SampleObject();
          return obj;
        }
      }

      schema = await buildSchema({
        resolvers: [SampleResolver],
        validate: false,
      });
    });

    it("should build the schema without errors", () => {
      expect(schema).toBeDefined();
    });

    it("should properly calculate complexity points for a query with complex field resolver", () => {
      const query = /* graphql */ `
        query {
          sampleQuery {
            complexResolverMethod
          }
        }
      `;
      const points = calculateComplexityPoints(query, schema);

      expect(points).toEqual(11);
    });
  });

  describe("Subscriptions", () => {
    let schema: GraphQLSchema;

    beforeAll(async () => {
      getMetadataStorage().clear();

      @ObjectType()
      class SampleObject {
        @Field()
        normalField: string;
      }

      function createResolver(name: string, objectType: ClassType) {
        @Resolver(() => objectType)
        class BaseResolver {
          protected name = "baseName";

          @Query({ name: `${name}Query` })
          baseQuery(@Arg("arg") _arg: boolean): boolean {
            return true;
          }

          @Subscription({ topics: "baseTopic", name: `${name}Subscription` })
          baseSubscription(@Arg("arg") _arg: boolean): boolean {
            return true;
          }
        }

        return BaseResolver;
      }

      @Resolver()
      class ChildResolver extends createResolver("prefix", SampleObject) {
        @Subscription({ topics: "childTopic", complexity: 4 })
        childSubscription(): boolean {
          return true;
        }
      }

      const schemaInfo = await getSchemaInfo({
        resolvers: [ChildResolver],
      });

      schema = schemaInfo.schema;
    });

    it("should build schema correctly", async () => {
      expect(schema).toBeDefined();
    });

    it("should properly calculate subscription complexity", () => {
      const query = `subscription {
        childSubscription
      }`;

      const points = calculateComplexityPoints(query, schema);

      expect(points).toEqual(4);
    });
  });
});
