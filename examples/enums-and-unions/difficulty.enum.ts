import { registerEnum } from "../../src";

export enum Difficulty {
  Beginner,
  Easy,
  Medium,
  Hard,
  Masterchef,
}

registerEnum(Difficulty, {
  name: "Difficulty",
  description: "All possible preparation difficulty levels",
});
