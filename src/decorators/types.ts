import { GraphQLScalarType } from "graphql";
import { ValidatorOptions } from "class-validator";
import { ComplexityEstimator } from "graphql-query-complexity";

import { ResolverFilterData, ClassType } from "../interfaces";

export type TypeValue = ClassType | GraphQLScalarType | Function | object | symbol;
export type ReturnTypeFuncValue = TypeValue | [TypeValue];

export type TypeValueThunk = (type?: void) => TypeValue;
export type ClassTypeResolver = (of?: void) => ClassType;

export type ReturnTypeFunc = (returns?: void) => ReturnTypeFuncValue;

export type SubscriptionFilterFunc = (
  resolverFilterData: ResolverFilterData<any, any, any>,
) => boolean | Promise<boolean>;

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
export interface ComplexityOptions {
  complexity?: ComplexityEstimator | number;
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

export type MethodAndPropDecorator = PropertyDecorator & MethodDecorator;

export interface ResolverClassOptions {
  isAbstract?: boolean;
}
