import type { EnumValuesConfig } from "@/decorators/types";

export type EnumMetadata = {
  enumObj: object;
  name: string;
  description: string | undefined;
  valuesConfig: EnumValuesConfig<any>;
};
