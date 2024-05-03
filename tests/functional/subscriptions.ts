import "reflect-metadata";
import { createPubSub } from "@graphql-yoga/subscription";
import {
  type DocumentNode,
  type ExecutionResult,
  type GraphQLSchema,
  type IntrospectionObjectType,
  TypeKind,
  execute,
  subscribe,
} from "graphql";
import gql from "graphql-tag";
import {
  Arg,
  Authorized,
  Field,
  Float,
  Int,
  MissingPubSubError,
  MissingSubscriptionTopicsError,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
  Subscription,
  buildSchema,
} from "type-graphql";
import { getMetadataStorage } from "@/metadata/getMetadataStorage";
import { expectToThrow } from "../helpers/expectToThrow";
import { getInnerTypeOfNonNullableType, getItemTypeOfList } from "../helpers/getInnerFieldType";
import { getSchemaInfo } from "../helpers/getSchemaInfo";
import { sleep } from "../helpers/sleep";

describe("Subscriptions", () => {
  const pubSub = createPubSub();

  describe("Schema", () => {
    let schema: GraphQLSchema;
    let subscriptionType: IntrospectionObjectType;

    beforeAll(async () => {
      getMetadataStorage().clear();

      @ObjectType()
      class SampleObject {
        @Field()
        sampleField!: string;
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
          @Arg("stringArg") _stringArg: string,
          @Arg("booleanArg") _booleanArg: boolean,
        ): boolean {
          return true;
        }

        @Subscription(() => [SampleObject], { topics: "STH" })
        subscriptionWithExplicitType(): any {
          return true;
        }
      }
      const schemaInfo = await getSchemaInfo({
        resolvers: [SampleResolver],
        pubSub,
      });
      schema = schemaInfo.schema;
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

    beforeAll(async () => {
      getMetadataStorage().clear();

      @ObjectType()
      class SampleObject {
        @Field(() => Float)
        value!: number;
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

        @Mutation(() => Boolean)
        async pubSubMutation(@Arg("value") value: number): Promise<boolean> {
          pubSub.publish(SAMPLE_TOPIC, value);
          return true;
        }

        @Mutation(() => Boolean)
        async pubSubMutationCustomSubscription(@Arg("value") value: number): Promise<boolean> {
          pubSub.publish(CUSTOM_SUBSCRIBE_TOPIC, value);
          return true;
        }

        @Mutation(() => Boolean)
        async pubSubMutationDynamicTopic(
          @Arg("value") value: number,
          @Arg("topic") topic: string,
        ): Promise<boolean> {
          pubSub.publish(topic, value);
          return true;
        }

        @Mutation(() => Boolean)
        async pubSubOtherMutation(@Arg("value") value: number): Promise<boolean> {
          pubSub.publish(OTHER_TOPIC, value);
          return true;
        }

        @Subscription({
          topics: SAMPLE_TOPIC,
        })
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

        @Subscription({
          topics: [SAMPLE_TOPIC, OTHER_TOPIC],
        })
        multipleTopicSubscription(@Root() value: number): SampleObject {
          return { value };
        }

        @Subscription({
          topics: ({ args }) => args.topic,
        })
        dynamicTopicSubscription(
          @Root() value: number,
          @Arg("topic") _topic: string,
        ): SampleObject {
          return { value };
        }

        @Subscription({
          subscribe: () => pubSub.subscribe(CUSTOM_SUBSCRIBE_TOPIC),
        })
        customSubscribeSubscription(@Root() value: number): SampleObject {
          return { value };
        }
      }

      schema = await buildSchema({
        resolvers: [SampleResolver],
        pubSub,
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
  });

  describe("errors", () => {
    it("should throw error when using subscriptions but not providing pub sub implementation", async () => {
      getMetadataStorage().clear();
      const error = await expectToThrow(async () => {
        class SampleResolver {
          @Query()
          dumbQuery(): boolean {
            return true;
          }

          @Subscription({ topics: "TEST" })
          sampleSubscription(): boolean {
            return true;
          }
        }

        await buildSchema({
          resolvers: [SampleResolver],
          pubSub: undefined,
        });
      });

      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(MissingPubSubError);
    });

    it("should throw error while passing empty topics array to Subscription", async () => {
      getMetadataStorage().clear();
      const error = await expectToThrow(async () => {
        class SampleResolver {
          @Query()
          dumbQuery(): boolean {
            return true;
          }

          @Mutation(() => Boolean)
          async pubSubMutation(@Arg("value") value: number): Promise<boolean> {
            pubSub.publish("TEST", value);
            return true;
          }

          @Subscription({ topics: [] })
          sampleSubscription(): boolean {
            return true;
          }
        }

        await buildSchema({
          resolvers: [SampleResolver],
          pubSub,
        });
      });

      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(MissingSubscriptionTopicsError);
      expect(error.message).toContain("SampleResolver");
      expect(error.message).toContain("sampleSubscription");
      expect(error.message).not.toContain("class SampleResolver");
    });

    it("should throw authorization error just on subscribe", async () => {
      getMetadataStorage().clear();
      // expect.assertions(3);

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
      const schema = await buildSchema({
        resolvers: [SampleResolver],
        pubSub,
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
