export interface Inventory {
  upc: string;
  inStock: boolean;
}

export const inventory: Inventory[] = [
  { upc: "1", inStock: true },
  { upc: "2", inStock: false },
  { upc: "3", inStock: true },
];
