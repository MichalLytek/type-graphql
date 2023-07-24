import type { ClassType, TypeResolver } from "@/typings";

export type UnionMetadata = {
  getClassTypes: () => ClassType[];
  name: string;
  description?: string;
  resolveType?: TypeResolver<any, any>;
};
export type UnionMetadataWithSymbol = {
  symbol: symbol;
} & UnionMetadata;
