export declare function serializeRawParameters(data: any): string;
/**
 * Replaces Date as needed in https://github.com/prisma/prisma-engines/pull/835
 * @param data parameters
 */
export declare function replaceDates(data: any): any;
