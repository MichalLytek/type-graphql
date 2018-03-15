// tslint:disable:max-line-length
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
} from "graphql";
import * as path from "path";

import { MetadataStorage } from "../../src/metadata/metadata-storage";
import { getSchemaInfo } from "../helpers/getSchemaInfo";
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
} from "../../src";
import { plainToClass } from "class-transformer";
import { getInnerTypeOfNullableType } from "../helpers/getInnerFieldType";

describe("Resolvers", () => {
  describe("Schema", () => {
    let schemaIntrospection: IntrospectionSchema;
    let queryType: IntrospectionObjectType;
    let mutationType: IntrospectionObjectType;
    let sampleObjectType: IntrospectionObjectType;
    let argMethodField: IntrospectionField;

    beforeAll(async () => {
      MetadataStorage.clear();

      @InputType()
      class SampleInput {
        @Field() field: string;
      }

      @ArgsType()
      class SampleArgs {
        @Field() stringArg: string;
        @Field(type => Int, { nullable: true })
        numberArg: number;
        @Field() inputObjectArg: SampleInput;
      }

      @ObjectType()
      class SampleObject {
        @Field() normalField: string;

        @Field() resolverFieldWithArgs: string;

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
          @Arg("explicitNullableArg", type => String, { nullable: true })
          explicitNullableArg: any,
          @Arg("stringArrayArg", type => String)
          stringArrayArg: string[],
          @Arg("explicitArrayArg", type => String, { array: true })
          explicitArrayArg: any,
          @Arg("nullableStringArg", { nullable: true })
          nullableStringArg?: string,
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

      @Resolver(objectType => SampleObject)
      class SampleResolver {
        @Query()
        emptyQuery(): boolean {
          return true;
        }

        @Query()
        implicitStringQuery(): string {
          return "implicitStringQuery";
        }

        @Query(returnType => String)
        explicitStringQuery(): any {
          return "explicitStringQuery";
        }

        @Query(returnType => String, { nullable: true })
        nullableStringQuery(): string | null {
          return Math.random() > 0.5 ? "explicitStringQuery" : null;
        }

        @Query(itemType => String)
        implicitStringArrayQuery(): string[] {
          return [];
        }

        @Query(itemType => String, { array: true })
        explicitStringArrayQuery(): any {
          return [];
        }

        @Query(returnType => String)
        async promiseStringQuery(): Promise<string> {
          return "promiseStringQuery";
        }

        @Query()
        implicitObjectQuery(): SampleObject {
          return {} as SampleObject;
        }

        @Query(returnType => SampleObject)
        async asyncObjectQuery(): Promise<SampleObject> {
          return {} as SampleObject;
        }

        @Query()
        rootCtxQuery(@Root() root: any, @Ctx() ctx: any): boolean {
          return true;
        }

        @Query(returnType => String)
        argQuery(@Arg("arg1") arg1: string, @Arg("arg2") arg2: boolean): any {
          return "argQuery";
        }

        @Query(returnType => String)
        argsQuery(@Args() args: SampleArgs): any {
          return "argsQuery";
        }

        @Query(returnType => String)
        argAndArgsQuery(@Arg("arg1") arg1: string, @Args() args: SampleArgs): any {
          return "argAndArgsQuery";
        }

        @Mutation()
        emptyMutation(): boolean {
          return true;
        }

        @FieldResolver()
        resolverFieldWithArgs(@Arg("arg1") arg1: string, @Arg("arg2") arg2: boolean) {
          return "resolverFieldWithArgs";
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
        expect(getterFieldType.kind).toEqual("NON_NULL");
        expect(getterFieldInnerType.kind).toEqual("SCALAR");
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
        expect(simpleMethodFieldType.kind).toEqual("NON_NULL");
        expect(simpleMethodFieldInnerType.kind).toEqual("SCALAR");
        expect(simpleMethodFieldInnerType.name).toEqual("String");
      });

      it("should generate proper field type for class method with args", async () => {
        const argMethodFieldType = argMethodField.type as IntrospectionNonNullTypeRef;
        const argMethodFieldInnerType = argMethodFieldType.ofType as IntrospectionNamedTypeRef;

        expect(argMethodField.name).toEqual("argMethodField");
        expect(argMethodField.args).toHaveLength(8);
        expect(argMethodFieldType.kind).toEqual("NON_NULL");
        expect(argMethodFieldInnerType.kind).toEqual("SCALAR");
        expect(argMethodFieldInnerType.name).toEqual("String");
      });
    });

    describe("Inline args", () => {
      it("should generate normal string arg type for object field method", async () => {
        const stringArg = argMethodField.args.find(arg => arg.name === "stringArg")!;
        const stringArgType = stringArg.type as IntrospectionNonNullTypeRef;
        const stringArgInnerType = stringArgType.ofType as IntrospectionNamedTypeRef;

        expect(stringArg.name).toEqual("stringArg");
        expect(stringArgType.kind).toEqual("NON_NULL");
        expect(stringArgInnerType.kind).toEqual("SCALAR");
        expect(stringArgInnerType.name).toEqual("String");
      });

      it("should generate normal boolean arg type for object field method", async () => {
        const booleanArg = argMethodField.args.find(arg => arg.name === "booleanArg")!;
        const booleanArgType = booleanArg.type as IntrospectionNonNullTypeRef;
        const booleanArgInnerType = booleanArgType.ofType as IntrospectionNamedTypeRef;

        expect(booleanArg.name).toEqual("booleanArg");
        expect(booleanArgType.kind).toEqual("NON_NULL");
        expect(booleanArgInnerType.kind).toEqual("SCALAR");
        expect(booleanArgInnerType.name).toEqual("Boolean");
      });

      it("should generate normal number arg type for object field method", async () => {
        const numberArg = argMethodField.args.find(arg => arg.name === "numberArg")!;
        const numberArgType = numberArg.type as IntrospectionNonNullTypeRef;
        const numberArgInnerType = numberArgType.ofType as IntrospectionNamedTypeRef;

        expect(numberArg.name).toEqual("numberArg");
        expect(numberArgType.kind).toEqual("NON_NULL");
        expect(numberArgInnerType.kind).toEqual("SCALAR");
        expect(numberArgInnerType.name).toEqual("Float");
      });

      // tslint:disable-next-line:max-line-length
      it("should generate nullable string arg type for object field method when explicitly sets", async () => {
        const explicitNullableArg = argMethodField.args.find(
          arg => arg.name === "explicitNullableArg",
        )!;
        const explicitNullableArgType = explicitNullableArg.type as IntrospectionNamedTypeRef;

        expect(explicitNullableArg.name).toEqual("explicitNullableArg");
        expect(explicitNullableArgType.kind).toEqual("SCALAR");
        expect(explicitNullableArgType.name).toEqual("String");
      });

      it("should generate string array arg type for object field method", async () => {
        const stringArrayArg = argMethodField.args.find(arg => arg.name === "stringArrayArg")!;
        const stringArrayArgType = stringArrayArg.type as IntrospectionNonNullTypeRef;
        const stringArrayArgArrayType = stringArrayArgType.ofType as IntrospectionListTypeRef;
        const stringArrayArgInnerType = stringArrayArgArrayType.ofType as IntrospectionNonNullTypeRef;
        const stringArrayArgArrayItemType = stringArrayArgInnerType.ofType as IntrospectionNamedTypeRef;

        expect(stringArrayArg.name).toEqual("stringArrayArg");
        expect(stringArrayArgType.kind).toEqual("NON_NULL");
        expect(stringArrayArgArrayType.kind).toEqual("LIST");
        expect(stringArrayArgInnerType.kind).toEqual("NON_NULL");
        expect(stringArrayArgArrayItemType.kind).toEqual("SCALAR");
        expect(stringArrayArgArrayItemType.name).toEqual("String");
      });

      // tslint:disable-next-line:max-line-length
      it("should generate string array arg type for object field method when explicitly sets", async () => {
        const explicitArrayArg = argMethodField.args.find(arg => arg.name === "explicitArrayArg")!;
        const explicitArrayArgType = explicitArrayArg.type as IntrospectionNonNullTypeRef;
        const explicitArrayArgArrayType = explicitArrayArgType.ofType as IntrospectionListTypeRef;
        const explicitArrayArgInnerType = explicitArrayArgArrayType.ofType as IntrospectionNonNullTypeRef;
        const explicitArrayArgArrayItemType = explicitArrayArgInnerType.ofType as IntrospectionNamedTypeRef;

        expect(explicitArrayArg.name).toEqual("explicitArrayArg");
        expect(explicitArrayArgType.kind).toEqual("NON_NULL");
        expect(explicitArrayArgArrayType.kind).toEqual("LIST");
        expect(explicitArrayArgInnerType.kind).toEqual("NON_NULL");
        expect(explicitArrayArgArrayItemType.kind).toEqual("SCALAR");
        expect(explicitArrayArgArrayItemType.name).toEqual("String");
      });

      it("should generate nullable string arg type for object field method", async () => {
        const nullableStringArg = argMethodField.args.find(
          arg => arg.name === "nullableStringArg",
        )!;
        const nullableStringArgType = nullableStringArg.type as IntrospectionNamedTypeRef;

        expect(nullableStringArg.name).toEqual("nullableStringArg");
        expect(nullableStringArgType.kind).toEqual("SCALAR");
        expect(nullableStringArgType.name).toEqual("String");
      });

      it("should generate input object arg type for object field method", async () => {
        const inputArg = argMethodField.args.find(arg => arg.name === "inputArg")!;
        const inputArgType = inputArg.type as IntrospectionNonNullTypeRef;
        const inputArgInnerType = inputArgType.ofType as IntrospectionNamedTypeRef;

        expect(inputArg.name).toEqual("inputArg");
        expect(inputArgType.kind).toEqual("NON_NULL");
        expect(inputArgInnerType.kind).toEqual("INPUT_OBJECT");
        expect(inputArgInnerType.name).toEqual("SampleInput");
      });
    });

    describe("Args object", () => {
      it("should generate simple arg from args object field", async () => {
        const argsQuery = getQuery("argsQuery");
        const stringArg = argsQuery.args.find(arg => arg.name === "stringArg")!;
        const stringArgInnerType = (stringArg.type as IntrospectionNonNullTypeRef)
          .ofType as IntrospectionNamedTypeRef;

        expect(stringArg.name).toEqual("stringArg");
        expect(stringArgInnerType.kind).toEqual("SCALAR");
        expect(stringArgInnerType.name).toEqual("String");
      });

      it("should generate nullable type arg from args object field", async () => {
        const argsQuery = getQuery("argsQuery");
        const numberArg = argsQuery.args.find(arg => arg.name === "numberArg")!;
        const numberArgType = numberArg.type as IntrospectionNamedTypeRef;

        expect(numberArg.name).toEqual("numberArg");
        expect(numberArgType.kind).toEqual("SCALAR");
        expect(numberArgType.name).toEqual("Int");
      });

      it("should generate input object type arg from args object field", async () => {
        const argsQuery = getQuery("argsQuery");
        const inputObjectArg = argsQuery.args.find(arg => arg.name === "inputObjectArg")!;
        const inputObjectArgInnerType = (inputObjectArg.type as IntrospectionNonNullTypeRef)
          .ofType as IntrospectionNamedTypeRef;

        expect(inputObjectArg.name).toEqual("inputObjectArg");
        expect(inputObjectArgInnerType.kind).toEqual("INPUT_OBJECT");
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

        expect(arg1InnerType.kind).toEqual("SCALAR");
        expect(arg1InnerType.name).toEqual("String");
        expect(arg2InnerType.kind).toEqual("SCALAR");
        expect(arg2InnerType.name).toEqual("Boolean");
      });
    });

    describe("Handlers", () => {
      it("should generate proper definition for query method", async () => {
        const emptyQuery = getQuery("emptyQuery");
        const emptyQueryReturnType = emptyQuery.type as IntrospectionNonNullTypeRef;
        const emptyQueryInnerReturnType = emptyQueryReturnType.ofType as IntrospectionNamedTypeRef;

        expect(emptyQuery.args).toHaveLength(0);
        expect(emptyQuery.name).toEqual("emptyQuery");
        expect(emptyQueryReturnType.kind).toEqual("NON_NULL");
        expect(emptyQueryInnerReturnType.kind).toEqual("SCALAR");
        expect(emptyQueryInnerReturnType.name).toEqual("Boolean");
      });

      it("should generate proper definition for mutation method", async () => {
        const emptyMutation = getMutation("emptyMutation");
        const emptyMutationReturnType = emptyMutation.type as IntrospectionNonNullTypeRef;
        const emptyMutationInnerReturnType = emptyMutationReturnType.ofType as IntrospectionNamedTypeRef;

        expect(emptyMutation.args).toHaveLength(0);
        expect(emptyMutation.name).toEqual("emptyMutation");
        expect(emptyMutationReturnType.kind).toEqual("NON_NULL");
        expect(emptyMutationInnerReturnType.kind).toEqual("SCALAR");
        expect(emptyMutationInnerReturnType.name).toEqual("Boolean");
      });

      it("should generate implicit string return type for query method", async () => {
        const implicitStringQuery = getQuery("implicitStringQuery");
        const implicitStringQueryType = implicitStringQuery.type as IntrospectionNonNullTypeRef;
        const implicitStringQueryInnerType = implicitStringQueryType.ofType as IntrospectionNamedTypeRef;

        expect(implicitStringQueryInnerType.kind).toEqual("SCALAR");
        expect(implicitStringQueryInnerType.name).toEqual("String");
      });

      it("should generate string return type for query when explicitly set", async () => {
        const explicitStringQuery = getQuery("explicitStringQuery");
        const explicitStringQueryType = explicitStringQuery.type as IntrospectionNonNullTypeRef;
        const explicitStringQueryInnerType = explicitStringQueryType.ofType as IntrospectionNamedTypeRef;

        expect(explicitStringQueryInnerType.kind).toEqual("SCALAR");
        expect(explicitStringQueryInnerType.name).toEqual("String");
      });

      it("should generate nullable string return type for query when explicitly set", async () => {
        const nullableStringQuery = getQuery("nullableStringQuery");
        const nullableStringQueryType = nullableStringQuery.type as IntrospectionNamedTypeRef;

        expect(nullableStringQueryType.kind).toEqual("SCALAR");
        expect(nullableStringQueryType.name).toEqual("String");
      });

      it("should generate implicit array string return type for query", async () => {
        const implicitStringArrayQuery = getQuery("implicitStringArrayQuery");
        const type = implicitStringArrayQuery.type as IntrospectionNonNullTypeRef;
        const listType = type.ofType as IntrospectionListTypeRef;
        const nonNullItemType = listType.ofType as IntrospectionNonNullTypeRef;
        const itemType = nonNullItemType.ofType as IntrospectionNamedTypeRef;

        expect(listType.kind).toEqual("LIST");
        expect(itemType.kind).toEqual("SCALAR");
        expect(itemType.name).toEqual("String");
      });

      it("should generate explicit array string return type for query", async () => {
        const explicitStringArrayQuery = getQuery("explicitStringArrayQuery");
        const type = explicitStringArrayQuery.type as IntrospectionNonNullTypeRef;
        const listType = type.ofType as IntrospectionListTypeRef;
        const nonNullItemType = listType.ofType as IntrospectionNonNullTypeRef;
        const itemType = nonNullItemType.ofType as IntrospectionNamedTypeRef;

        expect(listType.kind).toEqual("LIST");
        expect(itemType.kind).toEqual("SCALAR");
        expect(itemType.name).toEqual("String");
      });

      it("should generate string return type for query returning Promise", async () => {
        const promiseStringQuery = getQuery("promiseStringQuery");
        const promiseStringQueryType = promiseStringQuery.type as IntrospectionNonNullTypeRef;
        const promiseStringQueryInnerType = promiseStringQueryType.ofType as IntrospectionNamedTypeRef;

        expect(promiseStringQueryInnerType.kind).toEqual("SCALAR");
        expect(promiseStringQueryInnerType.name).toEqual("String");
      });

      it("should generate object return type for query returning promise", async () => {
        const asyncObjectQuery = getQuery("asyncObjectQuery");
        const asyncObjectQueryType = asyncObjectQuery.type as IntrospectionNonNullTypeRef;
        const asyncObjectQueryInnerType = asyncObjectQueryType.ofType as IntrospectionNamedTypeRef;

        expect(asyncObjectQueryInnerType.kind).toEqual("OBJECT");
        expect(asyncObjectQueryInnerType.name).toEqual("SampleObject");
      });

      it("should generate object return type for query method", async () => {
        const implicitObjectQuery = getQuery("implicitObjectQuery");
        const implicitObjectQueryType = implicitObjectQuery.type as IntrospectionNonNullTypeRef;
        const implicitObjectQueryInnerType = implicitObjectQueryType.ofType as IntrospectionNamedTypeRef;

        expect(implicitObjectQueryInnerType.kind).toEqual("OBJECT");
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
        expect(argsQuery.args).toHaveLength(3);
      });

      it("should generate proper definition for query with both @Arg and @Args", async () => {
        const argAndArgsQuery = getQuery("argAndArgsQuery");

        expect(argAndArgsQuery.name).toEqual("argAndArgsQuery");
        expect(argAndArgsQuery.args).toHaveLength(4);
      });
    });

    describe("Errors", () => {
      beforeEach(() => {
        MetadataStorage.clear();
      });

      it("should throw error when arg type is not correct", async () => {
        expect.assertions(5);

        try {
          @Resolver()
          class SampleResolver {
            @Query(() => String)
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
          expect(error.message).toContain("Cannot determine type");
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
          expect(error.message).toContain("Cannot determine type");
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
          @Field() sampleField: string;
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
    });
  });

  describe("Functional", () => {
    let schema: GraphQLSchema;

    beforeAll(async () => {
      MetadataStorage.clear();

      @ArgsType()
      class SampleArgs {
        private readonly TRUE = true;
        instanceField = Math.random();

        @Field() factor: number;

        isTrue() {
          return this.TRUE;
        }
      }

      @InputType()
      class SampleInput {
        private readonly TRUE = true;
        instanceField = Math.random();

        @Field() factor: number;

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

        instanceValue = Math.random();

        @Field() fieldResolverField: number;
        @Field() fieldResolverGetter: number;
        @Field() fieldResolverMethod: number;
        @Field() fieldResolverMethodWithArgs: number;
        @Field() fieldResolverWithRoot: number;

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

      @Resolver(objectType => SampleObject)
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

        @FieldResolver()
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
  });

  it("should load resolvers from glob paths", async () => {
    MetadataStorage.clear();

    const { queryType } = await getSchemaInfo({
      resolvers: [path.resolve(__dirname, "../helpers/loading-from-directories/*.resolver.ts")],
    });

    const directoryQueryReturnType = getInnerTypeOfNullableType(
      queryType.fields.find(field => field.name === "sampleQuery")!,
    );

    expect(queryType.fields).toHaveLength(1);
    expect(directoryQueryReturnType.kind).toEqual(TypeKind.OBJECT);
    expect(directoryQueryReturnType.name).toEqual("SampleObject");
  });

  it("should throw errors when no resolvers provided", async () => {
    MetadataStorage.clear();
    expect.assertions(2);

    try {
      await buildSchema({ resolvers: [] });
    } catch (err) {
      expect(err.message).toContain("Empty");
      expect(err.message).toContain("resolvers");
    }
  });
});
