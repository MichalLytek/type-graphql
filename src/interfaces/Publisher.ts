export type Publisher<T> = (payload: T) => Promise<void>;
