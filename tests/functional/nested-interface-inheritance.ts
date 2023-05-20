import "reflect-metadata";
import type { GraphQLSchema } from "graphql";
import { printSchema } from "graphql";
import { Field, InterfaceType, ObjectType, Query, Resolver } from "../../src";
import { getSchemaInfo } from "../helpers/getSchemaInfo";

describe("nested interface inheritance", () => {
  let schema: GraphQLSchema;
  beforeAll(async () => {
    @InterfaceType()
    abstract class A {
      @Field()
      a!: string;
    }

    @InterfaceType({ implements: A })
    abstract class B extends A {
      @Field()
      b!: string;
    }

    @InterfaceType({ implements: B })
    abstract class C extends B {
      @Field()
      c!: string;
    }

    @ObjectType({ implements: C })
    class D extends C {
      @Field()
      d!: string;
    }

    @Resolver()
    class TestResolver {
      @Query()
      testQuery(): string {
        return "testQuery";
      }
    }
    const schemaInfo = await getSchemaInfo({
      resolvers: [TestResolver],
      orphanedTypes: [A, B, C, D],
    });
    schema = schemaInfo.schema;
  });

  it("should properly generate object type, implementing multi-inherited interface, with only one `implements`", async () => {
    expect(printSchema(schema)).toMatchInlineSnapshot(`
      "type D implements C & B & A {
        a: String!
        b: String!
        c: String!
        d: String!
      }

      interface A {
        a: String!
      }

      interface B implements A {
        a: String!
        b: String!
      }

      interface C implements B & A {
        a: String!
        b: String!
        c: String!
      }

      type Query {
        testQuery: String!
      }"
    `);
  });
});
