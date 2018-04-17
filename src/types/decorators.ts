import { GraphQLScalarType } from "graphql";
import { ValidatorOptions } from "class-validator";

import { FilterActionData } from "./index";

export type TypeValue = ClassType | GraphQLScalarType | Function | object | symbol;
export type ReturnTypeFuncValue = TypeValue | [TypeValue];

export type TypeValueThunk = (type?: void) => TypeValue;
export type ClassTypeResolver = (classType?: void) => ClassType;

export type ReturnTypeFunc = (returnType?: void) => ReturnTypeFuncValue;

export type SubscriptionFilterFunc = (
  actionData: FilterActionData<any, any, any>,
) => boolean | Promise<boolean>;

export interface TypeOptions {
  /**
   * Used to annotate the type as an Array (TS reflection system limitation)
   * @deprecated use array syntax `type => [ItemType]` notation instead
   */
  array?: boolean;
  nullable?: boolean;
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
export type BasicOptions = TypeOptions & DescriptionOptions;
export type AdvancedOptions = BasicOptions & DepreciationOptions;

export interface ClassType<T = any> {
  new (): T;
}

export interface EnumConfig {
  name: string;
  description?: string;
}
