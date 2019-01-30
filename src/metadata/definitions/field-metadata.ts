import { ParamMetadata } from "./param-metadata";
import { TypeValueThunk, TypeOptions } from "../../decorators/types";
import { Middleware } from "../../interfaces/Middleware";
import { Complexity } from "../../interfaces";

export interface FieldMetadata {
  target: Function;
  schemaName: string;
  name: string;
  getType: TypeValueThunk;
  typeOptions: TypeOptions;
  description: string | undefined;
  deprecationReason: string | undefined;
  complexity: Complexity | undefined;
  getter: boolean;
  setter: boolean;
  isAccessor: boolean;
  destinationField?: boolean;
  params?: ParamMetadata[];
  roles?: any[];
  fieldResolver?: boolean;
  fields?: FieldMetadata[];
  middlewares?: Array<Middleware<any>>;
}
