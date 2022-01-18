import "reflect-metadata";
import {
  GraphQLSchema,
  IntrospectionObjectType,
  IntrospectionSchema,
  TypeKind,
  graphql,
  subscribe,
  ExecutionResult,
  execute,
  DocumentNode,
} from "graphql";
import gql from "graphql-tag";
import { EventEmitter } from "events";
import { PubSub as LocalPubSub } from "graphql-subscriptions";

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
  Authorized,
  Int,
} from "../../src";
import { getMetadataStorage } from "../../src/metadata/getMetadataStorage";
import { getSchemaInfo } from "../helpers/getSchemaInfo";
import { getInnerTypeOfNonNullableType, getItemTypeOfList } from "../helpers/getInnerFieldType";
import sleep from "../helpers/sleep";

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
    const localPubSub: PubSubEngine = new LocalPubSub();

    beforeAll(async () => {
      getMetadataStorage().clear();

      @ObjectType()
      class SampleObject {
        @Field(type => Float)
        value: number;
      }

      const SAMPLE_TOPIC = "SAMPLE";
      const OTHER_TOPIC = "OTHER";
      const CUSTOM_SUBSCRIBE_TOPIC = "CUSTOM_SUBSCRIBE_TOPIC";
      @Resolver()
      class SampleResolver {
        @Query()
        dummyQuery(): boolean {
          return true;
        }

        @Mutation(returns => Boolean)
        async pubSubMutation(
          @Arg("value") value: number,
          @PubSub() pubSub: PubSubEngine,
        ): Promise<boolean> {
          await pubSub.publish(SAMPLE_TOPIC, value);
          return true;
        }

        @Mutation(returns => Boolean)
        async pubSubMutationCustomSubscription(@Arg("value") value: number): Promise<boolean> {
          await localPubSub.publish(CUSTOM_SUBSCRIBE_TOPIC, value);
          return true;
        }

        @Mutation(returns => Boolean)
        async pubSubMutationDynamicTopic(
          @Arg("value") value: number,
          @Arg("topic") topic: string,
          @PubSub() pubSub: PubSubEngine,
        ): Promise<boolean> {
          await pubSub.publish(topic, value);
          return true;
        }

        @Mutation(returns => Boolean)
        async pubSubPublisherMutation(
          @Arg("value") value: number,
          @PubSub(SAMPLE_TOPIC) publish: Publisher<number>,
        ): Promise<boolean> {
          await publish(value);
          return true;
        }

        @Mutation(returns => Boolean)
        async pubSubOtherMutation(
          @Arg("value") value: number,
          @PubSub() pubSub: PubSubEngine,
        ): Promise<boolean> {
          await pubSub.publish(OTHER_TOPIC, value);
          return true;
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
        dynamicTopicSubscription(@Root() value: number, @Arg("topic") topic: string): SampleObject {
          return { value };
        }

        @Subscription({ subscribe: () => localPubSub.asyncIterator(CUSTOM_SUBSCRIBE_TOPIC) })
        customSubscribeSubscription(@Root() value: number): SampleObject {
          return { value };
        }
      }

      schema = await buildSchema({
        resolvers: [SampleResolver],
      });
    });

    it("should build schema without errors", async () => {
      expect(schema).toBeDefined();
    });

    async function subscribeOnceAndMutate(options: {
      mutation: DocumentNode;
      mutationVariables?: object;
      subscription: DocumentNode;
      subscriptionVariables?: object;
      onSubscribedData: (data: any) => void;
    }) {
      const results = (await subscribe({
        schema,
        document: options.subscription,
        variableValues: options.subscriptionVariables as any,
      })) as AsyncIterableIterator<ExecutionResult>;
      const onDataPromise = results.next().then(async ({ value }) => {
        options.onSubscribedData(value.data);
      });
      await execute({
        schema,
        document: options.mutation,
        variableValues: options.mutationVariables as any,
      });
      await onDataPromise;
    }

    it("should successfully get data from subscription after publishing mutation", async () => {
      let subscriptionValue!: number;
      const testedValue = Math.PI;
      const subscription = gql`
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

      await subscribeOnceAndMutate({
        subscription,
        mutation,
        onSubscribedData: data => {
          subscriptionValue = data.sampleTopicSubscription.value;
        },
      });

      expect(subscriptionValue).toEqual(testedValue);
    });

    it("should successfully get data from subscription using fragments", async () => {
      let subscriptionValue!: number;
      const testedValue = Math.PI;
      const subscription = gql`
        fragment TestFragment on SampleObject {
          value
        }
        subscription {
          sampleTopicSubscription {
            ...TestFragment
          }
        }
      `;
      const mutation = gql`
        mutation {
          pubSubMutation(value: ${testedValue})
        }
      `;

      await subscribeOnceAndMutate({
        subscription,
        mutation,
        onSubscribedData: data => {
          subscriptionValue = data.sampleTopicSubscription.value;
        },
      });

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

      const subscription = (await subscribe({
        schema,
        document: subscriptionQuery,
      })) as AsyncIterableIterator<ExecutionResult>;
      // run subscription in a separate async "thread"
      (async () => {
        for await (const result of subscription) {
          subscriptionValue = (result.data as any).sampleTopicSubscription.value;
        }
      })();

      await execute({ schema, document: mutation, variableValues: { value: 1.23 } });
      await sleep(0);
      expect(subscriptionValue).toEqual(1.23);

      await execute({ schema, document: mutation, variableValues: { value: 2.37 } });
      await sleep(0);
      expect(subscriptionValue).toEqual(2.37);

      await execute({ schema, document: mutation, variableValues: { value: 4.53 } });
      await sleep(0);
      expect(subscriptionValue).toEqual(4.53);
    });

    it("should successfully publish using Publisher injection", async () => {
      let subscriptionValue: number;
      const testedValue = Math.PI;
      const subscription = gql`
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

      await subscribeOnceAndMutate({
        subscription,
        mutation,
        onSubscribedData: data => {
          subscriptionValue = data.sampleTopicSubscription.value;
        },
      });

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

      const subscription = (await subscribe({
        schema,
        document: subscriptionQuery,
      })) as AsyncIterableIterator<ExecutionResult>;
      // run subscription in a separate async "thread"
      (async () => {
        for await (const result of subscription) {
          subscriptionValue = (result.data as any).sampleTopicSubscription.value;
        }
      })();

      await execute({ schema, document: otherTopicMutation, variableValues: { value: 1.23 } });
      await sleep(0);
      expect(subscriptionValue).toBeUndefined();

      await execute({ schema, document: otherTopicMutation, variableValues: { value: 2.37 } });
      await sleep(0);
      expect(subscriptionValue).toBeUndefined();

      await execute({ schema, document: sampleTopicMutation, variableValues: { value: 3.47 } });
      await sleep(0);
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

      const subscription = (await subscribe({
        schema,
        document: subscriptionQuery,
      })) as AsyncIterableIterator<ExecutionResult>;
      // run subscription in a separate async "thread"
      (async () => {
        for await (const result of subscription) {
          subscriptionValue = (result.data as any).sampleTopicSubscriptionWithFilter.value;
        }
      })();

      await execute({ schema, document: mutation, variableValues: { value: 0.23 } });
      await sleep(0);
      expect(subscriptionValue).toBeUndefined();

      await execute({ schema, document: mutation, variableValues: { value: 0.77 } });
      await sleep(0);
      expect(subscriptionValue).toEqual(0.77);

      await execute({ schema, document: mutation, variableValues: { value: 0.44 } });
      await sleep(0);
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

      const subscription = (await subscribe({
        schema,
        document: subscriptionQuery,
      })) as AsyncIterableIterator<ExecutionResult>;
      // run subscription in a separate async "thread"
      (async () => {
        for await (const result of subscription) {
          subscriptionValue = (result.data as any).multipleTopicSubscription.value;
        }
      })();

      await execute({ schema, document: sampleTopicMutation, variableValues: { value: 0.23 } });
      await sleep(0);
      expect(subscriptionValue).toEqual(0.23);

      await execute({ schema, document: otherTopicMutation, variableValues: { value: 0.77 } });
      await sleep(0);
      expect(subscriptionValue).toEqual(0.77);

      await execute({ schema, document: sampleTopicMutation, variableValues: { value: 0.44 } });
      await sleep(0);
      expect(subscriptionValue).toEqual(0.44);
    });

    it("should correctly subscribe to dynamic topics", async () => {
      let subscriptionValue!: number;
      const SAMPLE_TOPIC = "MY_DYNAMIC_TOPIC";
      const dynamicTopicSubscription = gql`
        subscription dynamicTopicSubscription($topic: String!) {
          dynamicTopicSubscription(topic: $topic) {
            value
          }
        }
      `;
      const pubSubMutationDynamicTopic = gql`
        mutation pubSubMutationDynamicTopic($value: Float!, $topic: String!) {
          pubSubMutationDynamicTopic(value: $value, topic: $topic)
        }
      `;

      await subscribeOnceAndMutate({
        subscription: dynamicTopicSubscription,
        subscriptionVariables: { topic: SAMPLE_TOPIC },
        mutation: pubSubMutationDynamicTopic,
        mutationVariables: { value: 0.23, topic: SAMPLE_TOPIC },
        onSubscribedData: data => {
          subscriptionValue = data.dynamicTopicSubscription.value;
        },
      });

      expect(subscriptionValue).toEqual(0.23);
    });

    it("should correctly subscribe with custom subscribe function", async () => {
      let subscriptionValue!: number;
      const testedValue = Math.PI;
      const subscription = gql`
        subscription {
          customSubscribeSubscription {
            value
          }
        }
      `;
      const mutation = gql`
        mutation {
          pubSubMutationCustomSubscription(value: ${testedValue})
        }
      `;

      await subscribeOnceAndMutate({
        subscription,
        mutation,
        onSubscribedData: data => {
          subscriptionValue = data.customSubscribeSubscription.value;
        },
      });

      expect(subscriptionValue).toEqual(testedValue);
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

      await graphql({ schema: localSchema, source: mutation });

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
      await graphql({ schema: localSchema, source: mutation });

      expect(emittedValue).toBeDefined();
      expect(emittedValue.test).toEqual(true);
    });

    it("should throw error while passing empty topics array to Subscription", async () => {
      getMetadataStorage().clear();
      expect.assertions(5);
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
          async pubSubMutation(
            @Arg("value") value: number,
            @PubSub() pubSub: PubSubEngine,
          ): Promise<boolean> {
            await pubSub.publish("TEST", value);
            return true;
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
        expect(err.message).not.toContain("class SampleResolver");
      }
    });

    it("should throw authorization error just on subscribe", async () => {
      getMetadataStorage().clear();
      expect.assertions(3);

      @Resolver()
      class SampleResolver {
        @Query()
        sampleQuery(): number {
          return 2137;
        }

        @Authorized("prevent")
        @Subscription(_returns => Int, { topics: "SAMPLE_TOPIC" })
        authedSubscription(): number {
          return 0;
        }
      }
      schema = await buildSchema({
        resolvers: [SampleResolver],
        authChecker: () => false,
      });
      const document = gql`
        subscription {
          authedSubscription
        }
      `;

      const subscribeResult = await subscribe({ schema, document });

      expect(subscribeResult).toHaveProperty("errors");
      const { errors } = subscribeResult as ExecutionResult;
      expect(errors).toHaveLength(1);
      expect(errors![0].message).toContain("Access denied!");
    });
  });
});
