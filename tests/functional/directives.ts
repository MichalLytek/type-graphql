import "reflect-metadata";
import {
  type GraphQLInputObjectType,
  type GraphQLInterfaceType,
  type GraphQLObjectType,
  type GraphQLSchema,
  OperationTypeNode,
} from "graphql";
import {
  Arg,
  Args,
  ArgsType,
  Directive,
  Field,
  InputType,
  InterfaceType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Subscription,
  buildSchema,
} from "type-graphql";
import { InvalidDirectiveError } from "@/errors/InvalidDirectiveError";
import { getMetadataStorage } from "@/metadata/getMetadataStorage";
import { assertValidDirective } from "../helpers/directives/assertValidDirective";
import { testDirective, testDirectiveTransformer } from "../helpers/directives/TestDirective";
import { expectToThrow } from "../helpers/expectToThrow";

describe("Directives", () => {
  describe("Schema", () => {
    beforeEach(async () => {
      getMetadataStorage().clear();
    });

    describe("on ObjectType", () => {
      let schema: GraphQLSchema;
      beforeAll(async () => {
        @Directive("@test")
        @ObjectType()
        class SampleObject {
          @Field()
          sampleField!: string;
        }
        @Resolver()
        class SampleResolver {
          @Query()
          sampleQuery(): SampleObject {
            return { sampleField: "sampleField" };
          }
        }

        schema = await buildSchema({
          resolvers: [SampleResolver],
          directives: [testDirective],
          validate: false,
        });
        schema = testDirectiveTransformer(schema);
      });

      it("should properly emit directive in AST", () => {
        const sampleObjectTypeInfo = schema.getType("SampleObject") as GraphQLObjectType;

        expect(() => {
          assertValidDirective(sampleObjectTypeInfo.astNode, "test");
        }).not.toThrow();
      });

      it("should properly apply directive mapper", async () => {
        const sampleObjectTypeInfo = schema.getType("SampleObject") as GraphQLObjectType;

        expect(sampleObjectTypeInfo.extensions).toMatchObject({
          TypeGraphQL: { isMappedByDirective: true },
        });
      });
    });

    describe("on ObjectType field", () => {
      let schema: GraphQLSchema;
      beforeAll(async () => {
        @ObjectType()
        class SampleObject {
          @Field()
          @Directive("@test")
          sampleField!: string;
        }
        @Resolver()
        class SampleResolver {
          @Query()
          sampleQuery(): SampleObject {
            return { sampleField: "sampleField" };
          }
        }

        schema = await buildSchema({
          resolvers: [SampleResolver],
          directives: [testDirective],
          validate: false,
        });
        schema = testDirectiveTransformer(schema);
      });

      it("should properly emit directive in AST", () => {
        const sampleFieldTypeInfo = (
          schema.getType("SampleObject") as GraphQLObjectType
        ).getFields().sampleField;

        expect(() => {
          assertValidDirective(sampleFieldTypeInfo.astNode, "test");
        }).not.toThrow();
      });

      it("should properly apply directive mapper", async () => {
        const sampleFieldTypeInfo = (
          schema.getType("SampleObject") as GraphQLObjectType
        ).getFields().sampleField;

        expect(sampleFieldTypeInfo.extensions).toMatchObject({
          TypeGraphQL: { isMappedByDirective: true },
        });
      });
    });

    describe("on InterfaceType", () => {
      let schema: GraphQLSchema;
      beforeAll(async () => {
        @Directive("@test")
        @InterfaceType()
        class SampleInterface {
          @Field()
          sampleField!: string;
        }
        @ObjectType({ implements: [SampleInterface] })
        class SampleObject extends SampleInterface {}
        @Resolver()
        class SampleResolver {
          @Query()
          sampleQuery(): SampleInterface {
            const sampleObject = new SampleObject();
            sampleObject.sampleField = "sampleField";
            return sampleObject;
          }
        }

        schema = await buildSchema({
          resolvers: [SampleResolver],
          orphanedTypes: [SampleObject],
          directives: [testDirective],
          validate: false,
        });
        schema = testDirectiveTransformer(schema);
      });

      it("should properly emit directive in AST", () => {
        const sampleInterfaceTypeInfo = schema.getType("SampleInterface") as GraphQLInterfaceType;

        expect(() => {
          assertValidDirective(sampleInterfaceTypeInfo.astNode, "test");
        }).not.toThrow();
      });

      it("should properly apply directive mapper", async () => {
        const sampleInterfaceTypeInfo = schema.getType("SampleInterface") as GraphQLInterfaceType;

        expect(sampleInterfaceTypeInfo.extensions).toMatchObject({
          TypeGraphQL: { isMappedByDirective: true },
        });
      });
    });

    describe("on InterfaceType field", () => {
      let schema: GraphQLSchema;
      beforeAll(async () => {
        @InterfaceType()
        class SampleInterface {
          @Directive("@test")
          @Field()
          sampleField!: string;
        }
        @ObjectType({ implements: [SampleInterface] })
        class SampleObject extends SampleInterface {}
        @Resolver()
        class SampleResolver {
          @Query()
          sampleQuery(): SampleInterface {
            const sampleObject = new SampleObject();
            sampleObject.sampleField = "sampleField";
            return sampleObject;
          }
        }

        schema = await buildSchema({
          resolvers: [SampleResolver],
          orphanedTypes: [SampleObject],
          directives: [testDirective],
          validate: false,
        });
        schema = testDirectiveTransformer(schema);
      });

      it("should properly emit directive in AST", () => {
        const sampleFieldTypeInfo = (
          schema.getType("SampleInterface") as GraphQLInterfaceType
        ).getFields().sampleField;

        expect(() => {
          assertValidDirective(sampleFieldTypeInfo.astNode, "test");
        }).not.toThrow();
      });

      it("should properly apply directive mapper", async () => {
        const sampleFieldTypeInfo = (
          schema.getType("SampleInterface") as GraphQLInterfaceType
        ).getFields().sampleField;

        expect(sampleFieldTypeInfo.extensions).toMatchObject({
          TypeGraphQL: { isMappedByDirective: true },
        });
      });
    });

    describe("on InputType", () => {
      let schema: GraphQLSchema;
      beforeAll(async () => {
        @Directive("@test")
        @InputType()
        class SampleInput {
          @Field()
          sampleField!: string;
        }
        @Resolver()
        class SampleResolver {
          @Query()
          sampleQuery(@Arg("input") _input: SampleInput): boolean {
            return true;
          }
        }

        schema = await buildSchema({
          resolvers: [SampleResolver],
          directives: [testDirective],
          validate: false,
        });
        schema = testDirectiveTransformer(schema);
      });

      it("should properly emit directive in AST", () => {
        const sampleInputTypeInfo = schema.getType("SampleInput") as GraphQLInputObjectType;

        expect(() => {
          assertValidDirective(sampleInputTypeInfo.astNode, "test");
        }).not.toThrow();
      });

      it("should properly apply directive mapper", async () => {
        const sampleInputTypeInfo = schema.getType("SampleInput") as GraphQLInputObjectType;

        expect(sampleInputTypeInfo.extensions).toMatchObject({
          TypeGraphQL: { isMappedByDirective: true },
        });
      });
    });

    describe("on InputType field", () => {
      let schema: GraphQLSchema;
      beforeAll(async () => {
        @InputType()
        class SampleInput {
          @Field()
          @Directive("@test")
          sampleField!: string;
        }
        @Resolver()
        class SampleResolver {
          @Query()
          sampleQuery(@Arg("input") _input: SampleInput): boolean {
            return true;
          }
        }

        schema = await buildSchema({
          resolvers: [SampleResolver],
          directives: [testDirective],
          validate: false,
        });
        schema = testDirectiveTransformer(schema);
      });

      it("should properly emit directive in AST", () => {
        const sampleFieldTypeInfo = (
          schema.getType("SampleInput") as GraphQLInputObjectType
        ).getFields().sampleField;

        expect(() => {
          assertValidDirective(sampleFieldTypeInfo.astNode, "test");
        }).not.toThrow();
      });

      it("should properly apply directive mapper", async () => {
        const sampleFieldTypeInfo = (
          schema.getType("SampleInput") as GraphQLInputObjectType
        ).getFields().sampleField;

        expect(sampleFieldTypeInfo.extensions).toMatchObject({
          TypeGraphQL: { isMappedByDirective: true },
        });
      });
    });

    describe("on Query", () => {
      let schema: GraphQLSchema;
      beforeAll(async () => {
        @Resolver()
        class SampleResolver {
          @Directive("@test")
          @Query()
          sampleQuery(): boolean {
            return true;
          }
        }

        schema = await buildSchema({
          resolvers: [SampleResolver],
          directives: [testDirective],
          validate: false,
        });
        schema = testDirectiveTransformer(schema);
      });

      it("should properly emit directive in AST", () => {
        const sampleQueryInfo = schema
          .getRootType(OperationTypeNode.QUERY)!
          .getFields().sampleQuery;

        expect(() => {
          assertValidDirective(sampleQueryInfo.astNode, "test");
        }).not.toThrow();
      });

      it("should properly apply directive mapper", async () => {
        const sampleQueryInfo = schema
          .getRootType(OperationTypeNode.QUERY)!
          .getFields().sampleQuery;

        expect(sampleQueryInfo.extensions).toMatchObject({
          TypeGraphQL: { isMappedByDirective: true },
        });
      });
    });

    describe("on Mutation", () => {
      let schema: GraphQLSchema;
      beforeAll(async () => {
        @Resolver()
        class SampleResolver {
          @Query()
          sampleQuery(): boolean {
            return true;
          }

          @Directive("@test")
          @Mutation()
          sampleMutation(): boolean {
            return true;
          }
        }

        schema = await buildSchema({
          resolvers: [SampleResolver],
          directives: [testDirective],
          validate: false,
        });
        schema = testDirectiveTransformer(schema);
      });

      it("should properly emit directive in AST", () => {
        const sampleMutationInfo = schema
          .getRootType(OperationTypeNode.MUTATION)!
          .getFields().sampleMutation;

        expect(() => {
          assertValidDirective(sampleMutationInfo.astNode, "test");
        }).not.toThrow();
      });

      it("should properly apply directive mapper", async () => {
        const sampleMutationInfo = schema
          .getRootType(OperationTypeNode.MUTATION)!
          .getFields().sampleMutation;

        expect(sampleMutationInfo.extensions).toMatchObject({
          TypeGraphQL: { isMappedByDirective: true },
        });
      });
    });

    describe("on Subscription", () => {
      let schema: GraphQLSchema;
      beforeAll(async () => {
        @Resolver()
        class SampleResolver {
          @Query()
          sampleQuery(): boolean {
            return true;
          }

          @Directive("@test")
          @Subscription({ topics: "sample" })
          sampleSubscription(): boolean {
            return true;
          }
        }

        schema = await buildSchema({
          resolvers: [SampleResolver],
          directives: [testDirective],
          validate: false,
        });
        schema = testDirectiveTransformer(schema);
      });

      it("should properly emit directive in AST", () => {
        const sampleSubscriptionInfo = schema
          .getRootType(OperationTypeNode.SUBSCRIPTION)!
          .getFields().sampleSubscription;

        expect(() => {
          assertValidDirective(sampleSubscriptionInfo.astNode, "test");
        }).not.toThrow();
      });

      it("should properly apply directive mapper", async () => {
        const sampleSubscriptionInfo = schema
          .getRootType(OperationTypeNode.SUBSCRIPTION)!
          .getFields().sampleSubscription;

        expect(sampleSubscriptionInfo.extensions).toMatchObject({
          TypeGraphQL: { isMappedByDirective: true },
        });
      });
    });

    describe("on ArgsType field", () => {
      let schema: GraphQLSchema;
      beforeAll(async () => {
        @ArgsType()
        class SampleArgs {
          @Field()
          @Directive("@test")
          sampleField!: string;
        }
        @Resolver()
        class SampleResolver {
          @Query()
          sampleQuery(@Args(() => SampleArgs) _args: SampleArgs): boolean {
            return true;
          }
        }

        schema = await buildSchema({
          resolvers: [SampleResolver],
          directives: [testDirective],
          validate: false,
        });

        schema = testDirectiveTransformer(schema);
      });

      it("should properly emit directive in AST", () => {
        const sampleQueryInfo = schema
          .getRootType(OperationTypeNode.QUERY)!
          .getFields().sampleQuery;

        const sampleFieldTypeInfo = sampleQueryInfo.args[0];

        expect(() => {
          assertValidDirective(sampleFieldTypeInfo.astNode, "test");
        }).not.toThrow();
      });

      it("should properly apply directive mapper", async () => {
        const sampleQueryInfo = schema
          .getRootType(OperationTypeNode.QUERY)!
          .getFields().sampleQuery;

        const sampleFieldTypeInfo = sampleQueryInfo.args[0];

        expect(sampleFieldTypeInfo.extensions).toMatchObject({
          TypeGraphQL: { isMappedByDirective: true },
        });
      });
    });
  });

  describe("errors", () => {
    beforeEach(async () => {
      getMetadataStorage().clear();
    });

    it("throws error on multiple directive definitions", async () => {
      @Resolver()
      class InvalidQuery {
        @Query()
        @Directive("@upper @append")
        invalid(): string {
          return "invalid";
        }
      }

      const error = await expectToThrow(() => buildSchema({ resolvers: [InvalidQuery] }));

      expect(error).toBeInstanceOf(InvalidDirectiveError);
      expect(error.message).toContain(
        'Please pass only one directive name or definition at a time to the @Directive decorator "@upper @append"',
      );
    });

    it("throws error when parsing invalid directives", async () => {
      @Resolver()
      class InvalidQuery {
        @Query()
        @Directive("@invalid(@directive)")
        invalid(): string {
          return "invalid";
        }
      }

      const error = await expectToThrow(() => buildSchema({ resolvers: [InvalidQuery] }));

      expect(error).toBeInstanceOf(InvalidDirectiveError);
      expect(error.message).toContain('Error parsing directive definition "@invalid(@directive)"');
    });

    it("throws error when no directives are defined", async () => {
      @Resolver()
      class InvalidQuery {
        @Query()
        @Directive("")
        invalid(): string {
          return "invalid";
        }
      }

      const error = await expectToThrow(() => buildSchema({ resolvers: [InvalidQuery] }));

      expect(error).toBeInstanceOf(InvalidDirectiveError);
      expect(error.message).toContain(
        "Please pass at-least one directive name or definition to the @Directive decorator",
      );
    });
  });
});
