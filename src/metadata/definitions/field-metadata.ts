import { TypeOptions, TypeValueThunk } from "@/decorators/types";
import { Complexity } from "@/interfaces";
import { Middleware } from "@/interfaces/Middleware";
import { DirectiveMetadata } from "./directive-metadata";
import { ExtensionsMetadata } from "./extensions-metadata";
import { ParamMetadata } from "./param-metadata";

export interface FieldMetadata {
  target: Function;
  schemaName: string;
  name: string;
  getType: TypeValueThunk;
  typeOptions: TypeOptions;
  description: string | undefined;
  deprecationReason: string | undefined;
  complexity: Complexity | undefined;
  params?: ParamMetadata[];
  roles?: any[];
  middlewares?: Array<Middleware<any>>;
  directives?: DirectiveMetadata[];
  extensions?: ExtensionsMetadata;
  simple?: boolean;
}
