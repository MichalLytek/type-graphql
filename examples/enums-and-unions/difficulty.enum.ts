import { registerEnumType } from "type-graphql";

export enum Difficulty {
  Beginner,
  Easy,
  Medium,
  Hard,
  MasterChef,
}

registerEnumType(Difficulty, {
  name: "Difficulty",
  description: "All possible preparation difficulty levels",
});
