// tslint:disable:member-ordering
import "reflect-metadata";
import {
  IntrospectionSchema,
  IntrospectionObjectType,
  IntrospectionNamedTypeRef,
  IntrospectionNonNullTypeRef,
  IntrospectionListTypeRef,
  IntrospectionField,
  GraphQLSchema,
  graphql,
  TypeKind,
  IntrospectionInputObjectType,
  GraphQLError,
} from "graphql";
import * as path from "path";

import {
  ObjectType,
  Field,
  Resolver,
  Query,
  Arg,
  InputType,
  Root,
  Ctx,
  Mutation,
  Args,
  ArgsType,
  Int,
  buildSchema,
  FieldResolver,
  ResolverInterface,
  Info,
  buildSchemaSync,
  Subscription,
  PubSub,
  PubSubEngine,
  ClassType,
  ConflictingDefaultValuesError,
  WrongNullableListOptionError,
  createParamDecorator,
  CannotDetermineGraphQLTypeError,
  NoExplicitTypeError,
} from "../../src";
import { getMetadataStorage } from "../../src/metadata/getMetadataStorage";
import { getSchemaInfo } from "../helpers/getSchemaInfo";
import { getInnerTypeOfNonNullableType } from "../helpers/getInnerFieldType";

describe("Resolvers", () => {
  describe("Schema", () => {
    let schemaIntrospection: IntrospectionSchema;
    let queryType: IntrospectionObjectType;
    let mutationType: IntrospectionObjectType;
    let sampleObjectType: IntrospectionObjectType;
    let argMethodField: IntrospectionField;

    beforeAll(async () => {
      getMetadataStorage().clear();

      @InputType()
      class SampleInput {
        @Field()
        field: string;
        @Field({ defaultValue: "defaultStringFieldDefaultValue" })
        defaultStringField: string;
        @Field()
        implicitDefaultStringField: string = "implicitDefaultStringFieldDefaultValue";
        @Field()
        inheritDefaultField: string = "inheritDefaultFieldValue";
      }

      @InputType()
      class SampleInputChild extends SampleInput {
        @Field({ defaultValue: "defaultValueOverwritten" })
        defaultStringField: string;
        @Field()
        implicitDefaultStringField: string = "implicitDefaultValueOverwritten";
      }

      @ArgsType()
      class SampleArgs {
        @Field()
        stringArg: string;
        @Field(type => Int, { nullable: true })
        numberArg: number;
        @Field()
        inputObjectArg: SampleInput;
        @Field({ defaultValue: "defaultStringArgDefaultValue" })
        defaultStringArg: string;
        @Field()
        implicitDefaultStringArg: string = "implicitDefaultStringArgDefaultValue";
        @Field()
        inheritDefaultArg: string = "inheritDefaultArgValue";
      }

      @ArgsType()
      class SampleArgsChild extends SampleArgs {
        @Field({ defaultValue: "defaultValueOverwritten" })
        defaultStringArg: string;
        @Field()
        implicitDefaultStringArg: string = "implicitDefaultValueOverwritten";
      }

      @ObjectType()
      class SampleObject {
        @Field()
        normalField: string;

        @Field()
        resolverFieldWithArgs: string;

        @Field()
        get getterField(): string {
          return "getterField";
        }

        @Field()
        simpleMethodField(): string {
          return "simpleMethodField";
        }

        @Field(type => String)
        argMethodField(
          @Arg("stringArg") stringArg: string,
          @Arg("booleanArg") booleanArg: boolean,
          @Arg("numberArg") numberArg: number,
          @Arg("inputArg") inputArg: SampleInput,
          @Arg("inputChildArg") inputChildArg: SampleInputChild,
          @Arg("explicitNullableArg", type => String, { nullable: true })
          explicitNullableArg: any,
          @Arg("explicitArrayArg", type => [String]) explicitArrayArg: any,
          @Arg("defaultStringArg", { defaultValue: "defaultStringArgDefaultValue" })
          defaultStringArg: string,
          @Arg("nullableStringArg", { nullable: true }) nullableStringArg?: string,
        ): any {
          return "argMethodField";
        }
      }

      @Resolver(() => SampleObject)
      class LambdaResolver {
        @Query()
        lambdaQuery(): boolean {
          return true;
        }
      }

      @Resolver(SampleObject)
      class ClassResolver {
        @Query()
        classQuery(): boolean {
          return true;
        }
      }

      @Resolver(of => SampleObject)
      class SampleResolver {
        @Query()
        emptyQuery(): boolean {
          return true;
        }

        @Query()
        implicitStringQuery(): string {
          return "implicitStringQuery";
        }

        @Query(returns => String)
        explicitStringQuery(): any {
          return "explicitStringQuery";
        }

        @Query(returns => String, { nullable: true })
        nullableStringQuery(): string | null {
          return Math.random() > 0.5 ? "explicitStringQuery" : null;
        }

        @Query(returnType => [String])
        explicitStringArrayQuery(): any {
          return [];
        }

        @Query(returnType => [String], { nullable: "items" })
        explicitNullableItemArrayQuery(): any {
          return [];
        }

        @Query(returnType => [String], { nullable: "itemsAndList" })
        explicitNullableArrayWithNullableItemsQuery(): any {
          return [];
        }

        @Query(returns => String)
        async promiseStringQuery(): Promise<string> {
          return "promiseStringQuery";
        }

        @Query()
        implicitObjectQuery(): SampleObject {
          return {} as SampleObject;
        }

        @Query(returns => SampleObject)
        async asyncObjectQuery(): Promise<SampleObject> {
          return {} as SampleObject;
        }

        @Query()
        rootCtxQuery(@Root() root: any, @Ctx() ctx: any): boolean {
          return true;
        }

        @Query(returns => String)
        argQuery(@Arg("arg1") arg1: string, @Arg("arg2") arg2: boolean): any {
          return "argQuery";
        }

        @Query(returns => String)
        argsQuery(@Args() args: SampleArgs): any {
          return "argsQuery";
        }

        @Query(returns => String)
        argAndArgsQuery(@Arg("arg1") arg1: string, @Args() args: SampleArgs): any {
          return "argAndArgsQuery";
        }

        @Query(returns => String)
        argsInheritanceQuery(@Args() args: SampleArgsChild): any {
          return "argsInheritanceQuery";
        }

        @Mutation()
        emptyMutation(): boolean {
          return true;
        }

        @FieldResolver()
        resolverFieldWithArgs(@Arg("arg1") arg1: string, @Arg("arg2") arg2: boolean) {
          return "resolverFieldWithArgs";
        }

        @FieldResolver(type => String, { nullable: true, description: "independent" })
        independentFieldResolver(@Arg("arg1") arg1: string, @Arg("arg2") arg2: boolean) {
          return "resolverFieldWithArgs";
        }

        @FieldResolver(type => String, { name: "overwrittenField", nullable: true })
        overwrittenFieldResolver() {
          return "overwrittenFieldResolver";
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
      argMethodField = sampleObjectType.fields.find(field => field.name === "argMethodField")!;
    });

    // helpers
    function getQuery(queryName: string) {
      return queryType.fields.find(field => field.name === queryName)!;
    }
    function getMutation(mutationName: string) {
      return mutationType.fields.find(field => field.name === mutationName)!;
    }

    it("should generate schema without errors", async () => {
      expect(schemaIntrospection).toBeDefined();
    });

    describe("Fields", () => {
      it("should generate proper field type for property getter", async () => {
        const getterField = sampleObjectType.fields.find(field => field.name === "getterField")!;
        const getterFieldType = getterField.type as IntrospectionNonNullTypeRef;
        const getterFieldInnerType = getterFieldType.ofType as IntrospectionNamedTypeRef;

        expect(getterField.name).toEqual("getterField");
        expect(getterField.args).toHaveLength(0);
        expect(getterFieldType.kind).toEqual(TypeKind.NON_NULL);
        expect(getterFieldInnerType.kind).toEqual(TypeKind.SCALAR);
        expect(getterFieldInnerType.name).toEqual("String");
      });

      it("should generate proper field type for simple class method", async () => {
        const simpleMethodField = sampleObjectType.fields.find(
          field => field.name === "simpleMethodField",
        )!;
        const simpleMethodFieldType = simpleMethodField.type as IntrospectionNonNullTypeRef;
        const simpleMethodFieldInnerType =
          simpleMethodFieldType.ofType as IntrospectionNamedTypeRef;

        expect(simpleMethodField.name).toEqual("simpleMethodField");
        expect(simpleMethodField.args).toHaveLength(0);
        expect(simpleMethodFieldType.kind).toEqual(TypeKind.NON_NULL);
        expect(simpleMethodFieldInnerType.kind).toEqual(TypeKind.SCALAR);
        expect(simpleMethodFieldInnerType.name).toEqual("String");
      });

      it("should generate proper field type for class method with args", async () => {
        const argMethodFieldType = argMethodField.type as IntrospectionNonNullTypeRef;
        const argMethodFieldInnerType = argMethodFieldType.ofType as IntrospectionNamedTypeRef;

        expect(argMethodField.name).toEqual("argMethodField");
        expect(argMethodField.args).toHaveLength(9);
        expect(argMethodFieldType.kind).toEqual(TypeKind.NON_NULL);
        expect(argMethodFieldInnerType.kind).toEqual(TypeKind.SCALAR);
        expect(argMethodFieldInnerType.name).toEqual("String");
      });
    });

    describe("Inline args", () => {
      it("should generate normal string arg type for object field method", async () => {
        const stringArg = argMethodField.args.find(arg => arg.name === "stringArg")!;
        const stringArgType = stringArg.type as IntrospectionNonNullTypeRef;
        const stringArgInnerType = stringArgType.ofType as IntrospectionNamedTypeRef;

        expect(stringArg.name).toEqual("stringArg");
        expect(stringArgType.kind).toEqual(TypeKind.NON_NULL);
        expect(stringArgInnerType.kind).toEqual(TypeKind.SCALAR);
        expect(stringArgInnerType.name).toEqual("String");
      });

      it("should generate normal boolean arg type for object field method", async () => {
        const booleanArg = argMethodField.args.find(arg => arg.name === "booleanArg")!;
        const booleanArgType = booleanArg.type as IntrospectionNonNullTypeRef;
        const booleanArgInnerType = booleanArgType.ofType as IntrospectionNamedTypeRef;

        expect(booleanArg.name).toEqual("booleanArg");
        expect(booleanArgType.kind).toEqual(TypeKind.NON_NULL);
        expect(booleanArgInnerType.kind).toEqual(TypeKind.SCALAR);
        expect(booleanArgInnerType.name).toEqual("Boolean");
      });

      it("should generate normal number arg type for object field method", async () => {
        const numberArg = argMethodField.args.find(arg => arg.name === "numberArg")!;
        const numberArgType = numberArg.type as IntrospectionNonNullTypeRef;
        const numberArgInnerType = numberArgType.ofType as IntrospectionNamedTypeRef;

        expect(numberArg.name).toEqual("numberArg");
        expect(numberArgType.kind).toEqual(TypeKind.NON_NULL);
        expect(numberArgInnerType.kind).toEqual(TypeKind.SCALAR);
        expect(numberArgInnerType.name).toEqual("Float");
      });

      it("should generate nullable string arg type for object field method when explicitly sets", async () => {
        const explicitNullableArg = argMethodField.args.find(
          arg => arg.name === "explicitNullableArg",
        )!;
        const explicitNullableArgType = explicitNullableArg.type as IntrospectionNamedTypeRef;

        expect(explicitNullableArg.name).toEqual("explicitNullableArg");
        expect(explicitNullableArgType.kind).toEqual(TypeKind.SCALAR);
        expect(explicitNullableArgType.name).toEqual("String");
      });

      it("should generate string array arg type for object field method when explicitly sets", async () => {
        const explicitArrayArg = argMethodField.args.find(arg => arg.name === "explicitArrayArg")!;
        const explicitArrayArgType = explicitArrayArg.type as IntrospectionNonNullTypeRef;
        const explicitArrayArgArrayType = explicitArrayArgType.ofType as IntrospectionListTypeRef;
        const explicitArrayArgInnerType =
          explicitArrayArgArrayType.ofType as IntrospectionNonNullTypeRef;
        const explicitArrayArgArrayItemType =
          explicitArrayArgInnerType.ofType as IntrospectionNamedTypeRef;

        expect(explicitArrayArg.name).toEqual("explicitArrayArg");
        expect(explicitArrayArgType.kind).toEqual(TypeKind.NON_NULL);
        expect(explicitArrayArgArrayType.kind).toEqual(TypeKind.LIST);
        expect(explicitArrayArgInnerType.kind).toEqual(TypeKind.NON_NULL);
        expect(explicitArrayArgArrayItemType.kind).toEqual(TypeKind.SCALAR);
        expect(explicitArrayArgArrayItemType.name).toEqual("String");
      });

      it("should generate nullable string arg type for object field method", async () => {
        const nullableStringArg = argMethodField.args.find(
          arg => arg.name === "nullableStringArg",
        )!;
        const nullableStringArgType = nullableStringArg.type as IntrospectionNamedTypeRef;

        expect(nullableStringArg.name).toEqual("nullableStringArg");
        expect(nullableStringArgType.kind).toEqual(TypeKind.SCALAR);
        expect(nullableStringArgType.name).toEqual("String");
      });

      it("should generate input object arg type for object field method", async () => {
        const inputArg = argMethodField.args.find(arg => arg.name === "inputArg")!;
        const inputArgType = inputArg.type as IntrospectionNonNullTypeRef;
        const inputArgInnerType = inputArgType.ofType as IntrospectionNamedTypeRef;

        expect(inputArg.name).toEqual("inputArg");
        expect(inputArgType.kind).toEqual(TypeKind.NON_NULL);
        expect(inputArgInnerType.kind).toEqual(TypeKind.INPUT_OBJECT);
        expect(inputArgInnerType.name).toEqual("SampleInput");
      });

      it("should generate non-nullable string arg type with defaultValue for object field method", async () => {
        const inputArg = argMethodField.args.find(arg => arg.name === "defaultStringArg")!;
        const defaultValueStringArgType = inputArg.type as IntrospectionNamedTypeRef;

        expect(inputArg.defaultValue).toBe('"defaultStringArgDefaultValue"');
        expect(defaultValueStringArgType).toEqual({
          kind: "NON_NULL",
          name: null,
          ofType: {
            kind: "SCALAR",
            name: "String",
            ofType: null,
          },
        });
      });
    });

    describe("Input object", () => {
      let sampleInputType: IntrospectionInputObjectType;
      let sampleInputChildType: IntrospectionInputObjectType;

      beforeAll(() => {
        sampleInputType = schemaIntrospection.types.find(
          field => field.name === "SampleInput",
        )! as IntrospectionInputObjectType;
        sampleInputChildType = schemaIntrospection.types.find(
          field => field.name === "SampleInputChild",
        )! as IntrospectionInputObjectType;
      });

      it("should generate non-nullable string arg type with defaultValue for input object field", async () => {
        const defaultValueStringField = sampleInputType.inputFields.find(
          arg => arg.name === "defaultStringField",
        )!;
        const defaultValueStringFieldType =
          defaultValueStringField.type as IntrospectionNamedTypeRef;

        expect(defaultValueStringField.defaultValue).toBe('"defaultStringFieldDefaultValue"');
        expect(defaultValueStringFieldType).toEqual({
          kind: "NON_NULL",
          name: null,
          ofType: {
            kind: "SCALAR",
            name: "String",
            ofType: null,
          },
        });
      });

      it("should generate non-nullable string arg type with implicit defaultValue for input object field", async () => {
        const implicitDefaultValueStringField = sampleInputType.inputFields.find(
          arg => arg.name === "implicitDefaultStringField",
        )!;
        const implicitDefaultValueStringFieldType =
          implicitDefaultValueStringField.type as IntrospectionNamedTypeRef;

        expect(implicitDefaultValueStringField.defaultValue).toBe(
          '"implicitDefaultStringFieldDefaultValue"',
        );
        expect(implicitDefaultValueStringFieldType).toEqual({
          kind: "NON_NULL",
          name: null,
          ofType: {
            kind: "SCALAR",
            name: "String",
            ofType: null,
          },
        });
      });

      it("should overwrite defaultValue in child input object", async () => {
        const defaultValueStringField = sampleInputChildType.inputFields.find(
          arg => arg.name === "defaultStringField",
        )!;
        const defaultValueStringFieldType =
          defaultValueStringField.type as IntrospectionNamedTypeRef;

        expect(defaultValueStringField.defaultValue).toBe('"defaultValueOverwritten"');
        expect(defaultValueStringFieldType).toEqual({
          kind: "NON_NULL",
          name: null,
          ofType: {
            kind: "SCALAR",
            name: "String",
            ofType: null,
          },
        });
      });

      it("should overwrite implicit defaultValue in child input object", async () => {
        const implicitDefaultValueStringField = sampleInputChildType.inputFields.find(
          arg => arg.name === "implicitDefaultStringField",
        )!;
        const implicitDefaultValueStringFieldType =
          implicitDefaultValueStringField.type as IntrospectionNamedTypeRef;

        expect(implicitDefaultValueStringField.defaultValue).toBe(
          '"implicitDefaultValueOverwritten"',
        );
        expect(implicitDefaultValueStringFieldType).toEqual({
          kind: "NON_NULL",
          name: null,
          ofType: {
            kind: "SCALAR",
            name: "String",
            ofType: null,
          },
        });
      });

      it("should inherit field with defaultValue from parent", async () => {
        const inheritDefaultField = sampleInputChildType.inputFields.find(
          arg => arg.name === "inheritDefaultField",
        )!;
        const inheritDefaultFieldType = inheritDefaultField.type as IntrospectionNamedTypeRef;

        expect(inheritDefaultField.defaultValue).toBe('"inheritDefaultFieldValue"');
        expect(inheritDefaultFieldType).toEqual({
          kind: "NON_NULL",
          name: null,
          ofType: {
            kind: "SCALAR",
            name: "String",
            ofType: null,
          },
        });
      });
    });

    describe("Args object", () => {
      it("should generate simple arg from args object field", async () => {
        const argsQuery = getQuery("argsQuery");
        const stringArg = argsQuery.args.find(arg => arg.name === "stringArg")!;
        const stringArgInnerType = (stringArg.type as IntrospectionNonNullTypeRef)
          .ofType as IntrospectionNamedTypeRef;

        expect(stringArg.name).toEqual("stringArg");
        expect(stringArgInnerType.kind).toEqual(TypeKind.SCALAR);
        expect(stringArgInnerType.name).toEqual("String");
      });

      it("should generate non-nullable type arg with defaultValue from args object field", async () => {
        const argsQuery = getQuery("argsQuery");
        const defaultStringArg = argsQuery.args.find(arg => arg.name === "defaultStringArg")!;
        const defaultStringArgType = defaultStringArg.type as IntrospectionNamedTypeRef;

        expect(defaultStringArg.name).toEqual("defaultStringArg");
        expect(defaultStringArg.defaultValue).toEqual('"defaultStringArgDefaultValue"');
        expect(defaultStringArgType).toEqual({
          kind: "NON_NULL",
          name: null,
          ofType: {
            kind: "SCALAR",
            name: "String",
            ofType: null,
          },
        });
      });

      it("should overwrite defaultValue in child args object field", async () => {
        const argsQuery = getQuery("argsInheritanceQuery");
        const defaultStringArg = argsQuery.args.find(arg => arg.name === "defaultStringArg")!;
        const defaultStringArgType = defaultStringArg.type as IntrospectionNamedTypeRef;

        expect(defaultStringArg.name).toEqual("defaultStringArg");
        expect(defaultStringArg.defaultValue).toEqual('"defaultValueOverwritten"');
        expect(defaultStringArgType).toEqual({
          kind: "NON_NULL",
          name: null,
          ofType: {
            kind: "SCALAR",
            name: "String",
            ofType: null,
          },
        });
      });

      it("should overwrite implicit defaultValue in child args object field", async () => {
        const argsQuery = getQuery("argsInheritanceQuery");
        const implicitDefaultStringArg = argsQuery.args.find(
          arg => arg.name === "implicitDefaultStringArg",
        )!;
        const implicitDefaultStringArgType =
          implicitDefaultStringArg.type as IntrospectionNamedTypeRef;

        expect(implicitDefaultStringArg.name).toEqual("implicitDefaultStringArg");
        expect(implicitDefaultStringArg.defaultValue).toEqual('"implicitDefaultValueOverwritten"');
        expect(implicitDefaultStringArgType).toEqual({
          kind: "NON_NULL",
          name: null,
          ofType: {
            kind: "SCALAR",
            name: "String",
            ofType: null,
          },
        });
      });

      it("should inherit defaultValue field from parent args object field", async () => {
        const argsQuery = getQuery("argsInheritanceQuery");
        const inheritDefaultArg = argsQuery.args.find(arg => arg.name === "inheritDefaultArg")!;
        const inheritDefaultArgType = inheritDefaultArg.type as IntrospectionNamedTypeRef;

        expect(inheritDefaultArg.name).toEqual("inheritDefaultArg");
        expect(inheritDefaultArg.defaultValue).toEqual('"inheritDefaultArgValue"');
        expect(inheritDefaultArgType).toEqual({
          kind: "NON_NULL",
          name: null,
          ofType: {
            kind: "SCALAR",
            name: "String",
            ofType: null,
          },
        });
      });

      it("should generate non-nullable type arg with implicit defaultValue from args object field", async () => {
        const argsQuery = getQuery("argsQuery");
        const implicitDefaultStringArg = argsQuery.args.find(
          arg => arg.name === "implicitDefaultStringArg",
        )!;
        const implicitDefaultStringArgType =
          implicitDefaultStringArg.type as IntrospectionNamedTypeRef;

        expect(implicitDefaultStringArg.name).toEqual("implicitDefaultStringArg");
        expect(implicitDefaultStringArg.defaultValue).toEqual(
          '"implicitDefaultStringArgDefaultValue"',
        );
        expect(implicitDefaultStringArgType).toEqual({
          kind: "NON_NULL",
          name: null,
          ofType: {
            kind: "SCALAR",
            name: "String",
            ofType: null,
          },
        });
      });

      it("should generate nullable type arg from args object field", async () => {
        const argsQuery = getQuery("argsQuery");
        const numberArg = argsQuery.args.find(arg => arg.name === "numberArg")!;
        const numberArgType = numberArg.type as IntrospectionNamedTypeRef;

        expect(numberArg.name).toEqual("numberArg");
        expect(numberArgType.kind).toEqual(TypeKind.SCALAR);
        expect(numberArgType.name).toEqual("Int");
      });

      it("should generate input object type arg from args object field", async () => {
        const argsQuery = getQuery("argsQuery");
        const inputObjectArg = argsQuery.args.find(arg => arg.name === "inputObjectArg")!;
        const inputObjectArgInnerType = (inputObjectArg.type as IntrospectionNonNullTypeRef)
          .ofType as IntrospectionNamedTypeRef;

        expect(inputObjectArg.name).toEqual("inputObjectArg");
        expect(inputObjectArgInnerType.kind).toEqual(TypeKind.INPUT_OBJECT);
        expect(inputObjectArgInnerType.name).toEqual("SampleInput");
      });

      it("should generate field args from field resolver args definition", async () => {
        const resolverFieldWithArgs = sampleObjectType.fields.find(
          field => field.name === "resolverFieldWithArgs",
        )!;

        const fieldResolverArgs = resolverFieldWithArgs.args;
        expect(fieldResolverArgs).toHaveLength(2);

        const arg1 = fieldResolverArgs.find(arg => arg.name === "arg1")!;
        const arg1InnerType = (arg1.type as IntrospectionNonNullTypeRef)
          .ofType as IntrospectionNamedTypeRef;
        const arg2 = fieldResolverArgs.find(arg => arg.name === "arg2")!;
        const arg2InnerType = (arg2.type as IntrospectionNonNullTypeRef)
          .ofType as IntrospectionNamedTypeRef;

        expect(arg1InnerType.kind).toEqual(TypeKind.SCALAR);
        expect(arg1InnerType.name).toEqual("String");
        expect(arg2InnerType.kind).toEqual(TypeKind.SCALAR);
        expect(arg2InnerType.name).toEqual("Boolean");
      });

      it("should generate object field type from independent field resolver", async () => {
        const independentFieldResolver = sampleObjectType.fields.find(
          field => field.name === "independentFieldResolver",
        )!;
        const fieldResolverArgs = independentFieldResolver.args;
        const arg1Type = getInnerTypeOfNonNullableType(
          fieldResolverArgs.find(arg => arg.name === "arg1")!,
        );
        const arg2Type = getInnerTypeOfNonNullableType(
          fieldResolverArgs.find(arg => arg.name === "arg2")!,
        );
        const independentFieldResolverType =
          independentFieldResolver.type as IntrospectionNamedTypeRef;

        expect(independentFieldResolver.description).toEqual("independent");
        expect(independentFieldResolverType.kind).toEqual("SCALAR");
        expect(independentFieldResolverType.name).toEqual("String");
        expect(fieldResolverArgs).toHaveLength(2);
        expect(arg1Type.kind).toEqual(TypeKind.SCALAR);
        expect(arg1Type.name).toEqual("String");
        expect(arg2Type.kind).toEqual(TypeKind.SCALAR);
        expect(arg2Type.name).toEqual("Boolean");
      });

      it("should overwrite object field name from field resolver decorator option", async () => {
        const overwrittenField = sampleObjectType.fields.find(
          field => field.name === "overwrittenField",
        )!;
        const overwrittenFieldResolver = sampleObjectType.fields.find(
          field => field.name === "overwrittenFieldResolver",
        )!;
        const independentFieldResolverType = overwrittenField.type as IntrospectionNamedTypeRef;

        expect(overwrittenFieldResolver).toBeUndefined();
        expect(independentFieldResolverType.kind).toEqual("SCALAR");
        expect(independentFieldResolverType.name).toEqual("String");
      });
    });

    describe("Handlers", () => {
      it("should generate proper definition for query method", async () => {
        const emptyQuery = getQuery("emptyQuery");
        const emptyQueryReturnType = emptyQuery.type as IntrospectionNonNullTypeRef;
        const emptyQueryInnerReturnType = emptyQueryReturnType.ofType as IntrospectionNamedTypeRef;

        expect(emptyQuery.args).toHaveLength(0);
        expect(emptyQuery.name).toEqual("emptyQuery");
        expect(emptyQueryReturnType.kind).toEqual(TypeKind.NON_NULL);
        expect(emptyQueryInnerReturnType.kind).toEqual(TypeKind.SCALAR);
        expect(emptyQueryInnerReturnType.name).toEqual("Boolean");
      });

      it("should generate proper definition for mutation method", async () => {
        const emptyMutation = getMutation("emptyMutation");
        const emptyMutationReturnType = emptyMutation.type as IntrospectionNonNullTypeRef;
        const emptyMutationInnerReturnType =
          emptyMutationReturnType.ofType as IntrospectionNamedTypeRef;

        expect(emptyMutation.args).toHaveLength(0);
        expect(emptyMutation.name).toEqual("emptyMutation");
        expect(emptyMutationReturnType.kind).toEqual(TypeKind.NON_NULL);
        expect(emptyMutationInnerReturnType.kind).toEqual(TypeKind.SCALAR);
        expect(emptyMutationInnerReturnType.name).toEqual("Boolean");
      });

      it("should generate implicit string return type for query method", async () => {
        const implicitStringQuery = getQuery("implicitStringQuery");
        const implicitStringQueryType = implicitStringQuery.type as IntrospectionNonNullTypeRef;
        const implicitStringQueryInnerType =
          implicitStringQueryType.ofType as IntrospectionNamedTypeRef;

        expect(implicitStringQueryInnerType.kind).toEqual(TypeKind.SCALAR);
        expect(implicitStringQueryInnerType.name).toEqual("String");
      });

      it("should generate string return type for query when explicitly set", async () => {
        const explicitStringQuery = getQuery("explicitStringQuery");
        const explicitStringQueryType = explicitStringQuery.type as IntrospectionNonNullTypeRef;
        const explicitStringQueryInnerType =
          explicitStringQueryType.ofType as IntrospectionNamedTypeRef;

        expect(explicitStringQueryInnerType.kind).toEqual(TypeKind.SCALAR);
        expect(explicitStringQueryInnerType.name).toEqual("String");
      });

      it("should generate nullable string return type for query when explicitly set", async () => {
        const nullableStringQuery = getQuery("nullableStringQuery");
        const nullableStringQueryType = nullableStringQuery.type as IntrospectionNamedTypeRef;

        expect(nullableStringQueryType.kind).toEqual(TypeKind.SCALAR);
        expect(nullableStringQueryType.name).toEqual("String");
      });

      it("should generate explicit array string return type for query", async () => {
        const explicitStringArrayQuery = getQuery("explicitStringArrayQuery");
        const type = explicitStringArrayQuery.type as IntrospectionNonNullTypeRef;
        const listType = type.ofType as IntrospectionListTypeRef;
        const nonNullItemType = listType.ofType as IntrospectionNonNullTypeRef;
        const itemType = nonNullItemType.ofType as IntrospectionNamedTypeRef;

        expect(listType.kind).toEqual(TypeKind.LIST);
        expect(itemType.kind).toEqual(TypeKind.SCALAR);
        expect(itemType.name).toEqual("String");
      });

      it("should generate explicit array of nullable string return type for query", async () => {
        const explicitNullableItemArrayQuery = getQuery("explicitNullableItemArrayQuery");
        const type = explicitNullableItemArrayQuery.type as IntrospectionNonNullTypeRef;
        const listType = type.ofType as IntrospectionListTypeRef;
        const itemType = listType.ofType as IntrospectionNamedTypeRef;

        expect(type.kind).toEqual(TypeKind.NON_NULL);
        expect(listType.kind).toEqual(TypeKind.LIST);
        expect(itemType.kind).toEqual(TypeKind.SCALAR);
        expect(itemType.name).toEqual("String");
      });

      it("should generate explicit nullable array of nullable string return type for query", async () => {
        const explicitNullableArrayWithNullableItemsQuery = getQuery(
          "explicitNullableArrayWithNullableItemsQuery",
        );
        const listType =
          explicitNullableArrayWithNullableItemsQuery.type as IntrospectionListTypeRef;
        const itemType = listType.ofType as IntrospectionNamedTypeRef;

        expect(listType.kind).toEqual(TypeKind.LIST);
        expect(itemType.kind).toEqual(TypeKind.SCALAR);
        expect(itemType.name).toEqual("String");
      });

      it("should generate string return type for query returning Promise", async () => {
        const promiseStringQuery = getQuery("promiseStringQuery");
        const promiseStringQueryType = promiseStringQuery.type as IntrospectionNonNullTypeRef;
        const promiseStringQueryInnerType =
          promiseStringQueryType.ofType as IntrospectionNamedTypeRef;

        expect(promiseStringQueryInnerType.kind).toEqual(TypeKind.SCALAR);
        expect(promiseStringQueryInnerType.name).toEqual("String");
      });

      it("should generate object return type for query returning promise", async () => {
        const asyncObjectQuery = getQuery("asyncObjectQuery");
        const asyncObjectQueryType = asyncObjectQuery.type as IntrospectionNonNullTypeRef;
        const asyncObjectQueryInnerType = asyncObjectQueryType.ofType as IntrospectionNamedTypeRef;

        expect(asyncObjectQueryInnerType.kind).toEqual(TypeKind.OBJECT);
        expect(asyncObjectQueryInnerType.name).toEqual("SampleObject");
      });

      it("should generate object return type for query method", async () => {
        const implicitObjectQuery = getQuery("implicitObjectQuery");
        const implicitObjectQueryType = implicitObjectQuery.type as IntrospectionNonNullTypeRef;
        const implicitObjectQueryInnerType =
          implicitObjectQueryType.ofType as IntrospectionNamedTypeRef;

        expect(implicitObjectQueryInnerType.kind).toEqual(TypeKind.OBJECT);
        expect(implicitObjectQueryInnerType.name).toEqual("SampleObject");
      });

      it("should not generate args type for query using @Root and @Ctx decorators", async () => {
        const rootCtxQuery = getQuery("rootCtxQuery");

        expect(rootCtxQuery.args).toHaveLength(0);
      });

      it("should generate proper definition for query with @Arg", async () => {
        const argQuery = getQuery("argQuery");

        expect(argQuery.name).toEqual("argQuery");
        expect(argQuery.args).toHaveLength(2);
      });

      it("should generate proper definition for query with @Args", async () => {
        const argsQuery = getQuery("argsQuery");

        expect(argsQuery.name).toEqual("argsQuery");
        expect(argsQuery.args).toHaveLength(6);
      });

      it("should generate proper definition for query with both @Arg and @Args", async () => {
        const argAndArgsQuery = getQuery("argAndArgsQuery");

        expect(argAndArgsQuery.name).toEqual("argAndArgsQuery");
        expect(argAndArgsQuery.args).toHaveLength(7);
      });
    });

    describe("Errors", () => {
      beforeEach(() => {
        getMetadataStorage().clear();
      });

      it("should throw error when arg type is not correct", async () => {
        expect.assertions(3);

        try {
          @Resolver()
          class SampleResolverWithError {
            @Query(returns => String)
            sampleQuery(@Arg("arg") arg: any): string {
              return "sampleQuery";
            }
          }
        } catch (err) {
          expect(err).toBeInstanceOf(Error);
          expect(err).toBeInstanceOf(NoExplicitTypeError);
          const error = err as NoExplicitTypeError;
          expect(error.message).toMatchInlineSnapshot(
            `"Unable to infer GraphQL type from TypeScript reflection system. You need to provide explicit type for argument named 'arg' of 'sampleQuery' of 'SampleResolverWithError' class."`,
          );
        }
      });

      it("should throw error when query return type not provided", async () => {
        expect.assertions(3);

        try {
          @Resolver()
          class SampleResolverWithError {
            @Query()
            sampleQuery() {
              return "sampleQuery";
            }
          }
        } catch (err) {
          expect(err).toBeInstanceOf(Error);
          expect(err).toBeInstanceOf(NoExplicitTypeError);
          const error = err as NoExplicitTypeError;
          expect(error.message).toMatchInlineSnapshot(
            `"Unable to infer GraphQL type from TypeScript reflection system. You need to provide explicit type for 'sampleQuery' of 'SampleResolverWithError' class."`,
          );
        }
      });

      it("should throw error when provided query return type is not correct", async () => {
        expect.assertions(3);

        try {
          @Resolver()
          class SampleResolverWithError {
            @Query()
            sampleQuery(): any {
              return "sampleQuery";
            }
          }
        } catch (err) {
          expect(err).toBeInstanceOf(Error);
          expect(err).toBeInstanceOf(NoExplicitTypeError);
          const error = err as NoExplicitTypeError;
          expect(error.message).toMatchInlineSnapshot(
            `"Unable to infer GraphQL type from TypeScript reflection system. You need to provide explicit type for 'sampleQuery' of 'SampleResolverWithError' class."`,
          );
        }
      });

      it("should throw error when mutation return type not provided", async () => {
        expect.assertions(3);

        try {
          @Resolver()
          class SampleResolverWithError {
            @Mutation()
            sampleMutation() {
              return "sampleMutation";
            }
          }
        } catch (err) {
          expect(err).toBeInstanceOf(Error);
          expect(err).toBeInstanceOf(NoExplicitTypeError);
          const error = err as NoExplicitTypeError;
          expect(error.message).toMatchInlineSnapshot(
            `"Unable to infer GraphQL type from TypeScript reflection system. You need to provide explicit type for 'sampleMutation' of 'SampleResolverWithError' class."`,
          );
        }
      });

      it("should throw error provided mutation return type is not correct", async () => {
        expect.assertions(3);

        try {
          @Resolver()
          class SampleResolverWithError {
            @Mutation()
            sampleMutation(): any {
              return "sampleMutation";
            }
          }
        } catch (err) {
          expect(err).toBeInstanceOf(Error);
          expect(err).toBeInstanceOf(NoExplicitTypeError);
          const error = err as NoExplicitTypeError;
          expect(error.message).toMatchInlineSnapshot(
            `"Unable to infer GraphQL type from TypeScript reflection system. You need to provide explicit type for 'sampleMutation' of 'SampleResolverWithError' class."`,
          );
        }
      });

      it("should throw error when creating field resolver in resolver with no object type info", async () => {
        expect.assertions(2);

        @ObjectType()
        class SampleObjectWithError {
          @Field()
          sampleField: string;
        }

        try {
          @Resolver()
          class SampleResolverWithError {
            @Query()
            sampleQuery(): string {
              return "sampleQuery";
            }
            @FieldResolver()
            sampleField() {
              return "sampleField";
            }
          }
          await buildSchema({
            resolvers: [SampleResolverWithError],
          });
        } catch (err) {
          expect(err).toBeInstanceOf(Error);
          const error = err as NoExplicitTypeError;
          expect(error.message).toMatchInlineSnapshot(
            `"No provided object type in '@Resolver' decorator for class 'SampleResolverWithError!'"`,
          );
        }
      });

      it("should throw error when creating independent field resolver with no type info", async () => {
        expect.assertions(3);

        @ObjectType()
        class SampleObjectWithError {
          @Field()
          sampleField: string;
        }

        try {
          @Resolver(of => SampleObjectWithError)
          class SampleResolverWithError {
            @Query()
            sampleQuery(): string {
              return "sampleQuery";
            }
            @FieldResolver()
            independentField() {
              return "independentField";
            }
          }
          await buildSchema({
            resolvers: [SampleResolverWithError],
          });
        } catch (err) {
          expect(err).toBeInstanceOf(Error);
          expect(err).toBeInstanceOf(NoExplicitTypeError);
          const error = err as NoExplicitTypeError;
          expect(error.message).toMatchInlineSnapshot(
            `"Unable to infer GraphQL type from TypeScript reflection system. You need to provide explicit type for 'independentField' of 'SampleResolverWithError' class."`,
          );
        }
      });

      it("should throw error when using undecorated class as an explicit type", async () => {
        expect.assertions(3);

        class SampleUndecoratedObject {
          sampleField: string;
        }

        try {
          @Resolver()
          class SampleResolverWithError {
            @Query(returns => SampleUndecoratedObject)
            sampleQuery(): string {
              return "sampleQuery";
            }
          }
          await buildSchema({
            resolvers: [SampleResolverWithError],
          });
        } catch (err) {
          expect(err).toBeInstanceOf(Error);
          expect(err).toBeInstanceOf(CannotDetermineGraphQLTypeError);
          const error = err as CannotDetermineGraphQLTypeError;
          expect(error.message).toMatchInlineSnapshot(
            `"Cannot determine GraphQL output type for 'sampleQuery' of 'SampleResolverWithError' class. Is the value, that is used as its TS type or explicit type, decorated with a proper decorator or is it a proper output value?"`,
          );
        }
      });

      it("should throw error when using object type class is used as explicit type in place of input type", async () => {
        expect.assertions(3);

        @ObjectType()
        class SampleObject {
          @Field()
          sampleField: string;
        }

        try {
          @Resolver()
          class SampleResolverWithError {
            @Query()
            sampleQuery(@Arg("input") input: SampleObject): string {
              return "sampleQuery";
            }
          }
          await buildSchema({
            resolvers: [SampleResolverWithError],
          });
        } catch (err) {
          expect(err).toBeInstanceOf(Error);
          expect(err).toBeInstanceOf(CannotDetermineGraphQLTypeError);
          const error = err as CannotDetermineGraphQLTypeError;
          expect(error.message).toMatchInlineSnapshot(
            `"Cannot determine GraphQL input type for argument named 'input' of 'sampleQuery' of 'SampleResolverWithError' class. Is the value, that is used as its TS type or explicit type, decorated with a proper decorator or is it a proper input value?"`,
          );
        }
      });

      it("should throw error when using object type class is used as explicit type in place of args type", async () => {
        expect.assertions(2);

        @ObjectType()
        class SampleObject {
          @Field()
          sampleField: string;
        }

        try {
          @Resolver()
          class SampleResolverWithError {
            @Query()
            sampleQuery(@Args() args: SampleObject): string {
              return "sampleQuery";
            }
          }
          await buildSchema({
            resolvers: [SampleResolverWithError],
          });
        } catch (err) {
          expect(err).toBeInstanceOf(Error);
          const error = err as Error;
          expect(error.message).toMatchInlineSnapshot(
            `"The value used as a type of '@Args' for 'sampleQuery' of 'SampleResolverWithError' is not a class decorated with '@ArgsType' decorator!"`,
          );
        }
      });

      it("should throw error when declared default values are not equal", async () => {
        expect.assertions(3);

        try {
          @InputType()
          class SampleInput {
            @Field({ defaultValue: "decoratorDefaultValue" })
            inputField: string = "initializerDefaultValue";
          }

          @Resolver()
          class SampleResolver {
            @Query()
            sampleQuery(@Arg("input") input: SampleInput): string {
              return "sampleQuery";
            }
          }
          await buildSchema({ resolvers: [SampleResolver] });
        } catch (err) {
          expect(err).toBeInstanceOf(Error);
          expect(err).toBeInstanceOf(ConflictingDefaultValuesError);
          const error = err as ConflictingDefaultValuesError;
          expect(error.message).toMatchInlineSnapshot(
            `"The 'inputField' field of 'SampleInput' has conflicting default values. Default value from decorator ('decoratorDefaultValue') is not equal to the property initializer value ('initializerDefaultValue')."`,
          );
        }
      });

      it("should throw error when list nullable option is combined with non-list type", async () => {
        expect.assertions(3);

        try {
          @InputType()
          class SampleInput {
            @Field({ nullable: "items" })
            inputField: string;
          }

          @Resolver()
          class SampleResolver {
            @Query()
            sampleQuery(@Arg("input") input: SampleInput): string {
              return "sampleQuery";
            }
          }
          const resolvers = [SampleResolver] as const;
          await buildSchema({ resolvers });
        } catch (err) {
          expect(err).toBeInstanceOf(Error);
          expect(err).toBeInstanceOf(WrongNullableListOptionError);
          const error = err as WrongNullableListOptionError;
          expect(error.message).toMatchInlineSnapshot(
            `"Wrong nullable option set for SampleInput#inputField. You cannot combine non-list type with nullable 'items'."`,
          );
        }
      });
    });
  });

  describe("Functional", () => {
    const classes: any = {};
    let schema: GraphQLSchema;

    let queryRoot: any;
    let queryContext: any;
    let queryInfo: any;
    let queryFirstCustom: any;
    let querySecondCustom: any;
    let descriptorEvaluated: boolean;
    let sampleObjectConstructorCallCount: number;
    let validationErrors: GraphQLError[];

    function DescriptorDecorator(): MethodDecorator {
      return (obj, methodName, descriptor: any) => {
        const originalMethod: Function = descriptor.value;
        descriptor.value = function () {
          descriptorEvaluated = true;
          return originalMethod.apply(this, arguments);
        };
      };
    }

    let mutationInputValue: any;
    beforeEach(() => {
      queryRoot = undefined;
      queryContext = undefined;
      queryInfo = undefined;
      queryFirstCustom = undefined;
      querySecondCustom = undefined;
      descriptorEvaluated = false;
      sampleObjectConstructorCallCount = 0;
      mutationInputValue = undefined;
      validationErrors = [];
    });

    beforeAll(async () => {
      getMetadataStorage().clear();

      const FirstCustomArgDecorator = () => createParamDecorator(resolverData => resolverData);
      const SecondCustomArgDecorator = (arg: string) => createParamDecorator(async () => arg);

      @ArgsType()
      class SampleArgs {
        private readonly TRUE = true;
        instanceField = Math.random();

        @Field()
        factor: number;

        isTrue() {
          return this.TRUE;
        }
      }
      classes.SampleArgs = SampleArgs;

      @ArgsType()
      class SampleOptionalArgs {
        @Field()
        stringField: string;

        @Field({ nullable: true })
        optionalField?: string;
      }
      classes.SampleOptionalArgs = SampleOptionalArgs;

      @InputType()
      class SampleInput {
        private readonly TRUE = true;
        instanceField = Math.random();

        @Field()
        factor: number;

        isTrue() {
          return this.TRUE;
        }
      }
      classes.SampleInput = SampleInput;

      @InputType()
      class SampleNestedInput {
        instanceField = Math.random();

        @Field()
        nestedField: SampleInput;

        @Field({ nullable: true })
        optionalNestedField?: SampleInput;

        @Field(type => [SampleInput])
        nestedArrayField: SampleInput[];

        @Field(type => [SampleInput], { nullable: "itemsAndList" })
        nestedOptionalArrayField?: Array<SampleInput | undefined>;
      }
      classes.SampleNestedInput = SampleNestedInput;

      @InputType()
      class SampleTripleNestedInput {
        instanceField = Math.random();

        @Field(type => [[[SampleInput]]])
        deeplyNestedInputArrayField: SampleInput[][][];
      }
      classes.SampleTripleNestedInput = SampleTripleNestedInput;

      @ArgsType()
      class SampleNestedArgs {
        @Field()
        factor: number;

        @Field()
        input: SampleInput;
      }
      classes.SampleNestedArgs = SampleNestedArgs;

      @ObjectType()
      class SampleObject {
        private readonly TRUE = true;
        isTrue() {
          return this.TRUE;
        }
        constructor() {
          sampleObjectConstructorCallCount++;
        }

        instanceValue = Math.random();

        @Field()
        fieldResolverField: number;
        @Field()
        fieldResolverGetter: number;
        @Field({ complexity: 5 })
        fieldResolverMethod: number;
        @Field()
        fieldResolverMethodWithArgs: number;
        @Field()
        fieldResolverWithRoot: number;
        @Field({ complexity: 10 })
        complexResolverMethod: number;
        @Field()
        get getterField(): number {
          return this.instanceValue;
        }

        @Field()
        methodField(): number {
          return this.instanceValue;
        }

        @Field(type => String)
        async asyncMethodField() {
          return "asyncMethodField";
        }

        @Field()
        methodFieldWithArg(@Arg("factor") factor: number): number {
          return this.instanceValue * factor;
        }
      }

      @Resolver(of => SampleObject)
      class SampleResolver implements ResolverInterface<SampleObject> {
        factor = 1;
        randomValueField = Math.random() * this.factor;
        get randomValueGetter() {
          return Math.random() * this.factor;
        }
        getRandomValue() {
          return Math.random() * this.factor;
        }

        @Query()
        sampleQuery(): SampleObject {
          const obj = new SampleObject();
          return obj;
        }

        @Query()
        notInstanceQuery(): SampleObject {
          return {} as SampleObject;
        }

        @Query()
        queryWithRootContextAndInfo(
          @Root() root: any,
          @Ctx() context: any,
          @Info() info: any,
        ): boolean {
          queryRoot = root;
          queryContext = context;
          queryInfo = info;
          return true;
        }

        @Query()
        queryWithPartialRootAndContext(
          @Root("rootField") rootField: any,
          @Ctx("contextField") contextField: any,
        ): boolean {
          queryRoot = rootField;
          queryContext = contextField;
          return true;
        }

        @Query()
        queryWithCustomDecorators(
          @FirstCustomArgDecorator() firstCustom: any,
          @SecondCustomArgDecorator("secondCustom") secondCustom: any,
        ): boolean {
          queryFirstCustom = firstCustom;
          querySecondCustom = secondCustom;
          return true;
        }

        @Query()
        @DescriptorDecorator()
        queryWithCustomDescriptorDecorator(): boolean {
          return true;
        }

        @Mutation()
        mutationWithArgs(@Args() args: SampleArgs): number {
          if (args.isTrue()) {
            return args.factor * args.instanceField;
          } else {
            return -1.0;
          }
        }

        @Mutation()
        mutationWithOptionalArgs(@Args() args: SampleOptionalArgs): boolean {
          mutationInputValue = args;
          return true;
        }

        @Mutation()
        mutationWithInput(@Arg("input") input: SampleInput): number {
          if (input.isTrue()) {
            return input.factor * input.instanceField;
          } else {
            return -1.0;
          }
        }

        @Mutation()
        mutationWithNestedInputs(@Arg("input") input: SampleNestedInput): number {
          mutationInputValue = input;
          return input.instanceField;
        }

        @Mutation()
        mutationWithTripleNestedInputs(@Arg("input") input: SampleTripleNestedInput): number {
          mutationInputValue = input;
          return input.deeplyNestedInputArrayField[0][0][0].factor;
        }

        @Mutation()
        mutationWithNestedArgsInput(@Args() { factor, input }: SampleNestedArgs): number {
          mutationInputValue = input;
          return factor;
        }

        @Mutation()
        mutationWithInputs(@Arg("inputs", type => [SampleInput]) inputs: SampleInput[]): number {
          mutationInputValue = inputs[0];
          return inputs[0].factor;
        }

        @Mutation()
        mutationWithTripleArrayInputs(
          @Arg("inputs", type => [[[SampleInput]]]) inputs: SampleInput[][][],
        ): number {
          mutationInputValue = inputs;
          return inputs[0][0][0].factor;
        }

        @Mutation()
        mutationWithOptionalArg(
          @Arg("input", { nullable: true }) input?: SampleNestedInput,
        ): number {
          mutationInputValue = typeof input;
          return 0;
        }

        @FieldResolver()
        fieldResolverField() {
          return this.randomValueField;
        }

        @FieldResolver()
        fieldResolverGetter() {
          return this.randomValueGetter;
        }

        @FieldResolver({ complexity: 10 })
        fieldResolverMethod() {
          return this.getRandomValue();
        }

        @FieldResolver()
        fieldResolverWithRoot(@Root() root: SampleObject) {
          if (root.isTrue()) {
            return root.instanceValue;
          } else {
            return -1.0;
          }
        }

        @FieldResolver()
        fieldResolverMethodWithArgs(@Root() root: SampleObject, @Arg("arg") arg: number): number {
          return arg;
        }
      }

      schema = await buildSchema({
        resolvers: [SampleResolver],
        validate: false,
      });
    });

    it("should build the schema without errors", () => {
      expect(schema).toBeDefined();
    });

    it("should return value from object getter resolver", async () => {
      const query = `query {
        sampleQuery {
          getterField
        }
      }`;

      const result: any = await graphql({ schema, source: query });

      const getterFieldResult = result.data!.sampleQuery.getterField;
      expect(getterFieldResult).toBeGreaterThanOrEqual(0);
      expect(getterFieldResult).toBeLessThanOrEqual(1);
    });

    it("should return value from object method resolver", async () => {
      const query = `query {
        sampleQuery {
          methodField
        }
      }`;

      const result: any = await graphql({ schema, source: query });

      const methodFieldResult = result.data!.sampleQuery.methodField;
      expect(methodFieldResult).toBeGreaterThanOrEqual(0);
      expect(methodFieldResult).toBeLessThanOrEqual(1);
    });

    it("should return value from object async method resolver", async () => {
      const query = `query {
        sampleQuery {
          asyncMethodField
        }
      }`;

      const result: any = await graphql({ schema, source: query });

      const asyncMethodFieldResult = result.data!.sampleQuery.asyncMethodField;
      expect(asyncMethodFieldResult).toEqual("asyncMethodField");
    });

    it("should return value from object method resolver with arg", async () => {
      const query = `query {
        sampleQuery {
          methodFieldWithArg(factor: 10)
        }
      }`;

      const result: any = await graphql({ schema, source: query });

      const methodFieldWithArgResult = result.data!.sampleQuery.methodFieldWithArg;
      expect(methodFieldWithArgResult).toBeGreaterThanOrEqual(0);
      expect(methodFieldWithArgResult).toBeLessThanOrEqual(10);
    });

    it("should return value from field resolver with field access", async () => {
      const query = `query {
        sampleQuery {
          fieldResolverField
        }
      }`;

      const result: any = await graphql({ schema, source: query });

      const fieldResolverFieldResult = result.data!.sampleQuery.fieldResolverField;
      expect(fieldResolverFieldResult).toBeGreaterThanOrEqual(0);
      expect(fieldResolverFieldResult).toBeLessThanOrEqual(1);
    });

    it("should return value from field resolver with getter access", async () => {
      const query = `query {
        sampleQuery {
          fieldResolverGetter
        }
      }`;

      const result: any = await graphql({ schema, source: query });

      const fieldResolverGetterResult = result.data!.sampleQuery.fieldResolverGetter;
      expect(fieldResolverGetterResult).toBeGreaterThanOrEqual(0);
      expect(fieldResolverGetterResult).toBeLessThanOrEqual(1);
    });

    it("should return value from field resolver with method access", async () => {
      const query = `query {
        sampleQuery {
          fieldResolverMethod
        }
      }`;

      const result: any = await graphql({ schema, source: query });

      const fieldResolverMethodResult = result.data!.sampleQuery.fieldResolverMethod;
      expect(fieldResolverMethodResult).toBeGreaterThanOrEqual(0);
      expect(fieldResolverMethodResult).toBeLessThanOrEqual(1);
    });

    it("should return value from field resolver arg", async () => {
      const value = 21.37;
      const query = `query {
        sampleQuery {
          fieldResolverMethodWithArgs(arg: ${value})
        }
      }`;

      const result: any = await graphql({ schema, source: query });

      const resultFieldData = result.data!.sampleQuery.fieldResolverMethodWithArgs;
      expect(resultFieldData).toEqual(value);
    });

    it("should create new instances of object type for consecutive queries", async () => {
      const query = `query {
        sampleQuery {
          getterField
        }
      }`;

      const result1: any = await graphql({ schema, source: query });
      const result2: any = await graphql({ schema, source: query });

      const getterFieldResult1 = result1.data!.sampleQuery.getterField;
      const getterFieldResult2 = result2.data!.sampleQuery.getterField;
      expect(getterFieldResult1).not.toEqual(getterFieldResult2);
    });

    it("shouldn't create new instance for object type if it's already an instance of its class", async () => {
      const query = /* graphql */ `
        query {
          sampleQuery {
            getterField
            methodField
          }
        }
      `;

      const result: any = await graphql({ schema, source: query });
      const getterFieldValue = result.data!.sampleQuery.getterField;
      const methodFieldValue = result.data!.sampleQuery.getterField;

      expect(getterFieldValue).toEqual(methodFieldValue);
      expect(sampleObjectConstructorCallCount).toBe(1);
    });

    it("should use the same instance of resolver class for consecutive queries", async () => {
      const query = `query {
        sampleQuery {
          fieldResolverField
        }
      }`;

      const result1: any = await graphql({ schema, source: query });
      const result2: any = await graphql({ schema, source: query });

      const resolverFieldResult1 = result1.data!.sampleQuery.fieldResolverField;
      const resolverFieldResult2 = result2.data!.sampleQuery.fieldResolverField;
      expect(resolverFieldResult1).toEqual(resolverFieldResult2);
    });

    it("should create instance of args object", async () => {
      const mutation = `mutation {
        mutationWithArgs(factor: 10)
      }`;

      const mutationResult = await graphql({ schema, source: mutation });
      const result = mutationResult.data!.mutationWithArgs;

      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(10);
    });

    it("shouldn't create properties of nullable args", async () => {
      const mutation = `mutation {
        mutationWithOptionalArgs(stringField: "stringField")
      }`;

      const { errors } = await graphql({ schema, source: mutation });

      expect(errors).toBeUndefined();
      expect(mutationInputValue).toBeInstanceOf(classes.SampleOptionalArgs);
      expect(mutationInputValue).not.toHaveProperty("optionalField");
    });

    it("should create instance of input object", async () => {
      const mutation = `mutation {
        mutationWithInput(input: { factor: 10 })
      }`;

      const mutationResult = await graphql({ schema, source: mutation });
      const result = mutationResult.data!.mutationWithInput;

      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(10);
    });

    it("should create instances of nested input fields input objects without undefined", async () => {
      const mutation = `mutation {
        mutationWithNestedInputs(input: {
          nestedField: {
            factor: 20
          }
          nestedArrayField: [{
            factor: 30
          }]
        })
      }`;

      const mutationResult = await graphql({ schema, source: mutation });
      const result = mutationResult.data!.mutationWithNestedInputs;

      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(1);
      expect(mutationInputValue).toBeInstanceOf(classes.SampleNestedInput);
      expect(mutationInputValue.nestedField).toBeInstanceOf(classes.SampleInput);
      expect(mutationInputValue.nestedArrayField[0]).toBeInstanceOf(classes.SampleInput);
      expect(mutationInputValue).not.toHaveProperty("optionalNestedField");
    });

    it("shouldn't create instances of nested input fields nullable input objects when null provided", async () => {
      const mutation = `mutation {
        mutationWithNestedInputs(input: {
          nestedField: {
            factor: 20
          }
          nestedArrayField: [{
            factor: 30
          }]
          optionalNestedField: null
          nestedOptionalArrayField: [null, { factor: 40 }]
        })
      }`;

      const mutationResult = await graphql({ schema, source: mutation });
      expect(mutationResult.errors).toBeUndefined();

      const mutationWithNestedInputsData = mutationResult.data!.mutationWithNestedInputs;
      expect(mutationWithNestedInputsData).toBeGreaterThanOrEqual(0);
      expect(mutationWithNestedInputsData).toBeLessThanOrEqual(1);
      expect(mutationInputValue).toBeInstanceOf(classes.SampleNestedInput);
      expect(mutationInputValue.nestedField).toBeInstanceOf(classes.SampleInput);
      expect(mutationInputValue.nestedArrayField[0]).toBeInstanceOf(classes.SampleInput);
      expect(mutationInputValue.optionalNestedField).toBeNull();
      expect(mutationInputValue.nestedOptionalArrayField).toEqual([
        null,
        expect.any(classes.SampleInput),
      ]);
    });

    it("should create instance of nested input field of args type object", async () => {
      const mutation = `mutation {
        mutationWithNestedArgsInput(factor: 20, input: { factor: 30 })
      }`;

      const mutationResult = await graphql({ schema, source: mutation });
      const result = mutationResult.data!.mutationWithNestedArgsInput;

      expect(result).toEqual(20);
      expect(mutationInputValue).toBeInstanceOf(classes.SampleInput);
      expect(mutationInputValue.instanceField).toBeGreaterThanOrEqual(0);
      expect(mutationInputValue.instanceField).toBeLessThanOrEqual(1);
    });

    it("should create instance of inputs array from arg", async () => {
      const mutation = `mutation {
        mutationWithInputs(inputs: [{ factor: 30 }])
      }`;

      const mutationResult = await graphql({ schema, source: mutation });
      const result = mutationResult.data!.mutationWithInputs;

      expect(result).toEqual(30);
      expect(mutationInputValue).toBeInstanceOf(classes.SampleInput);
      expect(mutationInputValue.instanceField).toBeGreaterThanOrEqual(0);
      expect(mutationInputValue.instanceField).toBeLessThanOrEqual(1);
    });

    it("should create instance of nested arrays input from arg", async () => {
      const mutation = `mutation {
        mutationWithTripleArrayInputs(inputs: [[[{ factor: 30 }]]])
      }`;

      const mutationResult = await graphql({ schema, source: mutation });
      const result = mutationResult.data!.mutationWithTripleArrayInputs;
      const nestedInput = mutationInputValue[0][0][0];

      expect(mutationResult.errors).toBeUndefined();
      expect(result).toEqual(30);
      expect(mutationInputValue).toBeInstanceOf(Array);
      expect(mutationInputValue).toHaveLength(1);
      expect(mutationInputValue[0]).toBeInstanceOf(Array);
      expect(mutationInputValue[0]).toHaveLength(1);
      expect(mutationInputValue[0][0]).toBeInstanceOf(Array);
      expect(mutationInputValue[0][0]).toHaveLength(1);
      expect(nestedInput).toBeInstanceOf(classes.SampleInput);
      expect(nestedInput.instanceField).toBeGreaterThanOrEqual(0);
      expect(nestedInput.instanceField).toBeLessThanOrEqual(1);
    });

    it("should create instance of nested arrays input field", async () => {
      const mutation = `mutation {
        mutationWithTripleNestedInputs(input: {
          deeplyNestedInputArrayField: [[[{ factor: 30 }]]]
        })
      }`;

      const mutationResult = await graphql({ schema, source: mutation });
      expect(mutationResult.errors).toBeUndefined();

      const result = mutationResult.data!.mutationWithTripleNestedInputs;
      expect(result).toEqual(30);

      expect(mutationInputValue).toBeInstanceOf(classes.SampleTripleNestedInput);
      expect(mutationInputValue.deeplyNestedInputArrayField).toHaveLength(1);
      expect(mutationInputValue.deeplyNestedInputArrayField[0]).toBeInstanceOf(Array);
      expect(mutationInputValue.deeplyNestedInputArrayField[0]).toHaveLength(1);
      expect(mutationInputValue.deeplyNestedInputArrayField[0][0]).toBeInstanceOf(Array);
      expect(mutationInputValue.deeplyNestedInputArrayField[0][0]).toHaveLength(1);

      const nestedInput = mutationInputValue.deeplyNestedInputArrayField[0][0][0];
      expect(nestedInput).toBeInstanceOf(classes.SampleInput);
      expect(nestedInput.instanceField).toBeGreaterThanOrEqual(0);
      expect(nestedInput.instanceField).toBeLessThanOrEqual(1);
    });

    it("shouldn't create instance of an argument if the value is null or not provided", async () => {
      const mutation = `mutation {
        mutationWithOptionalArg
      }`;

      const { data, errors } = await graphql({ schema, source: mutation });
      expect(errors).toBeUndefined();
      expect(data!.mutationWithOptionalArg).toBeDefined();
      expect(mutationInputValue).toEqual("undefined");
    });

    it("should create instance of root object when root type is provided", async () => {
      const query = `query {
        sampleQuery {
          fieldResolverWithRoot
          getterField
        }
      }`;

      const queryResult: any = await graphql({ schema, source: query });
      const fieldResolverWithRootValue = queryResult.data!.sampleQuery.fieldResolverWithRoot;
      const getterFieldValue = queryResult.data!.sampleQuery.getterField;

      expect(fieldResolverWithRootValue).toBeGreaterThanOrEqual(0);
      expect(fieldResolverWithRootValue).toBeLessThanOrEqual(1);
      expect(fieldResolverWithRootValue).toEqual(getterFieldValue);
    });

    it("should reuse data from instance of root object", async () => {
      const query = `query {
        notInstanceQuery {
          fieldResolverWithRoot
          getterField
        }
      }`;

      const queryResult: any = await graphql({ schema, source: query });
      const fieldResolverWithRootValue = queryResult.data!.notInstanceQuery.fieldResolverWithRoot;
      const getterFieldValue = queryResult.data!.notInstanceQuery.getterField;

      expect(fieldResolverWithRootValue).toBeGreaterThanOrEqual(0);
      expect(fieldResolverWithRootValue).toBeLessThanOrEqual(1);
      expect(fieldResolverWithRootValue).not.toEqual(getterFieldValue);
    });

    it("should inject root and context object to resolver", async () => {
      const query = `query {
        queryWithRootContextAndInfo
      }`;
      const root = { isRoot: true };
      const context = { isContext: true };

      await graphql({ schema, source: query, rootValue: root, contextValue: context });

      expect(queryRoot).toEqual(root);
      expect(queryContext).toEqual(context);
      expect(queryInfo).toBeDefined();
      expect(queryInfo.fieldName).toEqual("queryWithRootContextAndInfo");
    });

    it("should inject parts of root and context objects to resolver", async () => {
      const query = `query {
        queryWithPartialRootAndContext
      }`;
      const root = { rootField: 2 };
      const context = { contextField: "present" };

      await graphql({ schema, source: query, rootValue: root, contextValue: context });

      expect(queryRoot).toEqual(2);
      expect(queryContext).toEqual("present");
    });

    it("should inject resolver data to custom arg decorator resolver and return its value", async () => {
      const query = /* graphql */ `
        query {
          queryWithCustomDecorators
        }
      `;
      const root = { rootField: 2 };
      const context = { contextField: "present" };

      await graphql({ schema, source: query, rootValue: root, contextValue: context });

      expect(queryFirstCustom.root).toEqual(root);
      expect(queryFirstCustom.context).toEqual(context);
      expect(queryFirstCustom.info).toBeDefined();
      expect(querySecondCustom).toEqual("secondCustom");
    });

    it("should allow for overwriting descriptor value in custom decorator", async () => {
      const query = /* graphql */ `
        query {
          queryWithCustomDescriptorDecorator
        }
      `;

      const { data } = await graphql({ schema, source: query });

      expect(descriptorEvaluated).toBe(true);
      expect(data!.queryWithCustomDescriptorDecorator).toBe(true);
    });
  });

  describe("buildSchema", () => {
    it("should load resolvers from glob paths", async () => {
      getMetadataStorage().clear();

      const { queryType } = await getSchemaInfo({
        resolvers: [path.resolve(__dirname, "../helpers/loading-from-directories/*.resolver.ts")],
      });

      const directoryQueryReturnType = getInnerTypeOfNonNullableType(
        queryType.fields.find(field => field.name === "sampleQuery")!,
      );

      expect(queryType.fields).toHaveLength(1);
      expect(directoryQueryReturnType.kind).toEqual(TypeKind.OBJECT);
      expect(directoryQueryReturnType.name).toEqual("SampleObject");
    });

    it("should emit only things from provided `resolvers` property", async () => {
      getMetadataStorage().clear();

      @ObjectType()
      class SampleObject {
        @Field()
        sampleField: string;
      }
      @Resolver()
      class SampleResolver {
        @Query()
        sampleQuery(): SampleObject {
          return { sampleField: "sampleField" };
        }
      }
      @ObjectType()
      class OmittedObject {
        @Field()
        omittedField: string;
      }
      @Resolver()
      class OmittedResolver {
        @Query()
        omittedQuery(): OmittedObject {
          return { omittedField: "omittedField" };
        }
      }

      const { queryType, schemaIntrospection } = await getSchemaInfo({
        resolvers: [SampleResolver],
      });
      const objectTypes = schemaIntrospection.types.filter(
        type =>
          type.kind === "OBJECT" &&
          !type.name.startsWith("__") &&
          !["Query", "Mutation", "Subscription"].includes(type.name),
      );

      expect(queryType.fields).toHaveLength(1);
      expect(queryType.fields[0].name).toEqual("sampleQuery");
      expect(objectTypes).toHaveLength(1);
      expect(objectTypes[0].name).toEqual("SampleObject");
    });

    it("should build the schema synchronously", async () => {
      getMetadataStorage().clear();

      @ObjectType()
      class SampleObject {
        @Field()
        sampleFieldSync: string;
      }
      @Resolver()
      class SampleResolver {
        @Query()
        sampleQuerySync(): SampleObject {
          return { sampleFieldSync: "sampleFieldSync" };
        }
      }

      const schema = buildSchemaSync({
        resolvers: [SampleResolver],
        validate: false,
      });
      const query = `
        query {
          sampleQuerySync {
            sampleFieldSync
          }
        }
      `;
      const result: any = await graphql({ schema, source: query });

      expect(result.data.sampleQuerySync.sampleFieldSync).toEqual("sampleFieldSync");
    });

    it("should generate the schema when schema is incorrect but `skipCheck` is set to true", async () => {
      getMetadataStorage().clear();

      @Resolver()
      class SampleResolver {
        @Mutation()
        sampleMutation(): string {
          return "sampleMutation";
        }
      }

      const schema = await buildSchema({
        resolvers: [SampleResolver],
        skipCheck: true,
      });

      expect(schema).toBeDefined();
    });

    it("should throw errors when no resolvers provided", async () => {
      getMetadataStorage().clear();
      expect.assertions(2);

      try {
        await buildSchema({ resolvers: [] as any });
      } catch (err) {
        expect(err.message).toContain("Empty");
        expect(err.message).toContain("resolvers");
      }
    });
  });

  describe("Schemas leaks", () => {
    it("should not call field resolver if resolver class is not provided to `buildSchema`", async () => {
      getMetadataStorage().clear();

      @ObjectType()
      class SampleObject {
        @Field()
        sampleField: string;
        @Field()
        resolvedField: string;
      }
      @Resolver()
      class SampleResolver {
        @Query()
        sampleQuery(): SampleObject {
          return { sampleField: "sampleField", resolvedField: "resolvedField" };
        }
      }
      @Resolver(of => SampleObject)
      class SampleObjectResolver {
        @FieldResolver()
        resolvedField(): string {
          return "SampleObjectResolver resolvedField";
        }
      }
      const query = /* graphql */ `
        query {
          sampleQuery {
            sampleField
            resolvedField
          }
        }
      `;
      const schema = await buildSchema({
        resolvers: [SampleResolver],
        validate: false,
      });

      const result: any = await graphql({ schema, source: query });

      expect(result.errors).toBeUndefined();
      expect(result.data!.sampleQuery).toEqual({
        sampleField: "sampleField",
        resolvedField: "resolvedField",
      });
    });

    it("should not emit field in schema if resolver class is not provided to `buildSchema`", async () => {
      getMetadataStorage().clear();

      @ObjectType()
      class SampleObject {
        @Field()
        sampleField: string;
      }
      @Resolver()
      class SampleResolver {
        @Query()
        sampleQuery(): SampleObject {
          return { sampleField: "sampleField" };
        }
      }
      @Resolver(of => SampleObject)
      class SampleObjectResolver {
        @FieldResolver()
        resolvedField(): string {
          return "SampleObjectResolver resolvedField";
        }
      }

      const schemaInfo = await getSchemaInfo({
        resolvers: [SampleResolver],
      });
      const schemaIntrospection = schemaInfo.schemaIntrospection;
      const sampleObjectType = schemaIntrospection.types.find(
        type => type.name === "SampleObject",
      ) as IntrospectionObjectType;

      expect(sampleObjectType.fields).toHaveLength(1);
      expect(sampleObjectType.fields[0].name).toEqual("sampleField");
    });

    it("should emit field in schema if resolver class is not provided to `buildSchema` but is in inheritance chain", async () => {
      getMetadataStorage().clear();

      @ObjectType()
      class SampleObject {
        @Field()
        sampleField: string;
      }
      @Resolver()
      class SampleResolver {
        @Query()
        sampleQuery(): SampleObject {
          return { sampleField: "sampleField" };
        }
      }
      function createResolver() {
        @Resolver(of => SampleObject)
        class SampleObjectResolver {
          @FieldResolver()
          resolvedField(): string {
            return "SampleObjectResolver resolvedField";
          }
        }
        return SampleObjectResolver;
      }
      class ChildResolver extends createResolver() {}

      const schemaInfo = await getSchemaInfo({
        resolvers: [SampleResolver, ChildResolver],
      });
      const schemaIntrospection = schemaInfo.schemaIntrospection;
      const sampleObjectType = schemaIntrospection.types.find(
        type => type.name === "SampleObject",
      ) as IntrospectionObjectType;

      expect(sampleObjectType.fields).toHaveLength(2);
    });
  });

  describe("Inheritance", () => {
    let schema: GraphQLSchema;
    let schemaIntrospection: IntrospectionSchema;
    let queryType: IntrospectionObjectType;
    let mutationType: IntrospectionObjectType;
    let subscriptionType: IntrospectionObjectType;
    let thisVar: any;
    let baseResolver: any;
    let childResolver: any;
    let overrideResolver: any;
    let validationErrors: GraphQLError[];

    beforeEach(() => {
      thisVar = null;
      validationErrors = [];
    });

    beforeAll(async () => {
      getMetadataStorage().clear();

      @ObjectType()
      class SampleObject {
        @Field()
        normalField: string;
      }

      @ObjectType()
      class DummyObject {
        @Field()
        normalField: string;
      }

      function createResolver(name: string, objectType: ClassType) {
        @Resolver(of => objectType, { isAbstract: true })
        class BaseResolver {
          protected name = "baseName";

          @Query({ name: `${name}Query` })
          baseQuery(@Arg("arg") arg: boolean): boolean {
            thisVar = this;
            return true;
          }

          @Mutation({ name: `${name}Mutation` })
          baseMutation(@Arg("arg") arg: boolean): boolean {
            thisVar = this;
            return true;
          }

          @Subscription({ topics: "baseTopic", name: `${name}Subscription` })
          baseSubscription(@Arg("arg") arg: boolean): boolean {
            thisVar = this;
            return true;
          }

          @Mutation(returns => Boolean, { name: `${name}Trigger` })
          async baseTrigger(@PubSub() pubSub: PubSubEngine): Promise<boolean> {
            await pubSub.publish("baseTopic", null);
            return true;
          }

          @FieldResolver()
          resolverField(): string {
            thisVar = this;
            return "resolverField";
          }
        }
        baseResolver = BaseResolver;

        return BaseResolver;
      }

      @Resolver()
      class ChildResolver extends createResolver("prefix", SampleObject) {
        @Query()
        childQuery(): boolean {
          thisVar = this;
          return true;
        }

        @Query()
        objectQuery(): SampleObject {
          return { normalField: "normalField" };
        }

        @Mutation()
        childMutation(): boolean {
          thisVar = this;
          return true;
        }

        @Subscription({ topics: "childTopic", complexity: 4 })
        childSubscription(): boolean {
          thisVar = this;
          return true;
        }

        @Mutation(returns => Boolean)
        async childTrigger(@PubSub() pubSub: PubSubEngine): Promise<boolean> {
          await pubSub.publish("childTopic", null);
          return true;
        }
      }
      childResolver = ChildResolver;

      @Resolver()
      class OverrideResolver extends createResolver("overridden", DummyObject) {
        @Query()
        overriddenQuery(@Arg("overriddenArg") arg: boolean): string {
          thisVar = this;
          return "overriddenQuery";
        }

        @Mutation({ name: "overriddenMutation" })
        overriddenMutationHandler(@Arg("overriddenArg") arg: boolean): string {
          thisVar = this;
          return "overriddenMutationHandler";
        }
      }
      overrideResolver = OverrideResolver;

      const schemaInfo = await getSchemaInfo({
        resolvers: [childResolver, overrideResolver],
      });
      schemaIntrospection = schemaInfo.schemaIntrospection;
      queryType = schemaInfo.queryType;
      mutationType = schemaInfo.mutationType!;
      subscriptionType = schemaInfo.subscriptionType!;
      schema = schemaInfo.schema;
    });

    it("should build schema correctly", async () => {
      expect(schema).toBeDefined();
    });

    it("should generate proper queries in schema", async () => {
      const queryNames = queryType.fields.map(it => it.name);

      expect(queryNames).toContain("childQuery");
      expect(queryNames).toContain("objectQuery");
      expect(queryNames).toContain("prefixQuery");
      expect(queryNames).toContain("overriddenQuery");
    });

    it("should generate proper mutations in schema", async () => {
      const mutationNames = mutationType.fields.map(it => it.name);

      expect(mutationNames).toContain("childMutation");
      expect(mutationNames).toContain("childTrigger");
      expect(mutationNames).toContain("prefixMutation");
      expect(mutationNames).toContain("prefixTrigger");
      expect(mutationNames).toContain("overriddenTrigger");
      expect(mutationNames).toContain("overriddenMutation");
    });

    it("should generate proper subscriptions in schema", async () => {
      const subscriptionNames = subscriptionType.fields.map(it => it.name);
      const prefixSubscription = subscriptionType.fields.find(
        it => it.name === "prefixSubscription",
      )!;

      expect(subscriptionNames).toContain("childSubscription");
      expect(subscriptionNames).toContain("prefixSubscription");
      expect(subscriptionNames).toContain("overriddenSubscription");
      expect(prefixSubscription.args).toHaveLength(1);
    });

    it("should generate proper object fields in schema", async () => {
      const sampleObjectType = schemaIntrospection.types.find(
        type => type.kind === TypeKind.OBJECT && type.name === "SampleObject",
      ) as IntrospectionObjectType;
      const sampleObjectTypeFieldsNames = sampleObjectType.fields.map(it => it.name);

      expect(sampleObjectType.fields).toHaveLength(2);
      expect(sampleObjectTypeFieldsNames).toContain("normalField");
      expect(sampleObjectTypeFieldsNames).toContain("resolverField");
    });

    it("should overwrite args in schema when handler has been overridden", async () => {
      const prefixQuery = queryType.fields.find(it => it.name === "prefixQuery")!;
      const overriddenQuery = queryType.fields.find(it => it.name === "overriddenQuery")!;
      const prefixMutation = mutationType.fields.find(it => it.name === "prefixMutation")!;
      const overriddenMutation = mutationType.fields.find(it => it.name === "overriddenMutation")!;
      const t = getInnerTypeOfNonNullableType(prefixQuery);

      expect(prefixQuery.args).toHaveLength(1);
      expect(prefixQuery.args[0].name).toEqual("arg");
      expect(overriddenQuery.args).toHaveLength(1);
      expect(overriddenQuery.args[0].name).toEqual("overriddenArg");
      expect(prefixMutation.args).toHaveLength(1);
      expect(prefixMutation.args[0].name).toEqual("arg");
      expect(overriddenMutation.args).toHaveLength(1);
      expect(overriddenMutation.args[0].name).toEqual("overriddenArg");
    });

    it("should overwrite return type in schema when handler has been overridden", async () => {
      const prefixQuery = queryType.fields.find(it => it.name === "prefixQuery")!;
      const overriddenQuery = queryType.fields.find(it => it.name === "overriddenQuery")!;
      const prefixMutation = mutationType.fields.find(it => it.name === "prefixMutation")!;
      const overriddenMutation = mutationType.fields.find(it => it.name === "overriddenMutation")!;
      const prefixQueryType = getInnerTypeOfNonNullableType(prefixQuery);
      const overriddenQueryType = getInnerTypeOfNonNullableType(overriddenQuery);
      const prefixMutationType = getInnerTypeOfNonNullableType(prefixMutation);
      const overriddenMutationType = getInnerTypeOfNonNullableType(overriddenMutation);

      expect(prefixQueryType.kind).toEqual(TypeKind.SCALAR);
      expect(prefixQueryType.name).toEqual("Boolean");
      expect(overriddenQueryType.kind).toEqual(TypeKind.SCALAR);
      expect(overriddenQueryType.name).toEqual("String");
      expect(prefixMutationType.kind).toEqual(TypeKind.SCALAR);
      expect(prefixMutationType.name).toEqual("Boolean");
      expect(overriddenMutationType.kind).toEqual(TypeKind.SCALAR);
      expect(overriddenMutationType.name).toEqual("String");
    });

    it("should correctly call query handler from base resolver class", async () => {
      const query = `query {
        prefixQuery(arg: true)
      }`;

      const { data } = await graphql({ schema, source: query });

      expect(data!.prefixQuery).toEqual(true);
      expect(thisVar.constructor).toEqual(childResolver);
    });

    it("should correctly call mutation handler from base resolver class", async () => {
      const mutation = `mutation {
        prefixMutation(arg: true)
      }`;

      const { data } = await graphql({ schema, source: mutation });

      expect(data!.prefixMutation).toEqual(true);
      expect(thisVar.constructor).toEqual(childResolver);
    });

    it("should correctly call query handler from child resolver class", async () => {
      const query = `query {
        childQuery
      }`;

      const { data } = await graphql({ schema, source: query });

      expect(data!.childQuery).toEqual(true);
      expect(thisVar.constructor).toEqual(childResolver);
    });

    it("should correctly call mutation handler from child resolver class", async () => {
      const mutation = `mutation {
        childMutation
      }`;

      const { data } = await graphql({ schema, source: mutation });

      expect(data!.childMutation).toEqual(true);
      expect(thisVar.constructor).toEqual(childResolver);
    });

    it("should correctly call field resolver handler from base resolver class", async () => {
      const query = `query {
        objectQuery {
          resolverField
        }
      }`;

      const result: any = await graphql({ schema, source: query });

      expect(result.data!.objectQuery.resolverField).toEqual("resolverField");
      expect(thisVar.constructor).toEqual(childResolver);
    });

    it("should correctly call overridden query handler from child resolver class", async () => {
      const query = `query {
        overriddenQuery(overriddenArg: true)
      }`;

      const { data } = await graphql({ schema, source: query });

      expect(data!.overriddenQuery).toEqual("overriddenQuery");
      expect(thisVar.constructor).toEqual(overrideResolver);
    });

    it("should correctly call overridden mutation handler from child resolver class", async () => {
      const mutation = `mutation {
        overriddenMutation(overriddenArg: true)
      }`;

      const { data } = await graphql({ schema, source: mutation });

      expect(data!.overriddenMutation).toEqual("overriddenMutationHandler");
      expect(thisVar.constructor).toEqual(overrideResolver);
    });

    it("should have access to inherited properties from base resolver class", async () => {
      const query = `query {
        childQuery
      }`;

      await graphql({ schema, source: query });

      expect(thisVar.name).toEqual("baseName");
    });

    it("should get child class instance when calling base resolver handler", async () => {
      const query = `query {
        prefixQuery(arg: true)
      }`;

      await graphql({ schema, source: query });

      expect(thisVar).toBeInstanceOf(childResolver);
    });
  });
});
