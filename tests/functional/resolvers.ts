// tslint:disable:max-line-length
import "reflect-metadata";
import {
  IntrospectionSchema,
  IntrospectionObjectType,
  IntrospectionNamedTypeRef,
  IntrospectionNonNullTypeRef,
  IntrospectionListTypeRef,
  IntrospectionField,
} from "graphql";

import { MetadataStorage } from "../../src/metadata/metadata-storage";
import { getSchemaInfo } from "../helpers/getSchemaInfo";
import {
  GraphQLObjectType,
  Field,
  GraphQLResolver,
  Query,
  Arg,
  GraphQLInputType,
  Root,
  Ctx,
  Mutation,
  Args,
  GraphQLArgumentType,
  Int,
} from "../../src";

describe("Resolvers", () => {
  describe("Schema", () => {
    let schemaIntrospection: IntrospectionSchema;
    let queryType: IntrospectionObjectType;
    let mutationType: IntrospectionObjectType;
    let sampleObjectType: IntrospectionObjectType;
    let argMethodField: IntrospectionField;

    beforeAll(async () => {
      MetadataStorage.clear();

      @GraphQLInputType()
      class SampleInput {
        @Field() field: string;
      }

      @GraphQLArgumentType()
      class SampleArgs {
        @Field() stringArg: string;
        @Field(type => Int, { nullable: true })
        numberArg: number;
        @Field() inputObjectArg: SampleInput;
      }

      @GraphQLObjectType()
      class SampleObject {
        @Field() normalField: string;

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

      @GraphQLResolver(() => SampleObject)
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

    // describe("Errors", () => {
    //   // TODO: throwing errors checks
    // });
  });

  // describe("Functional", () => {
  //   beforeAll(() => {
  //     MetadataStorage.clear();
  //   });

  //   it("will be implemented later", () => {
  //     const willImplementItLater = true;
  //     expect(willImplementItLater).toBeTruthy();
  //   });
  // });
});
