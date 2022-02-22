import "reflect-metadata";
import {
  IntrospectionSchema,
  IntrospectionObjectType,
  IntrospectionNonNullTypeRef,
  IntrospectionNamedTypeRef,
  TypeKind,
  IntrospectionListTypeRef,
} from "graphql";

import { Field, ObjectType, Resolver, Query } from "../../src";
import { getMetadataStorage } from "../../src/metadata/getMetadataStorage";
import { getSchemaInfo } from "../helpers/getSchemaInfo";

describe("buildSchema -> nullableByDefault", () => {
  let SampleObjectClass: any;
  let SampleResolverClass: any;

  beforeEach(async () => {
    getMetadataStorage().clear();

    @ObjectType()
    class SampleObject {
      @Field()
      normalField: string;

      @Field(type => [String])
      normalArrayField: string[];

      @Field({ nullable: true })
      nullableField: string;

      @Field({ nullable: false })
      nonNullableField: string;
    }
    SampleObjectClass = SampleObject;

    @Resolver(of => SampleObject)
    class SampleResolver {
      @Query()
      normalQuery(): string {
        return "normalQuery";
      }

      @Query(returns => [String])
      normalArrayQuery(): string[] {
        return ["normalArrayQuery"];
      }

      @Query(type => String, { nullable: true })
      nullableQuery() {
        return null;
      }

      @Query({ nullable: false })
      nonNullableQuery(): string {
        return "nonNullableQuery";
      }
    }
    SampleResolverClass = SampleResolver;
  });

  describe("default behavior", () => {
    let schemaIntrospection: IntrospectionSchema;
    let queryType: IntrospectionObjectType;
    let sampleObjectType: IntrospectionObjectType;

    beforeEach(async () => {
      ({ schemaIntrospection, queryType } = await getSchemaInfo({
        resolvers: [SampleResolverClass],
        orphanedTypes: [SampleObjectClass],
      }));
      sampleObjectType = schemaIntrospection.types.find(
        type => type.name === "SampleObject",
      ) as IntrospectionObjectType;
    });

    it("should emit non nullable fields by default", async () => {
      const normalField = sampleObjectType.fields.find(it => it.name === "normalField");
      const normalFieldType = normalField!.type as IntrospectionNonNullTypeRef;
      const normalFieldInnerType = normalFieldType.ofType as IntrospectionNamedTypeRef;
      expect(normalFieldType.kind).toBe(TypeKind.NON_NULL);
      expect(normalFieldInnerType.name).toBe("String");

      const normalArrayField = sampleObjectType.fields.find(it => it.name === "normalArrayField");
      const normalArrayFieldType = normalArrayField!.type as IntrospectionNonNullTypeRef;
      const normalArrayFieldListType = normalArrayFieldType.ofType as IntrospectionListTypeRef;
      const normalArrayFieldListElementType =
        normalArrayFieldListType.ofType as IntrospectionNonNullTypeRef;
      const normalArrayFieldListElementInnerType =
        normalArrayFieldListElementType.ofType as IntrospectionNamedTypeRef;
      expect(normalArrayFieldType.kind).toBe(TypeKind.NON_NULL);
      expect(normalArrayFieldListType.kind).toBe(TypeKind.LIST);
      expect(normalArrayFieldListElementType.kind).toBe(TypeKind.NON_NULL);
      expect(normalArrayFieldListElementInnerType.kind).toBe(TypeKind.SCALAR);
      expect(normalArrayFieldListElementInnerType.name).toBe("String");
    });

    it("should emit non nullable queries by default", async () => {
      const normalQuery = queryType.fields.find(it => it.name === "normalQuery");
      const normalQueryType = normalQuery!.type as IntrospectionNonNullTypeRef;
      const normalQueryInnerType = normalQueryType.ofType as IntrospectionNamedTypeRef;
      expect(normalQueryType.kind).toBe(TypeKind.NON_NULL);
      expect(normalQueryInnerType.name).toBe("String");

      const normalArrayQuery = queryType.fields.find(it => it.name === "normalArrayQuery");
      const normalArrayQueryType = normalArrayQuery!.type as IntrospectionNonNullTypeRef;
      const normalArrayQueryListType = normalArrayQueryType.ofType as IntrospectionListTypeRef;
      const normalArrayQueryListElementType =
        normalArrayQueryListType.ofType as IntrospectionNonNullTypeRef;
      const normalArrayQueryListElementInnerType =
        normalArrayQueryListElementType.ofType as IntrospectionNamedTypeRef;
      expect(normalArrayQueryType.kind).toBe(TypeKind.NON_NULL);
      expect(normalArrayQueryListType.kind).toBe(TypeKind.LIST);
      expect(normalArrayQueryListElementType.kind).toBe(TypeKind.NON_NULL);
      expect(normalArrayQueryListElementInnerType.kind).toBe(TypeKind.SCALAR);
      expect(normalArrayQueryListElementInnerType.name).toBe("String");
    });
  });

  describe("nullableByDefault = true", () => {
    let schemaIntrospection: IntrospectionSchema;
    let queryType: IntrospectionObjectType;
    let sampleObjectType: IntrospectionObjectType;

    beforeEach(async () => {
      ({ schemaIntrospection, queryType } = await getSchemaInfo({
        resolvers: [SampleResolverClass],
        orphanedTypes: [SampleObjectClass],
        nullableByDefault: true,
      }));
      sampleObjectType = schemaIntrospection.types.find(
        type => type.name === "SampleObject",
      ) as IntrospectionObjectType;
    });

    it("should emit nullable fields by default", async () => {
      const normalField = sampleObjectType.fields.find(it => it.name === "normalField")!;
      const normalFieldType = normalField.type as IntrospectionNamedTypeRef;
      expect(normalFieldType.name).toBe("String");

      const normalArrayField = sampleObjectType.fields.find(it => it.name === "normalArrayField");
      const normalArrayFieldType = normalArrayField!.type as IntrospectionListTypeRef;
      const normalArrayFieldListElementInnerType =
        normalArrayFieldType.ofType as IntrospectionNamedTypeRef;
      expect(normalArrayFieldType.kind).toBe(TypeKind.LIST);
      expect(normalArrayFieldListElementInnerType.kind).toBe(TypeKind.SCALAR);
      expect(normalArrayFieldListElementInnerType.name).toBe("String");
    });

    it("should emit nullable queries by default", async () => {
      const normalQuery = queryType.fields.find(it => it.name === "normalQuery")!;
      const normalQueryType = normalQuery.type as IntrospectionNamedTypeRef;
      expect(normalQueryType.name).toBe("String");

      const normalArrayQuery = queryType.fields.find(it => it.name === "normalArrayQuery");
      const normalArrayQueryType = normalArrayQuery!.type as IntrospectionListTypeRef;
      const normalArrayQueryListElementInnerType =
        normalArrayQueryType.ofType as IntrospectionNamedTypeRef;
      expect(normalArrayQueryType.kind).toBe(TypeKind.LIST);
      expect(normalArrayQueryListElementInnerType.kind).toBe(TypeKind.SCALAR);
      expect(normalArrayQueryListElementInnerType.name).toBe("String");
    });

    it("shouldn't affect explicit nullability options from decorators", async () => {
      const nullableField = sampleObjectType.fields.find(it => it.name === "nullableField")!;
      const nullableFieldType = nullableField.type as IntrospectionNamedTypeRef;
      expect(nullableFieldType.name).toBe("String");

      const nonNullableField = sampleObjectType.fields.find(it => it.name === "nonNullableField")!;
      const nonNullableFieldType = nonNullableField.type as IntrospectionNonNullTypeRef;
      const nonNullableFieldInnerType = nonNullableFieldType.ofType as IntrospectionNamedTypeRef;
      expect(nonNullableFieldType.kind).toBe(TypeKind.NON_NULL);
      expect(nonNullableFieldInnerType.name).toBe("String");

      const nullableQuery = queryType.fields.find(it => it.name === "nullableQuery")!;
      const nullableQueryType = nullableQuery.type as IntrospectionNamedTypeRef;
      expect(nullableQueryType.name).toBe("String");

      const nonNullableQuery = queryType.fields.find(it => it.name === "nonNullableQuery")!;
      const nonNullableQueryType = nonNullableQuery.type as IntrospectionNonNullTypeRef;
      const nonNullableQueryInnerType = nonNullableQueryType.ofType as IntrospectionNamedTypeRef;
      expect(nonNullableQueryType.kind).toBe(TypeKind.NON_NULL);
      expect(nonNullableQueryInnerType.name).toBe("String");
    });
  });
});
