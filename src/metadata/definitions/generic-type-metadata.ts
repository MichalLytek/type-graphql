import { FieldMetadata } from "./field-metadata";
import { GenericTypeOptions } from "../../decorators/types";
import { BaseClassMetadata } from ".";

export interface GenericTypeMetadata extends GenericTypeOptions, BaseClassMetadata {
  fields?: FieldMetadata[];
}
