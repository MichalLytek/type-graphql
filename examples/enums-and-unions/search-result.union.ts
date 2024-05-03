import { createUnionType } from "type-graphql";
import { Cook } from "./cook.type";
import { Recipe } from "./recipe.type";

export const SearchResult = createUnionType({
  name: "SearchResult",
  types: () => [Recipe, Cook] as const,
});
