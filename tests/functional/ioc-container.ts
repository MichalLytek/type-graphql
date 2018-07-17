import "reflect-metadata";
import { graphql } from "graphql";
import { Container, Service } from "typedi";
import * as uuid from "uuid";
import { asClass, asValue, createContainer, InjectionMode } from "awilix";
import * as _ from "lodash";

import { IOCContainer } from "../../src/utils/container";
import { getMetadataStorage } from "../../src/metadata/getMetadataStorage";
import {
  ObjectType,
  Field,
  Resolver,
  Query,
  useContainer,
  buildSchema,
  ResolverData,
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

  it("should pass resolver's context to container", async () => {
    let serviceValue: number | undefined;
    const initValue = 42;
    const logInfo = jest.fn();
    const logWarn = jest.fn();

    class Logger {
      // tslint:disable-next-line no-shadowed-variable
      constructor(private requestId: string) {}

      info(message: string, data: Record<string, any> = {}) {
        this.log("info", message, data);
      }

      warn(message: string, data: Record<string, any> = {}) {
        this.log("warn", message, data);
      }

      private log(method: "info" | "warn", message: string, data: Record<string, any>) {
        const handler = method === "info" ? logInfo : logWarn;

        handler(
          message,
          data,
          { requestId: this.requestId },
        );
      }
    }

    class SampleService {
      constructor(private logger: Logger) {}

      getValue() {
        const answer = initValue;
        this.logger.info("get value result", { answer });
        return answer;
      }
    }

    @ObjectType()
    class SampleObject {
      @Field({ nullable: true })
      field?: string;
    }

    @Resolver(of => SampleObject)
    class SampleResolver {
      constructor(private sampleService: SampleService, private logger: Logger) {}

      @Query()
      sampleQuery(): SampleObject {
        this.logger.warn("sampleQuery was called");
        serviceValue = this.sampleService.getValue();
        return {};
      }
    }

    const container = createContainer({ injectionMode: InjectionMode.CLASSIC }).register({
      sampleService: asClass(SampleService),
      logger: asClass(Logger),
      sampleResolver: asClass(SampleResolver),
    });

    const containerWrapper = {
      get(someClass: any, data: ResolverData<{ requestId: string }>) {
        const scopedContainer = container.createScope().register({
          requestId: asValue(data.context.requestId),
        });

        return scopedContainer.resolve<any>(_.lowerFirst(someClass.name));
      },
    };

    useContainer(containerWrapper);
    const schema = await buildSchema({
      resolvers: [SampleResolver],
    });
    const query = `query {
      sampleQuery {
        field
      }
    }`;

    const requestId = uuid.v4();
    await graphql(schema, query, null, { requestId });
    expect(serviceValue).toEqual(initValue);

    expect(logWarn).toHaveBeenCalledWith("sampleQuery was called", {}, { requestId });
    expect(logInfo).toHaveBeenCalledWith(
      "get value result",
      { answer: initValue },
      { requestId },
    );
  });
});
