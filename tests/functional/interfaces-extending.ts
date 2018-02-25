import "reflect-metadata";
import {
  IntrospectionSchema,
  IntrospectionInterfaceType,
  IntrospectionObjectType,
  IntrospectionNonNullTypeRef,
  IntrospectionNamedTypeRef,
  IntrospectionInputObjectType,
} from "graphql";

import { getSchemaInfo } from "../helpers/getSchemaInfo";
import { getTypeField } from "../helpers/getTypeField";
import { getInnerFieldType } from "../helpers/getInnerFieldType";
import {
  GraphQLInterfaceType,
  GraphQLObjectType,
  Field,
  ID,
  Query,
  GraphQLArgumentType,
  Args,
  GraphQLInputType,
  Arg,
  Mutation,
} from "../../src";

describe("Intefaces and extending classes", () => {
  describe("Schema", () => {
    let schemaIntrospection: IntrospectionSchema;
    let queryType: IntrospectionObjectType;
    let sampleInterface1Type: IntrospectionInterfaceType;
    let sampleInterface2Type: IntrospectionInterfaceType;
    let sampleMultiImplementingObjectType: IntrospectionObjectType;
    let sampleExtendingImplementingObjectType: IntrospectionObjectType;
    let sampleImplementingObject1Type: IntrospectionObjectType;
    let sampleImplementingObject2Type: IntrospectionObjectType;
    let sampleExtendingObject2Type: IntrospectionObjectType;

    beforeAll(async () => {
      @GraphQLInterfaceType()
      abstract class SampleInterface1 {
        @Field(type => ID)
        id: string;

        @Field() interfaceStringField1: string;
      }

      @GraphQLInterfaceType()
      abstract class SampleInterface2 {
        @Field(type => ID)
        id: string;

        @Field() interfaceStringField2: string;
      }

      @GraphQLObjectType({ implements: SampleInterface1 })
      class SampleImplementingObject1 implements SampleInterface1 {
        id: string;
        interfaceStringField1: string;

        @Field() ownField1: number;
      }

      @GraphQLObjectType({ implements: SampleInterface1 })
      class SampleImplementingObject2 implements SampleInterface1 {
        @Field(type => ID)
        id: string;

        @Field() interfaceStringField1: string;

        @Field() ownField2: number;
      }

      @GraphQLObjectType({ implements: [SampleInterface1, SampleInterface2] })
      class SampleMultiImplementingObject implements SampleInterface1, SampleInterface2 {
        id: string;
        interfaceStringField1: string;
        interfaceStringField2: string;

        @Field() ownField3: number;
      }

      @GraphQLObjectType({ implements: SampleInterface1 })
      class SampleExtendingImplementingObject extends SampleImplementingObject2
        implements SampleInterface1 {
        @Field() ownField4: number;
      }

      @GraphQLObjectType()
      class SampleExtendingObject2 extends SampleImplementingObject2 {
        @Field() ownExtendingField2: number;
      }

      @GraphQLArgumentType()
      class SampleBaseArgs {
        @Field() baseArgField: string;
      }

      @GraphQLArgumentType()
      class SampleExtendingArgs extends SampleBaseArgs {
        @Field() extendingArgField: boolean;
      }

      @GraphQLInputType()
      class SampleBaseInput {
        @Field() baseInputField: string;
      }

      @GraphQLInputType()
      class SampleExtendingInput extends SampleBaseInput {
        @Field() extendingInputField: boolean;
      }

      class SampleResolver {
        @Query()
        sampleQuery(): boolean {
          return true;
        }

        @Query()
        queryWithArgs(@Args() args: SampleExtendingArgs): boolean {
          return true;
        }

        @Mutation()
        mutationWithInput(@Arg("input") input: SampleExtendingInput): boolean {
          return true;
        }
      }

      // get builded schema info from retrospection
      const schemaInfo = await getSchemaInfo({
        resolvers: [SampleResolver],
      });
      queryType = schemaInfo.queryType;
      schemaIntrospection = schemaInfo.schemaIntrospection;
      sampleInterface1Type = schemaIntrospection.types.find(
        type => type.name === "SampleInterface1",
      ) as IntrospectionInterfaceType;
      sampleInterface2Type = schemaIntrospection.types.find(
        type => type.name === "SampleInterface2",
      ) as IntrospectionInterfaceType;
      sampleImplementingObject1Type = schemaIntrospection.types.find(
        type => type.name === "SampleImplementingObject1",
      ) as IntrospectionObjectType;
      sampleImplementingObject2Type = schemaIntrospection.types.find(
        type => type.name === "SampleImplementingObject2",
      ) as IntrospectionObjectType;
      sampleExtendingImplementingObjectType = schemaIntrospection.types.find(
        type => type.name === "SampleExtendingImplementingObject",
      ) as IntrospectionObjectType;
      sampleMultiImplementingObjectType = schemaIntrospection.types.find(
        type => type.name === "SampleMultiImplementingObject",
      ) as IntrospectionObjectType;
      sampleExtendingObject2Type = schemaIntrospection.types.find(
        type => type.name === "SampleExtendingObject2",
      ) as IntrospectionObjectType;
    });

    // helpers
    function getInnerType(fieldType: any) {
      return (fieldType.type as IntrospectionNonNullTypeRef).ofType! as IntrospectionNamedTypeRef;
    }

    it("should generate schema without errors", async () => {
      expect(schemaIntrospection).toBeDefined();
    });

    it("should generate interface type correctly", async () => {
      expect(sampleInterface1Type).toBeDefined();
      expect(sampleInterface1Type.kind).toEqual("INTERFACE");
      expect(sampleInterface1Type.fields).toHaveLength(2);

      const idFieldType = getInnerFieldType(sampleInterface1Type, "id");
      const interfaceStringField = getInnerFieldType(sampleInterface1Type, "interfaceStringField1");

      expect(idFieldType.name).toEqual("ID");
      expect(interfaceStringField.name).toEqual("String");
    });

    it("should generate object type explicitly implementing interface correctly", async () => {
      expect(sampleImplementingObject2Type).toBeDefined();
      expect(sampleImplementingObject2Type.fields).toHaveLength(3);

      const idFieldType = getInnerFieldType(sampleImplementingObject2Type, "id");
      const interfaceStringField = getInnerFieldType(
        sampleImplementingObject2Type,
        "interfaceStringField1",
      );
      const ownField2 = getInnerFieldType(sampleImplementingObject2Type, "ownField2");
      const implementedInterfaceInfo = sampleImplementingObject2Type.interfaces.find(
        it => it.name === "SampleInterface1",
      )!;

      expect(idFieldType.name).toEqual("ID");
      expect(interfaceStringField.name).toEqual("String");
      expect(ownField2.name).toEqual("Float");
      expect(implementedInterfaceInfo.kind).toEqual("INTERFACE");
    });

    it("should generate object type implicitly implementing interface correctly", async () => {
      expect(sampleImplementingObject1Type).toBeDefined();
      expect(sampleImplementingObject1Type.fields).toHaveLength(3);

      const idFieldType = getInnerFieldType(sampleImplementingObject1Type, "id");
      const interfaceStringField1 = getInnerFieldType(
        sampleImplementingObject1Type,
        "interfaceStringField1",
      );
      const ownField1 = getInnerFieldType(sampleImplementingObject1Type, "ownField1");
      const implementedInterfaceInfo = sampleImplementingObject2Type.interfaces.find(
        it => it.name === "SampleInterface1",
      )!;

      expect(idFieldType.name).toEqual("ID");
      expect(interfaceStringField1.name).toEqual("String");
      expect(ownField1.name).toEqual("Float");
      expect(implementedInterfaceInfo.kind).toEqual("INTERFACE");
    });

    it("should generate object type extending other object type correctly", async () => {
      expect(sampleExtendingObject2Type).toBeDefined();
      expect(sampleExtendingObject2Type.fields).toHaveLength(4);

      const idFieldType = getInnerFieldType(sampleExtendingObject2Type, "id");
      const interfaceStringField1 = getInnerFieldType(
        sampleExtendingObject2Type,
        "interfaceStringField1",
      );
      const ownField2 = getInnerFieldType(sampleExtendingObject2Type, "ownField2");
      const ownExtendingField2 = getInnerFieldType(
        sampleExtendingObject2Type,
        "ownExtendingField2",
      );

      expect(idFieldType.name).toEqual("ID");
      expect(interfaceStringField1.name).toEqual("String");
      expect(ownField2.name).toEqual("Float");
      expect(ownExtendingField2.name).toEqual("Float");
    });

    // tslint:disable-next-line:max-line-length
    it("should generate object type implementing interface when extending object type", async () => {
      expect(sampleExtendingObject2Type).toBeDefined();

      const implementedInterfaceInfo = sampleExtendingObject2Type.interfaces.find(
        it => it.name === "SampleInterface1",
      )!;

      expect(implementedInterfaceInfo).toBeDefined();
      expect(implementedInterfaceInfo.kind).toEqual("INTERFACE");
    });

    // tslint:disable-next-line:max-line-length
    it("should generate object type implicitly implementing mutliple interfaces correctly", async () => {
      expect(sampleMultiImplementingObjectType).toBeDefined();
      expect(sampleMultiImplementingObjectType.fields).toHaveLength(4);

      const idFieldType = getInnerFieldType(sampleMultiImplementingObjectType, "id");
      const interfaceStringField1 = getInnerFieldType(
        sampleMultiImplementingObjectType,
        "interfaceStringField1",
      );
      const interfaceStringField2 = getInnerFieldType(
        sampleMultiImplementingObjectType,
        "interfaceStringField2",
      );
      const ownField3 = getInnerFieldType(sampleMultiImplementingObjectType, "ownField3");

      expect(idFieldType.name).toEqual("ID");
      expect(interfaceStringField1.name).toEqual("String");
      expect(interfaceStringField2.name).toEqual("String");
      expect(ownField3.name).toEqual("Float");
    });

    it("should generate object type implicitly implementing and extending correctly", async () => {
      expect(sampleExtendingImplementingObjectType).toBeDefined();
      expect(sampleExtendingImplementingObjectType.fields).toHaveLength(4);

      const idFieldType = getInnerFieldType(sampleExtendingImplementingObjectType, "id");
      const interfaceStringField1 = getInnerFieldType(
        sampleExtendingImplementingObjectType,
        "interfaceStringField1",
      );
      const ownField2 = getInnerFieldType(sampleExtendingImplementingObjectType, "ownField2");
      const ownField4 = getInnerFieldType(sampleExtendingImplementingObjectType, "ownField4");

      expect(idFieldType.name).toEqual("ID");
      expect(interfaceStringField1.name).toEqual("String");
      expect(ownField2.name).toEqual("Float");
      expect(ownField4.name).toEqual("Float");
    });

    it("should generate query args when extending other args class", async () => {
      const queryWithArgs = queryType.fields.find(query => query.name === "queryWithArgs")!;
      expect(queryWithArgs.args).toHaveLength(2);

      const baseArgFieldType = getInnerType(
        queryWithArgs.args.find(arg => arg.name === "baseArgField")!,
      );
      const extendingArgFieldType = getInnerType(
        queryWithArgs.args.find(arg => arg.name === "extendingArgField")!,
      );

      expect(baseArgFieldType.name).toEqual("String");
      expect(extendingArgFieldType.name).toEqual("Boolean");
    });

    it("should generate mutation input when extending other args class", async () => {
      const sampleExtendingInputType = schemaIntrospection.types.find(
        type => type.name === "SampleExtendingInput",
      ) as IntrospectionInputObjectType;
      const baseInputFieldType = getInnerType(
        sampleExtendingInputType.inputFields.find(field => field.name === "baseInputField")!,
      );
      const extendingInputFieldType = getInnerType(
        sampleExtendingInputType.inputFields.find(field => field.name === "extendingInputField")!,
      );

      expect(baseInputFieldType.name).toEqual("String");
      expect(extendingInputFieldType.name).toEqual("Boolean");
    });
  });
});
