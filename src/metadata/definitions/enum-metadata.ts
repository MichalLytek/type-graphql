import { EnumValuesConfig } from "~/decorators/types";

export interface EnumMetadata {
  enumObj: object;
  name: string;
  description: string | undefined;
  valuesConfig: EnumValuesConfig<any>;
}
