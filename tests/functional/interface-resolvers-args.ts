import "reflect-metadata";
import {
  IntrospectionSchema,
  IntrospectionInterfaceType,
  GraphQLSchema,
  graphql,
  IntrospectionNonNullTypeRef,
  IntrospectionNamedTypeRef,
} from "graphql";

import { getSchemaInfo } from "../helpers/getSchemaInfo";
import {
  Arg,
  Args,
  ArgsType,
  Field,
  Int,
  InterfaceType,
  ObjectType,
  Query,
  Resolver,
  buildSchema,
  FieldResolver,
} from "../../src";
import { getMetadataStorage } from "../../src/metadata/getMetadataStorage";

describe("Interfaces with resolvers and arguments", () => {
  describe("Schema", () => {
    let schemaIntrospection: IntrospectionSchema;

    beforeAll(async () => {
      getMetadataStorage().clear();

      @ArgsType()
      class SampleArgs1 {
        @Field(_type => Int)
        classArg1: number;
        @Field(_type => Int)
        classArg2: number;
      }

      @InterfaceType()
      abstract class SampleInterfaceWithArgsFields {
        @Field()
        interfaceFieldInlineArgs(
          @Arg("inlineArg1", _type => Int) _inlineArg1: number,
          @Arg("inlineArg2", _type => Int) _inlineArg2: number,
        ): string {
          throw new Error("Method not implemented!");
        }

        @Field()
        interfaceFieldArgsType(@Args() _args: SampleArgs1): string {
          throw new Error("Method not implemented!");
        }
      }
      @InterfaceType()
      abstract class SampleInterfaceWithArgs {
        @Field()
        sampleFieldWithArgs(@Arg("sampleArg") _sampleArg: string): string {
          throw new Error("Method not implemented!");
        }
      }
      @InterfaceType()
      abstract class SampleInterfaceWithArgsAndInlineResolver {
        @Field()
        sampleFieldWithArgs(@Arg("sampleArg") sampleArg: string): string {
          return `SampleInterfaceWithArgsAndInlineResolver: ${sampleArg}`;
        }
      }
      @InterfaceType()
      abstract class SampleInterfaceWithArgsAndFieldResolver {}

      @ObjectType({ implements: SampleInterfaceWithArgs })
      class SampleImplementingObjectWithArgsAndOwnResolver implements SampleInterfaceWithArgs {
        sampleFieldWithArgs(sampleArg: string) {
          return `SampleImplementingObjectWithArgsAndOwnResolver: ${sampleArg}`;
        }
      }
      @ObjectType({ implements: SampleInterfaceWithArgsAndInlineResolver })
      class SampleImplementingObjectWithArgsAndInheritedResolver extends SampleInterfaceWithArgsAndInlineResolver {}
      @ObjectType({ implements: SampleInterfaceWithArgsAndFieldResolver })
      class SampleImplementingObjectWithArgsAndInheritedFieldResolver extends SampleInterfaceWithArgsAndFieldResolver {}

      @Resolver()
      class SampleResolver {
        @Query()
        sampleQuery(): string {
          return "sampleQuery";
        }
      }
      @Resolver(_of => SampleInterfaceWithArgsAndFieldResolver)
      class SampleInterfaceWithArgsResolver {
        @FieldResolver()
        sampleFieldWithArgs(@Arg("sampleArg") sampleArg: string): string {
          return `SampleInterfaceWithArgsAndFieldResolver: ${sampleArg}`;
        }
      }

      const schemaInfo = await getSchemaInfo({
        resolvers: [SampleResolver, SampleInterfaceWithArgsResolver],
        orphanedTypes: [
          SampleInterfaceWithArgsFields,
          SampleInterfaceWithArgs,
          SampleInterfaceWithArgsAndInlineResolver,
          SampleInterfaceWithArgsAndFieldResolver,
          SampleImplementingObjectWithArgsAndOwnResolver,
          SampleImplementingObjectWithArgsAndInheritedResolver,
          SampleImplementingObjectWithArgsAndInheritedFieldResolver,
        ],
      });
      schemaIntrospection = schemaInfo.schemaIntrospection;
    });

    it("should generate schema without errors", async () => {
      expect(schemaIntrospection).toBeDefined();
    });

    it("should generate interface types fields with args correctly", async () => {
      const sampleInterfaceWithArgs = schemaIntrospection.types.find(
        type => type.name === "SampleInterfaceWithArgs",
      ) as IntrospectionInterfaceType;
      const sampleInterfaceWithArgsAndInlineResolver = schemaIntrospection.types.find(
        type => type.name === "SampleInterfaceWithArgsAndInlineResolver",
      ) as IntrospectionInterfaceType;
      const sampleInterfaceWithArgsAndFieldResolver = schemaIntrospection.types.find(
        type => type.name === "SampleInterfaceWithArgsAndFieldResolver",
      ) as IntrospectionInterfaceType;
      expect(sampleInterfaceWithArgs).toBeDefined();
      expect(sampleInterfaceWithArgsAndInlineResolver).toBeDefined();
      expect(sampleInterfaceWithArgsAndFieldResolver).toBeDefined();

      [
        sampleInterfaceWithArgs,
        sampleInterfaceWithArgsAndInlineResolver,
        sampleInterfaceWithArgsAndFieldResolver,
      ].forEach(type => {
        const sampleFieldWithArgsField = type.fields.find(it => it.name === "sampleFieldWithArgs")!;
        const sampleFieldWithArgsType = (
          sampleFieldWithArgsField.type as IntrospectionNonNullTypeRef
        ).ofType as IntrospectionNamedTypeRef;

        expect(sampleFieldWithArgsField.args).toHaveLength(1);
        expect(sampleFieldWithArgsType.name).toEqual("String");
      });
    });

    it("should generate interface types fields with args both for inline and args class", async () => {
      const sampleInterfaceWithArgsFields = schemaIntrospection.types.find(
        type => type.name === "SampleInterfaceWithArgsFields",
      ) as IntrospectionInterfaceType;
      expect(sampleInterfaceWithArgsFields).toBeDefined();

      const interfaceFieldInlineArgsField = sampleInterfaceWithArgsFields.fields.find(
        it => it.name === "interfaceFieldInlineArgs",
      )!;
      const interfaceFieldArgsTypeField = sampleInterfaceWithArgsFields.fields.find(
        it => it.name === "interfaceFieldArgsType",
      )!;
      const interfaceFieldInlineArgsType = (
        interfaceFieldInlineArgsField.type as IntrospectionNonNullTypeRef
      ).ofType as IntrospectionNamedTypeRef;
      const interfaceFieldArgsTypeFieldType = (
        interfaceFieldArgsTypeField.type as IntrospectionNonNullTypeRef
      ).ofType as IntrospectionNamedTypeRef;

      expect(interfaceFieldInlineArgsField.args).toHaveLength(2);
      expect(interfaceFieldArgsTypeField.args).toHaveLength(2);
      expect(interfaceFieldInlineArgsType.name).toEqual("String");
      expect(interfaceFieldArgsTypeFieldType.name).toEqual("String");
    });

    it("should generate object types inherited interface fields with args correctly", async () => {
      const sampleImplementingObjectWithArgsAndOwnResolver = schemaIntrospection.types.find(
        type => type.name === "SampleImplementingObjectWithArgsAndOwnResolver",
      ) as IntrospectionInterfaceType;
      const sampleImplementingObjectWithArgsAndInheritedResolver = schemaIntrospection.types.find(
        type => type.name === "SampleImplementingObjectWithArgsAndInheritedResolver",
      ) as IntrospectionInterfaceType;
      const sampleImplementingObjectWithArgsAndInheritedFieldResolver =
        schemaIntrospection.types.find(
          type => type.name === "SampleImplementingObjectWithArgsAndInheritedFieldResolver",
        ) as IntrospectionInterfaceType;
      expect(sampleImplementingObjectWithArgsAndOwnResolver).toBeDefined();
      expect(sampleImplementingObjectWithArgsAndInheritedResolver).toBeDefined();
      expect(sampleImplementingObjectWithArgsAndInheritedFieldResolver).toBeDefined();

      [
        sampleImplementingObjectWithArgsAndOwnResolver,
        sampleImplementingObjectWithArgsAndInheritedResolver,
        sampleImplementingObjectWithArgsAndInheritedFieldResolver,
      ].forEach(type => {
        const sampleFieldWithArgsField = type.fields.find(it => it.name === "sampleFieldWithArgs")!;
        const sampleFieldWithArgsType = (
          sampleFieldWithArgsField.type as IntrospectionNonNullTypeRef
        ).ofType as IntrospectionNamedTypeRef;

        expect(sampleFieldWithArgsField.args).toHaveLength(1);
        expect(sampleFieldWithArgsType.name).toEqual("String");
      });
    });
  });

  describe("Functional", () => {
    let schema: GraphQLSchema;

    beforeAll(async () => {
      getMetadataStorage().clear();

      @InterfaceType()
      abstract class SampleInterfaceWithArgs {
        @Field()
        sampleFieldWithArgs(@Arg("sampleArg") _sampleArg: string): string {
          throw new Error("Method not implemented!");
        }
      }
      @InterfaceType()
      abstract class SampleInterfaceWithArgsAndInlineResolver {
        @Field()
        sampleFieldWithArgs(@Arg("sampleArg") sampleArg: string): string {
          return `SampleInterfaceWithArgsAndInlineResolver: ${sampleArg}`;
        }
      }
      @InterfaceType({ implements: SampleInterfaceWithArgsAndInlineResolver })
      abstract class SampleInterfaceImplementingInterfaceWithArgsAndInlineResolver extends SampleInterfaceWithArgsAndInlineResolver {}
      @InterfaceType()
      abstract class SampleInterfaceWithArgsAndFieldResolver {}

      @ObjectType({ implements: SampleInterfaceWithArgs })
      class SampleImplementingObjectWithArgsAndOwnResolver extends SampleInterfaceWithArgs {
        sampleFieldWithArgs(sampleArg: string) {
          return `SampleImplementingObjectWithArgsAndOwnResolver: ${sampleArg}`;
        }
      }
      @ObjectType({ implements: SampleInterfaceWithArgsAndInlineResolver })
      class SampleImplementingObjectWithArgsAndInheritedResolver extends SampleInterfaceWithArgsAndInlineResolver {}
      @ObjectType({
        implements: [
          SampleInterfaceImplementingInterfaceWithArgsAndInlineResolver,
          SampleInterfaceWithArgsAndInlineResolver,
        ],
      })
      class SampleObjectImplementingInterfaceImplementingWithArgsAndInheritedResolver
        extends SampleInterfaceImplementingInterfaceWithArgsAndInlineResolver
        implements SampleInterfaceWithArgsAndInlineResolver {}
      @ObjectType({ implements: SampleInterfaceWithArgsAndFieldResolver })
      class SampleImplementingObjectWithArgsAndInheritedFieldResolver extends SampleInterfaceWithArgsAndFieldResolver {}

      @Resolver(_of => SampleInterfaceWithArgsAndFieldResolver)
      class SampleInterfaceResolver {
        @FieldResolver()
        sampleFieldWithArgs(@Arg("sampleArg") sampleArg: string): string {
          return `SampleInterfaceResolver: ${sampleArg}`;
        }
      }
      @Resolver()
      class TestResolver {
        @Query()
        queryForSampleInterfaceWithArgs(): SampleInterfaceWithArgs {
          return new SampleImplementingObjectWithArgsAndOwnResolver();
        }
        @Query()
        queryForSampleInterfaceWithArgsAndInlineResolver(): SampleInterfaceWithArgsAndInlineResolver {
          return new SampleImplementingObjectWithArgsAndInheritedResolver();
        }
        @Query()
        queryForSampleInterfaceWithArgsAndFieldResolver(): SampleInterfaceWithArgsAndFieldResolver {
          return new SampleImplementingObjectWithArgsAndInheritedFieldResolver();
        }
        @Query()
        queryForSampleImplementingObjectWithArgsAndOwnResolver(): SampleImplementingObjectWithArgsAndOwnResolver {
          return new SampleImplementingObjectWithArgsAndOwnResolver();
        }
        @Query()
        queryForSampleImplementingObjectWithArgsAndInheritedResolver(): SampleImplementingObjectWithArgsAndInheritedResolver {
          return new SampleImplementingObjectWithArgsAndInheritedResolver();
        }
        @Query()
        queryForSampleImplementingObjectWithArgsAndInheritedFieldResolver(): SampleImplementingObjectWithArgsAndInheritedFieldResolver {
          return new SampleImplementingObjectWithArgsAndInheritedFieldResolver();
        }
        @Query()
        queryForSampleInterfaceImplementingInterfaceWithArgsAndInlineResolver(): SampleInterfaceImplementingInterfaceWithArgsAndInlineResolver {
          return new SampleObjectImplementingInterfaceImplementingWithArgsAndInheritedResolver();
        }
      }

      schema = await buildSchema({
        resolvers: [SampleInterfaceResolver, TestResolver],
        orphanedTypes: [
          SampleInterfaceWithArgs,
          SampleInterfaceWithArgsAndInlineResolver,
          SampleInterfaceWithArgsAndFieldResolver,
          SampleInterfaceImplementingInterfaceWithArgsAndInlineResolver,
          SampleImplementingObjectWithArgsAndOwnResolver,
          SampleImplementingObjectWithArgsAndInheritedResolver,
          SampleImplementingObjectWithArgsAndInheritedFieldResolver,
          SampleObjectImplementingInterfaceImplementingWithArgsAndInheritedResolver,
        ],
        validate: false,
      });
    });

    it("should build the schema without errors", () => {
      expect(schema).toBeDefined();
    });

    it("should invoke object type field resolver for interface returned query if override the interface type one", async () => {
      const query = /* graphql */ `
        query {
          queryForSampleInterfaceWithArgs {
            sampleFieldWithArgs(sampleArg: "sampleArgValue")
          }
        }
      `;

      const { data, errors } = await graphql({ schema, source: query });

      expect(errors).toBeUndefined();
      const result = (data as any).queryForSampleInterfaceWithArgs.sampleFieldWithArgs;
      expect(result).toBeDefined();
      expect(result).toEqual("SampleImplementingObjectWithArgsAndOwnResolver: sampleArgValue");
    });

    it("should invoke interface type inline field resolver for interface returned query", async () => {
      const query = /* graphql */ `
        query {
          queryForSampleInterfaceWithArgsAndInlineResolver {
            sampleFieldWithArgs(sampleArg: "sampleArgValue")
          }
        }
      `;

      const { data, errors } = await graphql({ schema, source: query });

      expect(errors).toBeUndefined();
      const result = (data as any).queryForSampleInterfaceWithArgsAndInlineResolver
        .sampleFieldWithArgs;
      expect(result).toBeDefined();
      expect(result).toEqual("SampleInterfaceWithArgsAndInlineResolver: sampleArgValue");
    });

    it("should invoke interface type resolvers field resolver for interface returned query", async () => {
      const query = /* graphql */ `
        query {
          queryForSampleInterfaceWithArgsAndFieldResolver {
            sampleFieldWithArgs(sampleArg: "sampleArgValue")
          }
        }
      `;

      const { data, errors } = await graphql({ schema, source: query });

      expect(errors).toBeUndefined();
      const result = (data as any).queryForSampleInterfaceWithArgsAndFieldResolver
        .sampleFieldWithArgs;
      expect(result).toBeDefined();
      expect(result).toEqual("SampleInterfaceResolver: sampleArgValue");
    });

    it("should invoke object type field resolver if override the interface type one", async () => {
      const query = /* graphql */ `
        query {
          queryForSampleImplementingObjectWithArgsAndOwnResolver {
            sampleFieldWithArgs(sampleArg: "sampleArgValue")
          }
        }
      `;

      const { data, errors } = await graphql({ schema, source: query });

      expect(errors).toBeUndefined();
      const result = (data as any).queryForSampleImplementingObjectWithArgsAndOwnResolver
        .sampleFieldWithArgs;
      expect(result).toBeDefined();
      expect(result).toEqual("SampleImplementingObjectWithArgsAndOwnResolver: sampleArgValue");
    });

    it("should invoke interface type inline field resolver for implementing object type", async () => {
      const query = /* graphql */ `
        query {
          queryForSampleImplementingObjectWithArgsAndInheritedResolver {
            sampleFieldWithArgs(sampleArg: "sampleArgValue")
          }
        }
      `;

      const { data, errors } = await graphql({ schema, source: query });

      expect(errors).toBeUndefined();
      const result = (data as any).queryForSampleImplementingObjectWithArgsAndInheritedResolver
        .sampleFieldWithArgs;
      expect(result).toBeDefined();
      expect(result).toEqual("SampleInterfaceWithArgsAndInlineResolver: sampleArgValue");
    });

    it("should invoke interface type resolvers field resolver for implementing object type", async () => {
      const query = /* graphql */ `
        query {
          queryForSampleImplementingObjectWithArgsAndInheritedFieldResolver {
            sampleFieldWithArgs(sampleArg: "sampleArgValue")
          }
        }
      `;

      const { data, errors } = await graphql({ schema, source: query });

      expect(errors).toBeUndefined();
      const result = (data as any).queryForSampleImplementingObjectWithArgsAndInheritedFieldResolver
        .sampleFieldWithArgs;
      expect(result).toBeDefined();
      expect(result).toEqual("SampleInterfaceResolver: sampleArgValue");
    });

    it("should invoke interface type resolvers field resolver from implemented interface for implementing object type", async () => {
      const query = /* graphql */ `
        query {
          queryForSampleInterfaceImplementingInterfaceWithArgsAndInlineResolver {
            sampleFieldWithArgs(sampleArg: "sampleArgValue")
          }
        }
      `;

      const { data, errors } = await graphql({ schema, source: query });

      expect(errors).toBeUndefined();
      const result = (data as any)
        .queryForSampleInterfaceImplementingInterfaceWithArgsAndInlineResolver.sampleFieldWithArgs;
      expect(result).toBeDefined();
      expect(result).toEqual("SampleInterfaceWithArgsAndInlineResolver: sampleArgValue");
    });
  });
});
