import "reflect-metadata";

import {
  GraphQLSchema,
  GraphQLResolveInfo,
  graphql,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
  GraphQLObjectTypeConfig,
} from "graphql";
import {
  Field,
  Resolver,
  Query,
  Extensions,
  buildSchema,
  ObjectType,
  MiddlewareFn,
  Int,
} from "../../src";
import { getMetadataStorage } from "../../src/metadata/getMetadataStorage";
import { extractFieldConfig, extractParentTypeConfig } from "../../src/helpers/resolveInfo";

describe("resolveInfo helpers", () => {
  let schema: GraphQLSchema;
  let infoRecord: Record<string, GraphQLResolveInfo> = {};

  const SampleMiddleware: MiddlewareFn = async ({ info }, next) => {
    infoRecord[info.fieldName] = info;
    return next();
  };

  beforeAll(async () => {
    getMetadataStorage().clear();

    @ObjectType()
    class BasicObjectType {
      @Field()
      basicField: string;

      @Field(type => Int, {
        description: "some field description",
        deprecationReason: "outdated type",
      })
      @Extensions({ data: "123" })
      decoratedField: number;
    }

    @ObjectType({ description: "some object type description" })
    @Extensions({ id: 1234 })
    class DecoratedObjectType {
      @Field()
      basicField: string;
    }

    @Resolver()
    class SampleResolver {
      @Query(() => BasicObjectType)
      basicObjectType(): BasicObjectType {
        return new BasicObjectType();
      }

      @Query(() => DecoratedObjectType)
      decoratedObjectType(): DecoratedObjectType {
        return new DecoratedObjectType();
      }
    }

    schema = await buildSchema({
      resolvers: [SampleResolver],
      globalMiddlewares: [SampleMiddleware],
    });
  });

  beforeEach(async () => {
    // Reset "infoRecord" after each test to prevent false positives
    infoRecord = {};
  });

  describe("extractFieldConfig", () => {
    it("should extract proper config for basic fields", async () => {
      const query = `query {
            basicObjectType {
              basicField
            }
          }`;
      await graphql(schema, query);

      const fieldConfig = extractFieldConfig(infoRecord.basicField);
      expect(fieldConfig).toEqual({
        deprecationReason: undefined,
        description: undefined,
        extensions: {
          complexity: undefined,
        },
        type: new GraphQLNonNull(GraphQLString),
      });
    });

    it("should extract proper config for decorated fields", async () => {
      const query = `query {
            basicObjectType {
              decoratedField
            }
          }`;
      await graphql(schema, query);

      const fieldConfig = extractFieldConfig(infoRecord.decoratedField);
      expect(fieldConfig).toEqual({
        deprecationReason: "outdated type",
        description: "some field description",
        extensions: {
          complexity: undefined,
          data: "123",
        },
        type: new GraphQLNonNull(GraphQLInt),
      });
    });

    describe("extractParentTypeConfig", () => {
      const baseObjectTypeConfig = {
        astNode: undefined,
        extensionASTNodes: [],
        interfaces: [],
        isTypeOf: undefined,
      };

      it("should extract proper config for basic parent types", async () => {
        const query = `query {
              basicObjectType {
                basicField
              }
            }`;
        await graphql(schema, query);

        const parentTypeConfig = extractParentTypeConfig(infoRecord.basicField);
        expect(parentTypeConfig).toEqual({
          ...baseObjectTypeConfig,
          description: undefined,
          extensions: {},
          fields: {
            basicField: expect.any(Object),
            decoratedField: expect.any(Object),
          },
          name: "BasicObjectType",
        });
      });

      it("should extract proper config for decorated parent types", async () => {
        const query = `query {
              decoratedObjectType {
                basicField
              }
            }`;
        await graphql(schema, query);

        const parentTypeConfig = extractParentTypeConfig(infoRecord.basicField);
        expect(parentTypeConfig).toEqual({
          ...baseObjectTypeConfig,
          description: "some object type description",
          extensions: {
            id: 1234,
          },
          fields: {
            basicField: expect.any(Object),
          },
          name: "DecoratedObjectType",
        });
      });
    });
  });
});
