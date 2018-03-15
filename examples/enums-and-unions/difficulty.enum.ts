import { registerEnumType } from "../../src";

export enum Difficulty {
  Beginner,
  Easy,
  Medium,
  Hard,
  Masterchef,
}

registerEnumType(Difficulty, {
  name: "Difficulty",
  description: "All possible preparation difficulty levels",
});
