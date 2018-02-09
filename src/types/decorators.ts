import { GraphQLScalarType } from "graphql";
import { ValidatorOptions } from "class-validator";

export type TypeValue = ClassType | GraphQLScalarType | Function;

export type TypeValueResolver = () => TypeValue;
export type ClassTypeResolver = () => ClassType | Function;

export type ReturnTypeFunc = (returnType: void) => TypeValue;

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
