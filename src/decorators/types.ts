import { type GraphQLScalarType } from "graphql";
import { type ValidateSettings } from "@/schema/build-context";
import {
  type ClassType,
  type Complexity,
  type MaybePromise,
  type SubscribeResolverData,
  type SubscriptionHandlerData,
  type TypeResolver,
  type ValidatorFn,
} from "@/typings";

export type RecursiveArray<TValue> = Array<RecursiveArray<TValue> | TValue>;

export type TypeValue = ClassType | GraphQLScalarType | Function | object | symbol;
export type ReturnTypeFuncValue = TypeValue | RecursiveArray<TypeValue>;

export type TypeValueThunk = (type?: void) => TypeValue;
export type ClassTypeResolver = (of?: void) => ClassType | Function;

export type ReturnTypeFunc = (returns?: void) => ReturnTypeFuncValue;

export type SubscriptionFilterFunc = (
  handlerData: SubscriptionHandlerData<any, any, any>,
) => boolean | Promise<boolean>;

export type SubscriptionTopicsFunc = (
  resolverData: SubscribeResolverData<any, any, any>,
) => string | string[];

export type SubscriptionSubscribeFunc = (
  resolverData: SubscribeResolverData<any, any, any>,
) => MaybePromise<AsyncIterable<any>>;

export type SubscriptionTopicIdFunc = (resolverData: SubscribeResolverData<any, any, any>) => any;

export interface DecoratorTypeOptions {
  nullable?: boolean | NullableListOptions;
  defaultValue?: any;
}

export type NullableListOptions = "items" | "itemsAndList";

export interface TypeOptions extends DecoratorTypeOptions {
  array?: boolean;
  arrayDepth?: number;
}
export interface DescriptionOptions {
  description?: string;
}
export interface DeprecationOptions {
  deprecationReason?: string;
}
export interface ValidateOptions {
  validate?: ValidateSettings;
  validateFn?: ValidatorFn;
}
export interface ComplexityOptions {
  complexity?: Complexity;
}
export interface SchemaNameOptions {
  name?: string;
}
export interface ImplementsClassOptions {
  implements?: Function | Function[];
}
export interface ResolveTypeOptions<TSource = any, TContext = any> {
  resolveType?: TypeResolver<TSource, TContext>;
}
export type BasicOptions = DecoratorTypeOptions & DescriptionOptions;
export type AdvancedOptions = BasicOptions &
  DeprecationOptions &
  SchemaNameOptions &
  ComplexityOptions;

export interface EnumConfig<TEnum extends object> {
  name: string;
  description?: string;
  valuesConfig?: EnumValuesConfig<TEnum>;
}
export type EnumValuesConfig<TEnum extends object> = Partial<
  Record<keyof TEnum, DescriptionOptions & DeprecationOptions>
>;

export type MethodAndPropDecorator = PropertyDecorator & MethodDecorator;
