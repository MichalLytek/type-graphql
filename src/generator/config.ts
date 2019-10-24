import { DMMF } from "@prisma/photon";

export type BaseKeys = keyof Pick<DMMF.Mapping, "model" | "plural">;
export const baseKeys: BaseKeys[] = ["model", "plural"];

export type ModelKeys = keyof Exclude<DMMF.Mapping, BaseKeys>;

export type SupportedQueries = keyof Pick<
  DMMF.Mapping,
  "findOne" | "findMany" | "aggregate"
>;
export const supportedQueries: SupportedQueries[] = [
  "findOne",
  "findMany",
  "aggregate",
];

export type SupportedMutations = keyof Pick<
  DMMF.Mapping,
  "create" | "delete" | "update" | "updateMany" | "upsert"
>;
export const supportedMutations: SupportedMutations[] = [
  "create",
  "delete",
  "update",
  "updateMany",
  "upsert",
];

export const modelsFolderName = "models";
export const enumsFolderName = "enums";
