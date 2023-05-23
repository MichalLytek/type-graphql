export interface ClassType<TInstance extends object = object> {
  new (...args: any[]): TInstance;
}
