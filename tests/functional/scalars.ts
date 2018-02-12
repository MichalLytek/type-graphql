import "reflect-metadata";
import {
  graphql,
  introspectionQuery,
  IntrospectionSchema,
  IntrospectionObjectType,
  IntrospectionInputObjectType,
  IntrospectionField,
  GraphQLID,
  IntrospectionNamedTypeRef,
  IntrospectionNonNullTypeRef,
  GraphQLScalarType,
  GraphQLSchema,
} from "graphql";

import {
  GraphQLObjectType,
  GraphQLArgumentType,
  GraphQLInputType,
  GraphQLResolver,
  Field,
  Query,
  Mutation,
  Arg,
  Args,
  buildSchema,
  ID,
  Float,
  Int,
  GraphQLISODateScalar,
  GraphQLTimestampScalar,
} from "../../src";
import { getSchemaInfo } from "../helpers/getSchemaInfo";

describe("Scalars", () => {
  let schemaIntrospection: IntrospectionSchema;
  let sampleObject: IntrospectionObjectType;
  let schema: GraphQLSchema;

  let argScalar: string | undefined;
  let argDate: Date | undefined;
  beforeEach(() => {
    argScalar = undefined;
    argDate = undefined;
  });

  beforeAll(async () => {
    // create sample definitions

    const CustomScalar = new GraphQLScalarType({
      name: "Custom",
      parseLiteral: () => "TypeGraphQL parseLiteral",
      parseValue: () => "TypeGraphQL parseValue",
      serialize: () => "TypeGraphQL serialize",
    });

    @GraphQLObjectType()
    class SampleObject {
      @Field(type => ID)
      idField: any;

      @Field() implicitFloatField: number;

      @Field(type => Float)
      explicitFloatField: any;

      @Field(type => Int)
      intField: any;

      @Field() implicitStringField: string;

      @Field(type => String)
      explicitStringField: any;

      @Field() implicitBooleanField: boolean;

      @Field(type => Boolean)
      explicitBooleanField: any;

      // @Field()
      // implicitDateField: Date;

      @Field(type => Date)
      explicitDateField: any;

      @Field(type => GraphQLISODateScalar)
      ISODateField: any;

      @Field(type => GraphQLTimestampScalar)
      timestampField: any;

      @Field(type => CustomScalar)
      customScalarField: any;
    }

    @GraphQLResolver(() => SampleObject)
    class SampleResolver {
      @Query()
      mainQuery(): SampleObject {
        return {} as any;
      }

      @Query(returnType => CustomScalar)
      returnScalar(): string {
        return "returnScalar";
      }

      @Query(returnType => Boolean)
      argScalar(
        @Arg("scalar", type => CustomScalar)
        scalar: any,
      ): any {
        argScalar = scalar;
        return true;
      }

      @Query(returnType => Date)
      returnDate(): any {
        return new Date();
      }

      @Query()
      argDate(
        @Arg("date", type => Date)
        date: any,
      ): boolean {
        argDate = date;
        return true;
      }
    }

    // get builded schema info from retrospection
    const schemaInfo = await getSchemaInfo({
      resolvers: [SampleResolver],
    });

    schema = schemaInfo.schema;
    schemaIntrospection = schemaInfo.schemaIntrospection;
    sampleObject = schemaIntrospection.types.find(
      field => field.name === "SampleObject",
    ) as IntrospectionObjectType;
  });

  describe("Schema", () => {
    function getSampleObjectFieldType(name: string) {
      const field = sampleObject.fields.find(it => it.name === name)!;
      const fieldType = (field.type as IntrospectionNonNullTypeRef)
        .ofType as IntrospectionNamedTypeRef;
      return fieldType;
    }

    it("should generate ID scalar field type", async () => {
      const idFieldType = getSampleObjectFieldType("idField");

      expect(idFieldType.kind).toEqual("SCALAR");
      expect(idFieldType.name).toEqual("ID");
    });

    it("should generate Float scalar field type", async () => {
      const explicitFloatFieldType = getSampleObjectFieldType("explicitFloatField");

      expect(explicitFloatFieldType.kind).toEqual("SCALAR");
      expect(explicitFloatFieldType.name).toEqual("Float");
    });

    it("should generate Float scalar field type when prop type is number", async () => {
      const implicitFloatFieldType = getSampleObjectFieldType("implicitFloatField");

      expect(implicitFloatFieldType.kind).toEqual("SCALAR");
      expect(implicitFloatFieldType.name).toEqual("Float");
    });

    it("should generate Int scalar field type", async () => {
      const intFieldType = getSampleObjectFieldType("intField");

      expect(intFieldType.kind).toEqual("SCALAR");
      expect(intFieldType.name).toEqual("Int");
    });

    it("should generate String scalar field type", async () => {
      const explicitStringFieldType = getSampleObjectFieldType("explicitStringField");

      expect(explicitStringFieldType.kind).toEqual("SCALAR");
      expect(explicitStringFieldType.name).toEqual("String");
    });

    it("should generate String scalar field type when prop type is string", async () => {
      const implicitStringFieldType = getSampleObjectFieldType("implicitStringField");

      expect(implicitStringFieldType.kind).toEqual("SCALAR");
      expect(implicitStringFieldType.name).toEqual("String");
    });

    it("should generate Date scalar field type", async () => {
      const explicitDateFieldType = getSampleObjectFieldType("explicitDateField");

      expect(explicitDateFieldType.kind).toEqual("SCALAR");
      expect(explicitDateFieldType.name).toEqual("Date");
    });

    // TODO: uncomment after ts-jest fix

    // it("should generate Date scalar field type when prop type is Date", async () => {
    //   const implicitStringFieldType = getSampleObjectFieldType("implicitDateField");

    //   expect(implicitStringFieldType.kind).toEqual("SCALAR");
    //   expect(implicitStringFieldType.name).toEqual("Date");
    // });

    it("should generate ISODate scalar field type", async () => {
      const ISODateFieldType = getSampleObjectFieldType("ISODateField");

      expect(ISODateFieldType.kind).toEqual("SCALAR");
      expect(ISODateFieldType.name).toEqual("Date");
    });

    it("should generate Timestamp scalar field type", async () => {
      const timestampFieldType = getSampleObjectFieldType("timestampField");

      expect(timestampFieldType.kind).toEqual("SCALAR");
      expect(timestampFieldType.name).toEqual("Timestamp");
    });

    it("should generate custom scalar field type", async () => {
      const customScalarFieldType = getSampleObjectFieldType("customScalarField");

      expect(customScalarFieldType.kind).toEqual("SCALAR");
      expect(customScalarFieldType.name).toEqual("Custom");
    });
  });

  describe("Custom scalar", () => {
    it("should properly serialize data", async () => {
      const query = `query {
        returnScalar
      }`;
      const result = await graphql(schema, query);
      const returnScalar = result.data!.returnScalar;

      expect(returnScalar).toEqual("TypeGraphQL serialize");
    });

    it("should properly parse args", async () => {
      const query = `query {
        argScalar(scalar: "test")
      }`;
      await graphql(schema, query);

      expect(argScalar!).toEqual("TypeGraphQL parseLiteral");
    });
  });

  describe("Bulit-in date", () => {
    it("should properly serialize date", async () => {
      const query = `query {
        returnDate
      }`;
      const beforeQuery = Date.now();
      const result = await graphql(schema, query);
      const afterQuery = Date.now();
      const returnDate = Date.parse(result.data!.returnDate);

      expect(returnDate).toBeLessThanOrEqual(afterQuery);
      expect(returnDate).toBeGreaterThanOrEqual(beforeQuery);
    });

    it("should properly parse date", async () => {
      const now = new Date();
      const query = `query {
        argDate(date: "${now.toISOString()}")
      }`;
      await graphql(schema, query);

      expect(now.getTime()).toEqual(argDate!.getTime());
    });
  });
});

// TODO: test suite for scalarMap and dateScalarMode
