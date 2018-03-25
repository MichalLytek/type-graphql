import { ClassType } from "../../types/decorators";

export interface UnionMetadata {
  types: ClassType[];
  name: string;
  description?: string;
}
export interface UnionMetadataWithSymbol extends UnionMetadata {
  symbol: symbol;
}
