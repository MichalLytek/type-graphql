import type { Class, TypeResolver } from "@/typings";

export interface UnionMetadata {
  getClassTypes: () => Class[];
  name: string;
  description?: string;
  resolveType?: TypeResolver<any, any>;
}
export interface UnionMetadataWithSymbol extends UnionMetadata {
  symbol: symbol;
}
