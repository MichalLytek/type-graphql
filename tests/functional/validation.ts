import "reflect-metadata";
import { MaxLength, Max, Min } from "class-validator";
import { GraphQLSchema, graphql } from "graphql";

import { getMetadataStorage } from "../../src/metadata/getMetadataStorage";
import {
  InputType,
  Field,
  buildSchema,
  Arg,
  ObjectType,
  Resolver,
  Mutation,
  Query,
  ArgumentValidationError,
  Args,
  ArgsType,
} from "../../src";

describe("Validation", () => {
  describe("Functional", () => {
    let schema: GraphQLSchema;
    let argInput: any;
    let argsData: any;
    let sampleResolver: any;

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
        stringField: string;

        @Field()
        @Max(5)
        numberField: number;

        @Field({ nullable: true })
        @Min(5)
        optionalField?: number;
      }

      @ArgsType()
      class SampleArguments {
        @Field()
        @MaxLength(5)
        stringField: string;

        @Field()
        @Max(5)
        numberField: number;

        @Field({ nullable: true })
        @Min(5)
        optionalField?: number;
      }

      @Resolver(of => SampleObject)
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
      }
      sampleResolver = SampleResolver;

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
      await graphql(schema, mutation);

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
      await graphql(schema, mutation);

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

      const result = await graphql(schema, mutation);
      expect(result.data).toBeNull();
      expect(result.errors).toHaveLength(1);

      const validationError = result.errors![0].originalError! as ArgumentValidationError;
      expect(validationError).toBeInstanceOf(ArgumentValidationError);
      expect(validationError.validationErrors).toHaveLength(1);
      expect(validationError.validationErrors[0].property).toEqual("numberField");
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

      const result = await graphql(schema, mutation);
      expect(result.data).toBeNull();
      expect(result.errors).toHaveLength(1);

      const validationError = result.errors![0].originalError! as ArgumentValidationError;
      expect(validationError).toBeInstanceOf(ArgumentValidationError);
      expect(validationError.validationErrors).toHaveLength(1);
      expect(validationError.validationErrors[0].property).toEqual("optionalField");
    });

    // tslint:disable-next-line:max-line-length
    it("should pass input validation when arguments data without optional field is correct", async () => {
      const query = `query {
      sampleQuery(
        stringField: "12345",
        numberField: 5,
      ) {
        field
      }
    }`;
      await graphql(schema, query);

      expect(argsData).toEqual({ stringField: "12345", numberField: 5 });
    });

    // tslint:disable-next-line:max-line-length
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
      await graphql(schema, query);

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

      const result = await graphql(schema, query);
      expect(result.data).toBeNull();
      expect(result.errors).toHaveLength(1);

      const validationError = result.errors![0].originalError! as ArgumentValidationError;
      expect(validationError).toBeInstanceOf(ArgumentValidationError);
      expect(validationError.validationErrors).toHaveLength(1);
      expect(validationError.validationErrors[0].property).toEqual("numberField");
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

      const result = await graphql(schema, query);
      expect(result.data).toBeNull();
      expect(result.errors).toHaveLength(1);

      const validationError = result.errors![0].originalError! as ArgumentValidationError;
      expect(validationError).toBeInstanceOf(ArgumentValidationError);
      expect(validationError.validationErrors).toHaveLength(1);
      expect(validationError.validationErrors[0].property).toEqual("optionalField");
    });
  });

  describe("Settings", () => {
    let localArgsData: any;
    beforeEach(() => {
      localArgsData = undefined;
    });

    it("should pass incorrect args when validation is turned off", async () => {
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
        field: string;
      }
      @Resolver(of => SampleObject)
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
      await graphql(localSchema, query);
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
        field: string;
      }
      @Resolver(of => SampleObject)
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
      await graphql(localSchema, query);
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
        field: string;
      }
      @Resolver(of => SampleObject)
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
      const result = await graphql(localSchema, query);
      expect(result.data).toBeNull();
      expect(result.errors).toHaveLength(1);

      const validationError = result.errors![0].originalError! as ArgumentValidationError;
      expect(validationError).toBeInstanceOf(ArgumentValidationError);
      expect(validationError.validationErrors).toHaveLength(1);
      expect(validationError.validationErrors[0].property).toEqual("field");
    });

    // tslint:disable-next-line:max-line-length
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
        field: string;
      }
      @Resolver(of => SampleObject)
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
      const result = await graphql(localSchema, query);
      expect(result.data).toBeNull();
      expect(result.errors).toHaveLength(1);

      const validationError = result.errors![0].originalError! as ArgumentValidationError;
      expect(validationError).toBeInstanceOf(ArgumentValidationError);
      expect(validationError.validationErrors).toHaveLength(1);
      expect(validationError.validationErrors[0].property).toEqual("field");
    });

    // tslint:disable-next-line:max-line-length
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
        field: string;
      }
      @Resolver(of => SampleObject)
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
      await graphql(localSchema, query);
      expect(localArgsData).toEqual({ field: "123456789" });
    });

    // tslint:disable-next-line:max-line-length
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
        field: string;
      }
      @Resolver(of => SampleObject)
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
      const { errors } = await graphql(localSchema, query);
      const error = errors![0].originalError! as ArgumentValidationError;

      expect(localArgsData).toBeUndefined();
      expect(error.validationErrors[0].target).toBeUndefined();
    });
  });
});
