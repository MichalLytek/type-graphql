import Review from "./review";
import User from "../user/user";
import Product from "../product/product";

export const reviews: Review[] = [
  createReview({
    id: "1",
    author: createUser({
      id: "1",
      username: "@ada",
    }),
    product: createProduct({
      upc: "1",
    }),
    body: "Love it!",
  }),
  createReview({
    id: "2",
    author: createUser({
      id: "1",
      username: "@ada",
    }),
    product: createProduct({
      upc: "2",
    }),
    body: "Too expensive.",
  }),
  createReview({
    id: "3",
    author: createUser({
      id: "2",
      username: "@complete",
    }),
    product: createProduct({
      upc: "3",
    }),
    body: "Could be better.",
  }),
  createReview({
    id: "4",
    author: createUser({
      id: "2",
      username: "@complete",
    }),
    product: createProduct({
      upc: "1",
    }),
    body: "Prefer something else.",
  }),
];

function createReview(reviewData: Partial<Review>) {
  return Object.assign(new Review(), reviewData);
}

function createUser(userData: Partial<User>) {
  return Object.assign(new User(), userData);
}

function createProduct(productData: Partial<Product>) {
  return Object.assign(new Product(), productData);
}
