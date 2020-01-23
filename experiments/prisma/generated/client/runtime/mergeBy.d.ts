/**
 * Merge two arrays, their elements uniqueness decided by the callback.
 * In case of a duplicate, elements of `arr2` are taken.
 * If there is a duplicate within an array, the last element is being taken.
 * @param arr1 Base array
 * @param arr2 Array to overwrite the first one if there is a match
 * @param cb The function to calculate uniqueness
 */
export declare function mergeBy<T>(arr1: T[], arr2: T[], cb: (element: T) => string): T[];
