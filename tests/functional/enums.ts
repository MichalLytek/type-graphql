import "reflect-metadata";
import {
  IntrospectionSchema,
  IntrospectionObjectType,
  IntrospectionNonNullTypeRef,
  IntrospectionNamedTypeRef,
  IntrospectionInputObjectType,
  IntrospectionEnumType,
  graphql,
  GraphQLSchema,
} from "graphql";

import { getSchemaInfo } from "../helpers/getSchemaInfo";
import { getInnerInputFieldType, getInnerTypeOfNullableType } from "../helpers/getInnerFieldType";
import { MetadataStorage } from "../../src/metadata/metadata-storage";
import { Field, GraphQLInputType, Query, Arg, registerEnum } from "../../src";

describe("Enums", () => {
  let schemaIntrospection: IntrospectionSchema;
  let queryType: IntrospectionObjectType;
  let schema: GraphQLSchema;

  beforeAll(async () => {
    MetadataStorage.clear();

    enum NumberEnum {
      One = 1,
      Two,
      Three,
      Four,
    }
    registerEnum(NumberEnum, { name: "NumberEnum" });

    enum StringEnum {
      One = "ONE",
      Two = "TWO",
      Three = "THREE",
    }
    registerEnum(StringEnum, { name: "StringEnum", description: "custom string enum" });

    @GraphQLInputType()
    class NumberEnumInput {
      @Field(type => NumberEnum)
      numberEnumField: NumberEnum;
    }

    @GraphQLInputType()
    class StringEnumInput {
      @Field(type => StringEnum)
      stringEnumField: StringEnum;
    }

    class SampleResolver {
      @Query(returnType => NumberEnum)
      getNumberEnumValue(@Arg("input") input: NumberEnumInput): NumberEnum {
        return NumberEnum.Two;
      }

      @Query(returnType => StringEnum)
      getStringEnumValue(@Arg("input") input: StringEnumInput): StringEnum {
        return StringEnum.Two;
      }

      @Query()
      isNumberEnumEqualOne(
        @Arg("enum", type => NumberEnum)
        numberEnum: NumberEnum,
      ): boolean {
        return numberEnum === NumberEnum.One;
      }

      @Query()
      isStringEnumEqualOne(
        @Arg("enum", type => StringEnum)
        stringEnum: StringEnum,
      ): boolean {
        return stringEnum === StringEnum.One;
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

    it("should generate correct enum output type", async () => {
      const getNumberEnumValueType = getInnerTypeOfNullableType(
        queryType.fields.find(field => field.name === "getNumberEnumValue")!,
      );
      const getStringEnumValue = getInnerTypeOfNullableType(
        queryType.fields.find(field => field.name === "getStringEnumValue")!,
      );

      expect(getNumberEnumValueType.kind).toEqual("ENUM");
      expect(getNumberEnumValueType.name).toEqual("NumberEnum");
      expect(getStringEnumValue.kind).toEqual("ENUM");
      expect(getStringEnumValue.name).toEqual("StringEnum");
    });

    it("should generate correct enum input type", async () => {
      const numberEnumInput = schemaIntrospection.types.find(
        type => type.kind === "INPUT_OBJECT" && type.name === "NumberEnumInput",
      ) as IntrospectionInputObjectType;
      const stringEnumInput = schemaIntrospection.types.find(
        type => type.kind === "INPUT_OBJECT" && type.name === "StringEnumInput",
      ) as IntrospectionInputObjectType;
      const numberEnumInputType = getInnerInputFieldType(numberEnumInput, "numberEnumField");
      const stringEnumInputType = getInnerInputFieldType(stringEnumInput, "stringEnumField");

      expect(numberEnumInputType.kind).toEqual("ENUM");
      expect(numberEnumInputType.name).toEqual("NumberEnum");
      expect(stringEnumInputType.kind).toEqual("ENUM");
      expect(stringEnumInputType.name).toEqual("StringEnum");
    });

    it("should generate correct enum arg type", async () => {
      const numberEnumArgType = getInnerTypeOfNullableType(
        queryType.fields.find(type => type.name === "isNumberEnumEqualOne")!.args[0],
      );
      const stringEnumArgType = getInnerTypeOfNullableType(
        queryType.fields.find(type => type.name === "isStringEnumEqualOne")!.args[0],
      );

      expect(numberEnumArgType.kind).toEqual("ENUM");
      expect(numberEnumArgType.name).toEqual("NumberEnum");
      expect(stringEnumArgType.kind).toEqual("ENUM");
      expect(stringEnumArgType.name).toEqual("StringEnum");
    });

    it("should generate correct enum values for number enum", async () => {
      const numberEnumType = schemaIntrospection.types.find(
        type => type.kind === "ENUM" && type.name === "NumberEnum",
      ) as IntrospectionEnumType;

      expect(numberEnumType.name).toEqual("NumberEnum");
      expect(numberEnumType.kind).toEqual("ENUM");
      expect(numberEnumType.enumValues).toHaveLength(4);
      expect(numberEnumType.enumValues[0].name).toEqual("One");
      expect(numberEnumType.enumValues[1].name).toEqual("Two");
      expect(numberEnumType.enumValues[2].name).toEqual("Three");
      expect(numberEnumType.enumValues[3].name).toEqual("Four");
    });

    it("should generate correct enum values for string enum", async () => {
      const stringEnumType = schemaIntrospection.types.find(
        type => type.kind === "ENUM" && type.name === "StringEnum",
      ) as IntrospectionEnumType;

      expect(stringEnumType.name).toEqual("StringEnum");
      expect(stringEnumType.kind).toEqual("ENUM");
      expect(stringEnumType.description).toEqual("custom string enum");
      expect(stringEnumType.enumValues).toHaveLength(3);
      expect(stringEnumType.enumValues[0].name).toEqual("One");
      expect(stringEnumType.enumValues[1].name).toEqual("Two");
      expect(stringEnumType.enumValues[2].name).toEqual("Three");
    });
  });

  describe("Functional", () => {
    it("should correctly serialize number enum internal value", async () => {
      const query = `query {
        getNumberEnumValue(input: { numberEnumField: One })
      }`;
      const result = await graphql(schema, query);

      expect(result.data!.getNumberEnumValue).toEqual("Two");
    });

    it("should correctly serialize string enum internal value", async () => {
      const query = `query {
        getStringEnumValue(input: { stringEnumField: One })
      }`;
      const result = await graphql(schema, query);

      expect(result.data!.getStringEnumValue).toEqual("Two");
    });

    it("should correctly map number enum to internal value", async () => {
      const query1 = `query {
        isNumberEnumEqualOne(enum: One)
      }`;
      const query2 = `query {
        isNumberEnumEqualOne(enum: Two)
      }`;

      const result1 = await graphql(schema, query1);
      const result2 = await graphql(schema, query2);

      expect(result1.data!.isNumberEnumEqualOne).toEqual(true);
      expect(result2.data!.isNumberEnumEqualOne).toEqual(false);
    });

    it("should correctly map string enum to internal value", async () => {
      const query1 = `query {
        isStringEnumEqualOne(enum: One)
      }`;
      const query2 = `query {
        isStringEnumEqualOne(enum: Two)
      }`;

      const result1 = await graphql(schema, query1);
      const result2 = await graphql(schema, query2);

      expect(result1.data!.isStringEnumEqualOne).toEqual(true);
      expect(result2.data!.isStringEnumEqualOne).toEqual(false);
    });
  });
});
