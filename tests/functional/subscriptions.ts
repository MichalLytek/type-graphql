import "reflect-metadata";
import {
  GraphQLSchema,
  IntrospectionObjectType,
  IntrospectionSchema,
  TypeKind,
  graphql,
} from "graphql";
import { ApolloClient } from "apollo-client";
import gql from "graphql-tag";
import { EventEmitter } from "events";

import {
  Subscription,
  Resolver,
  Query,
  Arg,
  ObjectType,
  Field,
  PubSub,
  Mutation,
  Root,
  Publisher,
  PubSubEngine,
  Float,
  buildSchema,
  MissingSubscriptionTopicsError,
  Args,
} from "../../src";
import { getMetadataStorage } from "../../src/metadata/getMetadataStorage";
import { getSchemaInfo } from "../helpers/getSchemaInfo";
import { getInnerTypeOfNonNullableType, getItemTypeOfList } from "../helpers/getInnerFieldType";
import { createWebSocketUtils, WebSocketUtils } from "../helpers/subscriptions/createWebSocketGQL";

describe("Subscriptions", () => {
  describe("Schema", () => {
    let schema: GraphQLSchema;
    let schemaIntrospection: IntrospectionSchema;
    let subscriptionType: IntrospectionObjectType;

    beforeAll(async () => {
      getMetadataStorage().clear();

      @ObjectType()
      class SampleObject {
        @Field()
        sampleField: string;
      }

      @Resolver()
      class SampleResolver {
        @Query()
        sampleQuery(): boolean {
          return true;
        }
        @Subscription({ topics: "STH" })
        sampleSubscription(): boolean {
          return true;
        }

        @Subscription({ topics: "STH" })
        subscriptionWithArgs(
          @Arg("stringArg") stringArg: string,
          @Arg("booleanArg") booleanArg: boolean,
        ): boolean {
          return true;
        }

        @Subscription(returns => [SampleObject], { topics: "STH" })
        subscriptionWithExplicitType(): any {
          return true;
        }
      }
      const schemaInfo = await getSchemaInfo({
        resolvers: [SampleResolver],
      });
      schema = schemaInfo.schema;
      schemaIntrospection = schemaInfo.schemaIntrospection;
      subscriptionType = schemaInfo.subscriptionType!;
    });

    it("should build schema without errors", () => {
      expect(schema).toBeDefined();
    });

    it("should correctly generate simple subscription type", () => {
      const sampleSubscription = subscriptionType.fields.find(
        field => field.name === "sampleSubscription",
      )!;
      const sampleSubscriptionType = getInnerTypeOfNonNullableType(sampleSubscription);

      expect(sampleSubscription).toBeDefined();
      expect(sampleSubscription.args).toHaveLength(0);
      expect(sampleSubscriptionType.kind).toEqual(TypeKind.SCALAR);
      expect(sampleSubscriptionType.name).toEqual("Boolean");
    });

    it("should correctly generate type of subscription with args", () => {
      const subscriptionWithArgs = subscriptionType.fields.find(
        field => field.name === "subscriptionWithArgs",
      )!;
      const subscriptionWithArgsType = getInnerTypeOfNonNullableType(subscriptionWithArgs);

      expect(subscriptionWithArgs).toBeDefined();
      expect(subscriptionWithArgs.args).toHaveLength(2);
      expect(subscriptionWithArgsType.kind).toEqual(TypeKind.SCALAR);
      expect(subscriptionWithArgsType.name).toEqual("Boolean");
    });

    it("should correctly generate type of subscription with explicit type", () => {
      const subscriptionWithExplicitType = subscriptionType.fields.find(
        field => field.name === "subscriptionWithExplicitType",
      )!;
      const innerType = getInnerTypeOfNonNullableType(subscriptionWithExplicitType);
      const itemType = getItemTypeOfList(subscriptionWithExplicitType);

      expect(subscriptionWithExplicitType).toBeDefined();
      expect(subscriptionWithExplicitType.args).toHaveLength(0);
      expect(innerType.kind).toEqual(TypeKind.LIST);
      expect(itemType.kind).toEqual(TypeKind.OBJECT);
      expect(itemType.name).toEqual("SampleObject");
    });
  });

  describe("Functional", () => {
    let schema: GraphQLSchema;
    let apollo: ApolloClient<any>;
    let webSocketUtils: WebSocketUtils;

    beforeAll(async () => {
      getMetadataStorage().clear();

      @ObjectType()
      class SampleObject {
        @Field(type => Float)
        value: number;
      }

      const SAMPLE_TOPIC = "SAMPLE";
      const OTHER_TOPIC = "OTHER";
      @Resolver()
      class SampleResolver {
        @Query()
        dummyQuery(): boolean {
          return true;
        }

        @Mutation(returns => Boolean)
        pubSubMutation(@Arg("value") value: number, @PubSub() pubSub: PubSubEngine): boolean {
          return pubSub.publish(SAMPLE_TOPIC, value);
        }

        @Mutation(returns => Boolean)
        pubSubMutationDynamicTopic(
          @Arg("value") value: number,
          @Arg("topic") topic: string,
          @PubSub() pubSub: PubSubEngine,
        ): boolean {
          return pubSub.publish(topic, value);
        }

        @Mutation(returns => Boolean)
        pubSubPublisherMutation(
          @Arg("value") value: number,
          @PubSub(SAMPLE_TOPIC) publish: Publisher<number>,
        ): boolean {
          return publish(value);
        }

        @Mutation(returns => Boolean)
        pubSubOtherMutation(@Arg("value") value: number, @PubSub() pubSub: PubSubEngine): boolean {
          return pubSub.publish(OTHER_TOPIC, value);
        }

        @Subscription({ topics: SAMPLE_TOPIC })
        sampleTopicSubscription(@Root() value: number): SampleObject {
          return { value };
        }

        @Subscription({
          topics: SAMPLE_TOPIC,
          filter: ({ payload: value }) => value > 0.5,
        })
        sampleTopicSubscriptionWithFilter(@Root() value: number): SampleObject {
          return { value };
        }

        @Subscription({ topics: [SAMPLE_TOPIC, OTHER_TOPIC] })
        multipleTopicSubscription(@Root() value: number): SampleObject {
          return { value };
        }

        @Subscription({ topics: ({ args }) => args.topic })
        dynamicTopicSubscription(
          @Root() value: number,
          @Arg("topic") topic: string,
        ): SampleObject {
          return { value };
        }
      }

      schema = await buildSchema({
        resolvers: [SampleResolver],
      });

      webSocketUtils = await createWebSocketUtils(schema);
      apollo = webSocketUtils.apollo;
    });

    afterAll(async () => {
      webSocketUtils.server.close();
    });

    it("should build schema without errors", async () => {
      expect(schema).toBeDefined();
    });

    it("should successfully get data from subscription after publishing mutation", async () => {
      let subscriptionValue!: number;
      const testedValue = Math.PI;
      const subscriptionQuery = gql`
        subscription {
          sampleTopicSubscription {
            value
          }
        }
      `;
      const mutation = gql`
        mutation {
          pubSubMutation(value: ${testedValue})
        }
      `;

      apollo.subscribe({ query: subscriptionQuery }).subscribe({
        next: ({ data }) => (subscriptionValue = data!.sampleTopicSubscription.value),
      });
      await apollo.mutate({ mutation });

      expect(subscriptionValue).toEqual(testedValue);
    });

    it("should successfully get data from subscription after sequential mutations", async () => {
      let subscriptionValue!: number;
      const subscriptionQuery = gql`
        subscription {
          sampleTopicSubscription {
            value
          }
        }
      `;
      const mutation = gql`
        mutation SimpleMutation($value: Float!) {
          pubSubMutation(value: $value)
        }
      `;

      apollo.subscribe({ query: subscriptionQuery }).subscribe({
        next: ({ data }) => (subscriptionValue = data!.sampleTopicSubscription.value),
      });

      await apollo.mutate({ mutation, variables: { value: 1.23 } });
      expect(subscriptionValue).toEqual(1.23);
      await apollo.mutate({ mutation, variables: { value: 2.37 } });
      expect(subscriptionValue).toEqual(2.37);
      await apollo.mutate({ mutation, variables: { value: 4.53 } });
      expect(subscriptionValue).toEqual(4.53);
    });

    it("should successfully publish using Publisher injection", async () => {
      let subscriptionValue: number;
      const testedValue = Math.PI;
      const subscriptionQuery = gql`
        subscription {
          sampleTopicSubscription {
            value
          }
        }
      `;
      const mutation = gql`
        mutation {
          pubSubPublisherMutation(value: ${testedValue})
        }
      `;

      apollo.subscribe({ query: subscriptionQuery }).subscribe({
        next: ({ data }) => (subscriptionValue = data!.sampleTopicSubscription.value),
      });
      await apollo.mutate({ mutation });

      expect(subscriptionValue!).toEqual(testedValue);
    });

    it("should doesn't trigger subscription when published to other topic", async () => {
      let subscriptionValue!: number;
      const subscriptionQuery = gql`
        subscription {
          sampleTopicSubscription {
            value
          }
        }
      `;
      const sampleTopicMutation = gql`
        mutation SampleTopicMutation($value: Float!) {
          pubSubMutation(value: $value)
        }
      `;
      const otherTopicMutation = gql`
        mutation OtherTopicMutation($value: Float!) {
          pubSubOtherMutation(value: $value)
        }
      `;

      apollo.subscribe({ query: subscriptionQuery }).subscribe({
        next: ({ data }) => (subscriptionValue = data!.sampleTopicSubscription.value),
      });

      await apollo.mutate({ mutation: otherTopicMutation, variables: { value: 1.23 } });
      expect(subscriptionValue).toBeUndefined();
      await apollo.mutate({ mutation: otherTopicMutation, variables: { value: 2.37 } });
      expect(subscriptionValue).toBeUndefined();
      await apollo.mutate({ mutation: sampleTopicMutation, variables: { value: 3.47 } });
      expect(subscriptionValue).toEqual(3.47);
    });

    it("should correctly filter triggering subscription", async () => {
      let subscriptionValue!: number;
      const subscriptionQuery = gql`
        subscription {
          sampleTopicSubscriptionWithFilter {
            value
          }
        }
      `;
      const mutation = gql`
        mutation SimpleMutation($value: Float!) {
          pubSubMutation(value: $value)
        }
      `;

      apollo.subscribe({ query: subscriptionQuery }).subscribe({
        next: ({ data }) => (subscriptionValue = data!.sampleTopicSubscriptionWithFilter.value),
      });

      await apollo.mutate({ mutation, variables: { value: 0.23 } });
      expect(subscriptionValue).toBeUndefined();
      await apollo.mutate({ mutation, variables: { value: 0.77 } });
      expect(subscriptionValue).toEqual(0.77);
      await apollo.mutate({ mutation, variables: { value: 0.44 } });
      expect(subscriptionValue).toEqual(0.77);
    });

    it("should correctly subscribe to multiple topics", async () => {
      let subscriptionValue!: number;
      const subscriptionQuery = gql`
        subscription {
          multipleTopicSubscription {
            value
          }
        }
      `;
      const sampleTopicMutation = gql`
        mutation SampleTopicMutation($value: Float!) {
          pubSubMutation(value: $value)
        }
      `;
      const otherTopicMutation = gql`
        mutation OtherTopicMutation($value: Float!) {
          pubSubOtherMutation(value: $value)
        }
      `;

      apollo.subscribe({ query: subscriptionQuery }).subscribe({
        next: ({ data }) => (subscriptionValue = data!.multipleTopicSubscription.value),
      });

      await apollo.mutate({ mutation: sampleTopicMutation, variables: { value: 0.23 } });
      expect(subscriptionValue).toEqual(0.23);
      await apollo.mutate({ mutation: otherTopicMutation, variables: { value: 0.77 } });
      expect(subscriptionValue).toEqual(0.77);
      await apollo.mutate({ mutation: sampleTopicMutation, variables: { value: 0.44 } });
      expect(subscriptionValue).toEqual(0.44);
    });

    it("should correctly subscribe to dynamic topics", async () => {
      let subscriptionValue!: number;
      const SAMPLE_TOPIC = "MY_DYNAMIC_TOPIC";
      const dynamicTopicSubscription = gql`
        subscription dynamicTopicSubscription($topic: String!) {
          dynamicTopicSubscription (topic: $topic) {
            value
          }
        }
      `;
      const pubSubMutationDynamicTopic = gql`
        mutation pubSubMutationDynamicTopic($value: Float!, $topic: String!) {
          pubSubMutationDynamicTopic(value: $value, topic: $topic)
        }
      `;

      apollo.subscribe({
        query: dynamicTopicSubscription,
        variables: { topic: SAMPLE_TOPIC },
      }).subscribe({
        next: ({ data }) => (subscriptionValue = data!.dynamicTopicSubscription.value),
      });

      await apollo.mutate({
        mutation: pubSubMutationDynamicTopic,
        variables: { value: 0.23 , topic: SAMPLE_TOPIC },
      });
      expect(subscriptionValue).toEqual(0.23);

    });

    it("should inject the provided custom PubSub implementation", async () => {
      let pubSub: any;
      getMetadataStorage().clear();

      @ObjectType()
      class SampleObject {
        @Field()
        sampleField: string;
      }

      class SampleResolver {
        @Query()
        dumbQuery(): boolean {
          return true;
        }

        @Mutation()
        pubSubMutation(@PubSub() pubSubArg: any): boolean {
          pubSub = pubSubArg;
          return true;
        }
      }
      const customPubSub = { myField: true };
      const mutation = `mutation {
        pubSubMutation
      }`;

      const localSchema = await buildSchema({
        resolvers: [SampleResolver],
        pubSub: customPubSub as any,
      });

      await graphql(localSchema, mutation);

      expect(pubSub).toEqual(customPubSub);
      expect(pubSub.myField).toEqual(true);
    });

    it("should create PubSub instance with provided emitter options", async () => {
      getMetadataStorage().clear();
      @ObjectType()
      class SampleObject {
        @Field()
        sampleField: string;
      }
      class SampleResolver {
        @Query()
        dumbQuery(): boolean {
          return true;
        }
        @Mutation()
        pubSubMutation(@PubSub() pubSubArg: PubSubEngine): boolean {
          pubSubArg.publish("TEST", { test: true });
          return true;
        }
      }

      let emittedValue: any;
      const customEmitter = new EventEmitter();
      customEmitter.on("TEST", payload => (emittedValue = payload));
      const mutation = `mutation {
        pubSubMutation
      }`;
      const localSchema = await buildSchema({
        resolvers: [SampleResolver],
        pubSub: { eventEmitter: customEmitter },
      });
      await graphql(localSchema, mutation);

      expect(emittedValue).toBeDefined();
      expect(emittedValue.test).toEqual(true);
    });

    it("should throw error while passing empty topics array to Subscription", async () => {
      getMetadataStorage().clear();
      expect.assertions(4);
      try {
        @ObjectType()
        class SampleObject {
          @Field()
          sampleField: string;
        }
        class SampleResolver {
          @Query()
          dumbQuery(): boolean {
            return true;
          }
          @Mutation(returns => Boolean)
          pubSubMutation(@Arg("value") value: number, @PubSub() pubSub: PubSubEngine): boolean {
            return pubSub.publish("TEST", value);
          }
          @Subscription({ topics: [] })
          sampleSubscription(): boolean {
            return true;
          }
        }

        await buildSchema({
          resolvers: [SampleResolver],
        });
      } catch (err) {
        expect(err).toBeDefined();
        expect(err).toBeInstanceOf(MissingSubscriptionTopicsError);
        expect(err.message).toContain("SampleResolver");
        expect(err.message).toContain("sampleSubscription");
      }
    });
  });
});
