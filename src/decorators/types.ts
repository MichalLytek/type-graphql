import type { GraphQLScalarType } from "graphql";
import type { ValidateSettings } from "@/schema/build-context";
import type {
  ClassType,
  Complexity,
  ResolverFilterData,
  ResolverTopicData,
  TypeResolver,
} from "@/typings";

export type RecursiveArray<TValue> = Array<RecursiveArray<TValue> | TValue>;

export type TypeValue = ClassType | GraphQLScalarType | Function | object | symbol;
export type ReturnTypeFuncValue = TypeValue | RecursiveArray<TypeValue>;

export type TypeValueThunk = (type?: void) => TypeValue;
export type ClassTypeResolver = (of?: void) => ClassType | Function;

export type ReturnTypeFunc = (returns?: void) => ReturnTypeFuncValue;

export type SubscriptionFilterFunc = (
  resolverFilterData: ResolverFilterData<any, any, any>,
) => boolean | Promise<boolean>;

export type SubscriptionTopicFunc = (
  resolverTopicData: ResolverTopicData<any, any, any>,
) => string | string[];

export type DecoratorTypeOptions = {
  nullable?: boolean | NullableListOptions;
  defaultValue?: any;
};

export type NullableListOptions = "items" | "itemsAndList";

export type TypeOptions = {
  array?: boolean;
  arrayDepth?: number;
} & DecoratorTypeOptions;
export type DescriptionOptions = {
  description?: string;
};
export type DeprecationOptions = {
  deprecationReason?: string;
};
export type ValidateOptions = {
  validate?: ValidateSettings;
};
export type ComplexityOptions = {
  complexity?: Complexity;
};
export type SchemaNameOptions = {
  name?: string;
};
export type ImplementsClassOptions = {
  implements?: Function | Function[];
};
export type ResolveTypeOptions<TSource = any, TContext = any> = {
  resolveType?: TypeResolver<TSource, TContext>;
};
export type BasicOptions = DecoratorTypeOptions & DescriptionOptions;
export type AdvancedOptions = BasicOptions &
  DeprecationOptions &
  SchemaNameOptions &
  ComplexityOptions;

export type EnumConfig<TEnum extends object> = {
  name: string;
  description?: string;
  valuesConfig?: EnumValuesConfig<TEnum>;
};
export type EnumValuesConfig<TEnum extends object> = Partial<
  Record<keyof TEnum, DescriptionOptions & DeprecationOptions>
>;

export type MethodAndPropDecorator = PropertyDecorator & MethodDecorator;
