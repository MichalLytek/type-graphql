import type { ClassMetadata } from "./class-metadata";

export type ObjectClassMetadata = {
  interfaceClasses: Function[] | undefined;
} & ClassMetadata;
