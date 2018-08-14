import { ClassType } from "../interfaces";

export type ArrayElementTypes<T extends any[]> = T extends Array<infer TElement> ? TElement : never;
export type InstanceSideOfClass<U extends ClassType> = U extends Function ? U["prototype"] : never;
