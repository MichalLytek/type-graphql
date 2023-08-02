import { type ClassType, type TypeResolver } from "@/typings";

export interface UnionMetadata {
  getClassTypes: () => ClassType[];
  name: string;
  description?: string;
  resolveType?: TypeResolver<any, any>;
}
export type UnionMetadataWithSymbol = {
  symbol: symbol;
} & UnionMetadata;
