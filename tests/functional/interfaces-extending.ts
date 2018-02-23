import "reflect-metadata";
import { IntrospectionSchema, IntrospectionInterfaceType, IntrospectionObjectType } from "graphql";

import { getSchemaInfo } from "../helpers/getSchemaInfo";
import { getTypeField } from "../helpers/getTypeField";
import { getInnerFieldType } from "../helpers/getInnerFieldType";
import { GraphQLInterfaceType, GraphQLObjectType, Field, ID, Query } from "../../src";

describe("Intefaces and extending classes", () => {
  describe("Schema", () => {
    let schemaIntrospection: IntrospectionSchema;
    let sampleInterface1Type: IntrospectionInterfaceType;
    let sampleImplementingObject2Type: IntrospectionObjectType;

    beforeAll(async () => {
      @GraphQLInterfaceType()
      abstract class SampleInterface1 {
        @Field(type => ID)
        id: string;

        @Field() interfaceStringField1: string;
      }

      @GraphQLObjectType({ implements: SampleInterface1 })
      class SampleImplementingObject2 implements SampleInterface1 {
        @Field(type => ID)
        id: string;

        @Field() interfaceStringField1: string;

        @Field() ownField2: number;
      }

      class SampleResolver {
        @Query()
        sampleQuery(): boolean {
          return true;
        }
      }

      // get builded schema info from retrospection
      const schemaInfo = await getSchemaInfo({
        resolvers: [SampleResolver],
      });
      schemaIntrospection = schemaInfo.schemaIntrospection;
      sampleInterface1Type = schemaIntrospection.types.find(
        type => type.name === "SampleInterface1",
      ) as IntrospectionInterfaceType;
      sampleImplementingObject2Type = schemaIntrospection.types.find(
        type => type.name === "SampleImplementingObject2",
      ) as IntrospectionObjectType;
    });

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
      const ownField1 = getInnerFieldType(sampleImplementingObject2Type, "ownField2");
      const implementedInterfaceInfo = sampleImplementingObject2Type.interfaces.find(
        it => it.name === "SampleInterface1",
      )!;

      expect(idFieldType.name).toEqual("ID");
      expect(interfaceStringField.name).toEqual("String");
      expect(ownField1.name).toEqual("Float");
      expect(implementedInterfaceInfo.kind).toEqual("INTERFACE");
    });
  });
});
