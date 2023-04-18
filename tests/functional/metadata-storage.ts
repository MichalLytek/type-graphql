import "reflect-metadata";
import type { Class } from "type-graphql";
import {
  Field,
  FieldResolver,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Subscription,
  buildSchema,
} from "type-graphql";
import { getMetadataStorage } from "@/metadata/getMetadataStorage";

describe("MetadataStorage", () => {
  describe("resolvers inheritance", () => {
    const INHERITED_QUERY_NAME = "inheritedQueryName";
    const INHERITED_MUTATION_NAME = "inheritedMutationName";
    const INHERITED_SUBSCRIPTION_NAME = "inheritedSubscriptionName";
    const INHERITED_FIELD_RESOLVER_NAME = "inheritedFieldResolverName";

    beforeAll(async () => {
      getMetadataStorage().clear();

      function createAbstractResolver(classType: Class) {
        @Resolver(() => classType)
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

    it("should not have duplicated query metadata for inherited resolvers", async () => {
      expect(
        getMetadataStorage().queries.filter(query => query.schemaName === INHERITED_QUERY_NAME),
      ).toHaveLength(1);
      expect(getMetadataStorage().queries).toHaveLength(2);
    });

    it("should not have duplicated mutation metadata for inherited resolvers", async () => {
      expect(
        getMetadataStorage().mutations.filter(
          mutation => mutation.schemaName === INHERITED_MUTATION_NAME,
        ),
      ).toHaveLength(1);
      expect(getMetadataStorage().mutations).toHaveLength(2);
    });

    it("should not have duplicated subscription metadata for inherited resolvers", async () => {
      expect(
        getMetadataStorage().subscriptions.filter(
          subscription => subscription.schemaName === INHERITED_SUBSCRIPTION_NAME,
        ),
      ).toHaveLength(1);
      expect(getMetadataStorage().subscriptions).toHaveLength(2);
    });

    it("should not have duplicated fieldResolver metadata for inherited resolvers", async () => {
      expect(
        getMetadataStorage().fieldResolvers.filter(
          fieldResolver => fieldResolver.schemaName === INHERITED_FIELD_RESOLVER_NAME,
        ),
      ).toHaveLength(1);
      expect(getMetadataStorage().fieldResolvers).toHaveLength(2);
    });
  });
});
