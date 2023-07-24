import type { TypeResolver } from "@/typings";
import type { ClassMetadata } from "./class-metadata";

export type InterfaceClassMetadata = {
  resolveType?: TypeResolver<any, any>;
  autoRegisteringDisabled: boolean;
  interfaceClasses: Function[] | undefined;
} & ClassMetadata;
