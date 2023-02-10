import { TypeResolver } from "@/interfaces";
import { ClassMetadata } from "./class-metadata";

export interface InterfaceClassMetadata extends ClassMetadata {
  resolveType?: TypeResolver<any, any>;
  autoRegisteringDisabled: boolean;
  interfaceClasses: Function[] | undefined;
}
