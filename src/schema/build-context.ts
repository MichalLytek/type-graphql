import { GraphQLScalarType } from "graphql";
import { ValidatorOptions } from "class-validator";

export type DateScalarMode = "isoDate" | "timestamp";

export interface ScalarsTypeMap {
  type: Function;
  scalar: GraphQLScalarType;
}

export interface BuildContextOptions {
  dateScalarMode: DateScalarMode;
  scalarsMap: ScalarsTypeMap[];
  /**
   * Indicates if class-validator should be used to auto validate objects injected into params.
   * You can also directly pass validator options to enable validator with a given options.
   */
  validate: boolean | ValidatorOptions;
}

export abstract class BuildContext {
  static dateScalarMode: DateScalarMode;
  static scalarsMaps: ScalarsTypeMap[];
  static validate: boolean | ValidatorOptions;

  /**
   * Set static fields with current building context data
   */
  static create(options: BuildContextOptions) {
    this.dateScalarMode = options.dateScalarMode;
    this.scalarsMaps = options.scalarsMap;
    this.validate = options.validate;
  }

  /**
   * Restore default settings
   */
  static clear() {
    this.dateScalarMode = "isoDate";
    this.scalarsMaps = [];
    this.validate = true;
  }
}

// initialize fields
BuildContext.clear();
