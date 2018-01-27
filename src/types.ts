export type Resolver<T extends object> = { [P in keyof T]?: (root: T) => T[P] } & {};

export type ReturnTypeFunc = (returnType: void) => any;
export interface TypeOptions {
  array?: boolean;
  nullable?: boolean;
}

export interface ClassType {
  new (): any;
}
