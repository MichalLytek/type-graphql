// tslint:disable:member-ordering
import "reflect-metadata";

import { GraphQLSchema, graphql, GraphQLInputObjectType } from "graphql";
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
} from "../../src";
import { getMetadataStorage } from "../../src/metadata/getMetadataStorage";
import { SchemaDirectiveVisitor } from "graphql-tools";
import { UpperCaseDirective } from "../helpers/directives/UpperCaseDirective";
import { AppendDirective } from "../helpers/directives/AppendDirective";
import { assertValidDirective } from "../helpers/directives/assertValidDirective";
import { InvalidDirectiveError } from "../../src/errors/InvalidDirectiveError";

describe("Directives", () => {
  let schema: GraphQLSchema;

  describe("Schema", () => {
    beforeAll(async () => {
      getMetadataStorage().clear();

      @InputType()
      class DirectiveOnFieldInput {
        @Field()
        @Directive("@upper")
        append: string;
      }

      @InputType()
      @Directive("@upper")
      class DirectiveOnClassInput {
        @Field()
        append: string;
      }

      @ObjectType()
      class SampleObjectType {
        @Field()
        @Directive("foo")
        withDirective: string = "withDirective";

        @Field()
        @Directive("bar", { baz: "true" })
        withDirectiveWithArgs: string = "withDirectiveWithArgs";

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
          return `hello${input.append}`;
        }

        @Field()
        @Directive("upper")
        withInputUpper(@Arg("input") input: DirectiveOnFieldInput): string {
          return `hello${input.append}`;
        }

        @Field()
        withInputOnClass(@Arg("input") input: DirectiveOnClassInput): string {
          return `hello${input.append}`;
        }

        @Field()
        @Directive("upper")
        withInputUpperOnClass(@Arg("input") input: DirectiveOnClassInput): string {
          return `hello${input.append}`;
        }
      }

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

        @Query()
        @Directive("bar", { baz: "true" })
        queryWithDirectiveWithArgs(): string {
          return "queryWithDirectiveWithArgs";
        }

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

        @Mutation()
        @Directive("bar", { baz: "true" })
        mutationWithDirectiveWithArgs(): string {
          return "mutationWithDirectiveWithArgs";
        }

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
      }

      schema = await buildSchema({
        resolvers: [SampleResolver],
      });

      SchemaDirectiveVisitor.visitSchemaDirectives(schema, {
        upper: UpperCaseDirective,
        append: AppendDirective,
      });
    });

    it("should generate schema without errors", async () => {
      expect(schema).toBeDefined();
    });

    describe("Query", () => {
      it("should add directives to query types", async () => {
        const queryWithDirective = schema.getQueryType()!.getFields().queryWithDirective;

        assertValidDirective(queryWithDirective.astNode, "foo");
      });

      it("should add directives to query types with arguments", async () => {
        const queryWithDirectiveWithArgs = schema.getQueryType()!.getFields()
          .queryWithDirectiveWithArgs;

        assertValidDirective(queryWithDirectiveWithArgs.astNode, "bar", { baz: "true" });
      });

      it("calls directive 'upper'", async () => {
        const query = `query {
          queryWithUpper
        }`;

        const { data } = await graphql(schema, query);

        expect(data).toHaveProperty("queryWithUpper");
        expect(data.queryWithUpper).toBe("QUERYWITHUPPER");
      });

      it("calls directive 'upper' using Definition", async () => {
        const query = `query {
          queryWithUpperDefinition
        }`;

        const { data } = await graphql(schema, query);

        expect(data).toHaveProperty("queryWithUpperDefinition");
        expect(data.queryWithUpperDefinition).toBe("QUERYWITHUPPER");
      });

      it("calls directive 'append'", async () => {
        const query = `query {
          queryWithAppend(append: ", world!")
        }`;

        const { data } = await graphql(schema, query);

        expect(data).toHaveProperty("queryWithAppend");
        expect(data.queryWithAppend).toBe("hello, world!");
      });

      it("calls directive 'append' using Definition", async () => {
        const query = `query {
          queryWithAppendDefinition(append: ", world!")
        }`;

        const { data } = await graphql(schema, query);

        expect(data).toHaveProperty("queryWithAppendDefinition");
        expect(data.queryWithAppendDefinition).toBe("hello, world!");
      });

      it("calls directive 'upper' and 'append'", async () => {
        const query = `query {
          queryWithUpperAndAppend(append: ", world!")
        }`;

        const { data } = await graphql(schema, query);

        expect(data).toHaveProperty("queryWithUpperAndAppend");
        expect(data.queryWithUpperAndAppend).toBe("HELLO, WORLD!");
      });
    });

    describe("Mutation", () => {
      it("should add directives to mutation types", async () => {
        const mutationWithDirective = schema.getMutationType()!.getFields().mutationWithDirective;

        assertValidDirective(mutationWithDirective.astNode, "foo");
      });

      it("should add directives to mutation types with arguments", async () => {
        const mutationWithDirectiveWithArgs = schema.getMutationType()!.getFields()
          .mutationWithDirectiveWithArgs;

        assertValidDirective(mutationWithDirectiveWithArgs.astNode, "bar", { baz: "true" });
      });

      it("calls directive 'upper'", async () => {
        const mutation = `mutation {
          mutationWithUpper
        }`;

        const { data } = await graphql(schema, mutation);

        expect(data).toHaveProperty("mutationWithUpper");
        expect(data.mutationWithUpper).toBe("MUTATIONWITHUPPER");
      });

      it("calls directive 'upper' using Definition", async () => {
        const mutation = `mutation {
          mutationWithUpperDefinition
        }`;

        const { data } = await graphql(schema, mutation);

        expect(data).toHaveProperty("mutationWithUpperDefinition");
        expect(data.mutationWithUpperDefinition).toBe("MUTATIONWITHUPPER");
      });

      it("calls directive 'append'", async () => {
        const mutation = `mutation {
          mutationWithAppend(append: ", world!")
        }`;

        const { data } = await graphql(schema, mutation);

        expect(data).toHaveProperty("mutationWithAppend");
        expect(data.mutationWithAppend).toBe("hello, world!");
      });

      it("calls directive 'append' using Definition", async () => {
        const mutation = `mutation {
          mutationWithAppendDefinition(append: ", world!")
        }`;

        const { data } = await graphql(schema, mutation);

        expect(data).toHaveProperty("mutationWithAppendDefinition");
        expect(data.mutationWithAppendDefinition).toBe("hello, world!");
      });

      it("calls directive 'upper' and 'append'", async () => {
        const mutation = `mutation {
          mutationWithUpperAndAppend(append: ", world!")
        }`;

        const { data } = await graphql(schema, mutation);

        expect(data).toHaveProperty("mutationWithUpperAndAppend");
        expect(data.mutationWithUpperAndAppend).toBe("HELLO, WORLD!");
      });
    });

    describe("InputType", () => {
      it("adds field directive to input types", async () => {
        const inputType = schema.getType("DirectiveOnClassInput") as GraphQLInputObjectType;

        expect(inputType).toHaveProperty("astNode");
        assertValidDirective(inputType.astNode, "upper");
      });

      it("adds field directives to input type fields", async () => {
        const fields = (schema.getType(
          "DirectiveOnFieldInput",
        ) as GraphQLInputObjectType).getFields();

        expect(fields).toHaveProperty("append");
        expect(fields.append).toHaveProperty("astNode");
        assertValidDirective(fields.append.astNode, "upper");
      });
    });

    describe("ObjectType", () => {
      it("calls object type directives", async () => {
        const query = `query {
          objectType {
            withDirective
            withDirectiveWithArgs
            withUpper
            withUpperDefinition
            withAppend(append: ", world!")
            withAppendDefinition(append: ", world!")
            withUpperAndAppend(append: ", world!")
            withInput(input: { append: ", world!" })
            withInputUpper(input: { append: ", world!" })
            withInputOnClass(input: { append: ", world!" })
            withInputUpperOnClass(input: { append: ", world!" })
          }
      }`;

        const { data } = await graphql(schema, query);

        expect(data).toHaveProperty("objectType");
        expect(data.objectType).toEqual({
          withDirective: "withDirective",
          withDirectiveWithArgs: "withDirectiveWithArgs",
          withUpper: "WITHUPPER",
          withUpperDefinition: "WITHUPPERDEFINITION",
          withAppend: "hello, world!",
          withAppendDefinition: "hello, world!",
          withUpperAndAppend: "HELLO, WORLD!",
          withInput: "hello, WORLD!",
          withInputUpper: "HELLO, WORLD!",
          withInputOnClass: "hello, WORLD!",
          withInputUpperOnClass: "HELLO, WORLD!",
        });
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
          'There must be exactly one directive defined for directive "@upper @append"',
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
        expect(error.message).toContain('Error parsing directive "@invalid(@directive)"');
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
          'There must be exactly one directive defined for directive ""',
        );
      }
    });
  });
});
