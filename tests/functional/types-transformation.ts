import "reflect-metadata";
import { IntrospectionInputObjectType, IntrospectionObjectType, TypeKind } from "graphql";
import {
  Arg,
  Args,
  ArgsType,
  ClassType,
  Field,
  getMetadataStorage,
  InputType,
  InterfaceType,
  ObjectType,
  OmitType,
  PartialType,
  PickType,
  Query,
  RequiredType,
  Resolver,
} from "../../src";
import { getSchemaInfo } from "../helpers/getSchemaInfo";
import { IntersectionType } from "../../src/utils/types-transformation";

describe("Types transformation utils", () => {
  beforeEach(() => {
    getMetadataStorage().clear();
  });

  it("PartialType should set all fields to nullable", async () => {
    @ObjectType()
    class BaseObject {
      @Field({ nullable: true })
      baseFieldA: string;

      @Field({ nullable: false })
      baseFieldB: string;

      @Field()
      baseFieldC: string;
    }

    @ObjectType()
    class SampleObject extends PartialType(BaseObject) {}

    const sampleObjectType = await getSampleObjectType(SampleObject);

    const baseFieldA = sampleObjectType.fields.find(field => field.name === "baseFieldA")!;
    expect(baseFieldA.type.kind).toEqual(TypeKind.SCALAR);
    const baseFieldB = sampleObjectType.fields.find(field => field.name === "baseFieldB")!;
    expect(baseFieldB.type.kind).toEqual(TypeKind.SCALAR);
    const baseFieldC = sampleObjectType.fields.find(field => field.name === "baseFieldC")!;
    expect(baseFieldC.type.kind).toEqual(TypeKind.SCALAR);
  });

  it("RequiredType should set all fields to NON_NULL", async () => {
    @ObjectType()
    class BaseObject {
      @Field({ nullable: true })
      baseFieldA: string;

      @Field({ nullable: false })
      baseFieldB: string;

      @Field()
      baseFieldC: string;
    }

    @ObjectType()
    class SampleObject extends RequiredType(BaseObject) {}

    const sampleObjectType = await getSampleObjectType(SampleObject);

    const baseFieldA = sampleObjectType.fields.find(field => field.name === "baseFieldA")!;
    expect(baseFieldA.type.kind).toEqual(TypeKind.NON_NULL);
    const baseFieldB = sampleObjectType.fields.find(field => field.name === "baseFieldB")!;
    expect(baseFieldB.type.kind).toEqual(TypeKind.NON_NULL);
    const baseFieldC = sampleObjectType.fields.find(field => field.name === "baseFieldC")!;
    expect(baseFieldC.type.kind).toEqual(TypeKind.NON_NULL);
  });

  it("PickType should only define specified field", async () => {
    @ObjectType()
    class BaseObject {
      @Field({ nullable: true })
      baseFieldA: string;

      @Field({ nullable: false })
      baseFieldB: string;

      @Field()
      baseFieldC: string;
    }

    @ObjectType()
    class SampleObject extends PickType(BaseObject, "baseFieldA") {}

    const sampleObjectType = await getSampleObjectType(SampleObject);

    const baseFieldA = sampleObjectType.fields.find(field => field.name === "baseFieldA")!;
    expect(baseFieldA).toBeDefined();
    const baseFieldB = sampleObjectType.fields.find(field => field.name === "baseFieldB")!;
    expect(baseFieldB).toBeUndefined();
    const baseFieldC = sampleObjectType.fields.find(field => field.name === "baseFieldC")!;
    expect(baseFieldC).toBeUndefined();
  });

  it("OmitType should omit specified field", async () => {
    @ObjectType()
    class BaseObject {
      @Field({ nullable: true })
      baseFieldA: string;

      @Field({ nullable: false })
      baseFieldB: string;

      @Field()
      baseFieldC: string;
    }

    @ObjectType()
    class SampleObject extends OmitType(BaseObject, "baseFieldA", "baseFieldB") {}

    const sampleObjectType = await getSampleObjectType(SampleObject);

    const baseFieldA = sampleObjectType.fields.find(field => field.name === "baseFieldA")!;
    expect(baseFieldA).toBeUndefined();
    const baseFieldB = sampleObjectType.fields.find(field => field.name === "baseFieldB")!;
    expect(baseFieldB).toBeUndefined();
    const baseFieldC = sampleObjectType.fields.find(field => field.name === "baseFieldC")!;
    expect(baseFieldC).toBeDefined();
  });

  it("IntersectionType should combines two types into one new type", async () => {
    @ObjectType()
    class BaseObjectA {
      @Field()
      baseFieldA: string;
    }

    @ObjectType()
    class BaseObjectB {
      @Field()
      baseFieldB: string;
    }

    @ObjectType()
    class BaseObjectC {
      @Field()
      baseFieldC: string;
    }

    @ObjectType()
    class SampleObject extends IntersectionType(
      BaseObjectA,
      IntersectionType(BaseObjectB, BaseObjectC),
    ) {}

    const sampleObjectType = await getSampleObjectType(SampleObject);

    const baseFieldA = sampleObjectType.fields.find(field => field.name === "baseFieldA")!;
    expect(baseFieldA).toBeDefined();
    const baseFieldB = sampleObjectType.fields.find(field => field.name === "baseFieldB")!;
    expect(baseFieldB).toBeDefined();
    const baseFieldC = sampleObjectType.fields.find(field => field.name === "baseFieldC")!;
    expect(baseFieldC).toBeDefined();
  });

  it("should composable", async () => {
    @InputType()
    class PartialObject {
      @Field()
      nullableStringField: string;
    }

    @ArgsType()
    class RequiredObject {
      @Field()
      nonNullStringField: string;
    }

    @InterfaceType()
    class PickedObject {
      @Field()
      pickedStringField: string;
    }

    @ObjectType()
    class OmittedObject {
      @Field()
      OmittedStringField: string;
    }

    @ObjectType()
    class SampleObject extends IntersectionType(
      IntersectionType(PartialType(PartialObject), RequiredType(RequiredObject)),
      IntersectionType(
        PickType(PickedObject, "pickedStringField"),
        OmitType(OmittedObject, "OmittedStringField"),
      ),
    ) {}

    const sampleObjectType = await getSampleObjectType(SampleObject);

    const nullableStringField = sampleObjectType.fields.find(
      f => f.name === "nullableStringField",
    )!;
    expect(nullableStringField).toBeDefined();
    expect(nullableStringField.type.kind).toEqual(TypeKind.SCALAR);

    const nonNullStringField = sampleObjectType.fields.find(f => f.name === "nonNullStringField")!;
    expect(nonNullStringField).toBeDefined();
    expect(nonNullStringField.type.kind).toEqual(TypeKind.NON_NULL);

    const OmittedStringField = sampleObjectType.fields.find(f => f.name === "OmittedStringField")!;
    expect(OmittedStringField).toBeUndefined();

    const pickedStringField = sampleObjectType.fields.find(f => f.name === "pickedStringField")!;
    expect(pickedStringField).toBeDefined();
  });

  it("should work with InputType", async () => {
    @ObjectType()
    class BaseObject {
      @Field({ nullable: false })
      stringField: string;
    }

    @InputType()
    class SampleArgs extends PartialType(BaseObject) {}

    @Resolver()
    class SampleResolver {
      @Query()
      sampleQuery(@Arg("sample") _args: SampleArgs): String {
        return "";
      }
    }

    const schemaInfo = await getSchemaInfo({
      resolvers: [SampleResolver],
    });
    const schemaIntrospection = schemaInfo.schemaIntrospection;
    const sampleInputType = schemaIntrospection.types.find(
      type => type.name === "SampleArgs",
    ) as IntrospectionInputObjectType;

    const stringField = sampleInputType.inputFields.find(f => f.name === "stringField")!;
    expect(stringField).toBeDefined();
    expect(stringField.type.kind).toEqual(TypeKind.SCALAR);
  });

  it("should work with ArgsType", async () => {
    @ObjectType()
    class BaseObject {
      @Field({ nullable: false })
      stringField: string;
    }

    @ArgsType()
    class SampleArgs extends PartialType(BaseObject) {}

    @Resolver()
    class SampleResolver {
      @Query()
      sampleQuery(@Args() _args: SampleArgs): String {
        return "";
      }
    }

    const schemaInfo = await getSchemaInfo({
      resolvers: [SampleResolver],
    });

    const sampleQuery = schemaInfo.queryType.fields.find(f => f.name === "sampleQuery")!;
    const stringField = sampleQuery.args[0];
    console.log("sampleQuery: \n", sampleQuery);

    expect(stringField).toBeDefined();
    expect(stringField.type.kind).toEqual(TypeKind.SCALAR);
  });
});

async function getSampleObjectType<SampleObject extends ClassType>(SampleObject: SampleObject) {
  @Resolver()
  class SampleResolver {
    @Query(() => SampleObject)
    sampleQuery(): SampleObject {
      return {} as SampleObject;
    }
  }

  const schemaInfo = await getSchemaInfo({
    resolvers: [SampleResolver],
  });
  const schemaIntrospection = schemaInfo.schemaIntrospection;
  const sampleObjectType = schemaIntrospection.types.find(
    type => type.name === "SampleObject",
  ) as IntrospectionObjectType;
  return sampleObjectType;
}
