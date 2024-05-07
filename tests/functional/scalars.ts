import "reflect-metadata";
import {
  type GraphQLSchema,
  type IntrospectionNamedTypeRef,
  type IntrospectionNonNullTypeRef,
  type IntrospectionObjectType,
  type IntrospectionSchema,
  TypeKind,
  graphql,
} from "graphql";
import {
  Arg,
  Field,
  Float,
  GraphQLISODateTime,
  GraphQLTimestamp,
  ID,
  Int,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { getMetadataStorage } from "@/metadata/getMetadataStorage";
import { CustomScalar, CustomType, ObjectScalar } from "../helpers/customScalar";
import { getSampleObjectFieldType } from "../helpers/getSampleObjectFieldType";
import { getSchemaInfo } from "../helpers/getSchemaInfo";

describe("Scalars", () => {
  let schemaIntrospection: IntrospectionSchema;
  let sampleObject: IntrospectionObjectType;
  let schema: GraphQLSchema;
  let argScalar: string | undefined;

  beforeEach(() => {
    argScalar = undefined;
  });

  beforeAll(async () => {
    // create sample definitions

    @ObjectType()
    class SampleObject {
      @Field(() => ID)
      idField: any;

      @Field()
      implicitFloatField!: number;

      @Field(() => Float)
      explicitFloatField: any;

      @Field(() => Int)
      intField: any;

      @Field()
      implicitStringField!: string;

      @Field(() => String)
      explicitStringField: any;

      @Field()
      implicitBooleanField!: boolean;

      @Field(() => Boolean)
      explicitBooleanField: any;

      @Field()
      implicitDateField!: Date;

      @Field(() => Date)
      explicitDateField: any;

      @Field(() => GraphQLISODateTime)
      ISODateField: any;

      @Field(() => GraphQLTimestamp)
      timestampField: any;

      @Field(() => CustomScalar)
      customScalarField: any;
    }

    @Resolver(() => SampleObject)
    class SampleResolver {
      @Query()
      mainQuery(): SampleObject {
        return {} as any;
      }

      @Query(() => CustomScalar)
      returnScalar(): string {
        return "returnScalar";
      }

      @Query(() => Boolean)
      argScalar(@Arg("scalar", () => CustomScalar) scalar: any): any {
        argScalar = scalar;
        return true;
      }

      @Query(() => Boolean)
      objectArgScalar(@Arg("scalar", () => ObjectScalar) scalar: any): any {
        argScalar = scalar;
        return true;
      }

      @Query(() => Date)
      returnDate(): any {
        return new Date();
      }

      @Query()
      argDate(@Arg("date", () => Date) _date: any): boolean {
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
    function getFieldType(name: string) {
      const field = sampleObject.fields.find(it => it.name === name)!;
      const fieldType = (field.type as IntrospectionNonNullTypeRef)
        .ofType as IntrospectionNamedTypeRef;
      return fieldType;
    }

    it("should generate ID scalar field type", async () => {
      const idFieldType = getFieldType("idField");

      expect(idFieldType.kind).toEqual(TypeKind.SCALAR);
      expect(idFieldType.name).toEqual("ID");
    });

    it("should generate Float scalar field type", async () => {
      const explicitFloatFieldType = getFieldType("explicitFloatField");

      expect(explicitFloatFieldType.kind).toEqual(TypeKind.SCALAR);
      expect(explicitFloatFieldType.name).toEqual("Float");
    });

    it("should generate Float scalar field type when prop type is number", async () => {
      const implicitFloatFieldType = getFieldType("implicitFloatField");

      expect(implicitFloatFieldType.kind).toEqual(TypeKind.SCALAR);
      expect(implicitFloatFieldType.name).toEqual("Float");
    });

    it("should generate Int scalar field type", async () => {
      const intFieldType = getFieldType("intField");

      expect(intFieldType.kind).toEqual(TypeKind.SCALAR);
      expect(intFieldType.name).toEqual("Int");
    });

    it("should generate String scalar field type", async () => {
      const explicitStringFieldType = getFieldType("explicitStringField");

      expect(explicitStringFieldType.kind).toEqual(TypeKind.SCALAR);
      expect(explicitStringFieldType.name).toEqual("String");
    });

    it("should generate String scalar field type when prop type is string", async () => {
      const implicitStringFieldType = getFieldType("implicitStringField");

      expect(implicitStringFieldType.kind).toEqual(TypeKind.SCALAR);
      expect(implicitStringFieldType.name).toEqual("String");
    });

    it("should generate Date scalar field type", async () => {
      const explicitDateFieldType = getFieldType("explicitDateField");

      expect(explicitDateFieldType.kind).toEqual(TypeKind.SCALAR);
      expect(explicitDateFieldType.name).toEqual("DateTimeISO");
    });

    it("should generate Date scalar field type when prop type is Date", async () => {
      const implicitStringFieldType = getFieldType("implicitDateField");

      expect(implicitStringFieldType.kind).toEqual(TypeKind.SCALAR);
      expect(implicitStringFieldType.name).toEqual("DateTimeISO");
    });

    it("should generate ISODate scalar field type", async () => {
      const ISODateFieldType = getFieldType("ISODateField");

      expect(ISODateFieldType.kind).toEqual(TypeKind.SCALAR);
      expect(ISODateFieldType.name).toEqual("DateTimeISO");
    });

    it("should generate Timestamp scalar field type", async () => {
      const timestampFieldType = getFieldType("timestampField");

      expect(timestampFieldType.kind).toEqual(TypeKind.SCALAR);
      expect(timestampFieldType.name).toEqual("Timestamp");
    });

    it("should generate custom scalar field type", async () => {
      const customScalarFieldType = getFieldType("customScalarField");

      expect(customScalarFieldType.kind).toEqual(TypeKind.SCALAR);
      expect(customScalarFieldType.name).toEqual("Custom");
    });
  });

  describe("Custom scalar", () => {
    it("should properly serialize data", async () => {
      const query = `query {
        returnScalar
      }`;
      const result: any = await graphql({ schema, source: query });
      const { returnScalar } = result.data!;

      expect(returnScalar).toEqual("TypeGraphQL serialize");
    });

    it("should properly parse args", async () => {
      const query = `query {
        argScalar(scalar: "test")
      }`;
      await graphql({ schema, source: query });

      expect(argScalar!).toEqual("TypeGraphQL parseLiteral");
    });

    it("should properly parse scalar object", async () => {
      const query = `query {
        objectArgScalar(scalar: "test")
      }`;
      await graphql({ schema, source: query });

      expect(argScalar!).toEqual({ value: "TypeGraphQL parseLiteral" });
    });
  });

  describe("Settings", () => {
    let sampleResolver: any;

    beforeAll(() => {
      getMetadataStorage().clear();

      @ObjectType()
      class SampleObject {
        @Field(() => Date)
        dateField: any;
      }

      @Resolver(() => SampleObject)
      class SampleResolver {
        @Query()
        mainQuery(): SampleObject {
          return {} as any;
        }
      }
      sampleResolver = SampleResolver;
    });

    it("should generate iso date scalar field type by default", async () => {
      const schemaInfo = await getSchemaInfo({
        resolvers: [sampleResolver],
      });
      const dateFieldType = getSampleObjectFieldType(schemaInfo.schemaIntrospection)("dateField");

      expect(dateFieldType.kind).toEqual(TypeKind.SCALAR);
      expect(dateFieldType.name).toEqual("DateTimeISO");
    });

    it("should generate DateTime scalar field type when scalarsMap is using GraphQLISODateTime", async () => {
      const schemaInfo = await getSchemaInfo({
        resolvers: [sampleResolver],
        scalarsMap: [{ type: Date, scalar: GraphQLISODateTime }],
      });
      const dateFieldType = getSampleObjectFieldType(schemaInfo.schemaIntrospection)("dateField");

      expect(dateFieldType.kind).toEqual(TypeKind.SCALAR);
      expect(dateFieldType.name).toEqual("DateTimeISO");
    });

    it("should generate Timestamp scalar field type when scalarsMap is using GraphQLTimestamp", async () => {
      const schemaInfo = await getSchemaInfo({
        resolvers: [sampleResolver],
        scalarsMap: [{ type: Date, scalar: GraphQLTimestamp }],
      });
      const dateFieldType = getSampleObjectFieldType(schemaInfo.schemaIntrospection)("dateField");

      expect(dateFieldType.kind).toEqual(TypeKind.SCALAR);
      expect(dateFieldType.name).toEqual("Timestamp");
    });

    it("should generate custom scalar field type when defined in scalarMap", async () => {
      getMetadataStorage().clear();

      @ObjectType()
      class SampleObject {
        @Field()
        customField!: CustomType;
      }

      @Resolver(() => SampleObject)
      class SampleResolver {
        @Query()
        mainQuery(): SampleObject {
          return {} as any;
        }
      }

      const schemaInfo = await getSchemaInfo({
        resolvers: [SampleResolver],
        scalarsMap: [{ type: CustomType, scalar: CustomScalar }],
      });
      const dateFieldType = getSampleObjectFieldType(schemaInfo.schemaIntrospection)("customField");

      expect(dateFieldType.kind).toEqual(TypeKind.SCALAR);
      expect(dateFieldType.name).toEqual("Custom");
    });

    it("should generate custom scalar field type when overwriteDate in scalarMap", async () => {
      getMetadataStorage().clear();

      @ObjectType()
      class SampleObject {
        @Field(() => Date)
        dateField: any;
      }

      @Resolver(() => SampleObject)
      class SampleResolver {
        @Query()
        mainQuery(): SampleObject {
          return {} as any;
        }
      }

      const schemaInfo = await getSchemaInfo({
        resolvers: [SampleResolver],
        scalarsMap: [{ type: Date, scalar: CustomScalar }],
      });
      const dateFieldType = getSampleObjectFieldType(schemaInfo.schemaIntrospection)("dateField");

      expect(dateFieldType.kind).toEqual(TypeKind.SCALAR);
      expect(dateFieldType.name).toEqual("Custom");
    });
  });
});
