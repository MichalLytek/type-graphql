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
  parse,
  TypeInfo,
  ValidationContext,
  visit,
  visitWithTypeInfo,
  IntrospectionInputObjectType,
} from "graphql";
import * as path from "path";
import { plainToClass } from "class-transformer";
import { fieldConfigEstimator, simpleEstimator } from "graphql-query-complexity";
import ComplexityVisitor from "graphql-query-complexity/dist/QueryComplexity";

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
  ConflictingDefaultWithNullableError,
  WrongNullableListOptionError,
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
          @Arg("explicitNullableArg", type => String, { nullable: true }) explicitNullableArg: any,
          @Arg("stringArrayArg", type => String) stringArrayArg: string[],
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

        @Query(itemType => String)
        implicitStringArrayQuery(): string[] {
          return [];
        }

        @Query(itemType => [String])
        explicitStringArrayQuery(): any {
          return [];
        }

        @Query(itemType => [String], { nullable: "items" })
        explicitNullableItemArrayQuery(): any {
          return [];
        }

        @Query(itemType => [String], { nullable: "itemsAndList" })
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
        const simpleMethodFieldInnerType = simpleMethodFieldType.ofType as IntrospectionNamedTypeRef;

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
        expect(argMethodField.args).toHaveLength(10);
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

      it("should generate string array arg type for object field method", async () => {
        const stringArrayArg = argMethodField.args.find(arg => arg.name === "stringArrayArg")!;
        const stringArrayArgType = stringArrayArg.type as IntrospectionNonNullTypeRef;
        const stringArrayArgArrayType = stringArrayArgType.ofType as IntrospectionListTypeRef;
        const stringArrayArgInnerType = stringArrayArgArrayType.ofType as IntrospectionNonNullTypeRef;
        const stringArrayArgArrayItemType = stringArrayArgInnerType.ofType as IntrospectionNamedTypeRef;

        expect(stringArrayArg.name).toEqual("stringArrayArg");
        expect(stringArrayArgType.kind).toEqual(TypeKind.NON_NULL);
        expect(stringArrayArgArrayType.kind).toEqual(TypeKind.LIST);
        expect(stringArrayArgInnerType.kind).toEqual(TypeKind.NON_NULL);
        expect(stringArrayArgArrayItemType.kind).toEqual(TypeKind.SCALAR);
        expect(stringArrayArgArrayItemType.name).toEqual("String");
      });

      it("should generate string array arg type for object field method when explicitly sets", async () => {
        const explicitArrayArg = argMethodField.args.find(arg => arg.name === "explicitArrayArg")!;
        const explicitArrayArgType = explicitArrayArg.type as IntrospectionNonNullTypeRef;
        const explicitArrayArgArrayType = explicitArrayArgType.ofType as IntrospectionListTypeRef;
        const explicitArrayArgInnerType = explicitArrayArgArrayType.ofType as IntrospectionNonNullTypeRef;
        const explicitArrayArgArrayItemType = explicitArrayArgInnerType.ofType as IntrospectionNamedTypeRef;

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

      it("should generate nullable string arg type with defaultValue for object field method", async () => {
        const inputArg = argMethodField.args.find(arg => arg.name === "defaultStringArg")!;
        const defaultValueStringArgType = inputArg.type as IntrospectionNamedTypeRef;

        expect(inputArg.defaultValue).toBe('"defaultStringArgDefaultValue"');
        expect(defaultValueStringArgType.kind).toEqual(TypeKind.SCALAR);
        expect(defaultValueStringArgType.name).toEqual("String");
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

      it("should generate nullable string arg type with defaultValue for input object field", async () => {
        const defaultValueStringField = sampleInputType.inputFields.find(
          arg => arg.name === "defaultStringField",
        )!;
        const defaultValueStringFieldType = defaultValueStringField.type as IntrospectionNamedTypeRef;

        expect(defaultValueStringField.defaultValue).toBe('"defaultStringFieldDefaultValue"');
        expect(defaultValueStringFieldType.kind).toEqual(TypeKind.SCALAR);
        expect(defaultValueStringFieldType.name).toEqual("String");
      });

      it("should generate nullable string arg type with implicit defaultValue for input object field", async () => {
        const implicitDefaultValueStringField = sampleInputType.inputFields.find(
          arg => arg.name === "implicitDefaultStringField",
        )!;
        const implicitDefaultValueStringFieldType = implicitDefaultValueStringField.type as IntrospectionNamedTypeRef;

        expect(implicitDefaultValueStringField.defaultValue).toBe(
          '"implicitDefaultStringFieldDefaultValue"',
        );
        expect(implicitDefaultValueStringFieldType.kind).toEqual(TypeKind.SCALAR);
        expect(implicitDefaultValueStringFieldType.name).toEqual("String");
      });

      it("should overwrite defaultValue in child input object", async () => {
        const defaultValueStringField = sampleInputChildType.inputFields.find(
          arg => arg.name === "defaultStringField",
        )!;
        const defaultValueStringFieldType = defaultValueStringField.type as IntrospectionNamedTypeRef;

        expect(defaultValueStringField.defaultValue).toBe('"defaultValueOverwritten"');
        expect(defaultValueStringFieldType.kind).toEqual(TypeKind.SCALAR);
        expect(defaultValueStringFieldType.name).toEqual("String");
      });

      it("should overwrite implicit defaultValue in child input object", async () => {
        const implicitDefaultValueStringField = sampleInputChildType.inputFields.find(
          arg => arg.name === "implicitDefaultStringField",
        )!;
        const implicitDefaultValueStringFieldType = implicitDefaultValueStringField.type as IntrospectionNamedTypeRef;

        expect(implicitDefaultValueStringField.defaultValue).toBe(
          '"implicitDefaultValueOverwritten"',
        );
        expect(implicitDefaultValueStringFieldType.kind).toEqual(TypeKind.SCALAR);
        expect(implicitDefaultValueStringFieldType.name).toEqual("String");
      });

      it("should inherit field with defaultValue from parent", async () => {
        const inheritDefaultField = sampleInputChildType.inputFields.find(
          arg => arg.name === "inheritDefaultField",
        )!;
        const inheritDefaultFieldType = inheritDefaultField.type as IntrospectionNamedTypeRef;

        expect(inheritDefaultField.defaultValue).toBe('"inheritDefaultFieldValue"');
        expect(inheritDefaultFieldType.kind).toEqual(TypeKind.SCALAR);
        expect(inheritDefaultFieldType.name).toEqual("String");
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

      it("should generate nullable type arg with defaultValue from args object field", async () => {
        const argsQuery = getQuery("argsQuery");
        const defaultStringArg = argsQuery.args.find(arg => arg.name === "defaultStringArg")!;
        const defaultStringArgType = defaultStringArg.type as IntrospectionNamedTypeRef;

        expect(defaultStringArg.name).toEqual("defaultStringArg");
        expect(defaultStringArg.defaultValue).toEqual('"defaultStringArgDefaultValue"');
        expect(defaultStringArgType.kind).toEqual(TypeKind.SCALAR);
        expect(defaultStringArgType.name).toEqual("String");
      });

      it("should overwrite defaultValue in child args object field", async () => {
        const argsQuery = getQuery("argsInheritanceQuery");
        const defaultStringArg = argsQuery.args.find(arg => arg.name === "defaultStringArg")!;
        const defaultStringArgType = defaultStringArg.type as IntrospectionNamedTypeRef;

        expect(defaultStringArg.name).toEqual("defaultStringArg");
        expect(defaultStringArg.defaultValue).toEqual('"defaultValueOverwritten"');
        expect(defaultStringArgType.kind).toEqual(TypeKind.SCALAR);
        expect(defaultStringArgType.name).toEqual("String");
      });

      it("should overwrite implicit defaultValue in child args object field", async () => {
        const argsQuery = getQuery("argsInheritanceQuery");
        const implicitDefaultStringArg = argsQuery.args.find(
          arg => arg.name === "implicitDefaultStringArg",
        )!;
        const implicitDefaultStringArgType = implicitDefaultStringArg.type as IntrospectionNamedTypeRef;

        expect(implicitDefaultStringArg.name).toEqual("implicitDefaultStringArg");
        expect(implicitDefaultStringArg.defaultValue).toEqual('"implicitDefaultValueOverwritten"');
        expect(implicitDefaultStringArgType.kind).toEqual(TypeKind.SCALAR);
        expect(implicitDefaultStringArgType.name).toEqual("String");
      });

      it("should inherit defaultValue field from parent args object field", async () => {
        const argsQuery = getQuery("argsInheritanceQuery");
        const inheritDefaultArg = argsQuery.args.find(arg => arg.name === "inheritDefaultArg")!;
        const inheritDefaultArgType = inheritDefaultArg.type as IntrospectionNamedTypeRef;

        expect(inheritDefaultArg.name).toEqual("inheritDefaultArg");
        expect(inheritDefaultArg.defaultValue).toEqual('"inheritDefaultArgValue"');
        expect(inheritDefaultArgType.kind).toEqual(TypeKind.SCALAR);
        expect(inheritDefaultArgType.name).toEqual("String");
      });

      it("should generate nullable type arg with implicit defaultValue from args object field", async () => {
        const argsQuery = getQuery("argsQuery");
        const implicitDefaultStringArg = argsQuery.args.find(
          arg => arg.name === "implicitDefaultStringArg",
        )!;
        const implicitDefaultStringArgType = implicitDefaultStringArg.type as IntrospectionNamedTypeRef;

        expect(implicitDefaultStringArg.name).toEqual("implicitDefaultStringArg");
        expect(implicitDefaultStringArg.defaultValue).toEqual(
          '"implicitDefaultStringArgDefaultValue"',
        );
        expect(implicitDefaultStringArgType.kind).toEqual(TypeKind.SCALAR);
        expect(implicitDefaultStringArgType.name).toEqual("String");
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
        const independentFieldResolverType = independentFieldResolver.type as IntrospectionNamedTypeRef;

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
        const emptyMutationInnerReturnType = emptyMutationReturnType.ofType as IntrospectionNamedTypeRef;

        expect(emptyMutation.args).toHaveLength(0);
        expect(emptyMutation.name).toEqual("emptyMutation");
        expect(emptyMutationReturnType.kind).toEqual(TypeKind.NON_NULL);
        expect(emptyMutationInnerReturnType.kind).toEqual(TypeKind.SCALAR);
        expect(emptyMutationInnerReturnType.name).toEqual("Boolean");
      });

      it("should generate implicit string return type for query method", async () => {
        const implicitStringQuery = getQuery("implicitStringQuery");
        const implicitStringQueryType = implicitStringQuery.type as IntrospectionNonNullTypeRef;
        const implicitStringQueryInnerType = implicitStringQueryType.ofType as IntrospectionNamedTypeRef;

        expect(implicitStringQueryInnerType.kind).toEqual(TypeKind.SCALAR);
        expect(implicitStringQueryInnerType.name).toEqual("String");
      });

      it("should generate string return type for query when explicitly set", async () => {
        const explicitStringQuery = getQuery("explicitStringQuery");
        const explicitStringQueryType = explicitStringQuery.type as IntrospectionNonNullTypeRef;
        const explicitStringQueryInnerType = explicitStringQueryType.ofType as IntrospectionNamedTypeRef;

        expect(explicitStringQueryInnerType.kind).toEqual(TypeKind.SCALAR);
        expect(explicitStringQueryInnerType.name).toEqual("String");
      });

      it("should generate nullable string return type for query when explicitly set", async () => {
        const nullableStringQuery = getQuery("nullableStringQuery");
        const nullableStringQueryType = nullableStringQuery.type as IntrospectionNamedTypeRef;

        expect(nullableStringQueryType.kind).toEqual(TypeKind.SCALAR);
        expect(nullableStringQueryType.name).toEqual("String");
      });

      it("should generate implicit array string return type for query", async () => {
        const implicitStringArrayQuery = getQuery("implicitStringArrayQuery");
        const type = implicitStringArrayQuery.type as IntrospectionNonNullTypeRef;
        const listType = type.ofType as IntrospectionListTypeRef;
        const nonNullItemType = listType.ofType as IntrospectionNonNullTypeRef;
        const itemType = nonNullItemType.ofType as IntrospectionNamedTypeRef;

        expect(listType.kind).toEqual(TypeKind.LIST);
        expect(itemType.kind).toEqual(TypeKind.SCALAR);
        expect(itemType.name).toEqual("String");
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

      it("should generate explicit nullable array of nullalbe string return type for query", async () => {
        const explicitNullableArrayWithNullableItemsQuery = getQuery(
          "explicitNullableArrayWithNullableItemsQuery",
        );
        const listType = explicitNullableArrayWithNullableItemsQuery.type as IntrospectionListTypeRef;
        const itemType = listType.ofType as IntrospectionNamedTypeRef;

        expect(listType.kind).toEqual(TypeKind.LIST);
        expect(itemType.kind).toEqual(TypeKind.SCALAR);
        expect(itemType.name).toEqual("String");
      });

      it("should generate string return type for query returning Promise", async () => {
        const promiseStringQuery = getQuery("promiseStringQuery");
        const promiseStringQueryType = promiseStringQuery.type as IntrospectionNonNullTypeRef;
        const promiseStringQueryInnerType = promiseStringQueryType.ofType as IntrospectionNamedTypeRef;

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
        const implicitObjectQueryInnerType = implicitObjectQueryType.ofType as IntrospectionNamedTypeRef;

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
        expect.assertions(5);

        try {
          @Resolver()
          class SampleResolver {
            @Query(returns => String)
            sampleQuery(@Arg("arg") arg: any): string {
              return "sampleQuery";
            }
          }
        } catch (err) {
          expect(err).toBeInstanceOf(Error);
          const error = err as Error;
          expect(error.message).toContain("provide explicit type");
          expect(error.message).toContain("parameter");
          expect(error.message).toContain("#0");
          expect(error.message).toContain("sampleQuery");
        }
      });

      it("should throw error when query return type not provided", async () => {
        expect.assertions(3);

        try {
          @Resolver()
          class SampleResolver {
            @Query()
            sampleQuery() {
              return "sampleQuery";
            }
          }
        } catch (err) {
          expect(err).toBeInstanceOf(Error);
          const error = err as Error;
          expect(error.message).toContain("provide explicit type");
          expect(error.message).toContain("sampleQuery");
        }
      });

      it("should throw error when provided query return type is not correct", async () => {
        expect.assertions(3);

        try {
          @Resolver()
          class SampleResolver {
            @Query()
            sampleQuery(): any {
              return "sampleQuery";
            }
          }
        } catch (err) {
          expect(err).toBeInstanceOf(Error);
          const error = err as Error;
          expect(error.message).toContain("provide explicit type");
          expect(error.message).toContain("sampleQuery");
        }
      });

      it("should throw error when mutation return type not provided", async () => {
        expect.assertions(3);

        try {
          @Resolver()
          class SampleResolver {
            @Mutation()
            sampleMutation() {
              return "sampleMutation";
            }
          }
        } catch (err) {
          expect(err).toBeInstanceOf(Error);
          const error = err as Error;
          expect(error.message).toContain("provide explicit type");
          expect(error.message).toContain("sampleMutation");
        }
      });

      it("should throw error provided mutation return type is not correct", async () => {
        expect.assertions(3);

        try {
          @Resolver()
          class SampleResolver {
            @Mutation()
            sampleMutation(): any {
              return "sampleMutation";
            }
          }
        } catch (err) {
          expect(err).toBeInstanceOf(Error);
          const error = err as Error;
          expect(error.message).toContain("provide explicit type");
          expect(error.message).toContain("sampleMutation");
        }
      });

      it("should throw error when creating field resolver in resolver with no object type info", async () => {
        expect.assertions(3);

        @ObjectType()
        class SampleObject {
          @Field()
          sampleField: string;
        }

        try {
          @Resolver()
          class SampleResolver {
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
            resolvers: [SampleResolver],
          });
        } catch (err) {
          expect(err).toBeInstanceOf(Error);
          const error = err as Error;
          expect(error.message).toContain("@Resolver");
          expect(error.message).toContain("SampleResolver");
        }
      });

      it("should throw error when creating independent field resolver with no type info", async () => {
        expect.assertions(4);

        @ObjectType()
        class SampleObject {
          @Field()
          sampleField: string;
        }

        try {
          @Resolver(of => SampleObject)
          class SampleResolver {
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
            resolvers: [SampleResolver],
          });
        } catch (err) {
          expect(err).toBeInstanceOf(Error);
          const error = err as Error;
          expect(error.message).toContain("explicit type");
          expect(error.message).toContain("SampleResolver");
          expect(error.message).toContain("independentField");
        }
      });

      it("should throw error when declared default values are not equal", async () => {
        expect.assertions(10);

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
          expect(error.message).toContain("conflicting default values");
          expect(error.message).toContain("inputField");
          expect(error.message).toContain("SampleInput");
          expect(error.message).toContain("is not equal");
          expect(error.message).toContain("decorator");
          expect(error.message).toContain("decoratorDefaultValue");
          expect(error.message).toContain("initializer");
          expect(error.message).toContain("initializerDefaultValue");
        }
      });

      it("should throw error when default value set with non-nullable option", async () => {
        expect.assertions(8);

        try {
          @InputType()
          class SampleInput {
            @Field({ defaultValue: "stringDefaultValue", nullable: false })
            inputField: string;
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
          expect(err).toBeInstanceOf(ConflictingDefaultWithNullableError);
          const error = err as ConflictingDefaultWithNullableError;
          expect(error.message).toContain("cannot combine");
          expect(error.message).toContain("default value");
          expect(error.message).toContain("stringDefaultValue");
          expect(error.message).toContain("nullable");
          expect(error.message).toContain("false");
          expect(error.message).toContain("inputField");
          // expect(error.message).toContain("SampleInput");
        }
      });

      it("should throw error when list nullable option is combined with non-list type", async () => {
        expect.assertions(6);

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
          await buildSchema({ resolvers: [SampleResolver] });
        } catch (err) {
          expect(err).toBeInstanceOf(Error);
          expect(err).toBeInstanceOf(WrongNullableListOptionError);
          const error = err as WrongNullableListOptionError;
          expect(error.message).toContain("Wrong nullable option");
          expect(error.message).toContain("nullable");
          expect(error.message).toContain("items");
          expect(error.message).toContain("inputField");
          // expect(error.message).toContain("SampleInput");
        }
      });
    });
  });

  describe("Functional", () => {
    let schema: GraphQLSchema;
    let queryRoot: any;
    let queryContext: any;
    let queryInfo: any;
    let descriptorEvaluated: boolean;
    let sampleObjectConstructorCallCount: number;

    function DescriptorDecorator(): MethodDecorator {
      return (obj, methodName, descriptor: any) => {
        const originalMethod: Function = descriptor.value;
        descriptor.value = function() {
          descriptorEvaluated = true;
          return originalMethod.apply(this, arguments);
        };
      };
    }

    // helpers
    function generateAndVisitComplexMethod(maximumComplexity: number): ValidationContext {
      const query = /* graphql */ `
        query {
          sampleQuery {
            complexResolverMethod
          }
        }
      `;
      const ast = parse(query);
      const typeInfo = new TypeInfo(schema);
      const context = new ValidationContext(schema, ast, typeInfo);
      const visitor = new ComplexityVisitor(context, {
        maximumComplexity,
        estimators: [fieldConfigEstimator(), simpleEstimator({ defaultComplexity: 1 })],
      });
      visit(ast, visitWithTypeInfo(typeInfo, visitor));
      return context;
    }

    beforeEach(() => {
      queryRoot = undefined;
      queryContext = undefined;
      queryInfo = undefined;
      descriptorEvaluated = false;
      sampleObjectConstructorCallCount = 0;
    });

    beforeAll(async () => {
      getMetadataStorage().clear();

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
          return plainToClass(SampleObject, {});
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
        mutationWithInput(@Arg("input") input: SampleInput): number {
          if (input.isTrue()) {
            return input.factor * input.instanceField;
          } else {
            return -1.0;
          }
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

      const result = await graphql(schema, query);

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

      const result = await graphql(schema, query);

      const methodFieldResult = result.data!.sampleQuery.methodField;
      expect(methodFieldResult).toBeGreaterThanOrEqual(0);
      expect(methodFieldResult).toBeLessThanOrEqual(1);
    });

    it("should return value from object method resolver with arg", async () => {
      const query = `query {
        sampleQuery {
          methodFieldWithArg(factor: 10)
        }
      }`;

      const result = await graphql(schema, query);

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

      const result = await graphql(schema, query);

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

      const result = await graphql(schema, query);

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

      const result = await graphql(schema, query);

      const fieldResolverMethodResult = result.data!.sampleQuery.fieldResolverMethod;
      expect(fieldResolverMethodResult).toBeGreaterThanOrEqual(0);
      expect(fieldResolverMethodResult).toBeLessThanOrEqual(1);
    });

    it("should fail when a query exceeds the max allowed complexity", () => {
      const context = generateAndVisitComplexMethod(5);
      expect(context.getErrors().length).toEqual(1);
      expect(context.getErrors()[0].message).toEqual(
        "The query exceeds the maximum complexity of 5. Actual complexity is 11",
      );
    });

    it("should succeed when a query does not exceed the max allowed complexity", () => {
      const context = generateAndVisitComplexMethod(12);
      expect(context.getErrors().length).toEqual(0);
    });

    it("Complexity of a field should be overridden by complexity of a field resolver", () => {
      const context = generateAndVisitComplexMethod(9);
      expect(context.getErrors().length).toEqual(1);
      expect(context.getErrors()[0].message).toEqual(
        "The query exceeds the maximum complexity of 9. Actual complexity is 11",
      );
    });

    it("should return value from field resolver arg", async () => {
      const value = 21.37;
      const query = `query {
        sampleQuery {
          fieldResolverMethodWithArgs(arg: ${value})
        }
      }`;

      const result = await graphql(schema, query);

      const resultFieldData = result.data!.sampleQuery.fieldResolverMethodWithArgs;
      expect(resultFieldData).toEqual(value);
    });

    it("should create new instances of object type for consecutive queries", async () => {
      const query = `query {
        sampleQuery {
          getterField
        }
      }`;

      const result1 = await graphql(schema, query);
      const result2 = await graphql(schema, query);

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

      const result = await graphql(schema, query);
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

      const result1 = await graphql(schema, query);
      const result2 = await graphql(schema, query);

      const resolverFieldResult1 = result1.data!.sampleQuery.fieldResolverField;
      const resolverFieldResult2 = result2.data!.sampleQuery.fieldResolverField;
      expect(resolverFieldResult1).toEqual(resolverFieldResult2);
    });

    it("should create instance of args object", async () => {
      const mutation = `mutation {
        mutationWithArgs(factor: 10)
      }`;

      const mutationResult = await graphql(schema, mutation);
      const result = mutationResult.data!.mutationWithArgs;

      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(10);
    });

    it("should create instance of input object", async () => {
      const mutation = `mutation {
        mutationWithInput(input: { factor: 10 })
      }`;

      const mutationResult = await graphql(schema, mutation);
      const result = mutationResult.data!.mutationWithInput;

      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(10);
    });

    it("should create instance of root object when root type is provided", async () => {
      const query = `query {
        sampleQuery {
          fieldResolverWithRoot
          getterField
        }
      }`;

      const queryResult = await graphql(schema, query);
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

      const queryResult = await graphql(schema, query);
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

      await graphql(schema, query, root, context);

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

      await graphql(schema, query, root, context);

      expect(queryRoot).toEqual(2);
      expect(queryContext).toEqual("present");
    });

    it("should allow for overwriting descriptor value in custom decorator", async () => {
      const query = /* graphql */ `
        query {
          queryWithCustomDescriptorDecorator
        }
      `;

      const { data } = await graphql(schema, query);

      expect(descriptorEvaluated).toBe(true);
      expect(data.queryWithCustomDescriptorDecorator).toBe(true);
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
      });
      const query = `
        query {
          sampleQuerySync {
            sampleFieldSync
          }
        }
      `;
      const { data } = await graphql(schema, query);

      expect(data!.sampleQuerySync.sampleFieldSync).toEqual("sampleFieldSync");
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
        await buildSchema({ resolvers: [] });
      } catch (err) {
        expect(err.message).toContain("Empty");
        expect(err.message).toContain("resolvers");
      }
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

    beforeEach(() => {
      thisVar = null;
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
          async baseTrigger(@PubSub() pubsub: PubSubEngine): Promise<boolean> {
            await pubsub.publish("baseTopic", null);
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
        async childTrigger(@PubSub() pubsub: PubSubEngine): Promise<boolean> {
          await pubsub.publish("childTopic", null);
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
        resolvers: [childResolver],
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
    it("should fail when a subscription exceeds the max allowed complexity", () => {
      const query = `subscription {
        childSubscription
      }`;
      const ast = parse(query);
      const typeInfo = new TypeInfo(schema);
      const context = new ValidationContext(schema, ast, typeInfo);
      const visitor = new ComplexityVisitor(context, {
        maximumComplexity: 2,
        estimators: [fieldConfigEstimator(), simpleEstimator({ defaultComplexity: 1 })],
      });
      visit(ast, visitWithTypeInfo(typeInfo, visitor));
      expect(context.getErrors().length).toEqual(1);
      expect(context.getErrors()[0].message).toEqual(
        "The query exceeds the maximum complexity of 2. Actual complexity is 4",
      );
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

      const { data } = await graphql(schema, query);

      expect(data!.prefixQuery).toEqual(true);
      expect(thisVar.constructor).toEqual(childResolver);
    });

    it("should correctly call mutation handler from base resolver class", async () => {
      const mutation = `mutation {
        prefixMutation(arg: true)
      }`;

      const { data } = await graphql(schema, mutation);

      expect(data!.prefixMutation).toEqual(true);
      expect(thisVar.constructor).toEqual(childResolver);
    });

    it("should correctly call query handler from child resolver class", async () => {
      const query = `query {
        childQuery
      }`;

      const { data } = await graphql(schema, query);

      expect(data!.childQuery).toEqual(true);
      expect(thisVar.constructor).toEqual(childResolver);
    });

    it("should correctly call mutation handler from child resolver class", async () => {
      const mutation = `mutation {
        childMutation
      }`;

      const { data } = await graphql(schema, mutation);

      expect(data!.childMutation).toEqual(true);
      expect(thisVar.constructor).toEqual(childResolver);
    });

    it("should correctly call field resolver handler from base resolver class", async () => {
      const query = `query {
        objectQuery {
          resolverField
        }
      }`;

      const { data } = await graphql(schema, query);

      expect(data!.objectQuery.resolverField).toEqual("resolverField");
      expect(thisVar.constructor).toEqual(childResolver);
    });

    it("should correctly call overridden query handler from child resolver class", async () => {
      const query = `query {
        overriddenQuery(overriddenArg: true)
      }`;

      const { data } = await graphql(schema, query);

      expect(data!.overriddenQuery).toEqual("overriddenQuery");
      expect(thisVar.constructor).toEqual(overrideResolver);
    });

    it("should correctly call overridden mutation handler from child resolver class", async () => {
      const mutation = `mutation {
        overriddenMutation(overriddenArg: true)
      }`;

      const { data } = await graphql(schema, mutation);

      expect(data!.overriddenMutation).toEqual("overriddenMutationHandler");
      expect(thisVar.constructor).toEqual(overrideResolver);
    });

    it("should have access to inherited properties from base resolver class", async () => {
      const query = `query {
        childQuery
      }`;

      await graphql(schema, query);

      expect(thisVar.name).toEqual("baseName");
    });

    it("should get child class instance when calling base resolver handler", async () => {
      const query = `query {
        prefixQuery(arg: true)
      }`;

      await graphql(schema, query);

      expect(thisVar).toBeInstanceOf(childResolver);
    });
  });
});
