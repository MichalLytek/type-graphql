import "reflect-metadata";
import {
  IntrospectionSchema,
  IntrospectionObjectType,
  IntrospectionNonNullTypeRef,
  IntrospectionNamedTypeRef,
  IntrospectionListTypeRef,
} from "graphql";

import { MetadataStorage } from "../../src/metadata/metadata-storage";
import { getSchemaInfo } from "../helpers/getSchemaInfo";
import { GraphQLObjectType, Field, Query, GraphQLResolver } from "../../src";

describe("Fields - schema", () => {
  let schemaIntrospection: IntrospectionSchema;
  let queryType: IntrospectionObjectType;
  let mutationType: IntrospectionObjectType;
  let sampleObjectType: IntrospectionObjectType;

  beforeAll(async () => {
    MetadataStorage.clear();

    @GraphQLObjectType()
    class SampleNestedObject {
      @Field() stringField: string;
    }

    @GraphQLObjectType()
    class SampleObject {
      @Field() implicitStringField: string;

      @Field(type => String)
      explicitStringField: any;

      @Field() implicitObjectField: SampleNestedObject;

      @Field(type => String, { nullable: true })
      explicitNullableStringField: any;

      @Field({ nullable: true })
      implicitNullableStringField: string;

      @Field(type => String)
      implicitStringArrayField: string[];

      @Field(type => String, { array: true })
      explicitStringArrayField: any;

      @Field(type => String, { nullable: true, array: true })
      nullableArrayField: string[] | null;
    }

    @GraphQLResolver(() => SampleObject)
    class SampleResolver {
      @Query()
      sampleQuery(): SampleObject {
        return null as any;
      }
    }

    // get builded schema info from retrospection
    const schemaInfo = await getSchemaInfo({
      resolvers: [SampleResolver],
    });
    schemaIntrospection = schemaInfo.schemaIntrospection;
    queryType = schemaInfo.queryType;
    mutationType = schemaInfo.mutationType!;
    sampleObjectType = schemaIntrospection.types.find(
      type => type.name === "SampleObject",
    ) as IntrospectionObjectType;
  });

  // helpers
  function getInnerFieldType(name: string) {
    const fieldType = sampleObjectType.fields.find(field => field.name === name)!;
    return (fieldType.type as IntrospectionNonNullTypeRef).ofType! as IntrospectionNamedTypeRef;
  }

  // tests
  it("should generate schema without errors", async () => {
    expect(schemaIntrospection).toBeDefined();
  });

  it("should throw error when field type not provided", async () => {
    expect.assertions(3);
    MetadataStorage.clear();

    try {
      @GraphQLObjectType()
      class SampleObject {
        @Field() invalidSampleField: any;
      }
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      const error: Error = err;
      expect(error.message).toContain("provide explicit type");
      expect(error.message).toContain("invalidSampleField");
    }
  });

  it("should throw error when field type is array and no explicit item type provided", async () => {
    expect.assertions(3);
    MetadataStorage.clear();

    try {
      @GraphQLObjectType()
      class SampleObject {
        @Field() invalidSampleArrayField: string[];
      }
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      const error: Error = err;
      expect(error.message).toContain("provide explicit type");
      expect(error.message).toContain("invalidSampleArrayField");
    }
  });

  it("should throw error when cannot determine field type", async () => {
    expect.assertions(3);
    MetadataStorage.clear();

    try {
      @GraphQLObjectType()
      class SampleObject {
        @Field({ nullable: true })
        invalidSampleNullableField: string | null;
      }
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      const error: Error = err;
      expect(error.message).toContain("provide explicit type");
      expect(error.message).toContain("invalidSampleNullableField");
    }
  });

  it("should generate non-nullable field type by default", async () => {
    const implicitStringField = sampleObjectType.fields.find(
      field => field.name === "implicitStringField",
    )!;

    expect(implicitStringField.type.kind).toEqual("NON_NULL");
  });

  it("should generate implicit field type for scalar", async () => {
    const implicitStringFieldType = getInnerFieldType("implicitStringField");

    expect(implicitStringFieldType.kind).toEqual("SCALAR");
    expect(implicitStringFieldType.name).toEqual("String");
  });

  it("should generate explicit field type for scalar", async () => {
    const explicitStringFieldType = getInnerFieldType("explicitStringField");

    expect(explicitStringFieldType.kind).toEqual("SCALAR");
    expect(explicitStringFieldType.name).toEqual("String");
  });

  it("should generate implicit field type for object type", async () => {
    const implicitObjectFieldType = getInnerFieldType("implicitObjectField");

    expect(implicitObjectFieldType.kind).toEqual("OBJECT");
    expect(implicitObjectFieldType.name).toEqual("SampleNestedObject");
  });

  it("should generate nullable field type for implicit scalar", async () => {
    const implicitNullableStringField = sampleObjectType.fields.find(
      field => field.name === "implicitNullableStringField",
    )!;
    // prettier-ignore
    const implicitNullableStringFieldType =
      implicitNullableStringField.type as IntrospectionNamedTypeRef;

    expect(implicitNullableStringFieldType.kind).toEqual("SCALAR");
    expect(implicitNullableStringFieldType.name).toEqual("String");
  });

  it("should generate nullable field type for explicit type", async () => {
    const explicitNullableStringField = sampleObjectType.fields.find(
      field => field.name === "explicitNullableStringField",
    )!;
    // prettier-ignore
    const explicitNullableStringFieldType =
      explicitNullableStringField.type as IntrospectionNamedTypeRef;

    expect(explicitNullableStringFieldType.kind).toEqual("SCALAR");
    expect(explicitNullableStringFieldType.name).toEqual("String");
  });

  it("should generate non-nullable array of non-nullable items field type by default", async () => {
    const nonNullField = sampleObjectType.fields.find(
      field => field.name === "implicitStringArrayField",
    )!;
    const nonNullFieldType = nonNullField.type as IntrospectionNonNullTypeRef;
    const arrayFieldType = nonNullFieldType.ofType as IntrospectionListTypeRef;
    const arrayItemNonNullFieldType = arrayFieldType.ofType as IntrospectionNonNullTypeRef;
    const arrayItemFieldType = arrayItemNonNullFieldType.ofType as IntrospectionNamedTypeRef;

    expect(nonNullFieldType.kind).toEqual("NON_NULL");
    expect(arrayFieldType.kind).toEqual("LIST");
    expect(arrayItemNonNullFieldType.kind).toEqual("NON_NULL");
    expect(arrayItemFieldType.kind).toEqual("SCALAR");
    expect(arrayItemFieldType.name).toEqual("String");
  });

  it("should generate array field type when explicitly set", async () => {
    const nonNullField = sampleObjectType.fields.find(
      field => field.name === "explicitStringArrayField",
    )!;
    const nonNullFieldType = nonNullField.type as IntrospectionNonNullTypeRef;
    const arrayFieldType = nonNullFieldType.ofType as IntrospectionListTypeRef;
    const arrayItemNonNullFieldType = arrayFieldType.ofType as IntrospectionNonNullTypeRef;
    const arrayItemFieldType = arrayItemNonNullFieldType.ofType as IntrospectionNamedTypeRef;

    expect(nonNullFieldType.kind).toEqual("NON_NULL");
    expect(arrayFieldType.kind).toEqual("LIST");
    expect(arrayItemNonNullFieldType.kind).toEqual("NON_NULL");
    expect(arrayItemFieldType.kind).toEqual("SCALAR");
    expect(arrayItemFieldType.name).toEqual("String");
  });

  it("should generate nullable array field type when declared", async () => {
    const arrayField = sampleObjectType.fields.find(field => field.name === "nullableArrayField")!;
    const arrayFieldType = arrayField.type as IntrospectionListTypeRef;
    const arrayItemNonNullFieldType = arrayFieldType.ofType as IntrospectionNonNullTypeRef;
    const arrayItemFieldType = arrayItemNonNullFieldType.ofType as IntrospectionNamedTypeRef;

    expect(arrayFieldType.kind).toEqual("LIST");
    expect(arrayItemNonNullFieldType.kind).toEqual("NON_NULL");
    expect(arrayItemFieldType.kind).toEqual("SCALAR");
    expect(arrayItemFieldType.name).toEqual("String");
  });
});
