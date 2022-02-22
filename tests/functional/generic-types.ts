import "reflect-metadata";
import {
  IntrospectionObjectType,
  IntrospectionInterfaceType,
  IntrospectionNonNullTypeRef,
  IntrospectionScalarType,
  TypeKind,
  IntrospectionListTypeRef,
  graphql,
  GraphQLSchema,
  IntrospectionSchema,
  IntrospectionInputObjectType,
} from "graphql";

import { getSchemaInfo } from "../helpers/getSchemaInfo";
import { getMetadataStorage } from "../../src/metadata/getMetadataStorage";
import {
  ObjectType,
  Field,
  Resolver,
  Query,
  InterfaceType,
  ClassType,
  Int,
  InputType,
  Arg,
} from "../../src";

describe("Generic types", () => {
  beforeEach(() => {
    getMetadataStorage().clear();
  });

  it("shouldn't emit abstract object type", async () => {
    @ObjectType({ isAbstract: true })
    abstract class BaseType {
      @Field()
      baseField: string;
    }

    @ObjectType()
    class SampleType extends BaseType {
      @Field()
      sampleField: string;
    }

    @Resolver()
    class SampleResolver {
      @Query()
      sampleQuery(): SampleType {
        return {
          sampleField: "sampleField",
          baseField: "baseField",
        };
      }
    }

    const { schemaIntrospection } = await getSchemaInfo({ resolvers: [SampleResolver] });

    const sampleTypeInfo = schemaIntrospection.types.find(
      it => it.name === "SampleType",
    ) as IntrospectionObjectType;
    const baseTypeInfo = schemaIntrospection.types.find(it => it.name === "BaseType") as undefined;

    expect(sampleTypeInfo.fields).toHaveLength(2);
    expect(baseTypeInfo).toBeUndefined();
  });

  it("shouldn't emit abstract interface type", async () => {
    @InterfaceType({ isAbstract: true })
    abstract class BaseInterfaceType {
      @Field()
      baseField: string;
    }

    @InterfaceType()
    abstract class SampleInterfaceType extends BaseInterfaceType {
      @Field()
      sampleField: string;
    }

    @ObjectType({ implements: SampleInterfaceType })
    class SampleType implements SampleInterfaceType {
      @Field()
      baseField: string;
      @Field()
      sampleField: string;
    }

    @Resolver()
    class SampleResolver {
      @Query()
      sampleQuery(): SampleInterfaceType {
        const sample = new SampleType();
        sample.baseField = "baseField";
        sample.sampleField = "sampleField";
        return sample;
      }
    }

    const { schemaIntrospection } = await getSchemaInfo({ resolvers: [SampleResolver] });

    const sampleInterfaceTypeInfo = schemaIntrospection.types.find(
      it => it.name === "SampleInterfaceType",
    ) as IntrospectionInterfaceType;
    const baseInterfaceTypeInfo = schemaIntrospection.types.find(
      it => it.name === "BaseInterfaceType",
    ) as undefined;

    expect(sampleInterfaceTypeInfo.fields).toHaveLength(2);
    expect(baseInterfaceTypeInfo).toBeUndefined();
  });

  it("shouldn't emit abstract input object type", async () => {
    @InputType({ isAbstract: true })
    abstract class BaseInput {
      @Field()
      baseField: string;
    }

    @InputType()
    class SampleInput extends BaseInput {
      @Field()
      sampleField: string;
    }

    @Resolver()
    class SampleResolver {
      @Query()
      sampleQuery(@Arg("input") input: SampleInput): boolean {
        return true;
      }
    }

    const { schemaIntrospection } = await getSchemaInfo({ resolvers: [SampleResolver] });

    const sampleInputInfo = schemaIntrospection.types.find(
      it => it.name === "SampleInput",
    ) as IntrospectionInputObjectType;
    const baseInputInfo = schemaIntrospection.types.find(
      it => it.name === "BaseInput",
    ) as undefined;

    expect(sampleInputInfo.inputFields).toHaveLength(2);
    expect(baseInputInfo).toBeUndefined();
  });

  describe("multiple children of base generic class", () => {
    let schema: GraphQLSchema;
    let schemaIntrospection: IntrospectionSchema;
    let dogsResponseMock: any;

    beforeEach(async () => {
      function Connection<TItem>(TItemClass: ClassType<TItem>) {
        @ObjectType(`${TItemClass.name}Connection`, { isAbstract: true })
        class ConnectionClass {
          @Field(type => Int)
          count: number;

          @Field(type => [TItemClass])
          items: TItem[];
        }
        return ConnectionClass;
      }

      @ObjectType()
      class User {
        @Field()
        name: string;
      }

      @ObjectType()
      class Dog {
        @Field()
        canBark: boolean;
      }

      const UserConnection = Connection(User);
      type UserConnection = InstanceType<typeof UserConnection>;
      @ObjectType()
      class DogConnection extends Connection(Dog) {}

      dogsResponseMock = {
        count: 2,
        items: [{ canBark: false }, { canBark: true }],
      } as DogConnection;

      @Resolver()
      class GenericConnectionResolver {
        @Query(returns => UserConnection)
        users(): UserConnection {
          return {
            count: 2,
            items: [{ name: "Tony" }, { name: "Michael" }],
          };
        }

        @Query(returns => DogConnection)
        dogs(): DogConnection {
          return dogsResponseMock;
        }
      }

      ({ schema, schemaIntrospection } = await getSchemaInfo({
        resolvers: [GenericConnectionResolver],
      }));
    });

    it("should register proper types in schema using const and class syntax", async () => {
      const schemaObjectTypes = schemaIntrospection.types.filter(
        it => it.kind === TypeKind.OBJECT && !it.name.startsWith("__"),
      );
      const userConnectionTypeInfo = schemaObjectTypes.find(
        it => it.name === "UserConnection",
      ) as IntrospectionObjectType;
      const userConnectionCountField = userConnectionTypeInfo.fields.find(
        it => it.name === "count",
      )!;
      const userConnectionCountFieldType = (
        userConnectionCountField.type as IntrospectionNonNullTypeRef
      ).ofType as IntrospectionScalarType;
      const userConnectionItemsField = userConnectionTypeInfo.fields.find(
        it => it.name === "items",
      )!;
      const userConnectionItemsFieldType = (
        (
          (userConnectionItemsField.type as IntrospectionNonNullTypeRef)
            .ofType as IntrospectionListTypeRef
        ).ofType as IntrospectionNonNullTypeRef
      ).ofType as IntrospectionObjectType;

      expect(schemaObjectTypes).toHaveLength(5); // Query, User, Dog, UserCon, DogCon
      expect(userConnectionTypeInfo.fields).toHaveLength(2);
      expect(userConnectionCountFieldType.kind).toBe(TypeKind.SCALAR);
      expect(userConnectionCountFieldType.name).toBe("Int");
      expect(userConnectionItemsFieldType.kind).toBe(TypeKind.OBJECT);
      expect(userConnectionItemsFieldType.name).toBe("User");
    });

    it("should return child class data from query", async () => {
      const query = /* graphql */ `
        query {
          dogs {
            count
            items {
              canBark
            }
          }
        }
      `;

      const result: any = await graphql({ schema, source: query });

      expect(result.data!.dogs).toEqual(dogsResponseMock);
    });
  });

  describe("adding new properties in child class", () => {
    let schema: GraphQLSchema;
    let schemaIntrospection: IntrospectionSchema;
    let recipeEdgeResponse: any;
    let friendshipEdgeResponse: any;

    beforeEach(async () => {
      function Edge<TNodeClass>(NodeClass: ClassType<TNodeClass>) {
        @ObjectType({ isAbstract: true })
        abstract class EdgeClass {
          @Field(type => NodeClass)
          node: TNodeClass;

          @Field()
          cursor: string;
        }
        return EdgeClass;
      }

      @ObjectType()
      class Recipe {
        @Field()
        title: string;
      }

      @ObjectType()
      class User {
        @Field()
        name: string;
      }

      @ObjectType()
      class RecipeEdge extends Edge(Recipe) {
        @Field()
        personalNotes: string;
      }
      recipeEdgeResponse = {
        cursor: "recipeCursor",
        node: {
          title: "recipeTitle",
        },
        personalNotes: "recipePersonalNotes",
      } as RecipeEdge;

      @ObjectType()
      class FriendshipEdge extends Edge(User) {
        @Field()
        friendedAt: Date;
      }
      friendshipEdgeResponse = {
        cursor: "friendshipCursor",
        node: {
          name: "userName",
        },
        friendedAt: new Date(),
      } as FriendshipEdge;

      @Resolver()
      class EdgeResolver {
        @Query()
        recipeEdge(): RecipeEdge {
          return recipeEdgeResponse;
        }

        @Query()
        friendshipEdge(): FriendshipEdge {
          return friendshipEdgeResponse;
        }
      }

      ({ schema, schemaIntrospection } = await getSchemaInfo({
        resolvers: [EdgeResolver],
      }));
    });

    it("should register fields properly in schema", async () => {
      const schemaObjectTypes = schemaIntrospection.types.filter(
        it => it.kind === TypeKind.OBJECT && !it.name.startsWith("__"),
      );
      const recipeEdgeTypeInfo = schemaObjectTypes.find(
        it => it.name === "RecipeEdge",
      ) as IntrospectionObjectType;
      const recipeEdgeNodeField = recipeEdgeTypeInfo.fields.find(it => it.name === "node")!;
      const recipeEdgeNodeFieldType = (recipeEdgeNodeField.type as IntrospectionNonNullTypeRef)
        .ofType as IntrospectionObjectType;
      const recipeEdgePersonalNotesField = recipeEdgeTypeInfo.fields.find(
        it => it.name === "personalNotes",
      )!;
      const recipeEdgePersonalNotesFieldType = (
        recipeEdgePersonalNotesField.type as IntrospectionNonNullTypeRef
      ).ofType as IntrospectionObjectType;
      const friendshipEdgeTypeInfo = schemaObjectTypes.find(
        it => it.name === "FriendshipEdge",
      ) as IntrospectionObjectType;
      const friendshipEdgeNodeField = friendshipEdgeTypeInfo.fields.find(it => it.name === "node")!;
      const friendshipEdgeNodeFieldType = (
        friendshipEdgeNodeField.type as IntrospectionNonNullTypeRef
      ).ofType as IntrospectionObjectType;
      const friendshipEdgeFriendedAtField = friendshipEdgeTypeInfo.fields.find(
        it => it.name === "friendedAt",
      )!;
      const friendshipEdgeFriendedAtFieldType = (
        friendshipEdgeFriendedAtField.type as IntrospectionNonNullTypeRef
      ).ofType as IntrospectionObjectType;

      expect(schemaObjectTypes).toHaveLength(5); // Query, User, Dog, UserCon, DogCon
      expect(recipeEdgeTypeInfo.fields).toHaveLength(3);
      expect(recipeEdgeNodeFieldType.kind).toBe(TypeKind.OBJECT);
      expect(recipeEdgeNodeFieldType.name).toBe("Recipe");
      expect(recipeEdgePersonalNotesFieldType.kind).toBe(TypeKind.SCALAR);
      expect(recipeEdgePersonalNotesFieldType.name).toBe("String");
      expect(friendshipEdgeTypeInfo.fields).toHaveLength(3);
      expect(friendshipEdgeNodeFieldType.kind).toBe(TypeKind.OBJECT);
      expect(friendshipEdgeNodeFieldType.name).toBe("User");
      expect(friendshipEdgeFriendedAtFieldType.kind).toBe(TypeKind.SCALAR);
      expect(friendshipEdgeFriendedAtFieldType.name).toBe("DateTime");
    });

    it("should return child classes data from queries", async () => {
      const query = /* graphql */ `
        query {
          recipeEdge {
            cursor
            node {
              title
            }
            personalNotes
          }
          friendshipEdge {
            cursor
            node {
              name
            }
            friendedAt
          }
        }
      `;

      const result: any = await graphql({ schema, source: query });

      expect(result.data!.recipeEdge).toEqual(recipeEdgeResponse);
      expect(result.data!.friendshipEdge).toEqual({
        ...friendshipEdgeResponse,
        friendedAt: friendshipEdgeResponse.friendedAt.toISOString(),
      });
    });
  });

  describe("overwriting a property from base generic class in child class", () => {
    let schema: GraphQLSchema;
    let schemaIntrospection: IntrospectionSchema;

    beforeAll(async () => {
      function Base<TType>(TTypeClass: ClassType<TType>) {
        @ObjectType({ isAbstract: true })
        class BaseClass {
          @Field(type => TTypeClass)
          baseField: TType;
        }
        return BaseClass;
      }

      @ObjectType()
      class BaseSample {
        @Field()
        sampleField: string;
      }

      @ObjectType()
      class ChildSample {
        @Field()
        sampleField: string;
        @Field()
        childField: string;
      }

      @ObjectType()
      class Child extends Base(BaseSample) {
        @Field()
        baseField: ChildSample; // overwriting field with a up compatible type
      }

      @Resolver()
      class OverwriteResolver {
        @Query()
        child(): Child {
          return {
            baseField: {
              sampleField: "sampleField",
              childField: "childField",
            },
          };
        }
      }

      ({ schema, schemaIntrospection } = await getSchemaInfo({
        resolvers: [OverwriteResolver],
      }));
    });

    it("should register proper type with overwritten field from base generic class", async () => {
      const childTypeInfo = schemaIntrospection.types.find(
        it => it.name === "Child",
      ) as IntrospectionObjectType;
      const childTypeBaseField = childTypeInfo.fields.find(it => it.name === "baseField")!;
      const childTypeBaseFieldType = (childTypeBaseField.type as IntrospectionNonNullTypeRef)
        .ofType as IntrospectionObjectType;

      expect(childTypeBaseFieldType.kind).toEqual(TypeKind.OBJECT);
      expect(childTypeBaseFieldType.name).toEqual("ChildSample");
    });

    it("should return overwritten child class data from query", async () => {
      const document = /* graphql */ `
        query {
          child {
            baseField {
              sampleField
              childField
            }
          }
        }
      `;

      const result: any = await graphql({ schema, source: document });

      expect(result.data!).toEqual({
        child: {
          baseField: {
            sampleField: "sampleField",
            childField: "childField",
          },
        },
      });
    });
  });
});
