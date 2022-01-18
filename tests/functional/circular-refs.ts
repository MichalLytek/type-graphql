import "reflect-metadata";
import { IntrospectionObjectType, TypeKind, GraphQLObjectType, graphql } from "graphql";

import { Query, ObjectType, Field, Resolver, buildSchema } from "../../src";
import { getMetadataStorage } from "../../src/metadata/getMetadataStorage";
import { getSchemaInfo } from "../helpers/getSchemaInfo";

describe("Circular references", () => {
  it("should resolve circular type dependencies when type functions are used", async () => {
    getMetadataStorage().clear();

    const { CircularRef1 } = require("../helpers/circular-refs/good/CircularRef1");
    const { CircularRef2 } = require("../helpers/circular-refs/good/CircularRef2");

    @ObjectType()
    class SampleObject {
      @Field(type => CircularRef1)
      ref1: any;
      @Field(type => CircularRef2)
      ref2: any;
    }
    @Resolver()
    class SampleResolver {
      @Query()
      objectQuery(): SampleObject {
        return {} as any;
      }
    }

    const {
      schemaIntrospection: { types },
    } = await getSchemaInfo({ resolvers: [SampleResolver] });
    const circularRef1 = types.find(
      type => type.name === "CircularRef1",
    ) as IntrospectionObjectType;
    const circularRef2 = types.find(
      type => type.name === "CircularRef2",
    ) as IntrospectionObjectType;

    expect(circularRef1).toBeDefined();
    expect(circularRef1.kind).toEqual(TypeKind.OBJECT);
    expect(circularRef2).toBeDefined();
    expect(circularRef2.kind).toEqual(TypeKind.OBJECT);
  });

  it("should throw error when not providing type function for circular type references", async () => {
    expect.assertions(6);
    getMetadataStorage().clear();

    try {
      require("../helpers/circular-refs/wrong/CircularRef1").CircularRef1;
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      const error: Error = err;
      expect(error.message).toContain("provide explicit type");
      expect(error.message).toContain("ref1Field");
      jest.resetModules();
    }

    try {
      require("../helpers/circular-refs/wrong/CircularRef2").CircularRef2;
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      const error: Error = err;
      expect(error.message).toContain("provide explicit type");
      expect(error.message).toContain("ref2Field");
      jest.resetModules();
    }
  });

  it("should allow to have self-reference fields in object type", async () => {
    @ObjectType()
    class SampleObject {
      @Field()
      stringField: string;

      @Field(type => SampleObject, { nullable: true })
      selfReferenceField?: SampleObject;

      @Field(type => [SampleObject])
      selfReferenceArrayField: SampleObject[];
    }
    @Resolver()
    class SampleResolver {
      @Query()
      objectQuery(): SampleObject {
        const obj: SampleObject = {
          stringField: "nestedStringField",
          selfReferenceArrayField: [],
        };
        obj.selfReferenceField = obj;
        return {
          stringField: "stringField",
          selfReferenceArrayField: [obj],
          selfReferenceField: obj,
        };
      }
    }

    const schema = await buildSchema({
      resolvers: [SampleResolver],
    });
    expect(schema).toBeDefined();

    const query = /* graphql */ `
      query {
        objectQuery {
          stringField
          selfReferenceField {
            stringField
          }
          selfReferenceArrayField {
            selfReferenceField {
              stringField
            }
          }
        }
      }
    `;
    const { data } = await graphql({ schema, source: query });

    expect(data!.objectQuery).toEqual({
      stringField: "stringField",
      selfReferenceField: {
        stringField: "nestedStringField",
      },
      selfReferenceArrayField: [
        {
          selfReferenceField: {
            stringField: "nestedStringField",
          },
        },
      ],
    });
  });
});
