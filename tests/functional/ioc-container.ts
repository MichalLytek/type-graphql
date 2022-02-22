import "reflect-metadata";
import { graphql } from "graphql";
import { Container, Service } from "typedi";

import { getMetadataStorage } from "../../src/metadata/getMetadataStorage";
import {
  ObjectType,
  Field,
  Resolver,
  Query,
  Arg,
  buildSchema,
  ResolverData,
  ContainerType,
} from "../../src";

describe("IOC container", () => {
  beforeEach(() => {
    getMetadataStorage().clear();
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
    @Service()
    @Resolver(of => SampleObject)
    class SampleResolver {
      constructor(private service: SampleService) {}
      @Query()
      sampleQuery(): SampleObject {
        serviceValue = this.service.value;
        return {};
      }
    }

    const schema = await buildSchema({
      resolvers: [SampleResolver],
      container: Container,
    });
    const query = /* graphql */ `
      query {
        sampleQuery {
          field
        }
      }
    `;
    await graphql({ schema, source: query });

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
    const query = /* graphql */ `
      query {
        sampleQuery {
          field
        }
      }
    `;
    await graphql({ schema, source: query });
    const firstCallValue = resolverValue;
    resolverValue = undefined;
    await graphql({ schema, source: query });
    const secondCallValue = resolverValue;

    expect(firstCallValue).toBeDefined();
    expect(secondCallValue).toBeDefined();
    expect(firstCallValue).toEqual(secondCallValue);
  });

  it("should pass resolver's data to container's get", async () => {
    let contextRequestId!: number;
    const testContainer: ContainerType = {
      get(someClass, resolverData: ResolverData<{ requestId: number }>) {
        contextRequestId = resolverData.context.requestId;
        return Container.get(someClass);
      },
    };

    @Resolver()
    class SampleResolver {
      @Query()
      sampleQuery(): string {
        return "sampleQuery";
      }
    }

    const schema = await buildSchema({
      resolvers: [SampleResolver],
      container: testContainer,
    });

    const query = /* graphql */ `
      query {
        sampleQuery
      }
    `;

    const requestId = Math.random();
    await graphql({ schema, source: query, contextValue: { requestId } });
    expect(contextRequestId).toEqual(requestId);
  });

  it("should properly get container from container getter function", async () => {
    let called: boolean = false;

    @Resolver()
    class SampleResolver {
      @Query()
      sampleQuery(): string {
        return "sampleQuery";
      }
    }

    interface TestContext {
      container: ContainerType;
    }

    const schema = await buildSchema({
      resolvers: [SampleResolver],
      container: ({ context }: ResolverData<TestContext>) => context.container,
    });

    const query = /* graphql */ `
      query {
        sampleQuery
      }
    `;

    const mockedContainer: ContainerType = {
      get(someClass: any) {
        called = true;
        return Container.get(someClass);
      },
    };
    const queryContext: TestContext = {
      container: mockedContainer,
    };

    await graphql({ schema, source: query, contextValue: queryContext });

    expect(called).toEqual(true);
  });

  it("should properly get instance from an async container", async () => {
    let called: boolean = false;

    @Service()
    @Resolver()
    class SampleResolver {
      @Query()
      sampleQuery(@Arg("sampleArg") sampleArg: string): string {
        return sampleArg;
      }
    }

    const asyncContainer: ContainerType = {
      async get(someClass: any) {
        await new Promise(setImmediate);
        called = true;
        return Container.get(someClass);
      },
    };

    const schema = await buildSchema({
      resolvers: [SampleResolver],
      container: asyncContainer,
    });

    const query = /* graphql */ `
      query {
        sampleQuery(sampleArg: "sampleArgValue")
      }
    `;

    const result: any = await graphql({ schema, source: query });

    expect(result.errors).toBeUndefined();
    expect(result.data!.sampleQuery).toEqual("sampleArgValue");
    expect(called).toEqual(true);
  });
});
