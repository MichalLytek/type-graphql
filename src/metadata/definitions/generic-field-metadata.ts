import {
  TypeValueThunk,
  TypeOptions,
  TransformFields,
  GenericFieldOptions,
} from "../../decorators/types";
import { BaseClassMetadata, FieldMetadata } from ".";

export interface GenericFieldMetadata extends GenericFieldOptions, BaseClassMetadata {}
