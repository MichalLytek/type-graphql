import { GraphQLScalarType } from "graphql";
import { ValidatorOptions } from "class-validator";

import { ResolverFilterData, ClassType, ResolverTopicData, Complexity } from "../interfaces";
import { FieldMetadata } from "../metadata/definitions";

export type GqlTypes = "ObjectType" | "InputType" | "ArgsType";

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
  generic?: Function;
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

export interface TransformFields {
  apply?: (field: FieldMetadata) => void;
  nullable?: boolean;
}
export interface GenericBaseOptions {
  transformFields?: TransformFields;
}
export interface GenericTypeOptions extends GenericBaseOptions {
  types?: Function[];
  gqlType?: GqlTypes;
}
export interface GenericFieldOptions extends GenericBaseOptions {
  array?: boolean;
  nullable?: boolean;
}

export type MethodAndPropDecorator = PropertyDecorator & MethodDecorator;

export interface ResolverClassOptions {
  isAbstract?: boolean;
}
