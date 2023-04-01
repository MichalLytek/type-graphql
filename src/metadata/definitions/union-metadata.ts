import type { ClassType, TypeResolver } from "@/typings";

export interface UnionMetadata {
  getClassTypes: () => ClassType[];
  name: string;
  description?: string;
  resolveType?: TypeResolver<any, any>;
}
export interface UnionMetadataWithSymbol extends UnionMetadata {
  symbol: symbol;
}
