import "reflect-metadata";
import {
  IntrospectionSchema,
  IntrospectionObjectType,
  IntrospectionNonNullTypeRef,
  IntrospectionNamedTypeRef,
  IntrospectionListTypeRef,
  TypeKind,
} from "graphql";

import { getMetadataStorage } from "../../src/metadata/getMetadataStorage";
import { getSchemaInfo } from "../helpers/getSchemaInfo";
import { ObjectType, Field, Query, Resolver } from "../../src";

describe("Fields - schema", () => {
  let schemaIntrospection: IntrospectionSchema;
  let queryType: IntrospectionObjectType;
  let mutationType: IntrospectionObjectType;
  let sampleObjectType: IntrospectionObjectType;

  beforeAll(async () => {
    getMetadataStorage().clear();

    @ObjectType()
    class SampleNestedObject {
      @Field() stringField: string;
    }

    @ObjectType()
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

      @Field(type => [String], { nullable: true })
      nullableArrayFieldNew: string[] | null;

      @Field(type => [SampleNestedObject], { nullable: true })
      nullableObjectArrayField: SampleNestedObject[] | null;
    }

    @Resolver(objectType => SampleObject)
    class SampleResolver {
      @Query()
      sampleQuery(): SampleObject {
        return {} as SampleObject;
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
    getMetadataStorage().clear();

    try {
      @ObjectType()
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
    getMetadataStorage().clear();

    try {
      @ObjectType()
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
    getMetadataStorage().clear();

    try {
      @ObjectType()
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
  it("should throw error when object type property key is symbol", async () => {
    expect.assertions(1);
    getMetadataStorage().clear();

    const symbolKey = Symbol("symbolKey");
    try {
      @ObjectType()
      class SampleObject {
        @Field({ nullable: true })
        [symbolKey]: string | null;
      }
    } catch (err) {
      expect(err.message).toContain("Symbol keys are not supported yet!");
    }
  });

  it("should generate non-nullable field type by default", async () => {
    const implicitStringField = sampleObjectType.fields.find(
      field => field.name === "implicitStringField",
    )!;

    expect(implicitStringField.type.kind).toEqual(TypeKind.NON_NULL);
  });

  it("should generate implicit field type for scalar", async () => {
    const implicitStringFieldType = getInnerFieldType("implicitStringField");

    expect(implicitStringFieldType.kind).toEqual(TypeKind.SCALAR);
    expect(implicitStringFieldType.name).toEqual("String");
  });

  it("should generate explicit field type for scalar", async () => {
    const explicitStringFieldType = getInnerFieldType("explicitStringField");

    expect(explicitStringFieldType.kind).toEqual(TypeKind.SCALAR);
    expect(explicitStringFieldType.name).toEqual("String");
  });

  it("should generate implicit field type for object type", async () => {
    const implicitObjectFieldType = getInnerFieldType("implicitObjectField");

    expect(implicitObjectFieldType.kind).toEqual(TypeKind.OBJECT);
    expect(implicitObjectFieldType.name).toEqual("SampleNestedObject");
  });

  it("should generate nullable field type for implicit scalar", async () => {
    const implicitNullableStringField = sampleObjectType.fields.find(
      field => field.name === "implicitNullableStringField",
    )!;
    // prettier-ignore
    const implicitNullableStringFieldType =
      implicitNullableStringField.type as IntrospectionNamedTypeRef;

    expect(implicitNullableStringFieldType.kind).toEqual(TypeKind.SCALAR);
    expect(implicitNullableStringFieldType.name).toEqual("String");
  });

  it("should generate nullable field type for explicit type", async () => {
    const explicitNullableStringField = sampleObjectType.fields.find(
      field => field.name === "explicitNullableStringField",
    )!;
    // prettier-ignore
    const explicitNullableStringFieldType =
      explicitNullableStringField.type as IntrospectionNamedTypeRef;

    expect(explicitNullableStringFieldType.kind).toEqual(TypeKind.SCALAR);
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

    expect(nonNullFieldType.kind).toEqual(TypeKind.NON_NULL);
    expect(arrayFieldType.kind).toEqual(TypeKind.LIST);
    expect(arrayItemNonNullFieldType.kind).toEqual(TypeKind.NON_NULL);
    expect(arrayItemFieldType.kind).toEqual(TypeKind.SCALAR);
    expect(arrayItemFieldType.name).toEqual("String");
  });

  it("should generate nullable array field type when declared using mongoose syntax", async () => {
    const nullableArrayFieldNew = sampleObjectType.fields.find(
      field => field.name === "nullableArrayFieldNew",
    )!;
    const arrayFieldType = nullableArrayFieldNew.type as IntrospectionListTypeRef;
    const arrayItemNonNullFieldType = arrayFieldType.ofType as IntrospectionNonNullTypeRef;
    const arrayItemFieldType = arrayItemNonNullFieldType.ofType as IntrospectionNamedTypeRef;

    expect(arrayFieldType.kind).toEqual(TypeKind.LIST);
    expect(arrayItemNonNullFieldType.kind).toEqual(TypeKind.NON_NULL);
    expect(arrayItemFieldType.kind).toEqual(TypeKind.SCALAR);
    expect(arrayItemFieldType.name).toEqual("String");
  });

  // tslint:disable-next-line:max-line-length
  it("should generate nullable array field object type when declared using mongoose syntax", async () => {
    const nullableArrayFieldNew = sampleObjectType.fields.find(
      field => field.name === "nullableObjectArrayField",
    )!;
    const arrayFieldType = nullableArrayFieldNew.type as IntrospectionListTypeRef;
    const arrayItemNonNullFieldType = arrayFieldType.ofType as IntrospectionNonNullTypeRef;
    const arrayItemFieldType = arrayItemNonNullFieldType.ofType as IntrospectionNamedTypeRef;

    expect(arrayFieldType.kind).toEqual(TypeKind.LIST);
    expect(arrayItemNonNullFieldType.kind).toEqual(TypeKind.NON_NULL);
    expect(arrayItemFieldType.kind).toEqual(TypeKind.OBJECT);
    expect(arrayItemFieldType.name).toEqual("SampleNestedObject");
  });
});
