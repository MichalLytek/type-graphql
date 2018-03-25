import { ParamMetadata } from "./param-metadata";
import { TypeValueThunk, TypeOptions } from "../../types/decorators";

export interface FieldMetadata {
  target: Function;
  name: string;
  getType: TypeValueThunk;
  typeOptions: TypeOptions;
  params?: ParamMetadata[];
  description?: string;
  deprecationReason?: string;
  roles?: string[];
}
