import { ClassType } from "../../decorators/types";

export interface UnionMetadata {
  types: ClassType[];
  name: string;
  description?: string;
}
export interface UnionMetadataWithSymbol extends UnionMetadata {
  symbol: symbol;
}
