import "reflect-metadata";
import {
  IntrospectionSchema,
  IntrospectionObjectType,
  graphql,
  GraphQLSchema,
  IntrospectionUnionType,
  TypeKind,
} from "graphql";

import { getSchemaInfo } from "../helpers/getSchemaInfo";
import { getInnerTypeOfNonNullableType, getInnerFieldType } from "../helpers/getInnerFieldType";
import { getMetadataStorage } from "../../src/metadata/getMetadataStorage";
import { Field, ObjectType, Query, createUnionType, buildSchema, Resolver } from "../../src";

describe("Unions", () => {
  let schemaIntrospection: IntrospectionSchema;
  let queryType: IntrospectionObjectType;
  let schema: GraphQLSchema;

  beforeAll(async () => {
    getMetadataStorage().clear();

    @ObjectType()
    class ObjectOne {
      @Field()
      fieldOne: string;
    }
    @ObjectType()
    class ObjectTwo {
      @Field()
      fieldTwo: string;
    }
    @ObjectType()
    class ObjectThree {
      @Field()
      fieldThree: string;
    }

    const OneTwoThreeUnion = createUnionType({
      name: "OneTwoThreeUnion",
      description: "OneTwoThreeUnion description",
      types: () => [ObjectOne, ObjectTwo, ObjectThree],
    });
    const OneTwoThreeUnionFn = createUnionType({
      name: "OneTwoThreeUnionFn",
      description: "OneTwoThreeUnionFn description",
      types: () => [ObjectOne, ObjectTwo, ObjectThree],
    });

    const UnionWithStringResolveType = createUnionType({
      name: "UnionWithStringResolveType",
      types: () => [ObjectOne, ObjectTwo],
      resolveType: value => {
        if ("fieldOne" in value) {
          return "ObjectOne";
        }
        if ("fieldTwo" in value) {
          return "ObjectTwo";
        }
        return;
      },
    });

    const UnionWithClassResolveType = createUnionType({
      name: "UnionWithClassResolveType",
      types: () => [ObjectOne, ObjectTwo],
      resolveType: value => {
        if ("fieldOne" in value) {
          return ObjectOne;
        }
        if ("fieldTwo" in value) {
          return ObjectTwo;
        }
        return;
      },
    });

    @ObjectType()
    class ObjectUnion {
      @Field(type => OneTwoThreeUnion)
      unionField: typeof OneTwoThreeUnion;
    }

    class SampleResolver {
      @Query(returns => OneTwoThreeUnion)
      getObjectOneFromUnion(): typeof OneTwoThreeUnion {
        const oneInstance = new ObjectTwo();
        oneInstance.fieldTwo = "fieldTwo";
        return oneInstance;
      }

      @Query(returns => OneTwoThreeUnionFn)
      getObjectOneFromUnionFn(): typeof OneTwoThreeUnionFn {
        const oneInstance = new ObjectTwo();
        oneInstance.fieldTwo = "fieldTwo";
        return oneInstance;
      }

      @Query()
      getObjectWithUnion(): ObjectUnion {
        const oneInstance = new ObjectTwo();
        oneInstance.fieldTwo = "fieldTwo";
        return {
          unionField: oneInstance,
        };
      }

      @Query(returns => OneTwoThreeUnion)
      getPlainObjectFromUnion(): typeof OneTwoThreeUnion {
        return {
          fieldTwo: "fieldTwo",
        };
      }

      @Query(returns => UnionWithStringResolveType)
      getObjectOneFromStringResolveTypeUnion(): typeof UnionWithStringResolveType {
        return {
          fieldTwo: "fieldTwo",
        };
      }

      @Query(returns => UnionWithClassResolveType)
      getObjectOneFromClassResolveTypeUnion(): typeof UnionWithClassResolveType {
        return {
          fieldTwo: "fieldTwo",
        };
      }
    }

    const schemaInfo = await getSchemaInfo({
      resolvers: [SampleResolver],
    });
    schema = schemaInfo.schema;
    schemaIntrospection = schemaInfo.schemaIntrospection;
    queryType = schemaInfo.queryType;
  });

  describe("Schema", () => {
    it("should generate schema without errors", async () => {
      expect(schemaIntrospection).toBeDefined();
    });

    it("should correctly generate union type", async () => {
      const oneTwoThreeUnionType = schemaIntrospection.types.find(
        type => type.name === "OneTwoThreeUnion",
      ) as IntrospectionUnionType;
      const objectOne = oneTwoThreeUnionType.possibleTypes.find(type => type.name === "ObjectOne")!;
      const objectTwo = oneTwoThreeUnionType.possibleTypes.find(type => type.name === "ObjectTwo")!;
      const objectThree = oneTwoThreeUnionType.possibleTypes.find(
        type => type.name === "ObjectThree",
      )!;

      expect(oneTwoThreeUnionType.kind).toEqual(TypeKind.UNION);
      expect(oneTwoThreeUnionType.name).toEqual("OneTwoThreeUnion");
      expect(oneTwoThreeUnionType.description).toEqual("OneTwoThreeUnion description");
      expect(objectOne.kind).toEqual(TypeKind.OBJECT);
      expect(objectTwo.kind).toEqual(TypeKind.OBJECT);
      expect(objectThree.kind).toEqual(TypeKind.OBJECT);
    });

    it("should correctly generate union type from function syntax", async () => {
      const oneTwoThreeUnionFnType = schemaIntrospection.types.find(
        type => type.name === "OneTwoThreeUnionFn",
      ) as IntrospectionUnionType;
      const objectOne = oneTwoThreeUnionFnType.possibleTypes.find(
        type => type.name === "ObjectOne",
      )!;
      const objectTwo = oneTwoThreeUnionFnType.possibleTypes.find(
        type => type.name === "ObjectTwo",
      )!;
      const objectThree = oneTwoThreeUnionFnType.possibleTypes.find(
        type => type.name === "ObjectThree",
      )!;

      expect(oneTwoThreeUnionFnType.kind).toEqual(TypeKind.UNION);
      expect(oneTwoThreeUnionFnType.name).toEqual("OneTwoThreeUnionFn");
      expect(oneTwoThreeUnionFnType.description).toEqual("OneTwoThreeUnionFn description");
      expect(objectOne.kind).toEqual(TypeKind.OBJECT);
      expect(objectTwo.kind).toEqual(TypeKind.OBJECT);
      expect(objectThree.kind).toEqual(TypeKind.OBJECT);
    });

    it("should correctly generate query's union output type", async () => {
      const getObjectOneFromUnion = queryType.fields.find(
        field => field.name === "getObjectOneFromUnion",
      )!;

      const getObjectOneFromUnionType = getInnerTypeOfNonNullableType(getObjectOneFromUnion);
      expect(getObjectOneFromUnionType.kind).toEqual(TypeKind.UNION);
      expect(getObjectOneFromUnionType.name).toEqual("OneTwoThreeUnion");
    });

    it("should correctly generate object type's union output type", async () => {
      const objectUnion = schemaIntrospection.types.find(
        type => type.name === "ObjectUnion",
      ) as IntrospectionObjectType;
      const objectUnionFieldType = getInnerFieldType(objectUnion, "unionField");

      expect(objectUnionFieldType.kind).toEqual(TypeKind.UNION);
      expect(objectUnionFieldType.name).toEqual("OneTwoThreeUnion");
    });
  });

  describe("Functional", () => {
    it("should correctly recognize returned object type using default `instance of` check", async () => {
      const query = `query {
        getObjectOneFromUnion {
          __typename
          ... on ObjectOne {
            fieldOne
          }
          ... on ObjectTwo {
            fieldTwo
          }
        }
      }`;

      const result: any = await graphql({ schema, source: query });
      const data = result.data!.getObjectOneFromUnion;
      expect(data.__typename).toEqual("ObjectTwo");
      expect(data.fieldTwo).toEqual("fieldTwo");
      expect(data.fieldOne).toBeUndefined();
    });

    it("should correctly recognize returned object type using string provided by `resolveType` function", async () => {
      const query = `query {
        getObjectOneFromStringResolveTypeUnion {
          __typename
          ... on ObjectOne {
            fieldOne
          }
          ... on ObjectTwo {
            fieldTwo
          }
        }
      }`;

      const result: any = await graphql({ schema, source: query });
      const data = result.data!.getObjectOneFromStringResolveTypeUnion;
      expect(data.__typename).toEqual("ObjectTwo");
      expect(data.fieldTwo).toEqual("fieldTwo");
      expect(data.fieldOne).toBeUndefined();
    });

    it("should correctly recognize returned object type using class provided by `resolveType` function", async () => {
      const query = `query {
        getObjectOneFromClassResolveTypeUnion {
          __typename
          ... on ObjectOne {
            fieldOne
          }
          ... on ObjectTwo {
            fieldTwo
          }
        }
      }`;

      const result: any = await graphql({ schema, source: query });
      const data = result.data!.getObjectOneFromClassResolveTypeUnion;
      expect(data.__typename).toEqual("ObjectTwo");
      expect(data.fieldTwo).toEqual("fieldTwo");
      expect(data.fieldOne).toBeUndefined();
    });

    it("should correctly recognize returned object type from union on object field", async () => {
      const query = `query {
        getObjectWithUnion {
          unionField {
            __typename
            ... on ObjectOne {
              fieldOne
            }
            ... on ObjectTwo {
              fieldTwo
            }
          }
        }
      }`;

      const result: any = await graphql({ schema, source: query });
      const unionFieldData = result.data!.getObjectWithUnion.unionField;

      expect(unionFieldData.__typename).toEqual("ObjectTwo");
      expect(unionFieldData.fieldTwo).toEqual("fieldTwo");
      expect(unionFieldData.fieldOne).toBeUndefined();
    });

    it("should throw error when not returning instance of object class", async () => {
      const query = `query {
        getPlainObjectFromUnion {
          __typename
          ... on ObjectOne {
            fieldOne
          }
          ... on ObjectTwo {
            fieldTwo
          }
        }
      }`;

      const result: any = await graphql({ schema, source: query });

      expect(result.data).toBeNull();
      expect(result.errors).toHaveLength(1);
      const errorMessage = result.errors![0].message;
      expect(errorMessage).toContain("resolve");
      expect(errorMessage).toContain("OneTwoThreeUnion");
      expect(errorMessage).toContain("instance");
      expect(errorMessage).toContain("plain");
    });
  });

  describe("typings", () => {
    it("should correctly transform to TS union type when using extending classes", async () => {
      getMetadataStorage().clear();
      @ObjectType()
      class Base {
        @Field()
        base: string;
      }
      @ObjectType()
      class Extended extends Base {
        @Field()
        extended: string;
      }
      const ExtendedBase = createUnionType({
        name: "ExtendedBase",
        types: () => [Base, Extended] as const,
      });
      const _extended: typeof ExtendedBase = {
        base: "base",
        extended: "extended",
      };
    });
  });

  describe("Mutliple schemas", () => {
    it("should correctly return data from union query for all schemas that uses the same union", async () => {
      getMetadataStorage().clear();

      @ObjectType()
      class One {
        @Field()
        one: string;
      }
      @ObjectType()
      class Two {
        @Field()
        two: string;
      }
      const OneTwo = createUnionType({
        name: "OneTwo",
        types: () => [One, Two],
      });
      @Resolver()
      class OneTwoResolver {
        @Query(returns => OneTwo)
        oneTwo(): typeof OneTwo {
          const one = new One();
          one.one = "one";
          return one;
        }
      }
      const query = /* graphql */ `
        query {
          oneTwo {
            __typename
            ... on One {
              one
            }
            ... on Two {
              two
            }
          }
        }
      `;

      const firstSchema = await buildSchema({
        resolvers: [OneTwoResolver],
      });
      const secondSchema = await buildSchema({
        resolvers: [OneTwoResolver],
      });
      const firstResult = await graphql({ schema: firstSchema, source: query });
      const secondResult = await graphql({ schema: secondSchema, source: query });

      expect(firstResult.errors).toBeUndefined();
      expect(firstResult.data!.oneTwo).toEqual({
        __typename: "One",
        one: "one",
      });
      expect(secondResult.errors).toBeUndefined();
      expect(secondResult.data!.oneTwo).toEqual({
        __typename: "One",
        one: "one",
      });
    });

    it("should correctly return data from union query for all schemas that uses the same union when string `resolveType` is provided", async () => {
      getMetadataStorage().clear();

      @ObjectType()
      class One {
        @Field()
        one: string;
      }
      @ObjectType()
      class Two {
        @Field()
        two: string;
      }
      const OneTwo = createUnionType({
        name: "OneTwo",
        types: () => [One, Two],
        resolveType: value => {
          if ("one" in value) {
            return "One";
          }
          if ("two" in value) {
            return "Two";
          }
          throw new Error("Unknown union error");
        },
      });
      @Resolver()
      class OneTwoResolver {
        @Query(returns => OneTwo)
        oneTwo(): typeof OneTwo {
          const one = new One();
          one.one = "one";
          return one;
        }
      }
      const query = /* graphql */ `
        query {
          oneTwo {
            __typename
            ... on One {
              one
            }
            ... on Two {
              two
            }
          }
        }
      `;

      const firstSchema = await buildSchema({
        resolvers: [OneTwoResolver],
      });
      const secondSchema = await buildSchema({
        resolvers: [OneTwoResolver],
      });
      const firstResult = await graphql({ schema: firstSchema, source: query });
      const secondResult = await graphql({ schema: secondSchema, source: query });

      expect(firstResult.errors).toBeUndefined();
      expect(firstResult.data!.oneTwo).toEqual({
        __typename: "One",
        one: "one",
      });
      expect(secondResult.errors).toBeUndefined();
      expect(secondResult.data!.oneTwo).toEqual({
        __typename: "One",
        one: "one",
      });
    });

    it("should correctly return data from union query for all schemas that uses the same union when class `resolveType` is provided", async () => {
      getMetadataStorage().clear();

      @ObjectType()
      class One {
        @Field()
        one: string;
      }
      @ObjectType()
      class Two {
        @Field()
        two: string;
      }
      const OneTwo = createUnionType({
        name: "OneTwo",
        types: () => [One, Two],
        resolveType: value => {
          if ("one" in value) {
            return One;
          }
          if ("two" in value) {
            return Two;
          }
          throw new Error("Unknown union error");
        },
      });
      @Resolver()
      class OneTwoResolver {
        @Query(returns => OneTwo)
        oneTwo(): typeof OneTwo {
          const one = new One();
          one.one = "one";
          return one;
        }
      }
      const query = /* graphql */ `
        query {
          oneTwo {
            __typename
            ... on One {
              one
            }
            ... on Two {
              two
            }
          }
        }
      `;

      const firstSchema = await buildSchema({
        resolvers: [OneTwoResolver],
      });
      const secondSchema = await buildSchema({
        resolvers: [OneTwoResolver],
      });
      const firstResult = await graphql({ schema: firstSchema, source: query });
      const secondResult = await graphql({ schema: secondSchema, source: query });

      expect(firstResult.errors).toBeUndefined();
      expect(firstResult.data!.oneTwo).toEqual({
        __typename: "One",
        one: "one",
      });
      expect(secondResult.errors).toBeUndefined();
      expect(secondResult.data!.oneTwo).toEqual({
        __typename: "One",
        one: "one",
      });
    });

    it("should should fail with error info when `resolveType` returns undefined", async () => {
      getMetadataStorage().clear();

      @ObjectType()
      class One {
        @Field()
        one: string;
      }
      @ObjectType()
      class Two {
        @Field()
        two: string;
      }
      const OneTwo = createUnionType({
        name: "OneTwo",
        types: () => [One, Two],
        resolveType: () => {
          return undefined;
        },
      });
      @Resolver()
      class OneTwoResolver {
        @Query(returns => OneTwo)
        oneTwo(): typeof OneTwo {
          const one = new One();
          one.one = "one";
          return one;
        }
      }
      const query = /* graphql */ `
        query {
          oneTwo {
            __typename
            ... on One {
              one
            }
            ... on Two {
              two
            }
          }
        }
      `;

      const testSchema = await buildSchema({
        resolvers: [OneTwoResolver],
      });
      const result: any = await graphql({ schema: testSchema, source: query });

      expect(result.errors?.[0]?.message).toMatchInlineSnapshot(
        `"Abstract type \\"OneTwo\\" must resolve to an Object type at runtime for field \\"Query.oneTwo\\". Either the \\"OneTwo\\" type should provide a \\"resolveType\\" function or each possible type should provide an \\"isTypeOf\\" function."`,
      );
    });
  });
});
