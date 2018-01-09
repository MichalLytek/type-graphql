export type Resolver<T extends object> = {
  [P in keyof T]?: (root: T) => T[P];
} & {};
