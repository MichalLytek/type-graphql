import "reflect-metadata";
import { graphql } from "graphql";
import { Container, Service } from "typedi";

import { IOCContainer } from "../../src/utils/container";
import { getMetadataStorage } from "../../src/metadata/getMetadataStorage";
import {
  ObjectType,
  Field,
  Resolver,
  Query,
  useContainer,
  buildSchema,
} from "../../src";

describe("IOC container", () => {
  beforeEach(() => {
    getMetadataStorage().clear();
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
    @ObjectType()
    class SampleObject {
      @Field({ nullable: true })
      field?: string;
    }
    @Resolver(of => SampleObject)
    class SampleResolver {
      constructor(private service: SampleService) {}
      @Query()
      sampleQuery(): SampleObject {
        serviceValue = this.service.value;
        return {};
      }
    }

    useContainer(Container);
    const schema = await buildSchema({
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
    @ObjectType()
    class SampleObject {
      @Field({ nullable: true })
      field?: string;
    }
    @Resolver(of => SampleObject)
    class SampleResolver {
      value = Math.random();
      @Query()
      sampleQuery(): SampleObject {
        resolverValue = this.value;
        return {};
      }
    }

    const schema = await buildSchema({
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
