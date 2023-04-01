import type { TypeResolver } from "@/typings";
import type { ClassMetadata } from "./class-metadata";

export interface InterfaceClassMetadata extends ClassMetadata {
  resolveType?: TypeResolver<any, any>;
  autoRegisteringDisabled: boolean;
  interfaceClasses: Function[] | undefined;
}
