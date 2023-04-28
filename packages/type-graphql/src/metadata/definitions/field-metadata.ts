import type { TypeOptions, TypeValueThunk } from "@/decorators/types";
import type { Complexity } from "@/typings";
import type { Middleware } from "@/typings/Middleware";
import type { DirectiveMetadata } from "./directive-metadata";
import type { ExtensionsMetadata } from "./extensions-metadata";
import type { ParamMetadata } from "./param-metadata";

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
