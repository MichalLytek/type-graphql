import { EnumFieldsConfig } from "../../decorators/types";

export interface EnumMetadata {
  enumObj: object;
  name: string;
  description: string | undefined;
  fieldsConfig: EnumFieldsConfig<any>;
}
