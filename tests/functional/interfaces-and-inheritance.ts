import "reflect-metadata";
import {
  IntrospectionSchema,
  IntrospectionInterfaceType,
  IntrospectionObjectType,
  IntrospectionNonNullTypeRef,
  IntrospectionNamedTypeRef,
  IntrospectionInputObjectType,
  GraphQLSchema,
  graphql,
  TypeKind,
} from "graphql";

import { getSchemaInfo } from "../helpers/getSchemaInfo";
import { getInnerFieldType, getInnerInputFieldType } from "../helpers/getInnerFieldType";
import { getMetadataStorage } from "../../src/metadata/getMetadataStorage";
import { GeneratingSchemaError } from "../../src/errors";
import {
  InterfaceType,
  ObjectType,
  Field,
  ID,
  Query,
  ArgsType,
  Args,
  InputType,
  Arg,
  Mutation,
  buildSchema,
  Int,
  Resolver,
} from "../../src";

describe("Interfaces and inheritance", () => {
  describe("Schema", () => {
    let schemaIntrospection: IntrospectionSchema;
    let queryType: IntrospectionObjectType;
    let sampleInterface1Type: IntrospectionInterfaceType;
    let sampleInterface2Type: IntrospectionInterfaceType;
    let sampleInterfaceImplementing1: IntrospectionInterfaceType;
    let sampleMultiImplementingObjectType: IntrospectionObjectType;
    let sampleExtendingImplementingObjectType: IntrospectionObjectType;
    let sampleImplementingObject1Type: IntrospectionObjectType;
    let sampleImplementingObject2Type: IntrospectionObjectType;
    let sampleExtendingObject2Type: IntrospectionObjectType;
    let sampleSecondExtendedInputType: IntrospectionInputObjectType;

    beforeAll(async () => {
      getMetadataStorage().clear();

      @InterfaceType()
      abstract class SampleInterface1 {
        @Field(type => ID)
        id: string;
        @Field()
        interfaceStringField1: string;
      }
      @InterfaceType()
      abstract class SampleInterface2 {
        @Field(type => ID)
        id: string;
        @Field()
        interfaceStringField2: string;
      }
      @InterfaceType()
      abstract class SampleInterfaceExtending1 extends SampleInterface1 {
        @Field()
        ownStringField1: string;
      }
      @InterfaceType({ implements: [SampleInterface1] })
      abstract class SampleInterfaceImplementing1 implements SampleInterface1 {
        id: string;
        interfaceStringField1: string;
        @Field()
        ownStringField1: string;
      }

      @ObjectType({ implements: SampleInterface1 })
      class SampleImplementingObject1 implements SampleInterface1 {
        id: string;
        interfaceStringField1: string;
        @Field()
        ownField1: number;
      }
      @ObjectType({ implements: SampleInterface1 })
      class SampleImplementingObject2 implements SampleInterface1 {
        @Field(type => ID)
        id: string;
        @Field()
        interfaceStringField1: string;
        @Field()
        ownField2: number;
      }
      @ObjectType({ implements: [SampleInterface1, SampleInterface2] })
      class SampleMultiImplementingObject implements SampleInterface1, SampleInterface2 {
        id: string;
        interfaceStringField1: string;
        interfaceStringField2: string;
        @Field()
        ownField3: number;
      }
      @ObjectType({ implements: SampleInterface1 })
      class SampleExtendingImplementingObject
        extends SampleImplementingObject2
        implements SampleInterface1 {
        @Field()
        ownField4: number;
      }
      @ObjectType()
      class SampleExtendingObject2 extends SampleImplementingObject2 {
        @Field()
        ownExtendingField2: number;
      }

      @ArgsType()
      class SampleBaseArgs {
        @Field()
        baseArgField: string;
      }
      @ArgsType()
      class SampleExtendingArgs extends SampleBaseArgs {
        @Field()
        extendingArgField: boolean;
      }

      @InputType()
      class SampleBaseInput {
        @Field()
        baseInputField: string;
      }
      @InputType()
      class SampleExtendingInput extends SampleBaseInput {
        @Field()
        extendingInputField: boolean;
      }

      // overwriting fields case
      @InputType()
      class SampleFirstBaseInput {
        @Field()
        baseField: string;
      }
      @InputType()
      class SampleFirstExtendedInput extends SampleFirstBaseInput {
        @Field()
        extendedField: string;
      }
      @InputType()
      class SampleSecondBaseInput {
        @Field()
        baseInputField: SampleFirstBaseInput;
      }
      @InputType()
      class SampleSecondExtendedInput extends SampleSecondBaseInput {
        @Field()
        baseInputField: SampleFirstExtendedInput;
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
        orphanedTypes: [
          SampleInterface1,
          SampleInterfaceExtending1,
          SampleInterfaceImplementing1,
          SampleImplementingObject1,
          SampleImplementingObject2,
          SampleMultiImplementingObject,
          SampleExtendingImplementingObject,
          SampleExtendingObject2,
          SampleSecondExtendedInput,
        ],
      });
      queryType = schemaInfo.queryType;
      schemaIntrospection = schemaInfo.schemaIntrospection;
      sampleInterface1Type = schemaIntrospection.types.find(
        type => type.name === "SampleInterface1",
      ) as IntrospectionInterfaceType;
      sampleInterface2Type = schemaIntrospection.types.find(
        type => type.name === "SampleInterface2",
      ) as IntrospectionInterfaceType;
      sampleInterfaceImplementing1 = schemaIntrospection.types.find(
        type => type.name === "SampleInterfaceImplementing1",
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
      sampleSecondExtendedInputType = schemaIntrospection.types.find(
        type => type.name === "SampleSecondExtendedInput",
      ) as IntrospectionInputObjectType;
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
      expect(sampleInterface1Type.kind).toEqual(TypeKind.INTERFACE);
      expect(sampleInterface1Type.fields).toHaveLength(2);

      const idFieldType = getInnerFieldType(sampleInterface1Type, "id");
      const interfaceStringField = getInnerFieldType(sampleInterface1Type, "interfaceStringField1");

      expect(idFieldType.name).toEqual("ID");
      expect(interfaceStringField.name).toEqual("String");
    });

    it("should generate type of interface extending other interface correctly", async () => {
      const sampleInterfaceExtending1 = schemaIntrospection.types.find(
        type => type.name === "SampleInterfaceExtending1",
      ) as IntrospectionInterfaceType;
      expect(sampleInterfaceExtending1).toBeDefined();
      expect(sampleInterfaceExtending1.kind).toEqual(TypeKind.INTERFACE);
      expect(sampleInterfaceExtending1.fields).toHaveLength(3);

      const idFieldType = getInnerFieldType(sampleInterfaceExtending1, "id");
      const interfaceStringField = getInnerFieldType(
        sampleInterfaceExtending1,
        "interfaceStringField1",
      );
      const ownStringField1 = getInnerFieldType(sampleInterfaceExtending1, "ownStringField1");

      expect(idFieldType.name).toEqual("ID");
      expect(interfaceStringField.name).toEqual("String");
      expect(ownStringField1.name).toEqual("String");
    });

    it("should generate type of interface implementing other interface correctly", async () => {
      expect(sampleInterfaceImplementing1).toBeDefined();
      expect(sampleInterfaceImplementing1.kind).toEqual(TypeKind.INTERFACE);
      expect(sampleInterfaceImplementing1.fields).toHaveLength(3);

      expect(sampleInterfaceImplementing1.interfaces).toContainEqual(
        expect.objectContaining({
          name: "SampleInterface1",
        }),
      );

      const idFieldType = getInnerFieldType(sampleInterfaceImplementing1, "id");
      expect(idFieldType.name).toEqual("ID");
      const interfaceStringField = getInnerFieldType(
        sampleInterfaceImplementing1,
        "interfaceStringField1",
      );
      expect(interfaceStringField.name).toEqual("String");
      const ownStringField1 = getInnerFieldType(sampleInterfaceImplementing1, "ownStringField1");
      expect(ownStringField1.name).toEqual("String");
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
      expect(implementedInterfaceInfo.kind).toEqual(TypeKind.INTERFACE);
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
      expect(implementedInterfaceInfo.kind).toEqual(TypeKind.INTERFACE);
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

    it("should generate object type implementing interface when extending object type", async () => {
      expect(sampleExtendingObject2Type).toBeDefined();

      const implementedInterfaceInfo = sampleExtendingObject2Type.interfaces.find(
        it => it.name === "SampleInterface1",
      )!;

      expect(implementedInterfaceInfo).toBeDefined();
      expect(implementedInterfaceInfo.kind).toEqual(TypeKind.INTERFACE);
    });

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

    it("should properly overwrite input type field", () => {
      const baseInputFieldType = getInnerInputFieldType(
        sampleSecondExtendedInputType,
        "baseInputField",
      );

      expect(baseInputFieldType.name).toEqual("SampleFirstExtendedInput");
    });

    it("shouldn't throw error when extending wrong class type", async () => {
      getMetadataStorage().clear();

      @InputType()
      class SampleInput {
        @Field()
        inputField: string;
      }
      @ArgsType()
      class SampleArgs extends SampleInput {
        @Field()
        argField: string;
      }
      @Resolver()
      class SampleResolver {
        @Query()
        sampleQuery(@Args() args: SampleArgs): boolean {
          return true;
        }
      }
      const schema = await buildSchema({
        resolvers: [SampleResolver],
        validate: false,
      });
      expect(schema).toBeDefined();
    });
  });

  describe("Errors", () => {
    beforeEach(() => {
      getMetadataStorage().clear();
    });

    it("should throw error when field type doesn't match with interface", async () => {
      expect.assertions(3);
      try {
        @InterfaceType()
        class IBase {
          @Field()
          baseField: string;
        }
        @ObjectType({ implements: IBase })
        class ChildObject implements IBase {
          @Field(type => Number, { nullable: true })
          baseField: string;
          @Field()
          argField: string;
        }
        class SampleResolver {
          @Query()
          sampleQuery(): ChildObject {
            return {} as ChildObject;
          }
        }
        await buildSchema({
          resolvers: [SampleResolver],
          validate: false,
        });
      } catch (err) {
        expect(err).toBeInstanceOf(GeneratingSchemaError);
        const schemaError = err as GeneratingSchemaError;
        expect(schemaError.message).toMatchInlineSnapshot(`
          "Some errors occurred while generating GraphQL schema:
            Interface field IBase.baseField expects type String! but ChildObject.baseField is type Float.
          Please check the \`details\` property of the error to get more detailed info."
        `);
        expect(JSON.stringify(schemaError.details, null, 2)).toMatchInlineSnapshot(`
          "[
            {
              \\"message\\": \\"Interface field IBase.baseField expects type String! but ChildObject.baseField is type Float.\\"
            }
          ]"
        `);
      }
    });

    it("should throw error when not interface type is provided as `implements` option", async () => {
      expect.assertions(2);
      try {
        @ObjectType()
        class SampleNotInterface {
          @Field()
          sampleField: string;
        }
        @ObjectType({ implements: [SampleNotInterface] })
        class SampleImplementingObject implements SampleNotInterface {
          @Field()
          sampleField: string;
        }
        @Resolver()
        class SampleResolver {
          @Query()
          sampleQuery(): SampleImplementingObject {
            return {} as SampleImplementingObject;
          }
        }
        await buildSchema({
          resolvers: [SampleResolver],
          validate: false,
        });
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toMatchInlineSnapshot(
          `"Cannot find interface type metadata for class 'SampleNotInterface' provided in 'implements' option for 'SampleImplementingObject' object type class. Please make sure that class is annotated with an '@InterfaceType()' decorator."`,
        );
      }
    });
  });

  describe("Functional", () => {
    let schema: GraphQLSchema;
    let queryArgs: any;
    let mutationInput: any;
    let inputFieldValue: any;
    let argsFieldValue: any;

    beforeEach(() => {
      queryArgs = undefined;
      mutationInput = undefined;
    });

    beforeAll(async () => {
      getMetadataStorage().clear();

      @ArgsType()
      class BaseArgs {
        @Field()
        baseArgField: string;
        @Field(type => Int, { nullable: true })
        optionalBaseArgField: number = 255;
      }
      @ArgsType()
      class ChildArgs extends BaseArgs {
        @Field()
        childArgField: string;
      }

      @InputType()
      class BaseInput {
        @Field()
        baseInputField: string;
        @Field(type => Int, { nullable: true })
        optionalBaseInputField: number = 255;
      }
      @InputType()
      class ChildInput extends BaseInput {
        @Field()
        childInputField: string;
      }

      @InterfaceType()
      abstract class BaseInterface {
        @Field()
        baseInterfaceField: string;

        @Field({ name: "renamedInterfaceField", nullable: true })
        interfaceFieldToBeRenamed?: string;
      }
      @ObjectType({ implements: BaseInterface })
      class FirstImplementation implements BaseInterface {
        baseInterfaceField: string;
        interfaceFieldToBeRenamed?: string;
        @Field()
        firstField: string;
      }
      @ObjectType({ implements: BaseInterface })
      class SecondImplementation implements BaseInterface {
        baseInterfaceField: string;
        @Field()
        secondField: string;
      }

      @InterfaceType({
        resolveType: value => {
          if ("firstField" in value) {
            return "FirstInterfaceWithStringResolveTypeObject";
          }
          if ("secondField" in value) {
            return "SecondInterfaceWithStringResolveTypeObject";
          }
          return;
        },
      })
      abstract class InterfaceWithStringResolveType {
        @Field()
        baseInterfaceField: string;
      }
      @ObjectType({ implements: InterfaceWithStringResolveType })
      class FirstInterfaceWithStringResolveTypeObject implements InterfaceWithStringResolveType {
        baseInterfaceField: string;
        @Field()
        firstField: string;
      }
      @ObjectType({ implements: InterfaceWithStringResolveType })
      class SecondInterfaceWithStringResolveTypeObject implements InterfaceWithStringResolveType {
        baseInterfaceField: string;
        @Field()
        secondField: string;
      }

      @InterfaceType({
        resolveType: value => {
          if ("firstField" in value) {
            return FirstInterfaceWithClassResolveTypeObject;
          }
          if ("secondField" in value) {
            return SecondInterfaceWithClassResolveTypeObject;
          }
          return;
        },
      })
      abstract class InterfaceWithClassResolveType {
        @Field()
        baseInterfaceField: string;
      }
      @ObjectType({ implements: InterfaceWithClassResolveType })
      class FirstInterfaceWithClassResolveTypeObject implements InterfaceWithClassResolveType {
        baseInterfaceField: string;
        @Field()
        firstField: string;
      }
      @ObjectType({ implements: InterfaceWithClassResolveType })
      class SecondInterfaceWithClassResolveTypeObject implements InterfaceWithClassResolveType {
        baseInterfaceField: string;
        @Field()
        secondField: string;
      }

      class SampleBaseClass {
        static sampleStaticMethod() {
          return "sampleStaticMethod";
        }
      }
      @ObjectType()
      class SampleExtendingNormalClassObject extends SampleBaseClass {
        @Field()
        sampleField: string;
      }
      @InputType()
      class SampleExtendingNormalClassInput extends SampleBaseClass {
        @Field()
        sampleField: string;
      }
      @ArgsType()
      class SampleExtendingNormalClassArgs extends SampleBaseClass {
        @Field()
        sampleField: string;
      }

      // overwriting fields case
      @InputType()
      class SampleFirstBaseInput {
        @Field()
        baseField: string;
      }
      @InputType()
      class SampleFirstExtendedInput extends SampleFirstBaseInput {
        @Field()
        extendedField: string;
      }
      @InputType()
      class SampleSecondBaseInput {
        @Field()
        baseInputField: SampleFirstBaseInput;
      }
      @InputType()
      class SampleSecondExtendedInput extends SampleSecondBaseInput {
        @Field()
        baseInputField: SampleFirstExtendedInput;
      }

      @Resolver()
      class InterfacesResolver {
        @Query()
        getInterfacePlainObject(): BaseInterface {
          return {} as FirstImplementation;
        }

        @Query()
        getFirstInterfaceImplementationObject(): BaseInterface {
          const obj = new FirstImplementation();
          obj.baseInterfaceField = "baseInterfaceField";
          obj.firstField = "firstField";
          return obj;
        }

        @Query()
        getSecondInterfaceWithStringResolveTypeObject(): InterfaceWithStringResolveType {
          return {
            baseInterfaceField: "baseInterfaceField",
            secondField: "secondField",
          } as SecondInterfaceWithStringResolveTypeObject;
        }

        @Query()
        getSecondInterfaceWithClassResolveTypeObject(): InterfaceWithClassResolveType {
          return {
            baseInterfaceField: "baseInterfaceField",
            secondField: "secondField",
          } as SecondInterfaceWithClassResolveTypeObject;
        }

        @Query()
        notMatchingValueForInterfaceWithClassResolveTypeObject(): InterfaceWithClassResolveType {
          return { baseInterfaceField: "notMatchingValue" };
        }

        @Query()
        queryWithArgs(@Args() args: ChildArgs): boolean {
          queryArgs = args;
          return true;
        }

        @Mutation()
        mutationWithInput(@Arg("input") input: ChildInput): boolean {
          mutationInput = input;
          return true;
        }

        @Query()
        baseClassQuery(
          @Arg("input") input: SampleExtendingNormalClassInput,
          @Args() args: SampleExtendingNormalClassArgs,
        ): string {
          inputFieldValue = input.sampleField;
          argsFieldValue = args.sampleField;
          return SampleExtendingNormalClassObject.sampleStaticMethod();
        }

        @Query()
        secondImplementationPlainQuery(): SecondImplementation {
          return {
            baseInterfaceField: "baseInterfaceField",
            secondField: "secondField",
          };
        }

        @Query()
        renamedFieldInterfaceQuery(): BaseInterface {
          const obj = new FirstImplementation();
          obj.baseInterfaceField = "baseInterfaceField";
          obj.firstField = "firstField";
          obj.interfaceFieldToBeRenamed = "interfaceFieldToBeRenamed";
          return obj;
        }

        @Mutation()
        overwritingInputFieldMutation(@Arg("input") input: SampleSecondExtendedInput): boolean {
          mutationInput = input;
          return true;
        }
      }

      schema = await buildSchema({
        resolvers: [InterfacesResolver],
        orphanedTypes: [
          FirstImplementation,
          SecondInterfaceWithStringResolveTypeObject,
          FirstInterfaceWithStringResolveTypeObject,
          SecondInterfaceWithClassResolveTypeObject,
          FirstInterfaceWithClassResolveTypeObject,
        ],
        validate: false,
      });
    });

    it("should return interface type fields data", async () => {
      const query = `query {
        getFirstInterfaceImplementationObject {
          baseInterfaceField
        }
      }`;

      const result = await graphql(schema, query);
      const data = result.data!.getFirstInterfaceImplementationObject;
      expect(data.baseInterfaceField).toEqual("baseInterfaceField");
    });

    it("should correctly recognize returned object type using default `instance of` check", async () => {
      const query = `query {
        getFirstInterfaceImplementationObject {
          baseInterfaceField
          ... on FirstImplementation {
            firstField
          }
          ... on SecondImplementation {
            secondField
          }
        }
      }`;

      const result = await graphql(schema, query);
      const data = result.data!.getFirstInterfaceImplementationObject;
      expect(data.baseInterfaceField).toEqual("baseInterfaceField");
      expect(data.firstField).toEqual("firstField");
      expect(data.secondField).toBeUndefined();
    });

    it("should correctly recognize returned object type using string provided by `resolveType` function", async () => {
      const query = `query {
        getSecondInterfaceWithStringResolveTypeObject {
          baseInterfaceField
          ... on FirstInterfaceWithStringResolveTypeObject {
            firstField
          }
          ... on SecondInterfaceWithStringResolveTypeObject {
            secondField
          }
        }
      }`;

      const result = await graphql(schema, query);
      const data = result.data!.getSecondInterfaceWithStringResolveTypeObject;
      expect(data.baseInterfaceField).toEqual("baseInterfaceField");
      expect(data.firstField).toBeUndefined();
      expect(data.secondField).toEqual("secondField");
    });

    it("should correctly recognize returned object type using class provided by `resolveType` function", async () => {
      const query = `query {
        getSecondInterfaceWithClassResolveTypeObject {
          baseInterfaceField
          ... on FirstInterfaceWithClassResolveTypeObject {
            firstField
          }
          ... on SecondInterfaceWithClassResolveTypeObject {
            secondField
          }
        }
      }`;

      const result = await graphql(schema, query);
      const data = result.data!.getSecondInterfaceWithClassResolveTypeObject;
      expect(data.baseInterfaceField).toEqual("baseInterfaceField");
      expect(data.firstField).toBeUndefined();
      expect(data.secondField).toEqual("secondField");
    });

    it("should should fail with error info when `resolveType` returns undefined", async () => {
      const query = `query {
        notMatchingValueForInterfaceWithClassResolveTypeObject {
          __typename
          baseInterfaceField
          ... on FirstInterfaceWithClassResolveTypeObject {
            firstField
          }
          ... on SecondInterfaceWithClassResolveTypeObject {
            secondField
          }
        }
      }`;

      const result = await graphql(schema, query);

      expect(result.errors?.[0]?.message).toMatchInlineSnapshot(
        `"Abstract type \\"InterfaceWithClassResolveType\\" must resolve to an Object type at runtime for field \\"Query.notMatchingValueForInterfaceWithClassResolveTypeObject\\". Either the \\"InterfaceWithClassResolveType\\" type should provide a \\"resolveType\\" function or each possible type should provide an \\"isTypeOf\\" function."`,
      );
    });

    it("should throw error when not returning instance of object class", async () => {
      const query = `query {
        getInterfacePlainObject {
          baseInterfaceField
        }
      }`;

      const result = await graphql(schema, query);

      expect(result.data).toBeNull();
      expect(result.errors).toHaveLength(1);

      const errorMessage = result.errors![0].message;
      expect(errorMessage).toContain("resolve");
      expect(errorMessage).toContain("BaseInterface");
      expect(errorMessage).toContain("instance");
      expect(errorMessage).toContain("plain");
    });

    it("should return fields data of object type implementing interface", async () => {
      const query = `query {
        getFirstInterfaceImplementationObject {
          baseInterfaceField
          ... on FirstImplementation {
            firstField
          }
        }
      }`;

      const result = await graphql(schema, query);
      const data = result.data!.getFirstInterfaceImplementationObject;
      expect(data.baseInterfaceField).toEqual("baseInterfaceField");
      expect(data.firstField).toEqual("firstField");
    });

    it("should allow interfaces to specify custom schema names", async () => {
      const query = `query {
        renamedFieldInterfaceQuery {
          renamedInterfaceField
        }
      }`;

      const { data, errors } = await graphql(schema, query);

      expect(errors).toBeUndefined();
      expect(data!.renamedFieldInterfaceQuery.renamedInterfaceField).toEqual(
        "interfaceFieldToBeRenamed",
      );
    });

    it("should pass args data of extended args class", async () => {
      const query = `query {
        queryWithArgs(
          baseArgField: "baseArgField"
          childArgField: "childArgField"
        )
      }`;

      await graphql(schema, query);

      expect(queryArgs.baseArgField).toEqual("baseArgField");
      expect(queryArgs.childArgField).toEqual("childArgField");
      expect(queryArgs.optionalBaseArgField).toEqual(255);
    });

    it("should pass input data of extended input class", async () => {
      const query = `mutation {
        mutationWithInput(input: {
          baseInputField: "baseInputField"
          childInputField: "childInputField"
        })
      }`;

      await graphql(schema, query);

      expect(mutationInput.baseInputField).toEqual("baseInputField");
      expect(mutationInput.childInputField).toEqual("childInputField");
      expect(mutationInput.optionalBaseInputField).toEqual(255);
    });

    it("should correctly extends non-TypeGraphQL class", async () => {
      const query = `query {
        baseClassQuery(
          input: { sampleField: "sampleInputValue" }
          sampleField: "sampleArgValue"
        )
      }`;

      const { data } = await graphql(schema, query);

      expect(data!.baseClassQuery).toEqual("sampleStaticMethod");
      expect(inputFieldValue).toEqual("sampleInputValue");
      expect(argsFieldValue).toEqual("sampleArgValue");
    });

    it("should allow to return plain object when return type is a class that implements an interface", async () => {
      const query = `mutation {
        overwritingInputFieldMutation(input: {
          baseInputField: {
            baseField: "baseField",
            extendedField: "extendedField",
          }
        })
      }`;

      const { errors } = await graphql(schema, query);

      expect(errors).toBeUndefined();
      expect(mutationInput).toEqual({
        baseInputField: {
          baseField: "baseField",
          extendedField: "extendedField",
        },
      });
    });

    it("should correctly transform data of overwritten input field", async () => {
      const query = `query {
        secondImplementationPlainQuery {
          baseInterfaceField
          secondField
        }
      }`;

      const { data, errors } = await graphql(schema, query);

      expect(errors).toBeUndefined();
      expect(data!.secondImplementationPlainQuery.baseInterfaceField).toEqual("baseInterfaceField");
      expect(data!.secondImplementationPlainQuery.secondField).toEqual("secondField");
    });
  });

  describe("Multiple schemas", () => {
    beforeEach(() => {
      getMetadataStorage().clear();
    });

    it("should correctly return data from interface query for all schemas that uses the same interface", async () => {
      @InterfaceType()
      class BaseInterface {
        @Field()
        baseField: string;
      }
      @ObjectType({ implements: [BaseInterface] })
      class One extends BaseInterface {
        @Field()
        one: string;
      }
      @ObjectType({ implements: [BaseInterface] })
      class Two extends BaseInterface {
        @Field()
        two: string;
      }
      @Resolver()
      class OneTwoResolver {
        @Query(returns => BaseInterface)
        base(): BaseInterface {
          const one = new One();
          one.baseField = "baseField";
          one.one = "one";
          return one;
        }
      }
      const query = /* graphql */ `
        query {
          base {
            __typename
            baseField
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
        orphanedTypes: [One, Two],
        validate: false,
      });
      const secondSchema = await buildSchema({
        resolvers: [OneTwoResolver],
        orphanedTypes: [One, Two],
        validate: false,
      });
      const firstResult = await graphql(firstSchema, query);
      const secondResult = await graphql(secondSchema, query);

      expect(firstResult.errors).toBeUndefined();
      expect(firstResult.data!.base).toEqual({
        __typename: "One",
        baseField: "baseField",
        one: "one",
      });
      expect(secondResult.errors).toBeUndefined();
      expect(secondResult.data!.base).toEqual({
        __typename: "One",
        baseField: "baseField",
        one: "one",
      });
    });

    it("should correctly return data from interface query for all schemas that uses the same interface when string `resolveType` is provided", async () => {
      @InterfaceType({
        resolveType: value => {
          if ("one" in value) {
            return "One";
          }
          if ("two" in value) {
            return "Two";
          }
          throw new Error("Unkown resolveType error");
        },
      })
      class BaseInterface {
        @Field()
        baseField: string;
      }
      @ObjectType({ implements: [BaseInterface] })
      class One extends BaseInterface {
        @Field()
        one: string;
      }
      @ObjectType({ implements: [BaseInterface] })
      class Two extends BaseInterface {
        @Field()
        two: string;
      }
      @Resolver()
      class OneTwoResolver {
        @Query(returns => BaseInterface)
        base(): BaseInterface {
          const one = new One();
          one.baseField = "baseField";
          one.one = "one";
          return one;
        }
      }
      const query = /* graphql */ `
        query {
          base {
            __typename
            baseField
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
        orphanedTypes: [One, Two],
        validate: false,
      });
      const secondSchema = await buildSchema({
        resolvers: [OneTwoResolver],
        orphanedTypes: [One, Two],
        validate: false,
      });
      const firstResult = await graphql(firstSchema, query);
      const secondResult = await graphql(secondSchema, query);

      expect(firstResult.errors).toBeUndefined();
      expect(firstResult.data!.base).toEqual({
        __typename: "One",
        baseField: "baseField",
        one: "one",
      });
      expect(secondResult.errors).toBeUndefined();
      expect(secondResult.data!.base).toEqual({
        __typename: "One",
        baseField: "baseField",
        one: "one",
      });
    });

    it("should correctly return data from interface query for all schemas that uses the same interface when class `resolveType` is provided", async () => {
      @InterfaceType({
        resolveType: value => {
          if ("one" in value) {
            return One;
          }
          if ("two" in value) {
            return Two;
          }
          throw new Error("Unkown resolveType error");
        },
      })
      class BaseInterface {
        @Field()
        baseField: string;
      }
      @ObjectType({ implements: [BaseInterface] })
      class One extends BaseInterface {
        @Field()
        one: string;
      }
      @ObjectType({ implements: [BaseInterface] })
      class Two extends BaseInterface {
        @Field()
        two: string;
      }
      @Resolver()
      class OneTwoResolver {
        @Query(returns => BaseInterface)
        base(): BaseInterface {
          const one = new One();
          one.baseField = "baseField";
          one.one = "one";
          return one;
        }
      }
      const query = /* graphql */ `
        query {
          base {
            __typename
            baseField
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
        orphanedTypes: [One, Two],
        validate: false,
      });
      const secondSchema = await buildSchema({
        resolvers: [OneTwoResolver],
        orphanedTypes: [One, Two],
        validate: false,
      });
      const firstResult = await graphql(firstSchema, query);
      const secondResult = await graphql(secondSchema, query);

      expect(firstResult.errors).toBeUndefined();
      expect(firstResult.data!.base).toEqual({
        __typename: "One",
        baseField: "baseField",
        one: "one",
      });
      expect(secondResult.errors).toBeUndefined();
      expect(secondResult.data!.base).toEqual({
        __typename: "One",
        baseField: "baseField",
        one: "one",
      });
    });

    it("should by default automatically register all and only the object types that implements an used interface type", async () => {
      @InterfaceType()
      abstract class SampleUnusedInterface {
        @Field()
        sampleField: string;
      }
      @ObjectType({ implements: SampleUnusedInterface })
      class SampleUnusedObjectType implements SampleUnusedInterface {
        @Field()
        sampleField: string;
        @Field()
        sampleUnusedInterfaceField: SampleUnusedInterface;
      }
      @InterfaceType()
      abstract class SampleUsedInterface {
        @Field()
        sampleField: string;
      }
      @ObjectType({ implements: SampleUsedInterface })
      class SampleObjectTypeImplementingUsedInterface implements SampleUsedInterface {
        @Field()
        sampleField: string;
        @Field()
        sampleAdditionalField: string;
      }
      @Resolver()
      class SampleResolver {
        @Query()
        sampleQuery(): SampleUsedInterface {
          const sampleObject = new SampleObjectTypeImplementingUsedInterface();
          sampleObject.sampleField = "sampleField";
          sampleObject.sampleAdditionalField = "sampleAdditionalField";
          return sampleObject;
        }
      }

      const { schemaIntrospection } = await getSchemaInfo({
        resolvers: [SampleResolver],
      });

      expect(schemaIntrospection.types).not.toContainEqual(
        expect.objectContaining({
          kind: "OBJECT",
          name: "SampleUnusedObjectType",
        }),
      );
      expect(schemaIntrospection.types).toContainEqual(
        expect.objectContaining({
          kind: "OBJECT",
          name: "SampleObjectTypeImplementingUsedInterface",
        }),
      );
    });

    it("should by default automatically register all and only the object types that implements an interface type used as field type", async () => {
      getMetadataStorage().clear();
      @InterfaceType()
      class IFooBar {
        @Field(() => String)
        fooBarKind: string;
      }
      @ObjectType({ implements: IFooBar })
      class Foo extends IFooBar {
        fooBarKind = "Foo";
      }
      @ObjectType({ implements: IFooBar })
      class Bar extends IFooBar {
        fooBarKind = "Bar";
      }
      @ObjectType()
      class FooBar {
        @Field(() => IFooBar)
        iFooBarField: IFooBar;
      }
      @Resolver()
      class TestResolver {
        @Query(() => FooBar)
        foobar() {
          return new FooBar();
        }
      }
      const { schemaIntrospection } = await getSchemaInfo({
        resolvers: [TestResolver],
      });

      expect(schemaIntrospection.types).toContainEqual(
        expect.objectContaining({
          kind: TypeKind.INTERFACE,
          name: "IFooBar",
        }),
      );
      expect(schemaIntrospection.types).toContainEqual(
        expect.objectContaining({
          kind: TypeKind.OBJECT,
          name: "Bar",
        }),
      );
      expect(schemaIntrospection.types).toContainEqual(
        expect.objectContaining({
          kind: TypeKind.OBJECT,
          name: "Foo",
        }),
      );
    });

    it("should register only the object types from orphanedType when interface type has disabled auto registering", async () => {
      @InterfaceType({ autoRegisterImplementations: false })
      abstract class SampleUsedInterface {
        @Field()
        sampleField: string;
      }
      @ObjectType({ implements: SampleUsedInterface })
      class FirstSampleObject implements SampleUsedInterface {
        @Field()
        sampleField: string;
        @Field()
        sampleFirstAdditionalField: string;
      }
      @ObjectType({ implements: SampleUsedInterface })
      class SecondSampleObject implements SampleUsedInterface {
        @Field()
        sampleField: string;
        @Field()
        sampleSecondAdditionalField: string;
      }
      @Resolver()
      class SampleResolver {
        @Query()
        sampleQuery(): SampleUsedInterface {
          const sampleObject: FirstSampleObject = {
            sampleField: "sampleField",
            sampleFirstAdditionalField: "sampleFirstAdditionalField",
          };
          return sampleObject;
        }
      }

      const { schemaIntrospection } = await getSchemaInfo({
        resolvers: [SampleResolver],
        orphanedTypes: [FirstSampleObject],
      });

      expect(schemaIntrospection.types).toContainEqual(
        expect.objectContaining({
          kind: "OBJECT",
          name: "FirstSampleObject",
        }),
      );
      expect(schemaIntrospection.types).not.toContainEqual(
        expect.objectContaining({
          kind: "OBJECT",
          name: "SecondSampleObject",
        }),
      );
    });
  });
});
