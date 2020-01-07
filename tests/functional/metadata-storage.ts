import "reflect-metadata";

import { getMetadataStorage } from "../../src/metadata/getMetadataStorage";
import {
  Resolver,
  Query,
  buildSchema,
  Mutation,
  Subscription,
  FieldResolver,
  ObjectType,
  ClassType,
  Field,
} from "../../src";
import { MetadataStorage } from "../../src/metadata/metadata-storage";

describe("MetadataStorage", () => {
  let metadataStorage: MetadataStorage;
  const INHERITED_QUERY_NAME = "inheritedQueryName";
  const INHERITED_MUTATION_NAME = "inheritedMutationName";
  const INHERITED_SUBSCRIPTION_NAME = "inheritedSubscriptionName";
  const INHERITED_FIELD_RESOLVER_NAME = "inheritedFieldResolverName";

  beforeAll(async () => {
    metadataStorage = getMetadataStorage();
    metadataStorage.clear();

    function createAbstractResolver(classType: ClassType) {
      @Resolver(() => classType, { isAbstract: true })
      abstract class AbstractResolver {
        @Query({ name: INHERITED_QUERY_NAME })
        abstractQuery(): boolean {
          return true;
        }

        @Mutation({ name: INHERITED_MUTATION_NAME })
        abstractMutation(): boolean {
          return true;
        }

        @Subscription({ name: INHERITED_SUBSCRIPTION_NAME, topics: "sampleTopic" })
        abstractSubscription(): boolean {
          return true;
        }

        @FieldResolver({ name: INHERITED_FIELD_RESOLVER_NAME })
        abstractFieldResolver(): boolean {
          return true;
        }
      }
      return AbstractResolver;
    }

    @ObjectType()
    class SampleObject {
      @Field()
      sampleField: boolean;

      @Field({ name: INHERITED_FIELD_RESOLVER_NAME })
      abstractSampleField: boolean;
    }

    @Resolver(() => SampleObject)
    class SubClassResolver extends createAbstractResolver(SampleObject) {
      @Query()
      subClassQuery(): boolean {
        return true;
      }

      @Mutation()
      subClassMutation(): boolean {
        return true;
      }

      @Subscription({ topics: "sampleTopic" })
      subClassSubscription(): boolean {
        return true;
      }

      @FieldResolver()
      sampleField(): boolean {
        return true;
      }
    }

    await buildSchema({ resolvers: [SubClassResolver] });
  });

  it("should not have duplicate fieldResolver metadata", async () => {
    function countItems() {
      const qNameCount: { [key: string]: number } = {};
      metadataStorage.fieldResolvers.forEach((q: any) => {
        qNameCount[q.schemaName] === undefined
          ? (qNameCount[q.schemaName] = 1)
          : qNameCount[q.schemaName]++;
      });
      console.log("Field Resolver Count By Name", qNameCount);
    }
    countItems();
    expect(
      metadataStorage.fieldResolvers.filter(
        fieldResolver => fieldResolver.schemaName === INHERITED_FIELD_RESOLVER_NAME,
      ).length,
    ).toBe(1);
  });

  it("should not have duplicate subscription metadata for resolvers", async () => {
    function countItems() {
      const qNameCount: { [key: string]: number } = {};
      metadataStorage.subscriptions.forEach((q: any) => {
        qNameCount[q.schemaName] === undefined
          ? (qNameCount[q.schemaName] = 1)
          : qNameCount[q.schemaName]++;
      });
      console.log("Subscription Count By Name", qNameCount);
    }
    countItems();
    expect(
      metadataStorage.subscriptions.filter(
        subscription => subscription.schemaName === INHERITED_SUBSCRIPTION_NAME,
      ).length,
    ).toBe(1);
  });

  it("should not have duplicate mutation metadata for resolvers", async () => {
    function countItems() {
      const qNameCount: { [key: string]: number } = {};
      metadataStorage.mutations.forEach((q: any) => {
        qNameCount[q.schemaName] === undefined
          ? (qNameCount[q.schemaName] = 1)
          : qNameCount[q.schemaName]++;
      });
      console.log("Mutation Count By Name", qNameCount);
    }
    countItems();
    expect(
      metadataStorage.mutations.filter(mutation => mutation.schemaName === INHERITED_MUTATION_NAME)
        .length,
    ).toBe(1);
  });

  it("should not have duplicate query metadata for resolvers", async () => {
    function countItems() {
      const qNameCount: { [key: string]: number } = {};
      metadataStorage.queries.forEach((q: any) => {
        qNameCount[q.schemaName] === undefined
          ? (qNameCount[q.schemaName] = 1)
          : qNameCount[q.schemaName]++;
      });
      console.log("Query Count By Name", qNameCount);
    }
    countItems();
    expect(
      metadataStorage.queries.filter(query => query.schemaName === INHERITED_QUERY_NAME).length,
    ).toBe(1);
  });
});
