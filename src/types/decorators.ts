import { GraphQLScalarType } from "graphql";
import { ValidatorOptions } from "class-validator";

export type TypeValue = ClassType | GraphQLScalarType | Function | object;
export type ReturnTypeFuncValue = TypeValue | [TypeValue];

export type TypeValueThunk = (type?: void) => TypeValue;
export type ClassTypeResolver = (classType?: void) => ClassType;

export type ReturnTypeFunc = (returnType?: void) => ReturnTypeFuncValue;

export interface TypeOptions {
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

export interface ClassType {
  new (): any;
}

export interface EnumConfig {
  name: string;
  description?: string;
}
