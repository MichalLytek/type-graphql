import { plainToClass } from "class-transformer";

import Product from "./product";

export const products: Product[] = plainToClass(Product, [
  {
    upc: "1",
    name: "Table",
    price: 899,
    weight: 100,
  },
  {
    upc: "2",
    name: "Couch",
    price: 1299,
    weight: 1000,
  },
  {
    upc: "3",
    name: "Chair",
    price: 54,
    weight: 50,
  },
]);
