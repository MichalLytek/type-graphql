import { GraphQLScalarType } from "graphql";
import { ValidatorOptions } from "class-validator";

import { ResolverFilterData, ClassType, ResolverTopicData } from "../interfaces";

export type TypeValue = ClassType | GraphQLScalarType | Function | object | symbol;
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
  nullable?: boolean;
}
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
export interface SchemaNameOptions {
  name?: string;
}
export type BasicOptions = DecoratorTypeOptions & DescriptionOptions;
export type AdvancedOptions = BasicOptions & DepreciationOptions & SchemaNameOptions;

export interface EnumConfig {
  name: string;
  description?: string;
}

export type MethodAndPropDecorator = PropertyDecorator & MethodDecorator;

export interface ResolverClassOptions {
  isAbstract?: boolean;
}
