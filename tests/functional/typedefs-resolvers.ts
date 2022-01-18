import "reflect-metadata";
import {
  IntrospectionSchema,
  graphql,
  getIntrospectionQuery,
  IntrospectionQuery,
  IntrospectionInterfaceType,
  TypeKind,
  IntrospectionObjectType,
  IntrospectionInputObjectType,
  IntrospectionNamedTypeRef,
  IntrospectionEnumType,
  IntrospectionUnionType,
  IntrospectionScalarType,
  execute,
  GraphQLSchema,
  subscribe,
  ExecutionResult,
} from "graphql";
import { makeExecutableSchema } from "graphql-tools";
import { PubSub } from "graphql-subscriptions";
import { MinLength } from "class-validator";
import Container, { Service } from "typedi";
import gql from "graphql-tag";

import { getMetadataStorage } from "../../src/metadata/getMetadataStorage";
import {
  Resolver,
  Query,
  buildTypeDefsAndResolvers,
  buildTypeDefsAndResolversSync,
  InterfaceType,
  ObjectType,
  Field,
  registerEnumType,
  Subscription,
  PubSubEngine,
  Arg,
  createUnionType,
  Mutation,
  Root,
  InputType,
  Authorized,
  UseMiddleware,
  ResolversMap,
  ResolverObject,
  ResolverOptions,
} from "../../src";

describe("typeDefs and resolvers", () => {
  describe("buildTypeDefsAndResolvers", () => {
    const timestamp = 1547398942902;
    let typeDefs: string;
    let resolvers: ResolversMap;
    let schemaIntrospection: IntrospectionSchema;
    let schema: GraphQLSchema;
    let pubSub: PubSubEngine;
    let inputValue: any;
    let enumValue: any;
    let middlewareLogs: string[];

    beforeEach(async () => {
      middlewareLogs = [];
      enumValue = undefined;
    });

    beforeAll(async () => {
      getMetadataStorage().clear();

      @Service()
      class SampleService {
        getSampleString() {
          return "SampleString";
        }
      }

      @InterfaceType()
      abstract class SampleInterface {
        @Field()
        sampleInterfaceStringField: string;
      }

      @ObjectType({ implements: SampleInterface })
      class SampleType1 implements SampleInterface {
        @Field()
        sampleInterfaceStringField: string;
        @Field({ description: "sampleType1StringFieldDescription" })
        sampleType1StringField: string;
      }

      @ObjectType({ implements: SampleInterface })
      class SampleType2 implements SampleInterface {
        @Field()
        sampleInterfaceStringField: string;
        @Field({ deprecationReason: "sampleType2StringFieldDeprecation" })
        sampleType2StringField: string;
      }

      @ObjectType()
      class SampleType3 {
        @Field()
        sampleInterfaceStringField: string;
        @Field()
        sampleType3StringField: string;
      }

      @InputType()
      class SampleInput {
        @Field()
        @MinLength(10)
        sampleInputStringField: string;
        @Field()
        sampleInputDefaultStringField: string = "sampleInputDefaultStringField";
      }

      enum SampleNumberEnum {
        OptionOne,
        OptionTwo,
      }
      registerEnumType(SampleNumberEnum, { name: "SampleNumberEnum" });

      enum SampleStringEnum {
        OptionOne = "OptionOneString",
        OptionTwo = "OptionTwoString",
      }
      registerEnumType(SampleStringEnum, { name: "SampleStringEnum" });

      const SampleUnion = createUnionType({
        types: () => [SampleType2, SampleType3],
        name: "SampleUnion",
        description: "SampleUnion description",
      });

      const SampleResolveUnion = createUnionType({
        types: () => [SampleType2, SampleType3],
        name: "SampleResolveUnion",
        resolveType: value => {
          if ("sampleType2StringField" in value) {
            return "SampleType2";
          }
          if ("sampleType3StringField" in value) {
            return "SampleType3";
          }
          return;
        },
      });

      @Service()
      @Resolver()
      class SampleResolver {
        constructor(private readonly sampleService: SampleService) {}

        @Query({ description: "sampleDateQueryDescription" })
        sampleDateQuery(): Date {
          return new Date(timestamp);
        }

        @Query()
        sampleServiceQuery(): string {
          return this.sampleService.getSampleString();
        }

        @Query()
        @UseMiddleware(async (_, next) => {
          middlewareLogs.push("sampleMiddlewareBooleanQuery");
          return next();
        })
        sampleMiddlewareBooleanQuery(): boolean {
          return true;
        }

        @Mutation()
        sampleBooleanMutation(): boolean {
          return true;
        }

        @Mutation()
        sampleMutationWithInput(@Arg("input") input: SampleInput): boolean {
          inputValue = input;
          return true;
        }

        @Mutation()
        @Authorized()
        sampleAuthorizedMutation(): boolean {
          return true;
        }

        @Query()
        sampleInterfaceQuery(): SampleInterface {
          const type1 = new SampleType1();
          type1.sampleInterfaceStringField = "sampleInterfaceStringField";
          type1.sampleType1StringField = "sampleType1StringField";

          return type1;
        }

        @Query(returns => SampleUnion)
        sampleUnionQuery(): typeof SampleUnion {
          const type3 = new SampleType3();
          type3.sampleInterfaceStringField = "sampleInterfaceStringField";
          type3.sampleType3StringField = "sampleType3StringField";

          return type3;
        }

        @Query(returns => SampleResolveUnion)
        sampleResolveUnionQuery(): typeof SampleResolveUnion {
          return {
            sampleInterfaceStringField: "sampleInterfaceStringField",
            sampleType3StringField: "sampleType3StringField",
          };
        }

        @Query(returns => SampleNumberEnum)
        sampleNumberEnumQuery(
          @Arg("numberEnum", type => SampleNumberEnum) numberEnum: SampleNumberEnum,
        ): SampleNumberEnum {
          enumValue = numberEnum;
          return numberEnum;
        }

        @Query(returns => SampleStringEnum)
        sampleStringEnumQuery(
          @Arg("stringEnum", type => SampleStringEnum) stringEnum: SampleStringEnum,
        ): SampleStringEnum {
          enumValue = stringEnum;
          return stringEnum;
        }

        @Subscription({
          topics: "SAMPLE",
        })
        sampleSubscription(@Root() payload: number): number {
          return payload;
        }
      }

      pubSub = new PubSub();
      ({ typeDefs, resolvers } = await buildTypeDefsAndResolvers({
        resolvers: [SampleResolver],
        authChecker: () => false,
        pubSub,
        container: Container,
        orphanedTypes: [SampleType1],
      }));
      schema = makeExecutableSchema({
        typeDefs,
        resolvers,
      });
      const introspectionResult = await graphql({ schema, source: getIntrospectionQuery() });
      schemaIntrospection = (introspectionResult.data as unknown as IntrospectionQuery).__schema;
    });

    it("should generate schema without errors", () => {
      expect(schemaIntrospection).toBeDefined();
    });

    describe("typeDefs", () => {
      it("should generate typeDefs correctly", async () => {
        expect(typeDefs).toBeDefined();
      });

      it("should generate interface type", async () => {
        const sampleInterface = schemaIntrospection.types.find(
          it => it.name === "SampleInterface",
        ) as IntrospectionInterfaceType;

        expect(sampleInterface.kind).toBe(TypeKind.INTERFACE);
        expect(sampleInterface.fields).toHaveLength(1);
        expect(sampleInterface.fields[0].name).toBe("sampleInterfaceStringField");
        expect(sampleInterface.possibleTypes).toHaveLength(2);
        expect(sampleInterface.possibleTypes.map(it => it.name)).toContain("SampleType1");
        expect(sampleInterface.possibleTypes.map(it => it.name)).toContain("SampleType2");
      });

      it("should generate object types", async () => {
        const sampleType1 = schemaIntrospection.types.find(
          it => it.name === "SampleType1",
        ) as IntrospectionObjectType;
        const sampleType2 = schemaIntrospection.types.find(
          it => it.name === "SampleType2",
        ) as IntrospectionObjectType;
        const sampleType1StringField = sampleType1.fields.find(
          it => it.name === "sampleType1StringField",
        )!;
        const sampleType2StringField = sampleType2.fields.find(
          it => it.name === "sampleType2StringField",
        )!;

        expect(sampleType1.kind).toBe(TypeKind.OBJECT);
        expect(sampleType1.fields).toHaveLength(2);
        expect(sampleType1StringField.description).toEqual("sampleType1StringFieldDescription");
        expect(sampleType1.interfaces).toHaveLength(1);
        expect(sampleType1.interfaces[0].name).toBe("SampleInterface");
        expect(sampleType2StringField.deprecationReason).toBe("sampleType2StringFieldDeprecation");
      });

      it("should generate input type", async () => {
        const sampleInput = schemaIntrospection.types.find(
          it => it.name === "SampleInput",
        ) as IntrospectionInputObjectType;
        const sampleInputDefaultStringField = sampleInput.inputFields.find(
          it => it.name === "sampleInputDefaultStringField",
        )!;
        const sampleInputDefaultStringFieldType =
          sampleInputDefaultStringField.type as IntrospectionNamedTypeRef;

        expect(sampleInput.kind).toBe(TypeKind.INPUT_OBJECT);
        expect(sampleInput.inputFields).toHaveLength(2);
        expect(sampleInputDefaultStringFieldType).toEqual({
          kind: "NON_NULL",
          name: null,
          ofType: {
            kind: "SCALAR",
            name: "String",
            ofType: null,
          },
        });
        expect(sampleInputDefaultStringField.defaultValue).toBe('"sampleInputDefaultStringField"');
      });

      it("should generate enum types", async () => {
        const sampleNumberEnum = schemaIntrospection.types.find(
          it => it.name === "SampleNumberEnum",
        ) as IntrospectionEnumType;
        const sampleStringEnum = schemaIntrospection.types.find(
          it => it.name === "SampleStringEnum",
        ) as IntrospectionEnumType;

        expect(sampleNumberEnum.kind).toBe(TypeKind.ENUM);
        expect(sampleNumberEnum).toBeDefined();
        expect(sampleNumberEnum.enumValues).toHaveLength(2);
        expect(sampleStringEnum.enumValues).toHaveLength(2);
      });

      it("should generate union type", async () => {
        const sampleUnion = schemaIntrospection.types.find(
          it => it.name === "SampleUnion",
        ) as IntrospectionUnionType;

        expect(sampleUnion.kind).toBe(TypeKind.UNION);
        expect(sampleUnion.description).toBe("SampleUnion description");
        expect(sampleUnion.possibleTypes).toHaveLength(2);
        expect(sampleUnion.possibleTypes.map(it => it.name)).toContain("SampleType2");
        expect(sampleUnion.possibleTypes.map(it => it.name)).toContain("SampleType3");
      });

      it("should generate queries", async () => {
        const queryType = schemaIntrospection.types.find(
          it => it.name === schemaIntrospection.queryType.name,
        ) as IntrospectionObjectType;

        expect(queryType.fields).toHaveLength(8);
      });

      it("should generate mutations", async () => {
        const mutationType = schemaIntrospection.types.find(
          it => it.name === schemaIntrospection.mutationType!.name,
        ) as IntrospectionObjectType;

        expect(mutationType.fields).toHaveLength(3);
      });

      it("should generate subscription", async () => {
        const subscriptionType = schemaIntrospection.types.find(
          it => it.name === schemaIntrospection.subscriptionType!.name,
        ) as IntrospectionObjectType;

        expect(subscriptionType.fields).toHaveLength(1);
      });

      it("should emit Date scalar", async () => {
        const dateScalar = schemaIntrospection.types.find(
          it => it.name === "DateTime",
        ) as IntrospectionScalarType;

        expect(dateScalar.kind).toBe(TypeKind.SCALAR);
      });
    });

    describe("resolvers", () => {
      it("should generate resolversMap without errors", async () => {
        expect(resolvers).toBeDefined();
      });

      it("should not emit `__isTypeOf` for root objects", async () => {
        expect(resolvers.Query).not.toHaveProperty("__isTypeOf");
        expect(resolvers.Mutation).not.toHaveProperty("__isTypeOf");
        expect(resolvers.Subscription).not.toHaveProperty("__isTypeOf");
      });

      it("should properly serialize Date scalar", async () => {
        const document = gql`
          query {
            sampleDateQuery
          }
        `;

        const result: any = await execute({ schema, document });
        const parsedDate = new Date(result.data.sampleDateQuery);

        expect(typeof result.data.sampleDateQuery).toBe("string");
        expect(parsedDate.getTime()).toEqual(timestamp);
      });

      it("should use container to resolve dependency", async () => {
        const document = gql`
          query {
            sampleServiceQuery
          }
        `;

        const { data } = await execute({ schema, document });

        expect(data!.sampleServiceQuery).toEqual("SampleString");
      });

      it("should run resolver method middleware", async () => {
        const document = gql`
          query {
            sampleMiddlewareBooleanQuery
          }
        `;

        const { data } = await execute({ schema, document });

        expect(data!.sampleMiddlewareBooleanQuery).toEqual(true);
        expect(middlewareLogs).toHaveLength(1);
        expect(middlewareLogs[0]).toEqual("sampleMiddlewareBooleanQuery");
      });

      it("should allow for simple boolean mutation", async () => {
        const document = gql`
          mutation {
            sampleBooleanMutation
          }
        `;

        const { data } = await execute({ schema, document });

        expect(data!.sampleBooleanMutation).toBe(true);
      });

      it("should properly transform input argument", async () => {
        const document = gql`
          mutation {
            sampleMutationWithInput(input: { sampleInputStringField: "sampleInputStringField" })
          }
        `;

        const { data } = await execute({ schema, document });

        expect(data!.sampleMutationWithInput).toBe(true);
        expect(inputValue.constructor.name).toBe("SampleInput");
        expect(inputValue.sampleInputStringField).toBe("sampleInputStringField");
        expect(inputValue.sampleInputDefaultStringField).toBe("sampleInputDefaultStringField");
      });

      it("should validate the input", async () => {
        const document = gql`
          mutation {
            sampleMutationWithInput(input: { sampleInputStringField: "short" })
          }
        `;

        const { errors } = await execute({ schema, document });

        expect(errors).toHaveLength(1);
        expect(errors![0].message).toContain("Argument Validation Error");
      });

      it("should properly guard authorized resolver method", async () => {
        const document = gql`
          mutation {
            sampleAuthorizedMutation
          }
        `;

        const { errors } = await execute({ schema, document });

        expect(errors).toHaveLength(1);
        expect(errors![0].message).toContain("Access denied");
      });

      it("should detect returned object type from interface", async () => {
        const document = gql`
          query {
            sampleInterfaceQuery {
              sampleInterfaceStringField
              ... on SampleType1 {
                sampleType1StringField
              }
            }
          }
        `;

        const { data } = await execute({ schema, document });

        expect(data!.sampleInterfaceQuery).toEqual({
          sampleInterfaceStringField: "sampleInterfaceStringField",
          sampleType1StringField: "sampleType1StringField",
        });
      });

      it("should detect returned object type from union", async () => {
        const document = gql`
          query {
            sampleUnionQuery {
              ... on SampleType3 {
                sampleInterfaceStringField
                sampleType3StringField
              }
            }
          }
        `;

        const { data } = await execute({ schema, document });

        expect(data!.sampleUnionQuery).toEqual({
          sampleInterfaceStringField: "sampleInterfaceStringField",
          sampleType3StringField: "sampleType3StringField",
        });
      });

      it("should detect returned object type using resolveType from union", async () => {
        const document = gql`
          query {
            sampleResolveUnionQuery {
              ... on SampleType3 {
                sampleInterfaceStringField
                sampleType3StringField
              }
            }
          }
        `;

        const { data } = await execute({ schema, document });

        expect(data!.sampleResolveUnionQuery).toEqual({
          sampleInterfaceStringField: "sampleInterfaceStringField",
          sampleType3StringField: "sampleType3StringField",
        });
      });

      it("should properly transform number enum argument", async () => {
        const document = gql`
          query {
            sampleNumberEnumQuery(numberEnum: OptionOne)
          }
        `;

        const { data } = await execute({ schema, document });

        expect(data!.sampleNumberEnumQuery).toBe("OptionOne");
        expect(enumValue).toBe(0);
      });

      it("should properly transform string enum argument", async () => {
        const document = gql`
          query {
            sampleStringEnumQuery(stringEnum: OptionTwo)
          }
        `;

        const { data } = await execute({ schema, document });

        expect(data!.sampleStringEnumQuery).toBe("OptionTwo");
        expect(enumValue).toBe("OptionTwoString");
      });

      it("should properly run subscriptions", async () => {
        const document = gql`
          subscription {
            sampleSubscription
          }
        `;
        const payload = 5.4321;

        const iterator = (await subscribe({ schema, document })) as AsyncIterator<ExecutionResult>;
        const firstValuePromise = iterator.next();
        pubSub.publish("SAMPLE", payload);
        const data = await firstValuePromise;

        expect(data.value.data!.sampleSubscription).toBe(payload);
      });

      it("should generate simple resolvers function for queries and mutations", async () => {
        expect((resolvers.Query as ResolverObject<any, any>).sampleDateQuery).toBeInstanceOf(
          Function,
        );
        expect(
          (resolvers.Mutation as ResolverObject<any, any>).sampleBooleanMutation,
        ).toBeInstanceOf(Function);
      });

      it("should generate resolvers object for subscriptions", async () => {
        const sampleSubscription = (resolvers.Subscription as ResolverObject<any, any>)
          .sampleSubscription as ResolverOptions<any, any>;

        expect(sampleSubscription.resolve).toBeInstanceOf(Function);
        expect(sampleSubscription.subscribe).toBeInstanceOf(Function);
      });
    });
  });

  describe("buildTypeDefsAndResolversSync", () => {
    let typeDefs: string;
    let resolvers: ResolversMap;
    let schemaIntrospection: IntrospectionSchema;
    let schema: GraphQLSchema;

    beforeAll(async () => {
      getMetadataStorage().clear();

      @ObjectType()
      class SampleType {
        @Field()
        sampleInterfaceStringField: string;
        @Field({ description: "sampleTypeStringFieldDescription" })
        sampleTypeStringField: string;
      }

      @Resolver()
      class SampleResolver {
        @Query()
        sampleBooleanQuery(): boolean {
          return true;
        }
      }

      ({ typeDefs, resolvers } = buildTypeDefsAndResolversSync({
        resolvers: [SampleResolver],
        authChecker: () => false,
        orphanedTypes: [SampleType],
      }));
      schema = makeExecutableSchema({
        typeDefs,
        resolvers,
      });
      const introspectionResult = await graphql({ schema, source: getIntrospectionQuery() });
      schemaIntrospection = (introspectionResult.data as unknown as IntrospectionQuery).__schema;
    });

    it("should generate schema without errors", () => {
      expect(schemaIntrospection).toBeDefined();
    });

    describe("typeDefs", () => {
      it("should generate typeDefs correctly", async () => {
        expect(typeDefs).toBeDefined();
      });

      it("should generate object types", async () => {
        const sampleType = schemaIntrospection.types.find(
          it => it.name === "SampleType",
        ) as IntrospectionObjectType;
        const sampleTypeStringField = sampleType.fields.find(
          it => it.name === "sampleTypeStringField",
        )!;

        expect(sampleType.kind).toBe(TypeKind.OBJECT);
        expect(sampleType.fields).toHaveLength(2);
        expect(sampleTypeStringField.description).toEqual("sampleTypeStringFieldDescription");
        expect(sampleType.interfaces).toHaveLength(0);
      });
    });

    describe("resolvers", () => {
      it("should generate resolversMap without errors", async () => {
        expect(resolvers).toBeDefined();
      });

      it("should allow for simple boolean query", async () => {
        const document = gql`
          query {
            sampleBooleanQuery
          }
        `;

        const { data, errors } = await execute({ schema, document });

        expect(errors).toBeUndefined();
        expect(data!.sampleBooleanQuery).toBe(true);
      });
    });
  });
});
