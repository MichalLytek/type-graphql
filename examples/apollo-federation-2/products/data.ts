import { Dining } from "./dining";
import { type Product } from "./product";
import { Seating } from "./seating";

export const products: Product[] = [
  Object.assign(new Dining(), {
    upc: "1",
    name: "Table",
    price: 899,
    weight: 100,
    height: "3ft",
  }),
  Object.assign(new Seating(), {
    upc: "2",
    name: "Couch",
    price: 1299,
    weight: 1000,
    seats: 2,
  }),
  Object.assign(new Seating(), {
    upc: "3",
    name: "Chair",
    price: 54,
    weight: 50,
    seats: 1,
  }),
];
