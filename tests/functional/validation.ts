import "reflect-metadata";
import { Max, MaxLength, Min, ValidateNested } from "class-validator";
import { type GraphQLSchema, graphql } from "graphql";
import {
  Arg,
  Args,
  ArgsType,
  ArgumentValidationError,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  type ResolverData,
  buildSchema,
  getMetadataStorage,
} from "type-graphql";
import { type TypeValue } from "@/decorators/types";

describe("Validation", () => {
  describe("Functional", () => {
    let schema: GraphQLSchema;
    let argInput: any;
    let argsData: any;

    beforeEach(() => {
      argInput = undefined;
      argsData = undefined;
    });

    beforeAll(async () => {
      getMetadataStorage().clear();

      @ObjectType()
      class SampleObject {
        @Field({ nullable: true })
        field?: string;
      }

      @InputType()
      class SampleInput {
        @Field()
        @MaxLength(5)
        stringField!: string;

        @Field()
        @Max(5)
        numberField!: number;

        @Field({ nullable: true })
        @Min(5)
        optionalField?: number;

        @Field(() => SampleInput, { nullable: true })
        @ValidateNested()
        nestedField?: SampleInput;

        @Field(() => [SampleInput], { nullable: true })
        @ValidateNested({ each: true })
        arrayField?: SampleInput[];
      }

      @ArgsType()
      class SampleArguments {
        @Field()
        @MaxLength(5)
        stringField!: string;

        @Field()
        @Max(5)
        numberField!: number;

        @Field({ nullable: true })
        @Min(5)
        optionalField?: number;
      }

      @Resolver(() => SampleObject)
      class SampleResolver {
        @Query()
        sampleQuery(@Args() args: SampleArguments): SampleObject {
          argsData = args;
          return {};
        }

        @Mutation()
        sampleMutation(@Arg("input") input: SampleInput): SampleObject {
          argInput = input;
          return {};
        }

        @Mutation()
        mutationWithInputsArray(
          @Arg("inputs", () => [SampleInput]) inputs: SampleInput[],
        ): SampleObject {
          argInput = inputs;
          return {};
        }

        @Mutation()
        mutationWithOptionalInputsArray(
          @Arg("inputs", () => [SampleInput], { nullable: "items" })
          inputs: Array<SampleInput | null>,
        ): SampleObject {
          argInput = inputs;
          return {};
        }
      }

      schema = await buildSchema({
        resolvers: [SampleResolver],
        validate: true,
      });
    });

    it("should pass input validation when data without optional field is correct", async () => {
      const mutation = `mutation {
        sampleMutation(input: {
          stringField: "12345",
          numberField: 5,
        }) {
          field
        }
      }`;
      await graphql({ schema, source: mutation });

      expect(argInput).toEqual({ stringField: "12345", numberField: 5 });
    });

    it("should pass input validation when data with optional field is correct", async () => {
      const mutation = `mutation {
        sampleMutation(input: {
          stringField: "12345",
          numberField: 5,
          optionalField: 5,
        }) {
          field
        }
      }`;
      await graphql({ schema, source: mutation });

      expect(argInput).toEqual({ stringField: "12345", numberField: 5, optionalField: 5 });
    });

    it("should throw validation error when input is incorrect", async () => {
      const mutation = `mutation {
        sampleMutation(input: {
          stringField: "12345",
          numberField: 15,
        }) {
          field
        }
      }`;

      const result: any = await graphql({ schema, source: mutation });
      expect(result.data).toBeNull();
      expect(result.errors).toHaveLength(1);

      const validationError = result.errors![0].originalError! as ArgumentValidationError;
      expect(validationError).toBeInstanceOf(ArgumentValidationError);
      expect(validationError.extensions.validationErrors).toHaveLength(1);
      expect(validationError.extensions.validationErrors[0].property).toEqual("numberField");
    });

    it("should throw validation error when nested input field is incorrect", async () => {
      const mutation = `mutation {
        sampleMutation(input: {
          stringField: "12345",
          numberField: 5,
          nestedField: {
            stringField: "12345",
            numberField: 15,
          }
        }) {
          field
        }
      }`;

      const result: any = await graphql({ schema, source: mutation });
      expect(result.data).toBeNull();
      expect(result.errors).toHaveLength(1);

      const validationError = result.errors![0].originalError! as ArgumentValidationError;
      expect(validationError).toBeInstanceOf(ArgumentValidationError);
      expect(validationError.extensions.validationErrors).toHaveLength(1);
      expect(validationError.extensions.validationErrors[0].property).toEqual("nestedField");
    });

    it("should throw validation error when nested array input field is incorrect", async () => {
      const mutation = `mutation {
        sampleMutation(input: {
          stringField: "12345",
          numberField: 5,
          arrayField: [{
            stringField: "12345",
            numberField: 15,
          }]
        }) {
          field
        }
      }`;

      const result: any = await graphql({ schema, source: mutation });
      expect(result.data).toBeNull();
      expect(result.errors).toHaveLength(1);

      const validationError = result.errors![0].originalError! as ArgumentValidationError;
      expect(validationError).toBeInstanceOf(ArgumentValidationError);
      expect(validationError.extensions.validationErrors).toHaveLength(1);
      expect(validationError.extensions.validationErrors[0].property).toEqual("arrayField");
    });

    it("should throw validation error when one of input array is incorrect", async () => {
      const mutation = `mutation {
        mutationWithInputsArray(inputs: [
          {
            stringField: "12345",
            numberField: 5,
          },
          {
            stringField: "12345",
            numberField: 15,
          },
        ]) {
          field
        }
      }`;

      const result: any = await graphql({ schema, source: mutation });
      expect(result.data).toBeNull();
      expect(result.errors).toHaveLength(1);

      const validationError = result.errors![0].originalError! as ArgumentValidationError;
      expect(validationError).toBeInstanceOf(ArgumentValidationError);
      expect(validationError.extensions.validationErrors).toHaveLength(1);
      expect(validationError.extensions.validationErrors[0].property).toEqual("numberField");
    });

    it("should not throw error when one of optional items in the input array is null", async () => {
      const mutation = `mutation {
        mutationWithOptionalInputsArray(inputs: [
          null,
          {
            stringField: "12345",
            numberField: 5
          },
        ]) {
          field
        }
      }`;

      const result = await graphql({ schema, source: mutation });
      expect(result.errors).toBeUndefined();
      expect(result.data).toEqual({ mutationWithOptionalInputsArray: { field: null } });
    });

    it("should properly validate arg array when one of optional items in the input array is incorrect", async () => {
      const mutation = `mutation {
        mutationWithOptionalInputsArray(inputs: [
          null,
          {
            stringField: "12345",
            numberField: 5
          },
          {
            stringField: "12345",
            numberField: 15,
          },
        ]) {
          field
        }
      }`;

      const result = await graphql({ schema, source: mutation });
      expect(result.data).toBeNull();
      expect(result.errors).toHaveLength(1);

      const validationError = result.errors![0].originalError! as ArgumentValidationError;
      expect(validationError).toBeInstanceOf(ArgumentValidationError);
      expect(validationError.extensions.validationErrors).toHaveLength(1);
      expect(validationError.extensions.validationErrors[0].property).toEqual("numberField");
    });

    it("should throw validation error when optional input field is incorrect", async () => {
      const mutation = `mutation {
        sampleMutation(input: {
          stringField: "12345",
          numberField: 5,
          optionalField: -5,
        }) {
          field
        }
      }`;

      const result: any = await graphql({ schema, source: mutation });
      expect(result.data).toBeNull();
      expect(result.errors).toHaveLength(1);

      const validationError = result.errors![0].originalError! as ArgumentValidationError;
      expect(validationError).toBeInstanceOf(ArgumentValidationError);
      expect(validationError.extensions.validationErrors).toHaveLength(1);
      expect(validationError.extensions.validationErrors[0].property).toEqual("optionalField");
    });

    it("should pass input validation when arguments data without optional field is correct", async () => {
      const query = `query {
      sampleQuery(
        stringField: "12345",
        numberField: 5,
      ) {
        field
      }
    }`;
      await graphql({ schema, source: query });

      expect(argsData).toEqual({ stringField: "12345", numberField: 5 });
    });

    it("should pass input validation when arguments data with optional field is correct", async () => {
      const query = `query {
        sampleQuery(
          stringField: "12345",
          numberField: 5,
          optionalField: 5,
        ) {
          field
        }
      }`;
      await graphql({ schema, source: query });

      expect(argsData).toEqual({ stringField: "12345", numberField: 5, optionalField: 5 });
    });

    it("should throw validation error when one of arguments is incorrect", async () => {
      const query = `query {
        sampleQuery(
          stringField: "12345",
          numberField: 15,
        ) {
          field
        }
      }`;

      const result: any = await graphql({ schema, source: query });
      expect(result.data).toBeNull();
      expect(result.errors).toHaveLength(1);

      const validationError = result.errors![0].originalError! as ArgumentValidationError;
      expect(validationError).toBeInstanceOf(ArgumentValidationError);
      expect(validationError.extensions.validationErrors).toHaveLength(1);
      expect(validationError.extensions.validationErrors[0].property).toEqual("numberField");
    });

    it("should throw validation error when optional argument is incorrect", async () => {
      const query = `query {
        sampleQuery(
          stringField: "12345",
          numberField: 5,
          optionalField: -5,
        ) {
          field
        }
      }`;

      const result: any = await graphql({ schema, source: query });
      expect(result.data).toBeNull();
      expect(result.errors).toHaveLength(1);

      const validationError = result.errors![0].originalError! as ArgumentValidationError;
      expect(validationError).toBeInstanceOf(ArgumentValidationError);
      expect(validationError.extensions.validationErrors).toHaveLength(1);
      expect(validationError.extensions.validationErrors[0].property).toEqual("optionalField");
    });
  });

  describe("Settings", () => {
    let localArgsData: any;
    beforeEach(() => {
      localArgsData = undefined;
    });

    it("should pass incorrect args when validation is turned off by default", async () => {
      getMetadataStorage().clear();

      @ObjectType()
      class SampleObject {
        @Field({ nullable: true })
        field?: string;
      }
      @ArgsType()
      class SampleArguments {
        @Field()
        @MaxLength(5)
        field!: string;
      }
      @Resolver(() => SampleObject)
      class SampleResolver {
        @Query()
        sampleQuery(@Args() args: SampleArguments): SampleObject {
          localArgsData = args;
          return {};
        }
      }
      const localSchema = await buildSchema({
        resolvers: [SampleResolver],
        // default - `validate: false,`
      });

      const query = `query {
        sampleQuery(
          field: "12345678",
        ) {
          field
        }
      }`;
      await graphql({ schema: localSchema, source: query });
      expect(localArgsData).toEqual({ field: "12345678" });
    });

    it("should pass incorrect args when validation is turned off explicitly", async () => {
      getMetadataStorage().clear();

      @ObjectType()
      class SampleObject {
        @Field({ nullable: true })
        field?: string;
      }
      @ArgsType()
      class SampleArguments {
        @Field()
        @MaxLength(5)
        field!: string;
      }
      @Resolver(() => SampleObject)
      class SampleResolver {
        @Query()
        sampleQuery(@Args() args: SampleArguments): SampleObject {
          localArgsData = args;
          return {};
        }
      }
      const localSchema = await buildSchema({
        resolvers: [SampleResolver],
        validate: false,
      });

      const query = `query {
        sampleQuery(
          field: "12345678",
        ) {
          field
        }
      }`;
      await graphql({ schema: localSchema, source: query });
      expect(localArgsData).toEqual({ field: "12345678" });
    });

    it("should pass incorrect args when validation is locally turned off", async () => {
      getMetadataStorage().clear();

      @ObjectType()
      class SampleObject {
        @Field({ nullable: true })
        field?: string;
      }
      @ArgsType()
      class SampleArguments {
        @Field()
        @MaxLength(5)
        field!: string;
      }
      @Resolver(() => SampleObject)
      class SampleResolver {
        @Query()
        sampleQuery(@Args({ validate: false }) args: SampleArguments): SampleObject {
          localArgsData = args;
          return {};
        }
      }
      const localSchema = await buildSchema({
        resolvers: [SampleResolver],
        validate: true,
      });

      const query = `query {
        sampleQuery(
          field: "12345678",
        ) {
          field
        }
      }`;
      await graphql({ schema: localSchema, source: query });
      expect(localArgsData).toEqual({ field: "12345678" });
    });

    it("should throw validation error when validation is locally turned on", async () => {
      getMetadataStorage().clear();

      @ObjectType()
      class SampleObject {
        @Field({ nullable: true })
        field?: string;
      }
      @ArgsType()
      class SampleArguments {
        @Field()
        @MaxLength(5)
        field!: string;
      }
      @Resolver(() => SampleObject)
      class SampleResolver {
        @Query()
        sampleQuery(@Args({ validate: true }) args: SampleArguments): SampleObject {
          localArgsData = args;
          return {};
        }
      }
      const localSchema = await buildSchema({
        resolvers: [SampleResolver],
        validate: false,
      });

      const query = `query {
        sampleQuery(
          field: "12345678",
        ) {
          field
        }
      }`;
      const result: any = await graphql({ schema: localSchema, source: query });
      expect(result.data).toBeNull();
      expect(result.errors).toHaveLength(1);

      const validationError = result.errors![0].originalError! as ArgumentValidationError;
      expect(validationError).toBeInstanceOf(ArgumentValidationError);
      expect(validationError.extensions.validationErrors).toHaveLength(1);
      expect(validationError.extensions.validationErrors[0].property).toEqual("field");
    });

    it("should throw validation error for incorrect args when applied local validation settings", async () => {
      getMetadataStorage().clear();

      @ObjectType()
      class SampleObject {
        @Field({ nullable: true })
        field?: string;
      }
      @ArgsType()
      class SampleArguments {
        @Field()
        @MaxLength(5, { groups: ["test"] })
        field!: string;
      }
      @Resolver(() => SampleObject)
      class SampleResolver {
        @Query()
        sampleQuery(@Args({ validate: { groups: ["test"] } }) args: SampleArguments): SampleObject {
          localArgsData = args;
          return {};
        }
      }
      const localSchema = await buildSchema({
        resolvers: [SampleResolver],
        validate: false,
      });

      const query = `query {
        sampleQuery(
          field: "12345678",
        ) {
          field
        }
      }`;
      const result: any = await graphql({ schema: localSchema, source: query });
      expect(result.data).toBeNull();
      expect(result.errors).toHaveLength(1);

      const validationError = result.errors![0].originalError! as ArgumentValidationError;
      expect(validationError).toBeInstanceOf(ArgumentValidationError);
      expect(validationError.extensions.validationErrors).toHaveLength(1);
      expect(validationError.extensions.validationErrors[0].property).toEqual("field");
    });

    it("should pass validation of incorrect args when applied local validation settings", async () => {
      getMetadataStorage().clear();

      @ObjectType()
      class SampleObject {
        @Field({ nullable: true })
        field?: string;
      }
      @ArgsType()
      class SampleArguments {
        @Field()
        @MaxLength(5, { groups: ["not-test"] })
        field!: string;
      }
      @Resolver(() => SampleObject)
      class SampleResolver {
        @Query()
        sampleQuery(@Args({ validate: { groups: ["test"] } }) args: SampleArguments): SampleObject {
          localArgsData = args;
          return {};
        }
      }
      const localSchema = await buildSchema({
        resolvers: [SampleResolver],
        validate: false,
      });

      const query = `query {
        sampleQuery(
          field: "123456789",
        ) {
          field
        }
      }`;
      await graphql({ schema: localSchema, source: query });
      expect(localArgsData).toEqual({ field: "123456789" });
    });

    it("should merge local validation settings with global one", async () => {
      getMetadataStorage().clear();

      @ObjectType()
      class SampleObject {
        @Field({ nullable: true })
        field?: string;
      }
      @ArgsType()
      class SampleArguments {
        @Field()
        @MaxLength(5, { groups: ["test"] })
        field!: string;
      }
      @Resolver(() => SampleObject)
      class SampleResolver {
        @Query()
        sampleQuery(@Args({ validate: { groups: ["test"] } }) args: SampleArguments): SampleObject {
          localArgsData = args;
          return {};
        }
      }
      const localSchema = await buildSchema({
        resolvers: [SampleResolver],
        validate: { validationError: { target: false } },
      });

      const query = `query {
        sampleQuery(
          field: "123456789",
        ) {
          field
        }
      }`;
      const { errors } = await graphql({ schema: localSchema, source: query });
      const error = errors![0].originalError! as ArgumentValidationError;

      expect(localArgsData).toBeUndefined();
      expect(error.extensions.validationErrors[0].target).toBeUndefined();
    });
  });
});

describe("Custom validation", () => {
  let schema: GraphQLSchema;
  const document = /* graphql */ `
    query {
      sampleQuery(sampleField: "sampleFieldValue")
    }
  `;
  let sampleArgsCls: Function;
  let sampleInputCls: Function;
  let sampleResolverCls: Function;

  let validateArgs: Array<any | undefined> = [];
  let validateTypes: TypeValue[] = [];
  let validateResolverData: ResolverData[] = [];
  let sampleQueryArgs: any[] = [];

  beforeAll(async () => {
    getMetadataStorage().clear();

    @ArgsType()
    class SampleArgs {
      @Field()
      sampleField!: string;
    }
    sampleArgsCls = SampleArgs;
    @InputType()
    class SampleInput {
      @Field()
      sampleField!: string;
    }
    sampleInputCls = SampleInput;
    @Resolver()
    class SampleResolver {
      @Query(() => Boolean)
      sampleQuery(@Args() args: SampleArgs) {
        sampleQueryArgs.push(args);
        return true;
      }

      @Query(() => Boolean)
      sampleArrayArgQuery(@Arg("arrayArg", () => [SampleInput]) arrayArg: SampleInput[]) {
        sampleQueryArgs.push(arrayArg);
        return true;
      }

      @Query()
      sampleInlineArgValidateFnQuery(
        @Arg("arg", {
          validateFn: (arg, type, resolverData) => {
            validateArgs.push(arg);
            validateTypes.push(type);
            validateResolverData.push(resolverData);
          },
        })
        arg: SampleInput,
      ): string {
        return arg.sampleField;
      }
    }
    sampleResolverCls = SampleResolver;
  });

  beforeEach(() => {
    validateArgs = [];
    validateTypes = [];
    validateResolverData = [];
    sampleQueryArgs = [];
  });

  it("should call `validateFn` function provided in option with proper params", async () => {
    schema = await buildSchema({
      resolvers: [sampleResolverCls],
      validateFn: (arg, type, resolverData) => {
        validateArgs.push(arg);
        validateTypes.push(type);
        validateResolverData.push(resolverData);
      },
    });

    await graphql({ schema, source: document, contextValue: { isContext: true } });

    expect(validateArgs).toEqual([{ sampleField: "sampleFieldValue" }]);
    expect(validateArgs[0]).toBeInstanceOf(sampleArgsCls);
    expect(validateTypes).toEqual([sampleArgsCls]);
    expect(validateResolverData).toEqual([
      expect.objectContaining({
        context: { isContext: true },
      }),
    ]);
  });

  it("should let `validateFn` function handle array args", async () => {
    schema = await buildSchema({
      resolvers: [sampleResolverCls],
      validateFn: (arg, type) => {
        validateArgs.push(arg);
        validateTypes.push(type);
      },
    });

    await graphql({
      schema,
      source: /* graphql */ `
        query {
          sampleArrayArgQuery(arrayArg: [{ sampleField: "sampleFieldValue" }])
        }
      `,
    });

    expect(validateArgs).toEqual([[{ sampleField: "sampleFieldValue" }]]);
    expect((validateArgs[0] as object[])[0]).toBeInstanceOf(sampleInputCls);
    expect(validateTypes).toEqual([sampleInputCls]);
  });

  it("should inject validated arg as resolver param", async () => {
    schema = await buildSchema({
      resolvers: [sampleResolverCls],
      validateFn: () => {
        // do nothing
      },
    });

    await graphql({ schema, source: document });

    expect(sampleQueryArgs).toEqual([{ sampleField: "sampleFieldValue" }]);
  });

  it("should call `validateFn` function provided inline in arg option with proper params", async () => {
    schema = await buildSchema({
      resolvers: [sampleResolverCls],
    });

    await graphql({
      schema,
      source: /* graphql */ `
        query {
          sampleInlineArgValidateFnQuery(arg: { sampleField: "sampleArgValue" })
        }
      `,
      contextValue: { isContext: true },
    });

    expect(validateArgs).toEqual([{ sampleField: "sampleArgValue" }]);
    expect(validateArgs[0]).toBeInstanceOf(sampleInputCls);
    expect(validateTypes).toEqual([sampleInputCls]);
    expect(validateResolverData).toEqual([
      expect.objectContaining({
        context: { isContext: true },
      }),
    ]);
  });

  it("should rethrow wrapped error when error thrown in `validate`", async () => {
    schema = await buildSchema({
      resolvers: [sampleResolverCls],
      validateFn: () => {
        throw new Error("Test validate error");
      },
    });

    const result: any = await graphql({ schema, source: document });

    expect(result.errors).toHaveLength(1);
    expect(result.errors![0].message).toEqual("Test validate error");
    expect(result.data).toBeNull();
    expect(sampleQueryArgs).toHaveLength(0);
  });
});
