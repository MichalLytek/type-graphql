import { ClassMetadata } from "./class-metadata";
import { TypeResolver } from "../../interfaces";

export interface InterfaceClassMetadata extends ClassMetadata {
  resolveType?: TypeResolver<any, any>;
  autoRegisteringDisabled: boolean;
  interfaceClasses: Function[] | undefined;
}
