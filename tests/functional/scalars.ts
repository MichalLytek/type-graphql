import "reflect-metadata";
import {
  GraphQLSchema,
  IntrospectionNamedTypeRef,
  IntrospectionNonNullTypeRef,
  IntrospectionObjectType,
  IntrospectionSchema,
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
  InputType,
  Int,
  ObjectType,
  Query,
  Resolver,
  buildSchema,
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let argDate: Date | undefined;

  beforeEach(() => {
    argScalar = undefined;
    argDate = undefined;
  });

  beforeAll(async () => {
    // create sample definitions

    @ObjectType()
    class SampleObject {
      @Field(() => ID)
      idField: any;

      @Field()
      implicitFloatField: number;

      @Field(() => Float)
      explicitFloatField: any;

      @Field(() => Int)
      intField: any;

      @Field()
      implicitStringField: string;

      @Field(() => String)
      explicitStringField: any;

      @Field()
      implicitBooleanField: boolean;

      @Field(() => Boolean)
      explicitBooleanField: any;

      @Field()
      implicitDateField: Date;

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
      argDate(@Arg("date", () => Date) date: any): boolean {
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
      expect(explicitDateFieldType.name).toEqual("DateTime");
    });

    it("should generate Date scalar field type when prop type is Date", async () => {
      const implicitStringFieldType = getFieldType("implicitDateField");

      expect(implicitStringFieldType.kind).toEqual(TypeKind.SCALAR);
      expect(implicitStringFieldType.name).toEqual("DateTime");
    });

    it("should generate ISODate scalar field type", async () => {
      const ISODateFieldType = getFieldType("ISODateField");

      expect(ISODateFieldType.kind).toEqual(TypeKind.SCALAR);
      expect(ISODateFieldType.name).toEqual("DateTime");
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

  describe("Built-in scalars", () => {
    let sampleResolver: any;
    let localArgDate: Date | undefined;

    beforeAll(async () => {
      getMetadataStorage().clear();

      @InputType()
      class DateInput {
        @Field(() => Date)
        date: any;

        @Field(() => Date, { nullable: true })
        nullableDate?: any;
      }

      @Resolver()
      class SampleResolver {
        @Query(() => Date)
        returnDate(): any {
          return new Date();
        }

        @Query(() => Date, { nullable: true })
        nullableReturnDate(): Date | null {
          return null;
        }

        @Query(() => Date)
        returnStringAsDate(): any {
          return new Date().toISOString();
        }

        @Query()
        argDate(@Arg("date", () => Date) date: any): boolean {
          localArgDate = date;
          return true;
        }

        @Query()
        nullableArgDate(
          @Arg("date", () => Date, { nullable: true })
          date: any,
        ): boolean {
          localArgDate = date;
          return true;
        }

        @Query()
        inputDate(@Arg("input", () => DateInput) dateInput: any): boolean {
          localArgDate = dateInput.date;
          return true;
        }
      }

      sampleResolver = SampleResolver;
    });

    beforeEach(() => {
      argDate = undefined;
    });

    describe("GraphQLISODate", () => {
      let localSchema: GraphQLSchema;

      beforeAll(async () => {
        localSchema = await buildSchema({
          resolvers: [sampleResolver],
          dateScalarMode: "isoDate",
          validate: false,
        });
      });

      it("should properly serialize date", async () => {
        const query = `query {
          returnDate
        }`;
        const beforeQuery = Date.now();
        const result: any = await graphql({ schema: localSchema, source: query });
        const afterQuery = Date.now();
        const returnDate = Date.parse(result.data!.returnDate);

        expect(returnDate).toBeLessThanOrEqual(afterQuery);
        expect(returnDate).toBeGreaterThanOrEqual(beforeQuery);
      });

      it("should not fail while serializing null", async () => {
        const query = `query {
          nullableReturnDate
        }`;

        const result: any = await graphql({ schema: localSchema, source: query });

        expect(result.errors).toBeUndefined();
        expect(result.data!.nullableReturnDate).toBeNull();
      });

      it("should throw error when unable to serialize value as date", async () => {
        const query = `query {
          returnStringAsDate
        }`;

        const { errors } = await graphql({ schema: localSchema, source: query });

        expect(errors).toHaveLength(1);
        expect(errors![0].message).toContain(`Unable to serialize value`);
        expect(errors![0].message).toContain(`it's not an instance of 'Date'`);
      });

      it("should properly parse date from arg", async () => {
        const now = new Date();
        const query = `query {
          argDate(date: "${now.toISOString()}")
        }`;
        await graphql({ schema: localSchema, source: query });

        expect(now.getTime()).toEqual(localArgDate!.getTime());
      });

      it("should fail while providing wrong value type as date arg", async () => {
        const query = `query {
          argDate(date: true)
        }`;

        const { errors } = await graphql({ schema: localSchema, source: query });

        expect(errors).toHaveLength(1);
        expect(errors![0].message).toMatchInlineSnapshot(
          `"Expected value of type "DateTime!", found true; Unable to parse literal value of kind 'BooleanValue' as GraphQLISODateTime scalar supports only 'StringValue' ones"`,
        );
      });

      it("should not fail while parsing null date arg", async () => {
        const query = `query {
          nullableArgDate(date: null)
        }`;

        await graphql({ schema: localSchema, source: query });

        expect(localArgDate).toBeNull();
      });

      it("should properly parse date from input", async () => {
        const now = new Date();
        const query = `query {
          inputDate(input: { date: "${now.toISOString()}" })
        }`;
        await graphql({ schema: localSchema, source: query });

        expect(now.getTime()).toEqual(localArgDate!.getTime());
      });

      it("should fail while providing wrong value type as date input", async () => {
        const query = `query {
          inputDate(input: { date: true })
        }`;

        const { errors } = await graphql({ schema: localSchema, source: query });

        expect(errors).toHaveLength(1);
        expect(errors![0].message).toMatchInlineSnapshot(
          `"Expected value of type "DateTime!", found true; Unable to parse literal value of kind 'BooleanValue' as GraphQLISODateTime scalar supports only 'StringValue' ones"`,
        );
      });

      it("should not fail while parsing null from date input", async () => {
        const now = new Date();
        const query = `query {
          inputDate(input: { date: "${now.toISOString()}", nullableDate: null })
        }`;

        const result: any = await graphql({ schema: localSchema, source: query });

        expect(result.errors).toBeUndefined();
      });

      it("should properly parse date from variable", async () => {
        const now = new Date();
        const query = `query DateQuery($date: DateTime!) {
          inputDate(input: {date: $date})
        }`;
        await graphql({
          schema: localSchema,
          source: query,
          variableValues: {
            date: now.toISOString(),
          },
        });

        expect(now.getTime()).toEqual(localArgDate!.getTime());
      });

      it("should fail while providing wrong value type for as date variable", async () => {
        const query = `query DateQuery($date: DateTime!) {
          inputDate(input: {date: $date})
        }`;

        const { errors } = await graphql({
          schema: localSchema,
          source: query,
          variableValues: {
            date: true,
          },
        });

        expect(errors).toHaveLength(1);
        expect(errors![0].message).toMatchInlineSnapshot(
          `"Variable "$date" got invalid value true; Expected type "DateTime". Unable to parse value 'true' as GraphQLISODateTime scalar supports only string values"`,
        );
      });

      it("should not fail while parsing null from date variable", async () => {
        const now = new Date();
        const query = `query DateQuery($date: DateTime!, $nullableDate: DateTime) {
          inputDate(input: {date: $date, nullableDate: $nullableDate})
        }`;

        const result: any = await graphql({
          schema: localSchema,
          source: query,
          variableValues: {
            date: now.toISOString(),
            nullableDate: null,
          },
        });

        expect(result.errors).toBeUndefined();
      });
    });

    describe("GraphQLTimestamp", () => {
      let localSchema: GraphQLSchema;

      beforeAll(async () => {
        localSchema = await buildSchema({
          resolvers: [sampleResolver],
          dateScalarMode: "timestamp",
          validate: false,
        });
      });

      it("should properly serialize date", async () => {
        const query = `query {
          returnDate
        }`;
        const beforeQuery = Date.now();
        const result: any = await graphql({ schema: localSchema, source: query });
        const afterQuery = Date.now();
        const { returnDate } = result.data!;

        expect(returnDate).toBeLessThanOrEqual(afterQuery);
        expect(returnDate).toBeGreaterThanOrEqual(beforeQuery);
      });

      it("should not fail while serializing null", async () => {
        const query = `query {
          nullableReturnDate
        }`;

        const result: any = await graphql({ schema: localSchema, source: query });

        expect(result.errors).toBeUndefined();
        expect(result.data!.nullableReturnDate).toBeNull();
      });

      it("should throw error when unable to serialize value as date", async () => {
        const query = `query {
          returnStringAsDate
        }`;

        const { errors } = await graphql({ schema: localSchema, source: query });

        expect(errors).toHaveLength(1);
        expect(errors![0].message).toContain(`Unable to serialize value`);
        expect(errors![0].message).toContain(`it's not an instance of 'Date'`);
      });

      it("should properly parse date from arg", async () => {
        const now = new Date();
        const query = `query {
          argDate(date: ${now.getTime()})
        }`;
        await graphql({ schema: localSchema, source: query });

        expect(now.getTime()).toEqual(localArgDate!.getTime());
      });

      it("should fail while providing wrong value type as date arg", async () => {
        const query = `query {
          argDate(date: true)
        }`;

        const { errors } = await graphql({ schema: localSchema, source: query });

        expect(errors).toHaveLength(1);
        expect(errors![0].message).toMatchInlineSnapshot(
          `"Expected value of type "Timestamp!", found true; Unable to parse literal value of kind 'BooleanValue' as GraphQLTimestamp scalar supports only 'IntValue' ones"`,
        );
      });

      it("should not fail while parsing null date arg", async () => {
        const query = `query {
          nullableArgDate(date: null)
        }`;

        await graphql({ schema: localSchema, source: query });

        expect(localArgDate).toBeNull();
      });

      it("should properly parse date from input", async () => {
        const now = new Date();
        const query = `query {
          inputDate(input: {date: ${now.getTime()}})
        }`;
        await graphql({ schema: localSchema, source: query });

        expect(now.getTime()).toEqual(localArgDate!.getTime());
      });

      it("should fail while providing wrong value type as date input", async () => {
        const query = `query {
          inputDate(input: { date: true })
        }`;

        const { errors } = await graphql({ schema: localSchema, source: query });

        expect(errors).toHaveLength(1);
        expect(errors![0].message).toMatchInlineSnapshot(
          `"Expected value of type "Timestamp!", found true; Unable to parse literal value of kind 'BooleanValue' as GraphQLTimestamp scalar supports only 'IntValue' ones"`,
        );
      });

      it("should not fail while parsing null from date input", async () => {
        const now = new Date();
        const query = `query {
          inputDate(input: { date: ${now.getTime()}, nullableDate: null })
        }`;

        const result: any = await graphql({ schema: localSchema, source: query });

        expect(result.errors).toBeUndefined();
      });

      it("should properly parse date from variable", async () => {
        const now = new Date();
        const query = `query DateQuery($date: Timestamp!) {
          inputDate(input: {date: $date})
        }`;
        await graphql({
          schema: localSchema,
          source: query,
          variableValues: {
            date: now.getTime(),
          },
        });

        expect(now.getTime()).toEqual(localArgDate!.getTime());
      });

      it("should fail while providing wrong value type for as date variable", async () => {
        const query = `query DateQuery($date: Timestamp!) {
          inputDate(input: {date: $date})
        }`;

        const { errors } = await graphql({
          schema: localSchema,
          source: query,
          variableValues: {
            date: true,
          },
        });

        expect(errors).toHaveLength(1);
        expect(errors![0].message).toMatchInlineSnapshot(
          `"Variable "$date" got invalid value true; Expected type "Timestamp". Unable to parse value 'true' as GraphQLTimestamp scalar supports only number values"`,
        );
      });

      it("should not fail while parsing null from date variable", async () => {
        const now = new Date();
        const query = `query DateQuery($date: Timestamp!, $nullableDate: Timestamp) {
          inputDate(input: {date: $date, nullableDate: $nullableDate})
        }`;

        const result: any = await graphql({
          schema: localSchema,
          source: query,
          variableValues: {
            date: now.getTime(),
            nullableDate: null,
          },
        });

        expect(result.errors).toBeUndefined();
      });
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
      expect(dateFieldType.name).toEqual("DateTime");
    });

    it("should generate date scalar field type when dateScalarMode is isoDate", async () => {
      const schemaInfo = await getSchemaInfo({
        resolvers: [sampleResolver],
        dateScalarMode: "isoDate",
      });
      const dateFieldType = getSampleObjectFieldType(schemaInfo.schemaIntrospection)("dateField");

      expect(dateFieldType.kind).toEqual(TypeKind.SCALAR);
      expect(dateFieldType.name).toEqual("DateTime");
    });

    it("should generate timestamp scalar field type when dateScalarMode is timestamp", async () => {
      const schemaInfo = await getSchemaInfo({
        resolvers: [sampleResolver],
        dateScalarMode: "timestamp",
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
        customField: CustomType;
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
