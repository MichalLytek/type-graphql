import "reflect-metadata";
import { GraphQLSchema, graphql } from "graphql";
import { Container, Service } from "typedi";

import { IOCContainer } from "../../src/utils/container";
import { MetadataStorage } from "../../src/metadata/metadata-storage";
import {
  GraphQLObjectType,
  Field,
  GraphQLResolver,
  Query,
  useContainer,
  buildSchema,
} from "../../src";

describe("IOC container", () => {
  beforeEach(() => {
    MetadataStorage.clear();
    IOCContainer.restoreDefault();
    Container.reset();
  });

  it("should use provided container to load resolver class dependencies", async () => {
    let serviceValue: number | undefined;
    const initValue = 5;
    @Service()
    class SampleService {
      value = initValue;
    }
    @GraphQLObjectType()
    class SampleObject {
      @Field({ nullable: true })
      field?: string;
    }
    @GraphQLResolver(objectType => SampleObject)
    class SampleResolver {
      constructor(private service: SampleService) {}
      @Query()
      sampleQuery(): SampleObject {
        serviceValue = this.service.value;
        return {};
      }
    }

    useContainer(Container);
    const schema = buildSchema({
      resolvers: [SampleResolver],
    });
    const query = `query {
      sampleQuery {
        field
      }
    }`;
    await graphql(schema, query);

    expect(serviceValue).toEqual(initValue);
  });

  it("should use default container to instantiate resolver class", async () => {
    let resolverValue: number | undefined;
    @GraphQLObjectType()
    class SampleObject {
      @Field({ nullable: true })
      field?: string;
    }
    @GraphQLResolver(objectType => SampleObject)
    class SampleResolver {
      value = Math.random();
      @Query()
      sampleQuery(): SampleObject {
        resolverValue = this.value;
        return {};
      }
    }

    const schema = buildSchema({
      resolvers: [SampleResolver],
    });
    const query = `query {
      sampleQuery {
        field
      }
    }`;
    await graphql(schema, query);
    const firstCallValue = resolverValue;
    resolverValue = undefined;
    await graphql(schema, query);
    const secondCallValue = resolverValue;

    expect(firstCallValue).toBeDefined();
    expect(secondCallValue).toBeDefined();
    expect(firstCallValue).toEqual(secondCallValue);
  });
});
