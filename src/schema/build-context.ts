import { GraphQLScalarType } from "graphql";

export type DateScalarMode = "isoDate" | "timestamp";

export interface ScalarsTypeMap {
  type: Function;
  scalar: GraphQLScalarType;
}

export interface BuildContextOptions {
  dateScalarMode: DateScalarMode;
  scalarsMap: ScalarsTypeMap[];
}

export abstract class BuildContext {
  static dateScalarMode: DateScalarMode;
  static scalarsMaps: ScalarsTypeMap[];

  static create(options: BuildContextOptions) {
    this.dateScalarMode = options.dateScalarMode;
    this.scalarsMaps = options.scalarsMap;
  }

  static clear() {
    this.dateScalarMode = "isoDate";
    this.scalarsMaps = [];
  }
}

// initialize fields
BuildContext.clear();
