import { ParamMetadata } from "./param-metadata";
import { TypeValueThunk, TypeOptions } from "../../types/decorators";
import { Middleware } from "../../interfaces/Middleware";

export interface FieldMetadata {
  target: Function;
  name: string;
  getType: TypeValueThunk;
  typeOptions: TypeOptions;
  description: string | undefined;
  deprecationReason: string | undefined;
  params?: ParamMetadata[];
  roles?: string[];
  middlewares?: Array<Middleware<any>>;
}
