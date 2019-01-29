import { GraphQLScalarType } from "graphql";
import { ValidatorOptions } from "class-validator";

import { ResolverFilterData, ClassType, ResolverTopicData, Complexity } from "../interfaces";
import { ClassMetadata, FieldMetadata } from "../metadata/definitions";

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
}

export type NullableListOptions = "items" | "itemsAndList";

export interface TypeOptions extends DecoratorTypeOptions {
  array?: boolean;
}
export interface DescriptionOptions {
  description?: string;
}
export interface DepreciationOptions {
  deprecationReason?: string;
}
export interface ValidateOptions {
  validate?: boolean | ValidatorOptions;
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
  transformModel?: TransformModel;
}

export type MethodAndPropDecorator = PropertyDecorator & MethodDecorator;

export interface ResolverClassOptions {
  isAbstract?: boolean;
}
