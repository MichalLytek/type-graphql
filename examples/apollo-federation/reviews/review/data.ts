import { plainToClass } from "class-transformer";

import Review from "./review";

export const reviews: Review[] = plainToClass(Review, [
  {
    id: "1",
    author: { id: "1", username: "@ada" },
    product: { upc: "1" },
    body: "Love it!",
  },
  {
    id: "2",
    author: { id: "1", username: "@ada" },
    product: { upc: "2" },
    body: "Too expensive.",
  },
  {
    id: "3",
    author: { id: "2", username: "@complete" },
    product: { upc: "3" },
    body: "Could be better.",
  },
  {
    id: "4",
    author: { id: "2", username: "@complete" },
    product: { upc: "1" },
    body: "Prefer something else.",
  },
]);
