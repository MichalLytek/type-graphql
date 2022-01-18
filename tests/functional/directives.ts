// tslint:disable:member-ordering
import "reflect-metadata";
import {
  GraphQLSchema,
  graphql,
  GraphQLInputObjectType,
  GraphQLInterfaceType,
  GraphQLObjectType,
} from "graphql";
import {
  Field,
  InputType,
  Resolver,
  Query,
  Arg,
  Directive,
  buildSchema,
  ObjectType,
  Mutation,
  FieldResolver,
  Subscription,
  InterfaceType,
} from "../../src";
import { getMetadataStorage } from "../../src/metadata/getMetadataStorage";
import {
  upperCaseDirective,
  upperCaseDirectiveTransformer,
} from "../helpers/directives/UpperCaseDirective";
import { appendDirective, appendDirectiveTransformer } from "../helpers/directives/AppendDirective";
import { assertValidDirective } from "../helpers/directives/assertValidDirective";
import { InvalidDirectiveError } from "../../src/errors/InvalidDirectiveError";
import { hexDefaultValueDirectiveTransformer } from "../helpers/directives/HexDefaultValueDirective";

describe("Directives", () => {
  let schema: GraphQLSchema;

  describe("Schema", () => {
    beforeAll(async () => {
      getMetadataStorage().clear();

      @InputType()
      class DirectiveOnFieldInput {
        @Field()
        @Directive("@hexDefaultValue")
        value: string;
      }

      @InputType()
      class SubDirectiveOnFieldInput extends DirectiveOnFieldInput {}

      @InputType()
      @Directive("@hexDefaultValue")
      class DirectiveOnClassInput {
        @Field()
        value: string;
      }

      @ObjectType()
      class SampleObjectType {
        @Field()
        @Directive("foo")
        withDirective: string = "withDirective";

        // @Field()
        // @Directive("bar", { baz: "true" })
        // withDirectiveWithArgs: string = "withDirectiveWithArgs";

        @Field()
        @Directive("upper")
        withUpper: string = "withUpper";

        @Field()
        @Directive("@upper")
        withUpperDefinition: string = "withUpperDefinition";

        @Field()
        @Directive("append")
        withAppend: string = "hello";

        @Field()
        @Directive("@append")
        withAppendDefinition: string = "hello";

        @Field()
        @Directive("append")
        @Directive("upper")
        withUpperAndAppend: string = "hello";

        @Field()
        withInput(@Arg("input") input: DirectiveOnFieldInput): string {
          return `value: ${input.value}`;
        }

        @Field()
        @Directive("upper")
        withInputUpper(@Arg("input") input: DirectiveOnFieldInput): string {
          return `value: ${input.value}`;
        }

        @Field()
        withInputOnClass(@Arg("input") input: DirectiveOnClassInput): string {
          return `value: ${input.value}`;
        }

        @Field()
        @Directive("upper")
        withInputUpperOnClass(@Arg("input") input: DirectiveOnClassInput): string {
          return `value: ${input.value}`;
        }
      }

      @ObjectType()
      class SubSampleObjectType extends SampleObjectType {
        @Field()
        withInput(@Arg("input") input: SubDirectiveOnFieldInput): string {
          return `value: ${input.value}`;
        }
      }

      @InterfaceType()
      @Directive("foo")
      abstract class DirectiveOnInterface {
        @Field()
        @Directive("bar")
        withDirective: string;
      }

      @ObjectType({ implements: DirectiveOnInterface })
      class ObjectImplement extends DirectiveOnInterface {}

      @Resolver()
      class SampleResolver {
        @Query(() => SampleObjectType)
        objectType(): SampleObjectType {
          return new SampleObjectType();
        }

        @Query()
        @Directive("foo")
        queryWithDirective(): string {
          return "queryWithDirective";
        }

        // @Query()
        // @Directive("bar", { baz: "true" })
        // queryWithDirectiveWithArgs(): string {
        //   return "queryWithDirectiveWithArgs";
        // }

        @Query()
        @Directive("upper")
        queryWithUpper(): string {
          return "queryWithUpper";
        }

        @Query()
        @Directive("@upper")
        queryWithUpperDefinition(): string {
          return "queryWithUpper";
        }

        @Query()
        @Directive("append")
        queryWithAppend(): string {
          return "hello";
        }

        @Query()
        @Directive("@append")
        queryWithAppendDefinition(): string {
          return "hello";
        }

        @Query()
        @Directive("append")
        @Directive("upper")
        queryWithUpperAndAppend(): string {
          return "hello";
        }

        @Mutation()
        @Directive("foo")
        mutationWithDirective(): string {
          return "mutationWithDirective";
        }

        // @Mutation()
        // @Directive("bar", { baz: "true" })
        // mutationWithDirectiveWithArgs(): string {
        //   return "mutationWithDirectiveWithArgs";
        // }

        @Mutation()
        @Directive("upper")
        mutationWithUpper(): string {
          return "mutationWithUpper";
        }

        @Mutation()
        @Directive("@upper")
        mutationWithUpperDefinition(): string {
          return "mutationWithUpper";
        }

        @Mutation()
        @Directive("append")
        mutationWithAppend(): string {
          return "hello";
        }

        @Mutation()
        @Directive("@append")
        mutationWithAppendDefinition(): string {
          return "hello";
        }

        @Mutation()
        @Directive("append")
        @Directive("upper")
        mutationWithUpperAndAppend(): string {
          return "hello";
        }

        @Subscription({ topics: "TEST" })
        @Directive("@foo")
        subscriptionWithDirective(): string {
          return "subscriptionWithDirective";
        }
      }

      @Resolver(of => SampleObjectType)
      class SampleObjectTypeResolver {
        @FieldResolver()
        @Directive("@append")
        fieldResolverWithAppendDefinition(): string {
          return "hello";
        }
      }

      @Resolver(of => SubSampleObjectType)
      class SubSampleResolver {
        @Query(() => SubSampleObjectType)
        subObjectType(): SubSampleObjectType {
          return new SubSampleObjectType();
        }
      }

      @Resolver(() => ObjectImplement)
      class ObjectImplementResolver {
        @Query(() => ObjectImplement)
        objectImplentingInterface(): ObjectImplement {
          return new ObjectImplement();
        }
      }

      schema = await buildSchema({
        resolvers: [
          SampleResolver,
          SampleObjectTypeResolver,
          SubSampleResolver,
          ObjectImplementResolver,
        ],
        validate: false,
        directives: [upperCaseDirective, appendDirective],
      });

      schema = appendDirectiveTransformer(schema);
      schema = upperCaseDirectiveTransformer(schema);
      schema = hexDefaultValueDirectiveTransformer(schema);
    });

    it("should generate schema without errors", async () => {
      expect(schema).toBeDefined();
    });

    describe("Query", () => {
      it("should add directives to query types", async () => {
        const queryWithDirective = schema.getQueryType()!.getFields().queryWithDirective;

        assertValidDirective(queryWithDirective.astNode, "foo");
      });

      // it("should add directives to query types with arguments", async () => {
      //   const queryWithDirectiveWithArgs = schema.getQueryType()!.getFields()
      //     .queryWithDirectiveWithArgs;

      //   assertValidDirective(queryWithDirectiveWithArgs.astNode, "bar", { baz: "true" });
      // });

      it("calls directive 'upper'", async () => {
        const query = `query {
          queryWithUpper
        }`;

        const { data, errors } = await graphql({ schema, source: query });

        console.log(errors);
        expect(data).toHaveProperty("queryWithUpper", "QUERYWITHUPPER");
      });

      it("calls directive 'upper' using Definition", async () => {
        const query = `query {
          queryWithUpperDefinition
        }`;

        const { data, errors } = await graphql({ schema, source: query });

        console.log(errors);
        expect(data).toHaveProperty("queryWithUpperDefinition", "QUERYWITHUPPER");
      });

      it("calls directive 'append'", async () => {
        const query = `query {
          queryWithAppend(append: ", world!")
        }`;

        const { data, errors } = await graphql({ schema, source: query });

        console.log(errors);
        expect(data).toHaveProperty("queryWithAppend", "hello, world!");
      });

      it("calls directive 'append' using Definition", async () => {
        const query = `query {
          queryWithAppendDefinition(append: ", world!")
        }`;

        const { data, errors } = await graphql({ schema, source: query });

        console.log(errors);
        expect(data).toHaveProperty("queryWithAppendDefinition", "hello, world!");
      });

      it("calls directive 'upper' and 'append'", async () => {
        const query = `query {
          queryWithUpperAndAppend(append: ", world!")
        }`;

        const { data, errors } = await graphql({ schema, source: query });

        console.log(errors);
        expect(data).toHaveProperty("queryWithUpperAndAppend", "HELLO, WORLD!");
      });
    });

    describe("Mutation", () => {
      it("should add directives to mutation types", async () => {
        const mutationWithDirective = schema.getMutationType()!.getFields().mutationWithDirective;

        assertValidDirective(mutationWithDirective.astNode, "foo");
      });

      // it("should add directives to mutation types with arguments", async () => {
      //   const mutationWithDirectiveWithArgs = schema.getMutationType()!.getFields()
      //     .mutationWithDirectiveWithArgs;

      //   assertValidDirective(mutationWithDirectiveWithArgs.astNode, "bar", { baz: "true" });
      // });

      it("calls directive 'upper'", async () => {
        const mutation = `mutation {
          mutationWithUpper
        }`;

        const { data, errors } = await graphql({ schema, source: mutation });

        console.log(errors);
        expect(data).toHaveProperty("mutationWithUpper", "MUTATIONWITHUPPER");
      });

      it("calls directive 'upper' using Definition", async () => {
        const mutation = `mutation {
          mutationWithUpperDefinition
        }`;

        const { data, errors } = await graphql({ schema, source: mutation });

        console.log(errors);
        expect(data).toHaveProperty("mutationWithUpperDefinition", "MUTATIONWITHUPPER");
      });

      it("calls directive 'append'", async () => {
        const mutation = `mutation {
          mutationWithAppend(append: ", world!")
        }`;

        const { data, errors } = await graphql({ schema, source: mutation });

        console.log(errors);
        expect(data).toHaveProperty("mutationWithAppend", "hello, world!");
      });

      it("calls directive 'append' using Definition", async () => {
        const mutation = `mutation {
          mutationWithAppendDefinition(append: ", world!")
        }`;

        const { data, errors } = await graphql({ schema, source: mutation });

        console.log(errors);
        expect(data).toHaveProperty("mutationWithAppendDefinition", "hello, world!");
      });

      it("calls directive 'upper' and 'append'", async () => {
        const mutation = `mutation {
          mutationWithUpperAndAppend(append: ", world!")
        }`;

        const { data, errors } = await graphql({ schema, source: mutation });

        console.log(errors);
        expect(data).toHaveProperty("mutationWithUpperAndAppend", "HELLO, WORLD!");
      });
    });

    describe("Subscription", () => {
      it("should add directives to subscription types", async () => {
        const subscriptionWithDirective = schema
          .getSubscriptionType()!
          .getFields().subscriptionWithDirective;

        assertValidDirective(subscriptionWithDirective.astNode, "foo");
      });
    });

    describe("InputType", () => {
      it("adds field directive to input types", async () => {
        const inputType = schema.getType("DirectiveOnClassInput") as GraphQLInputObjectType;

        expect(inputType).toHaveProperty("astNode");
        assertValidDirective(inputType.astNode, "hexDefaultValue");
      });

      it("adds field directives to input type fields", async () => {
        const fields = (
          schema.getType("DirectiveOnFieldInput") as GraphQLInputObjectType
        ).getFields();

        // expect(fields).toHaveProperty("append");
        expect(fields.value).toHaveProperty("astNode");
        assertValidDirective(fields.value.astNode, "hexDefaultValue");
      });

      it.skip("adds inherited field directives to input type fields while extending input type class", async () => {
        const fields = (
          schema.getType("SubDirectiveOnFieldInput") as GraphQLInputObjectType
        ).getFields();

        expect(fields).toHaveProperty("append");
        expect(fields.value).toHaveProperty("astNode");
        assertValidDirective(fields.value.astNode, "upper");
      });
    });

    describe("ObjectType", () => {
      it("calls object type directives", async () => {
        const query = `query {
          objectType {
            withDirective
            # withDirectiveWithArgs
            withUpper
            withUpperDefinition
            withAppend(append: ", world!")
            withAppendDefinition(append: ", world!")
            withUpperAndAppend(append: ", world!")
            withInput(input: { append: ", world!" })
            withInputUpper(input: { append: ", world!" })
            withInputOnClass(input: { append: ", world!" })
            withInputUpperOnClass(input: { append: ", world!" })
            fieldResolverWithAppendDefinition(append: ", world!")
          }
      }`;

        const { data, errors } = await graphql({ schema, source: query });

        console.log(errors);
        expect(data).toHaveProperty("objectType");
        expect(data!.objectType).toEqual({
          withDirective: "withDirective",
          // withDirectiveWithArgs: "withDirectiveWithArgs",
          withUpper: "WITHUPPER",
          withUpperDefinition: "WITHUPPERDEFINITION",
          withAppend: "hello, world!",
          withAppendDefinition: "hello, world!",
          withUpperAndAppend: "HELLO, WORLD!",
          withInput: "hello, WORLD!",
          withInputUpper: "HELLO, WORLD!",
          withInputOnClass: "hello, WORLD!",
          withInputUpperOnClass: "HELLO, WORLD!",
          fieldResolverWithAppendDefinition: "hello, world!",
        });
      });

      it("call object type directives while extending field type class", async () => {
        const query = `query {
          subObjectType {
            withDirective
            # withDirectiveWithArgs
            withUpper
            withUpperDefinition
            withAppend(append: ", world!")
            withAppendDefinition(append: ", world!")
            withUpperAndAppend(append: ", world!")
            withInput(input: { append: ", world!" })
            withInputUpper(input: { append: ", world!" })
            withInputOnClass(input: { append: ", world!" })
            withInputUpperOnClass(input: { append: ", world!" })
            fieldResolverWithAppendDefinition(append: ", world!")
          }
      }`;

        const { data, errors } = await graphql({ schema, source: query });

        console.log(errors);
        expect(data).toHaveProperty("subObjectType");
        expect(data!.subObjectType).toEqual({
          withDirective: "withDirective",
          // withDirectiveWithArgs: "withDirectiveWithArgs",
          withUpper: "WITHUPPER",
          withUpperDefinition: "WITHUPPERDEFINITION",
          withAppend: "hello, world!",
          withAppendDefinition: "hello, world!",
          withUpperAndAppend: "HELLO, WORLD!",
          withInput: "hello, WORLD!",
          withInputUpper: "HELLO, WORLD!",
          withInputOnClass: "hello, WORLD!",
          withInputUpperOnClass: "HELLO, WORLD!",
          fieldResolverWithAppendDefinition: "hello, world!",
        });
      });
    });

    describe("Interface", () => {
      it("adds directive to interface", () => {
        const interfaceType = schema.getType("DirectiveOnInterface") as GraphQLInterfaceType;

        expect(interfaceType).toHaveProperty("astNode");
        assertValidDirective(interfaceType.astNode, "foo");
      });

      it("adds field directives to interface fields", async () => {
        const fields = (schema.getType("DirectiveOnInterface") as GraphQLInterfaceType).getFields();

        expect(fields).toHaveProperty("withDirective");
        expect(fields.withDirective).toHaveProperty("astNode");
        assertValidDirective(fields.withDirective.astNode, "bar");
      });

      it("adds inherited field directives to object type fields while extending interface type class", async () => {
        const fields = (schema.getType("ObjectImplement") as GraphQLObjectType).getFields();

        expect(fields).toHaveProperty("withDirective");
        expect(fields.withDirective).toHaveProperty("astNode");
        assertValidDirective(fields.withDirective.astNode, "bar");
      });
    });
  });

  describe("errors", () => {
    beforeEach(async () => {
      getMetadataStorage().clear();
    });

    it("throws error on multiple directive definitions", async () => {
      expect.assertions(2);

      @Resolver()
      class InvalidQuery {
        @Query()
        @Directive("@upper @append")
        invalid(): string {
          return "invalid";
        }
      }

      try {
        await buildSchema({ resolvers: [InvalidQuery] });
      } catch (err) {
        expect(err).toBeInstanceOf(InvalidDirectiveError);
        const error: InvalidDirectiveError = err;
        expect(error.message).toContain(
          'Please pass only one directive name or definition at a time to the @Directive decorator "@upper @append"',
        );
      }
    });

    it("throws error when parsing invalid directives", async () => {
      expect.assertions(2);

      @Resolver()
      class InvalidQuery {
        @Query()
        @Directive("@invalid(@directive)")
        invalid(): string {
          return "invalid";
        }
      }

      try {
        await buildSchema({ resolvers: [InvalidQuery] });
      } catch (err) {
        expect(err).toBeInstanceOf(InvalidDirectiveError);
        const error: InvalidDirectiveError = err;
        expect(error.message).toContain(
          'Error parsing directive definition "@invalid(@directive)"',
        );
      }
    });

    it("throws error when no directives are defined", async () => {
      expect.assertions(2);

      @Resolver()
      class InvalidQuery {
        @Query()
        @Directive("")
        invalid(): string {
          return "invalid";
        }
      }

      try {
        await buildSchema({ resolvers: [InvalidQuery] });
      } catch (err) {
        expect(err).toBeInstanceOf(InvalidDirectiveError);
        const error: InvalidDirectiveError = err;
        expect(error.message).toContain(
          "Please pass at-least one directive name or definition to the @Directive decorator",
        );
      }
    });
  });
});
