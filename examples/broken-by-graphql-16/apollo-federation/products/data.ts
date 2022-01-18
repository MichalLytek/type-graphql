import Product from "./product";

export const products: Product[] = [
  createProduct({
    upc: "1",
    name: "Table",
    price: 899,
    weight: 100,
  }),
  createProduct({
    upc: "2",
    name: "Couch",
    price: 1299,
    weight: 1000,
  }),
  createProduct({
    upc: "3",
    name: "Chair",
    price: 54,
    weight: 50,
  }),
];

function createProduct(productData: Partial<Product>) {
  return Object.assign(new Product(), productData);
}
