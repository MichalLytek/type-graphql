import { type EnumValuesConfig } from "@/decorators/types";
import { type DirectiveMetadata } from "./directive-metadata";

export interface EnumMetadata {
  enumObj: object;
  name: string;
  description: string | undefined;
  valuesConfig: EnumValuesConfig<any>;
  directives?: DirectiveMetadata[];
}
