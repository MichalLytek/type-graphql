export interface ClassType<T = any> {
  new (...args: any[]): T;
}
