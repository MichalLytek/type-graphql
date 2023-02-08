import "reflect-metadata";
import { IntrospectionObjectType } from "graphql";
import { Args, ArgsType, Field, ObjectType, Query, Resolver } from "../../src";
import { getSchemaInfo } from "../helpers/getSchemaInfo";

describe("manual decorators", () => {
  it("should not fail when field is dynamically registered", async () => {
    @ObjectType()
    class SampleObject {
      @Field()
      manualField: string;
    }

    // dynamically register field
    Field(() => String)(SampleObject.prototype, "dynamicField");
    @ArgsType()
    class SampleArgs {
      @Field()
      sampleField: string;
    }
    // dynamically register field args
    Args(() => SampleArgs)(SampleObject.prototype, "dynamicField", 0);

    @Resolver()
    class SampleResolver {
      @Query()
      sampleQuery(): SampleObject {
        return new SampleObject();
      }
    }

    // get builded schema info from retrospection
    const schemaInfo = await getSchemaInfo({
      resolvers: [SampleResolver],
    });
    const sampleObjectType = schemaInfo.schemaIntrospection.types.find(
      type => type.name === "SampleObject",
    ) as IntrospectionObjectType;
    const dynamicField = sampleObjectType.fields.find(it => it.name === "dynamicField")!;

    expect(sampleObjectType.fields).toHaveLength(2);
    expect(dynamicField.type).toEqual({
      kind: "NON_NULL",
      name: null,
      ofType: {
        kind: "SCALAR",
        name: "String",
        ofType: null,
      },
    });
    expect(dynamicField.args).toEqual([
      {
        defaultValue: null,
        deprecationReason: null,
        description: null,
        isDeprecated: false,
        name: "sampleField",
        type: {
          kind: "NON_NULL",
          name: null,
          ofType: {
            kind: "SCALAR",
            name: "String",
            ofType: null,
          },
        },
      },
    ]);
  });
});
