import { GraphQLScalarType } from "graphql";
import { ValidatorOptions } from "class-validator";

import { ResolverFilterData, ClassType, ResolverTopicData, Complexity } from "../interfaces";
import { ClassMetadata, FieldMetadata } from "../metadata/definitions";

export type ModelTransformType = "ObjectType" | "InputType" | "ArgsType";

export type TypeValue = ClassType | GraphQLScalarType | Function | object | symbol | string;
export type ReturnTypeFuncValue = TypeValue | [TypeValue];

export type TypeValueThunk = (type?: void) => TypeValue;
export type ClassTypeResolver = (of?: void) => ClassType;

export type ReturnTypeFunc = (returns?: void) => ReturnTypeFuncValue;

export type SubscriptionFilterFunc = (
  resolverFilterData: ResolverFilterData<any, any, any>,
) => boolean | Promise<boolean>;

export type SubscriptionTopicFunc = (
  resolverTopicData: ResolverTopicData<any, any, any>,
) => string | string[];

export interface DecoratorTypeOptions {
  nullable?: boolean | NullableListOptions;
  defaultValue?: any;
  model?: Function;
}

export type NullableListOptions = "items" | "itemsAndList";

export interface TypeOptions extends DecoratorTypeOptions {
  array?: boolean;
  type?: Function;
}
export interface DescriptionOptions {
  description?: string;
}
export interface DepreciationOptions {
  deprecationReason?: string;
}
export interface ValidateOptions {
  validate?: boolean | ValidatorOptions;
  type?: Function;
}
export interface ComplexityOptions {
  complexity?: Complexity;
}
export interface SchemaNameOptions {
  name?: string;
}
export type BasicOptions = DecoratorTypeOptions & DescriptionOptions;
export type AdvancedOptions = BasicOptions &
  DepreciationOptions &
  SchemaNameOptions &
  ComplexityOptions;

export interface EnumConfig {
  name: string;
  description?: string;
}

export interface TransformModel {
  apply?: (field: FieldMetadata) => void;
  nullable?: boolean;
}
export interface ModelOptions {
  models?: Function[];
  type?: ModelTransformType;
  transformModel?: TransformModel;
}
export interface DestinationOptions {
  nullable?: boolean;
  transformModel?: TransformModel;
}

export type MethodAndPropDecorator = PropertyDecorator & MethodDecorator;

export interface ResolverClassOptions {
  isAbstract?: boolean;
}
