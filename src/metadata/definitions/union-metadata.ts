import { ClassType, TypeResolver } from "../../interfaces";

export interface UnionMetadata {
  classTypes: ClassType[];
  name: string;
  description?: string;
  resolveType?: TypeResolver<any, any>;
}
export interface UnionMetadataWithSymbol extends UnionMetadata {
  symbol: symbol;
}
