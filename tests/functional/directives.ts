// tslint:disable:member-ordering
import "reflect-metadata";

import {
  GraphQLSchema,
  FieldDefinitionNode,
  GraphQLField,
  GraphQLDirective,
  DirectiveLocation,
  GraphQLString,
  parseValue,
  graphql,
  GraphQLInputObjectType,
  InputValueDefinitionNode,
  InputObjectTypeDefinitionNode,
  GraphQLInputField,
  GraphQLScalarType,
  GraphQLNonNull,
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
} from "../../src";
import { getMetadataStorage } from "../../src/metadata/getMetadataStorage";
import Maybe from "graphql/tsutils/Maybe";
import { SchemaDirectiveVisitor } from "graphql-tools";
import { ApolloServer } from "apollo-server";

class UpperCaseType extends GraphQLScalarType {
  constructor(type: any) {
    super({
      name: "UpperCase",
      parseValue: value => type.parseValue(value),
      serialize: value => type.serialize(value),
      parseLiteral: ast => {
        const result = type.parseLiteral(ast);

        if (typeof result === "string") {
          return result.toUpperCase();
        }

        return result;
      },
    });
  }
}

class UpperCaseDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field: GraphQLField<any, any>) {
    const resolve = field.resolve;

    field.resolve = async function(...args) {
      const result = await resolve!.apply(this, args);
      if (typeof result === "string") {
        return result.toUpperCase();
      }

      return result;
    };
  }

  visitInputObject(object: GraphQLInputObjectType) {
    const fields = object.getFields();

    Object.keys(fields).forEach(field => {
      this.visitInputFieldDefinition(fields[field]);
    });
  }

  visitInputFieldDefinition(field: GraphQLInputField) {
    if (field.type instanceof UpperCaseType) {
      /* noop */
    } else if (
      field.type instanceof GraphQLNonNull &&
      field.type.ofType instanceof GraphQLScalarType
    ) {
      field.type = new GraphQLNonNull(new UpperCaseType(field.type.ofType));
    } else if (field.type instanceof GraphQLScalarType) {
      field.type = new UpperCaseType(field.type);
    } else {
      throw new Error(`Not a scalar type: ${field.type}`);
    }
  }

  static getDirectiveDeclaration(directiveName: string): GraphQLDirective {
    return new GraphQLDirective({
      name: directiveName,
      locations: [DirectiveLocation.FIELD_DEFINITION],
    });
  }
}

class AppendDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field: GraphQLField<any, any>) {
    const resolve = field.resolve;

    field.args.push({
      name: "append",
      type: GraphQLString,
    });

    field.resolve = async function(source, { append, ...otherArgs }, context, info) {
      const result = await resolve!.call(this, source, otherArgs, context, info);

      return `${result}${append}`;
    };
  }

  static getDirectiveDeclaration(directiveName: string): GraphQLDirective {
    return new GraphQLDirective({
      name: directiveName,
      locations: [DirectiveLocation.FIELD_DEFINITION],
    });
  }
}

const assertValidFieldDirective = (
  astNode: Maybe<FieldDefinitionNode | InputObjectTypeDefinitionNode | InputValueDefinitionNode>,
  name: string,
  args?: { [key: string]: string },
): void => {
  if (!astNode) {
    throw new Error(`Directive with name ${name} does not exist`);
  }

  const directives = (astNode || {}).directives || [];

  const directive = directives.find(it => it.name.kind === "Name" && it.name.value === name);

  if (!directive) {
    throw new Error(`Directive with name ${name} does not exist`);
  }

  if (!args) {
    if (Array.isArray(directive.arguments)) {
      expect(directive.arguments).toHaveLength(0);
    } else {
      expect(directive.arguments).toBeFalsy();
    }
  } else {
    expect(directive.arguments).toEqual(
      Object.keys(args).map(arg => ({
        kind: "Argument",
        name: { kind: "Name", value: arg },
        value: parseValue(args[arg]),
      })),
    );
  }
};

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
        withUpperSDL: string = "withUpperSDL";

        @Field()
        @Directive("append")
        withAppend: string = "hello";

        @Field()
        @Directive("@append")
        withAppendSDL: string = "hello";

        @Field()
        @Directive("append")
        @Directive("upper")
        withUpperAndAppend: string = "hello";

        @Field()
        @Directive("@append @upper")
        withUpperAndAppendSDL: string = "hello";

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
        queryWithUpperSDL(): string {
          return "queryWithUpper";
        }

        @Query()
        @Directive("append")
        queryWithAppend(): string {
          return "hello";
        }

        @Query()
        @Directive("@append")
        queryWithAppendSDL(): string {
          return "hello";
        }

        @Query()
        @Directive("append")
        @Directive("upper")
        queryWithUpperAndAppend(): string {
          return "hello";
        }

        @Query()
        @Directive("@append @upper")
        queryWithUpperAndAppendSDL(): string {
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

        assertValidFieldDirective(queryWithDirective.astNode, "foo");
      });

      it("should add directives to query types with arguments", async () => {
        const queryWithDirectiveWithArgs = schema.getQueryType()!.getFields()
          .queryWithDirectiveWithArgs;

        assertValidFieldDirective(queryWithDirectiveWithArgs.astNode, "bar", { baz: "true" });
      });

      it("calls directive 'upper'", async () => {
        const query = `query {
        queryWithUpper
      }`;

        const { data } = await graphql(schema, query);

        expect(data).toHaveProperty("queryWithUpper");
        expect(data.queryWithUpper).toBe("QUERYWITHUPPER");
      });

      it("calls directive 'upper' using SDL", async () => {
        const query = `query {
        queryWithUpperSDL
      }`;

        const { data } = await graphql(schema, query);

        expect(data).toHaveProperty("queryWithUpperSDL");
        expect(data.queryWithUpperSDL).toBe("QUERYWITHUPPER");
      });

      it("calls directive 'append'", async () => {
        const query = `query {
        queryWithAppend(append: ", world!")
      }`;

        const { data } = await graphql(schema, query);

        expect(data).toHaveProperty("queryWithAppend");
        expect(data.queryWithAppend).toBe("hello, world!");
      });

      it("calls directive 'append' using SDL", async () => {
        const query = `query {
        queryWithAppendSDL(append: ", world!")
      }`;

        const { data } = await graphql(schema, query);

        expect(data).toHaveProperty("queryWithAppendSDL");
        expect(data.queryWithAppendSDL).toBe("hello, world!");
      });

      it("calls directive 'upper' and 'append'", async () => {
        const query = `query {
        queryWithUpperAndAppend(append: ", world!")
      }`;

        const { data } = await graphql(schema, query);

        expect(data).toHaveProperty("queryWithUpperAndAppend");
        expect(data.queryWithUpperAndAppend).toBe("HELLO, WORLD!");
      });

      it("calls directive 'upper' and 'append' using SDL", async () => {
        const query = `query {
        queryWithUpperAndAppendSDL(append: ", world!")
      }`;

        const { data } = await graphql(schema, query);

        expect(data).toHaveProperty("queryWithUpperAndAppendSDL");
        expect(data.queryWithUpperAndAppendSDL).toBe("HELLO, WORLD!");
      });
    });

    describe("InputType", () => {
      it("adds field directive to input types", async () => {
        const inputType = schema.getType("DirectiveOnClassInput") as GraphQLInputObjectType;

        expect(inputType).toHaveProperty("astNode");
        assertValidFieldDirective(inputType.astNode, "upper");
      });

      it("adds field directives to input type fields", async () => {
        const fields = (schema.getType(
          "DirectiveOnFieldInput",
        ) as GraphQLInputObjectType).getFields();

        expect(fields).toHaveProperty("append");
        expect(fields.append).toHaveProperty("astNode");
        assertValidFieldDirective(fields.append.astNode, "upper");
      });
    });

    describe("ObjectType", () => {
      it("calls object type directives", async () => {
        const query = `query {
          objectType {
            withDirective
            withDirectiveWithArgs
            withUpper
            withUpperSDL
            withAppend(append: ", world!")
            withAppendSDL(append: ", world!")
            withUpperAndAppend(append: ", world!")
            withUpperAndAppendSDL(append: ", world!")
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
          withUpperSDL: "WITHUPPERSDL",
          withAppend: "hello, world!",
          withAppendSDL: "hello, world!",
          withUpperAndAppend: "HELLO, WORLD!",
          withUpperAndAppendSDL: "HELLO, WORLD!",
          withInput: "hello, WORLD!",
          withInputUpper: "HELLO, WORLD!",
          withInputOnClass: "hello, WORLD!",
          withInputUpperOnClass: "HELLO, WORLD!",
        });
      });
    });
  });

  describe("@cacheControl", () => {
    it("works with ApolloServer and @cacheControl", async () => {
      @ObjectType()
      @Directive("@cacheControl(maxAge: 240)")
      class Post {
        @Field()
        id: number = 1;

        @Field()
        @Directive("@cacheControl(maxAge: 30)")
        votes: number = 1;

        @Field(() => [Comment])
        comments: Comment[] = [new Comment()];

        @Field()
        @Directive("@cacheControl(scope: PRIVATE)")
        readByCurrentUser: boolean = true;
      }

      @ObjectType()
      @Directive("@cacheControl(maxAge: 1000)")
      class Comment {
        @Field()
        comment: string = "comment";
      }

      @Resolver()
      class PostsResolver {
        @Query(() => Post)
        @Directive("@cacheControl(maxAge: 10)")
        latestPost(): Post {
          return new Post();
        }
      }

      const server = new ApolloServer({
        schema: await buildSchema({ resolvers: [PostsResolver] }),
        cacheControl: true,
      });

      const { extensions } = await server.executeOperation({
        query: `query {
          latestPost {
            id
            votes
            comments { comment }
            readByCurrentUser
          }
        }`,
      });

      expect(extensions).toBeDefined();
      expect(extensions).toHaveProperty("cacheControl");
      expect(extensions!.cacheControl).toEqual({
        version: 1,
        hints: [
          {
            maxAge: 10,
            path: ["latestPost"],
          },
          {
            maxAge: 30,
            path: ["latestPost", "votes"],
          },
          {
            maxAge: 1000,
            path: ["latestPost", "comments"],
          },
          {
            path: ["latestPost", "readByCurrentUser"],
            scope: "PRIVATE",
          },
        ],
      });
    });
  });
});
