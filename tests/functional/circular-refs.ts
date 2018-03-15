import "reflect-metadata";
import { IntrospectionObjectType } from "graphql";

import { Query, ObjectType, Field } from "../../src";
import { MetadataStorage } from "../../src/metadata/metadata-storage";
import { getSchemaInfo } from "../helpers/getSchemaInfo";

describe("Circular references", () => {
  it("should resolve circular type dependencies when type functions are used", async () => {
    MetadataStorage.clear();

    const { CircularRef1 } = require("../helpers/circular-refs/good/CircularRef1");
    const { CircularRef2 } = require("../helpers/circular-refs/good/CircularRef2");

    @ObjectType()
    class SampleObject {
      @Field(type => CircularRef1)
      ref1: any;
      @Field(type => CircularRef2)
      ref2: any;
    }
    class Resolver {
      @Query()
      objectQuery(): SampleObject {
        return {} as any;
      }
    }

    const { schemaIntrospection: { types } } = await getSchemaInfo({ resolvers: [Resolver] });
    const circularRef1 = types.find(
      type => type.name === "CircularRef1",
    ) as IntrospectionObjectType;
    const circularRef2 = types.find(
      type => type.name === "CircularRef2",
    ) as IntrospectionObjectType;

    expect(circularRef1).toBeDefined();
    expect(circularRef1.kind).toEqual("OBJECT");
    expect(circularRef2).toBeDefined();
    expect(circularRef2.kind).toEqual("OBJECT");
  });

  // tslint:disable-next-line:max-line-length
  it("should throw error when not providing type function for circular type references", async () => {
    expect.assertions(6);
    MetadataStorage.clear();

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
});
