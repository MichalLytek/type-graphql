import "reflect-metadata";
import type {
  IntrospectionListTypeRef,
  IntrospectionNamedTypeRef,
  IntrospectionNonNullTypeRef,
  IntrospectionObjectType,
  IntrospectionScalarType,
  IntrospectionSchema,
} from "graphql";
import { TypeKind } from "graphql";
import { Field, GraphQLISODateTime, ObjectType, Query, Resolver } from "type-graphql";
import { getMetadataStorage } from "@/metadata/getMetadataStorage";
import { getSchemaInfo } from "../helpers/getSchemaInfo";

describe("Fields - schema", () => {
  let schemaIntrospection: IntrospectionSchema;
  let sampleObjectType: IntrospectionObjectType;

  beforeAll(async () => {
    getMetadataStorage().clear();

    @ObjectType()
    class SampleNestedObject {
      @Field()
      stringField: string;
    }

    @ObjectType()
    class SampleObject {
      @Field()
      implicitStringField: string;

      @Field(() => String)
      explicitStringField: any;

      @Field()
      implicitObjectField: SampleNestedObject;

      @Field(() => String, { nullable: true })
      explicitNullableStringField: any;

      @Field({ nullable: true })
      implicitNullableStringField: string;

      @Field(() => [String])
      explicitStringArrayField: string[];

      @Field(() => [String], { nullable: true })
      nullableArrayFieldNew: string[] | null;

      @Field(() => [SampleNestedObject], { nullable: true })
      nullableObjectArrayField: SampleNestedObject[] | null;

      @Field(() => [String], { nullable: "itemsAndList" })
      arrayWithNullableItemField: string[];

      @Field(() => [String], { nullable: "items" })
      nonNullArrayWithNullableItemField: string[];

      @Field({ name: "overwrittenName", nullable: true })
      overwrittenStringField: string;

      @Field({ name: "complexField", complexity: 10 })
      complexField: string;

      @Field(() => [[String]], { nullable: true })
      nullableNestedArrayField: string[][] | null;

      @Field(() => [[String]], { nullable: "items" })
      nonNullNestedArrayWithNullableItemField: Array<Array<string | null> | null>;

      @Field(() => [[String]], { nullable: "itemsAndList" })
      nestedArrayWithNullableItemField: Array<Array<string | null> | null> | null;

      @Field(() => GraphQLISODateTime)
      overwrittenArrayScalarField: string[];
    }

    @Resolver(() => SampleObject)
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

  it("should register complexity info for field", async () => {
    const metadataStorage = getMetadataStorage();
    const sampleObj = metadataStorage.objectTypes.find(it => it.name === "SampleObject")!;
    const complexField = sampleObj.fields!.find(it => it.name === "complexField")!;
    expect(complexField.complexity).toBe(10);
  });

  it("should throw error when field type not provided", async () => {
    expect.assertions(3);
    getMetadataStorage().clear();

    try {
      @ObjectType()
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class SampleObject {
        @Field()
        invalidSampleField: any;
      }
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      const error: Error = err;
      expect(error.message).toContain("provide explicit type");
      expect(error.message).toContain("invalidSampleField");
    }
  });

  it("should throw error when field type is array and no explicit type provided", async () => {
    expect.assertions(3);
    getMetadataStorage().clear();

    try {
      @ObjectType()
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class SampleObject {
        @Field()
        invalidSampleArrayField: string[];
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      field => field.name === "explicitStringArrayField",
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

  it("should generate nullable item array with nullable option 'itemAndList'", async () => {
    const arrayWithNullableItemField = sampleObjectType.fields.find(
      field => field.name === "arrayWithNullableItemField",
    )!;
    const nullableArrayType = arrayWithNullableItemField.type as IntrospectionListTypeRef;
    const nullableItemType = nullableArrayType.ofType as IntrospectionNamedTypeRef;

    expect(nullableArrayType.kind).toEqual(TypeKind.LIST);
    expect(nullableItemType.kind).toEqual(TypeKind.SCALAR);
    expect(nullableItemType.name).toEqual("String");
  });

  it("should generate nullable element nonNull array with nullable option 'item'", async () => {
    const nonNullArrayWithNullableItemField = sampleObjectType.fields.find(
      field => field.name === "nonNullArrayWithNullableItemField",
    )!;
    const nonNullArrayType = nonNullArrayWithNullableItemField.type as IntrospectionNonNullTypeRef;
    const arrayType = nonNullArrayType.ofType as IntrospectionListTypeRef;
    const elementType = arrayType.ofType as IntrospectionNamedTypeRef;

    expect(nonNullArrayType.kind).toEqual(TypeKind.NON_NULL);
    expect(arrayType.kind).toEqual(TypeKind.LIST);
    expect(elementType.kind).toEqual(TypeKind.SCALAR);
    expect(elementType.name).toEqual("String");
  });

  it("should generate field with overwritten name from decorator option", async () => {
    const overwrittenNameField = sampleObjectType.fields.find(
      field => field.name === "overwrittenName",
    )!;
    const overwrittenStringField = sampleObjectType.fields.find(
      field => field.name === "overwrittenStringField",
    );
    const overwrittenNameFieldType = overwrittenNameField.type as IntrospectionNamedTypeRef;

    expect(overwrittenStringField).toBeUndefined();
    expect(overwrittenNameFieldType.kind).toEqual(TypeKind.SCALAR);
    expect(overwrittenNameFieldType.name).toEqual("String");
  });

  it("should generate nullable nested array field type when declared using mongoose syntax", async () => {
    const nullableNestedArrayField = sampleObjectType.fields.find(
      field => field.name === "nullableNestedArrayField",
    )!;
    const arrayFieldType = nullableNestedArrayField.type as IntrospectionListTypeRef;
    const arrayItemNonNullFieldType = arrayFieldType.ofType as IntrospectionNonNullTypeRef;
    const arrayItemFieldType = arrayItemNonNullFieldType.ofType as IntrospectionListTypeRef;
    const arrayItemScalarNonNullFieldType =
      arrayItemFieldType.ofType as IntrospectionNonNullTypeRef;
    const arrayItemScalarFieldType =
      arrayItemScalarNonNullFieldType.ofType as IntrospectionNamedTypeRef;

    expect(arrayFieldType.kind).toEqual(TypeKind.LIST);
    expect(arrayItemNonNullFieldType.kind).toEqual(TypeKind.NON_NULL);
    expect(arrayItemFieldType.kind).toEqual(TypeKind.LIST);
    expect(arrayItemScalarNonNullFieldType.kind).toEqual(TypeKind.NON_NULL);
    expect(arrayItemScalarFieldType.kind).toEqual(TypeKind.SCALAR);
    expect(arrayItemScalarFieldType.name).toEqual("String");
  });

  it("should generate nested array with nullable option 'items'", async () => {
    const nestedArrayField = sampleObjectType.fields.find(
      field => field.name === "nonNullNestedArrayWithNullableItemField",
    )!;

    const arrayNonNullFieldType = nestedArrayField.type as IntrospectionNonNullTypeRef;
    const arrayItemFieldType = arrayNonNullFieldType.ofType as IntrospectionListTypeRef;
    const arrayItemInnerFieldType = arrayItemFieldType.ofType as IntrospectionListTypeRef;
    const arrayItemScalarFieldType = arrayItemInnerFieldType.ofType as IntrospectionNamedTypeRef;

    expect(arrayNonNullFieldType.kind).toEqual(TypeKind.NON_NULL);
    expect(arrayItemFieldType.kind).toEqual(TypeKind.LIST);
    expect(arrayItemInnerFieldType.kind).toEqual(TypeKind.LIST);
    expect(arrayItemScalarFieldType.kind).toEqual(TypeKind.SCALAR);
    expect(arrayItemScalarFieldType.name).toEqual("String");
  });

  it("should generate nullable nested array with nullable option 'itemsAndList'", async () => {
    const nullableNestedArrayField = sampleObjectType.fields.find(
      field => field.name === "nestedArrayWithNullableItemField",
    )!;
    const arrayFieldType = nullableNestedArrayField.type as IntrospectionListTypeRef;
    const arrayItemFieldType = arrayFieldType.ofType as IntrospectionListTypeRef;
    const arrayItemScalarFieldType = arrayItemFieldType.ofType as IntrospectionNamedTypeRef;

    expect(arrayFieldType.kind).toEqual(TypeKind.LIST);
    expect(arrayItemFieldType.kind).toEqual(TypeKind.LIST);
    expect(arrayItemScalarFieldType.kind).toEqual(TypeKind.SCALAR);
    expect(arrayItemScalarFieldType.name).toEqual("String");
  });

  it("should generate not a list type for explicit scalar even when the reflected type is array", async () => {
    const overwrittenArrayScalarField = sampleObjectType.fields.find(
      field => field.name === "overwrittenArrayScalarField",
    )!;
    const overwrittenArrayScalarFieldType =
      overwrittenArrayScalarField.type as IntrospectionNonNullTypeRef;
    const overwrittenArrayScalarFieldInnerType =
      overwrittenArrayScalarFieldType.ofType as IntrospectionScalarType;

    expect(overwrittenArrayScalarFieldType.kind).toEqual(TypeKind.NON_NULL);
    expect(overwrittenArrayScalarFieldInnerType.kind).toEqual(TypeKind.SCALAR);
    expect(overwrittenArrayScalarFieldInnerType.name).toEqual("DateTime");
  });
});
