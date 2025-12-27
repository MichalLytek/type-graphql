import "reflect-metadata";
import {
  type GraphQLFieldMap,
  type GraphQLInputObjectType,
  GraphQLInterfaceType,
  type GraphQLObjectType,
  type GraphQLSchema,
} from "graphql";
import {
  Arg,
  Extensions,
  Field,
  FieldResolver,
  InputType,
  InterfaceType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  buildSchema,
} from "type-graphql";
import { getMetadataStorage } from "@/metadata/getMetadataStorage";

describe("Extensions", () => {
  let schema: GraphQLSchema;

  describe("Schema", () => {
    beforeAll(async () => {
      getMetadataStorage().clear();

      @InputType()
      class ExtensionsOnFieldInput {
        @Field()
        @Extensions({ role: "admin" })
        withExtensions!: string;
      }

      @InputType()
      @Extensions({ roles: ["admin", "user"] })
      class ExtensionsOnClassInput {
        @Field()
        regularField!: string;
      }

      @ObjectType()
      @Extensions({ id: 1234 })
      class ExtensionsOnClassObjectType {
        @Field()
        regularField!: string;
      }

      @ObjectType()
      class SampleObjectType {
        @Field()
        @Extensions({ role: "user" })
        withExtensions: string = "withExtensions";

        @Field()
        @Extensions({ first: "first value", second: "second value" })
        withMultipleExtensions: string = "withMultipleExtensions";

        @Field()
        @Extensions({ first: "first value" })
        @Extensions({ second: "second value", third: "third value" })
        withMultipleExtensionsDecorators: string = "hello";

        @Field()
        @Extensions({ duplicate: "first value" })
        @Extensions({ duplicate: "second value" })
        withConflictingExtensionsKeys: string = "hello";

        @Field()
        withInput(@Arg("input") input: ExtensionsOnFieldInput): string {
          return `hello${input.withExtensions}`;
        }

        @Field()
        @Extensions({ other: "extension" })
        withInputAndField(@Arg("input") input: ExtensionsOnFieldInput): string {
          return `hello${input.withExtensions}`;
        }

        @Field()
        withInputOnClass(@Arg("input") input: ExtensionsOnClassInput): string {
          return `hello${input.regularField}`;
        }

        @Field()
        @Extensions({ other: "extension" })
        withInputAndFieldOnClass(@Arg("input") input: ExtensionsOnClassInput): string {
          return `hello${input.regularField}`;
        }
      }

      @InterfaceType()
      @Extensions({ meta: "interfaceExtensionData" })
      class SampleInterfaceType {
        @Field()
        @Extensions({ meta: "interfaceFieldExtensionData" })
        withInterfaceFieldExtension!: string;
      }

      @ObjectType({
        implements: [SampleInterfaceType],
      })
      class SampleObjectInterfaceImplementation extends SampleInterfaceType {}

      @InterfaceType({
        implements: [SampleInterfaceType],
      })
      class SampleInterfaceInterfaceImplementation extends SampleInterfaceType {}

      @ObjectType({
        implements: [SampleInterfaceInterfaceImplementation],
      })
      class SampleObjectInterfaceInterfaceImplementation extends SampleInterfaceInterfaceImplementation {}

      @Resolver()
      class SampleResolver {
        @Query(() => SampleObjectType)
        sampleObjectType(): SampleObjectType {
          return new SampleObjectType();
        }

        @Query(() => ExtensionsOnClassObjectType)
        extensionsOnClassObjectType(): ExtensionsOnClassObjectType {
          return new ExtensionsOnClassObjectType();
        }

        @Query(() => SampleObjectInterfaceImplementation)
        sampleObjectInterfaceImplementation(): SampleObjectInterfaceImplementation {
          return new SampleObjectInterfaceImplementation();
        }

        @Query(() => SampleInterfaceInterfaceImplementation)
        sampleInterfaceInterfaceImplementation(): SampleInterfaceInterfaceImplementation {
          return new SampleInterfaceInterfaceImplementation();
        }

        @Query(() => SampleObjectInterfaceInterfaceImplementation)
        sampleObjectInterfaceInterfaceImplementation(): SampleObjectInterfaceInterfaceImplementation {
          return new SampleObjectInterfaceInterfaceImplementation();
        }

        @Query(() => SampleInterfaceType)
        sampleInterfaceType(): SampleInterfaceType {
          return new SampleObjectInterfaceImplementation();
        }

        @Query()
        @Extensions({ mandatory: true })
        queryWithExtensions(): string {
          return "queryWithExtensions";
        }

        @Query()
        @Extensions({ first: "first query value", second: "second query value" })
        queryWithMultipleExtensions(): string {
          return "hello";
        }

        @Query()
        @Extensions({ first: "first query value" })
        @Extensions({ second: "second query value", third: "third query value" })
        queryWithMultipleExtensionsDecorators(): string {
          return "hello";
        }

        @Mutation()
        @Extensions({ mandatory: false })
        mutationWithExtensions(): string {
          return "mutationWithExtensions";
        }

        @Mutation()
        @Extensions({ first: "first mutation value", second: "second mutation value" })
        mutationWithMultipleExtensions(): string {
          return "mutationWithMultipleExtensions";
        }

        @Mutation()
        @Extensions({ first: "first mutation value" })
        @Extensions({ second: "second mutation value", third: "third mutation value" })
        mutationWithMultipleExtensionsDecorators(): string {
          return "mutationWithMultipleExtensionsDecorators";
        }
      }

      @Resolver(() => SampleObjectType)
      class SampleObjectTypeResolver {
        @FieldResolver()
        @Extensions({ some: "extension" })
        fieldResolverWithExtensions(): string {
          return "hello";
        }
      }

      schema = await buildSchema({
        resolvers: [SampleResolver, SampleObjectTypeResolver],
      });
    });

    it("should generate schema without errors", async () => {
      expect(schema).toBeDefined();
    });

    describe("Fields", () => {
      let fields: GraphQLFieldMap<any, any>;

      beforeAll(async () => {
        fields = (schema.getType("SampleObjectType") as GraphQLObjectType).getFields();
      });

      it("should add simple extensions to object fields", async () => {
        expect(fields.withExtensions.extensions).toEqual({ role: "user" });
      });

      it("should add extensions with multiple properties to object fields", async () => {
        expect(fields.withMultipleExtensions.extensions).toEqual({
          first: "first value",
          second: "second value",
        });
      });

      it("should allow multiple extensions decorators for object fields", async () => {
        expect(fields.withMultipleExtensionsDecorators.extensions).toEqual({
          first: "first value",
          second: "second value",
          third: "third value",
        });
      });

      it("should override extensions values when duplicate keys are provided", async () => {
        expect(fields.withConflictingExtensionsKeys.extensions).toEqual({
          duplicate: "second value",
        });
      });
    });

    describe("Query", () => {
      it("should add simple extensions to query types", async () => {
        const { queryWithExtensions } = schema.getQueryType()!.getFields();
        expect(queryWithExtensions.extensions).toEqual({ mandatory: true });
      });

      it("should add extensions with multiple properties to query types", async () => {
        const { queryWithMultipleExtensions } = schema.getQueryType()!.getFields();
        expect(queryWithMultipleExtensions.extensions).toEqual({
          first: "first query value",
          second: "second query value",
        });
      });

      it("should allow multiple extensions decorators for query types", async () => {
        const { queryWithMultipleExtensionsDecorators } = schema.getQueryType()!.getFields();
        expect(queryWithMultipleExtensionsDecorators.extensions).toEqual({
          first: "first query value",
          second: "second query value",
          third: "third query value",
        });
      });
    });

    describe("Mutation", () => {
      it("should add simple extensions to mutation types", async () => {
        const { mutationWithExtensions } = schema.getMutationType()!.getFields();
        expect(mutationWithExtensions.extensions).toEqual({ mandatory: false });
      });

      it("should add extensions with multiple properties to mutation types", async () => {
        const { mutationWithMultipleExtensions } = schema.getMutationType()!.getFields();
        expect(mutationWithMultipleExtensions.extensions).toEqual({
          first: "first mutation value",
          second: "second mutation value",
        });
      });

      it("should allow multiple extensions decorators for mutation types", async () => {
        const { mutationWithMultipleExtensionsDecorators } = schema.getMutationType()!.getFields();
        expect(mutationWithMultipleExtensionsDecorators.extensions).toEqual({
          first: "first mutation value",
          second: "second mutation value",
          third: "third mutation value",
        });
      });
    });

    describe("ObjectType", () => {
      it("should add extensions to object types", async () => {
        const objectType = schema.getType("ExtensionsOnClassObjectType") as GraphQLObjectType;
        expect(objectType.extensions).toEqual({ id: 1234 });
      });
    });

    describe("InputType", () => {
      it("should add extensions to input types", async () => {
        const inputType = schema.getType("ExtensionsOnClassInput") as GraphQLInputObjectType;
        expect(inputType.extensions).toEqual({ roles: ["admin", "user"] });
      });

      it("should add extensions to input type fields", async () => {
        const fields = (
          schema.getType("ExtensionsOnFieldInput") as GraphQLInputObjectType
        ).getFields();

        expect(fields.withExtensions.extensions).toEqual({ role: "admin" });
      });
    });

    describe("FieldResolver", () => {
      it("should add extensions to field resolvers", async () => {
        const fields = (schema.getType("SampleObjectType") as GraphQLObjectType).getFields();
        expect(fields.fieldResolverWithExtensions.extensions).toEqual({ some: "extension" });
      });
    });

    describe("Interface Fields", () => {
      it("should add extensions to interface types", async () => {
        const fields = (schema.getType("SampleInterfaceType") as GraphQLObjectType).getFields();
        expect(fields.withInterfaceFieldExtension.extensions).toEqual({
          meta: "interfaceFieldExtensionData",
        });
      });

      it("should add extensions to ObjectType which extends InterfaceType", async () => {
        const fields = (
          schema.getType("SampleObjectInterfaceImplementation") as GraphQLObjectType
        ).getFields();
        expect(fields.withInterfaceFieldExtension.extensions).toEqual({
          meta: "interfaceFieldExtensionData",
        });
      });

      it("should add extensions to Interface which extends InterfaceType", async () => {
        const fields = (
          schema.getType("SampleInterfaceInterfaceImplementation") as GraphQLObjectType
        ).getFields();
        expect(fields.withInterfaceFieldExtension.extensions).toEqual({
          meta: "interfaceFieldExtensionData",
        });
      });

      it("should add extensions to ObjectType which extends InterfaceType which extends InterfaceType", async () => {
        const fields = (
          schema.getType("SampleInterfaceInterfaceImplementation") as GraphQLObjectType
        ).getFields();
        expect(fields.withInterfaceFieldExtension.extensions).toEqual({
          meta: "interfaceFieldExtensionData",
        });
      });
    });

    describe("Interface Class", () => {
      it("should add extensions to interface types", async () => {
        const sampleInterface = schema.getType("SampleInterfaceType") as GraphQLInterfaceType;
        expect(sampleInterface.extensions).toEqual({
          meta: "interfaceExtensionData",
        });
      });

      it("should add extensions to ObjectType which extends InterfaceType", async () => {
        const sampleInterface = schema.getType(
          "SampleObjectInterfaceImplementation",
        ) as GraphQLInterfaceType;
        expect(sampleInterface.extensions).toEqual({
          meta: "interfaceExtensionData",
        });
      });

      it("should add extensions to InterfaceType which extends InterfaceType", async () => {
        const sampleInterface = schema.getType(
          "SampleInterfaceInterfaceImplementation",
        ) as GraphQLInterfaceType;
        expect(sampleInterface.extensions).toEqual({
          meta: "interfaceExtensionData",
        });
      });

      it("should add extensions to ObjectType which extends InterfaceType which extends InterfaceType", async () => {
        const sampleInterface = schema.getType(
          "SampleObjectInterfaceInterfaceImplementation",
        ) as GraphQLInterfaceType;
        expect(sampleInterface.extensions).toEqual({
          meta: "interfaceExtensionData",
        });
      });
    });

    describe("Inheritance", () => {
      beforeAll(async () => {
        getMetadataStorage().clear();

        @ObjectType()
        @Extensions({ parentClass: true })
        class Parent {
          @Field()
          @Extensions({ parentField: true })
          parentField!: string;
        }
        @Extensions({ childClass: true })
        @ObjectType()
        class Child extends Parent {
          @Field()
          @Extensions({ childField: true })
          childField!: string;
        }
        @Resolver()
        class SampleResolver {
          @Query()
          sampleQuery(): Child {
            return {} as Child;
          }
        }

        schema = await buildSchema({
          resolvers: [SampleResolver],
          orphanedTypes: [Parent],
        });
      });

      it("should inherit object type extensions from parent object type class", () => {
        const childObjectType = schema.getType("Child") as GraphQLObjectType;

        expect(childObjectType.extensions).toEqual({
          parentClass: true,
          childClass: true,
        });
      });

      it("should not get object type extensions from child object type class", () => {
        const parentObjectType = schema.getType("Parent") as GraphQLObjectType;

        expect(parentObjectType.extensions).toEqual({
          parentClass: true,
        });
      });

      it("should inherit object type field extensions from parent object type field", () => {
        const childObjectType = schema.getType("Child") as GraphQLObjectType;
        const childObjectTypeParentField = childObjectType.getFields().parentField;

        expect(childObjectTypeParentField.extensions).toEqual({ parentField: true });
      });
    });

    describe("Fields with field resolvers", () => {
      beforeAll(async () => {
        getMetadataStorage().clear();

        @ObjectType()
        class Child {
          @Field()
          @Extensions({ childField: true })
          childField!: string;
        }
        @Resolver(() => Child)
        class ChildResolver {
          @Query()
          sampleQuery(): Child {
            return {} as Child;
          }

          @Extensions({ childFieldResolver: true })
          @FieldResolver()
          childField(): string {
            return "childField";
          }
        }

        schema = await buildSchema({
          resolvers: [ChildResolver],
        });
      });

      it("should merge field level with field resolver level extensions", () => {
        const childObjectType = schema.getType("Child") as GraphQLObjectType;

        expect(childObjectType.getFields().childField.extensions).toEqual({
          childField: true,
          childFieldResolver: true,
        });
      });
    });
  });
});
