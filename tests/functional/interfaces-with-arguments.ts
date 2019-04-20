import "reflect-metadata";
import { getMetadataStorage } from "../../src/metadata/getMetadataStorage";
import {
  IntrospectionSchema,
  IntrospectionObjectType,
  IntrospectionInterfaceType,
  IntrospectionField,
  GraphQLSchema,
  graphql,
} from "graphql";
import { getSchemaInfo } from "../helpers/getSchemaInfo";
import {
  Arg,
  Args,
  ArgsType,
  Field,
  ID,
  Int,
  InterfaceType,
  ObjectType,
  Query,
  Resolver,
  buildSchema,
} from "../../src";

describe("Interfaces with arguments", () => {
  describe("Schema", () => {
    let schemaIntrospection: IntrospectionSchema;

    beforeAll(async () => {
      getMetadataStorage().clear();

      @ArgsType()
      class SampleArgs1 {
        @Field(type => Int, { nullable: true })
        intValue1?: number;
        @Field(type => Int, { nullable: true })
        intValue2?: number;
      }

      @InterfaceType()
      abstract class SampleInterface1 {
        @Field(type => ID)
        id: string;
        @Field({ nullable: true })
        interfaceStringField1?: string;

        @Field()
        interfaceFieldInlineArguments(
          @Arg("intValue1") intValue1: number,
          @Arg("intValue2") intValue2: number,
        ): string {
          throw new Error("Method not implemented.");
        }
        @Field()
        interfaceFieldArgumentsType(@Args() args: SampleArgs1): string {
          throw new Error("Method not implemented.");
        }
      }

      @ObjectType({ implements: SampleInterface1 })
      class SampleImplementingObject1 implements SampleInterface1 {
        id: string;
        interfaceStringField1?: string;

        @Field()
        url: string;

        interfaceFieldInlineArguments(intValue1: number, intValue2: number): string {
          return `${intValue1}-${intValue2}`;
        }
        interfaceFieldArgumentsType(args: SampleArgs1): string {
          return `${args.intValue1}-${args.intValue2}`;
        }

        @Field()
        implemetingObjectTypeFieldInlineArguments(
          @Arg("intValue1") intValue1: number,
          @Arg("intValue2") intValue2: number,
        ): string {
          return `${intValue1}-${intValue2}`;
        }
        @Field()
        implemetingObjectTypeFieldArgumentsType(@Args() args: SampleArgs1): string {
          return `${args.intValue1}-${args.intValue2}`;
        }
      }

      @Resolver()
      class SampleResolver {
        @Query(returns => [SampleImplementingObject1])
        sampleQuery(): SampleImplementingObject1[] {
          return [];
        }
      }

      // get builded schema info from retrospection
      const schemaInfo = await getSchemaInfo({
        resolvers: [SampleResolver],
      });
      schemaIntrospection = schemaInfo.schemaIntrospection;
    });

    it("should generate schema without errors", async () => {
      expect(schemaIntrospection).toBeDefined();
    });

    it("should have proper arguments for the interface field with inline arguments", async () => {
      const sampleField = (schemaIntrospection.types.find(
        type => type.name === "SampleInterface1",
      ) as IntrospectionInterfaceType).fields.find(
        f => f.name === "interfaceFieldInlineArguments",
      ) as IntrospectionField;

      expect(sampleField.args).toBeDefined();
      expect(sampleField.args.length).toEqual(2);
      expect(
        sampleField.args.every(arg => ["intValue1", "intValue2"].includes(arg.name)),
      ).toBeTruthy();
    });

    it("should have proper arguments for the interface field with an arguments type", async () => {
      const sampleField = (schemaIntrospection.types.find(
        type => type.name === "SampleInterface1",
      ) as IntrospectionInterfaceType).fields.find(
        f => f.name === "interfaceFieldArgumentsType",
      ) as IntrospectionField;

      expect(sampleField.args).toBeDefined();
      expect(sampleField.args.length).toEqual(2);
      expect(
        sampleField.args.every(arg => ["intValue1", "intValue2"].includes(arg.name)),
      ).toBeTruthy();
    });

    it("should have proper arguments for the object field with inline arguments", async () => {
      const sampleField = (schemaIntrospection.types.find(
        type => type.name === "SampleImplementingObject1",
      ) as IntrospectionInterfaceType).fields.find(
        f => f.name === "implemetingObjectTypeFieldInlineArguments",
      ) as IntrospectionField;

      expect(sampleField.args).toBeDefined();
      expect(sampleField.args.length).toEqual(2);
      expect(
        sampleField.args.every(arg => ["intValue1", "intValue2"].includes(arg.name)),
      ).toBeTruthy();
    });

    it("should have proper arguments for the object field with an arguments type", async () => {
      const sampleField = (schemaIntrospection.types.find(
        type => type.name === "SampleImplementingObject1",
      ) as IntrospectionInterfaceType).fields.find(
        f => f.name === "implemetingObjectTypeFieldArgumentsType",
      ) as IntrospectionField;

      expect(sampleField.args).toBeDefined();
      expect(sampleField.args.length).toEqual(2);
      expect(
        sampleField.args.every(arg => ["intValue1", "intValue2"].includes(arg.name)),
      ).toBeTruthy();
    });
  });

  describe("Functional", () => {
    const resolvedValueString = (intValue1?: number, intValue2?: number) =>
      `${intValue1}-${intValue2}`;
    let schema: GraphQLSchema;

    beforeAll(async () => {
      getMetadataStorage().clear();

      @ArgsType()
      class SampleArgs1 {
        @Field(type => Int, { nullable: true })
        intValue1?: number;
        @Field(type => Int, { nullable: true })
        intValue2?: number;
      }

      @InterfaceType()
      abstract class SampleInterface1 {
        @Field(type => ID)
        id: string;
        @Field({ nullable: true })
        interfaceStringField1?: string;

        @Field()
        interfaceFieldInlineArguments(
          @Arg("intValue1") intValue1: number,
          @Arg("intValue2") intValue2: number,
        ): string {
          throw new Error("Method not implemented.");
        }
        @Field()
        interfaceFieldArgumentsType(@Args() args: SampleArgs1): string {
          throw new Error("Method not implemented.");
        }
      }

      @ObjectType({ implements: SampleInterface1 })
      class SampleImplementingObject1 implements SampleInterface1 {
        id: string;
        interfaceStringField1?: string;

        @Field()
        ownStringField1: string;

        constructor(id: string, ownStringField1: string) {
          this.id = id;
          this.ownStringField1 = ownStringField1;
        }

        @Field()
        interfaceFieldInlineArguments(
          @Arg("intValue1") intValue1: number,
          @Arg("intValue2") intValue2: number,
        ): string {
          return resolvedValueString(intValue1, intValue2);
        }
        @Field()
        interfaceFieldArgumentsType(@Args() args: SampleArgs1): string {
          return resolvedValueString(args.intValue1, args.intValue2);
        }

        @Field()
        implemetingObjectTypeFieldInlineArguments(
          @Arg("intValue1") intValue1: number,
          @Arg("intValue2") intValue2: number,
        ): string {
          return resolvedValueString(intValue1, intValue2);
        }
        @Field()
        implemetingObjectTypeFieldArgumentsType(@Args() args: SampleArgs1): string {
          return resolvedValueString(args.intValue1, args.intValue2);
        }
      }

      @Resolver()
      class SampleResolver {
        @Query(returns => [SampleImplementingObject1])
        sampleQuery(): SampleImplementingObject1[] {
          return [new SampleImplementingObject1("sampleId", "sampleString1")];
        }
      }

      schema = await buildSchema({
        resolvers: [SampleResolver],
      });
    });

    it("should build the schema without errors", () => {
      expect(schema).toBeDefined();
    });

    it("should properly resolve the interface field with inline arguments", async () => {
      const query = `query {
        sampleQuery {
          interfaceFieldInlineArguments(intValue1: 200, intValue2: 200)
        }
      }`;

      const response = await graphql(schema, query);

      const result = response.data!.sampleQuery;
      expect(result).toBeDefined();
      expect(result.length).toEqual(1);
      expect(result[0].interfaceFieldInlineArguments).toEqual(resolvedValueString(200, 200));
    });

    it("should properly resolve the interface field with an arguments type", async () => {
      const query = `query {
        sampleQuery {
          interfaceFieldArgumentsType(intValue1: 200, intValue2: 200)
        }
      }`;

      const response = await graphql(schema, query);

      const result = response.data!.sampleQuery;
      expect(result).toBeDefined();
      expect(result.length).toEqual(1);
      expect(result[0].interfaceFieldArgumentsType).toEqual(resolvedValueString(200, 200));
    });

    it("should properly resolve the object field with inline arguments", async () => {
      const query = `query {
        sampleQuery {
          ... on SampleImplementingObject1 {
            implemetingObjectTypeFieldInlineArguments(intValue1: 200, intValue2: 200)
          }
        }
      }`;

      const response = await graphql(schema, query);

      const result = response.data!.sampleQuery;
      expect(result).toBeDefined();
      expect(result.length).toEqual(1);
      expect(result[0].implemetingObjectTypeFieldInlineArguments).toEqual(
        resolvedValueString(200, 200),
      );
    });

    it("should properly resolve the object field with an arguments type", async () => {
      const query = `query {
        sampleQuery {
          ... on SampleImplementingObject1 {
            implemetingObjectTypeFieldArgumentsType(intValue1: 200, intValue2: 200)
          }
        }
      }`;

      const response = await graphql(schema, query);

      const result = response.data!.sampleQuery;
      expect(result).toBeDefined();
      expect(result.length).toEqual(1);
      expect(result[0].implemetingObjectTypeFieldArgumentsType).toEqual(
        resolvedValueString(200, 200),
      );
    });
  });
});
