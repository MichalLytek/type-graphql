/// <reference types="node" />

export { DMMF } from './dmmf-types'
import { inspect } from "util";
export declare type Value = string | number | boolean | object | null | undefined;
export declare type RawValue = Value | Sql;

/**
 * A SQL instance can be nested within each other to build SQL strings.
 */
export declare class Sql {
    values: Value[];
    strings: string[];
    rawStrings: ReadonlyArray<string>;
    rawValues: ReadonlyArray<RawValue>;
    constructor(rawStrings: ReadonlyArray<string>, rawValues: ReadonlyArray<RawValue>);
    readonly text: string;
    readonly sql: string;
    [inspect.custom](): {
        text: string;
        sql: string;
        values: Value[];
    };
}
/**
 * Create a SQL query for a list of values.
 */
export declare function join(values: RawValue[], separator?: string): Sql;
/**
 * Create raw SQL statement.
 */
export declare function raw(value: string): Sql;
/**
 * Placeholder value for "no text".
 */
export declare const empty: Sql;
/**
 * Create a SQL object from a template string.
 */
export declare function sqltag(strings: TemplateStringsArray, ...values: RawValue[]): Sql;
/**
 * Standard `sql` tag.
 */


export declare var Engine: any
export declare type Engine = any

// export declare var DMMF: any
// export declare type DMMF = any

export declare var DMMFClass: any
export declare type DMMFClass = any

export declare var deepGet: any
export declare type deepGet = any

export declare var chalk: any
export declare type chalk = any

export declare var deepSet: any
export declare type deepSet = any

export declare var makeDocument: any
export declare type makeDocument = any

export declare var transformDocument: any
export declare type transformDocument = any

export declare var debug: any
export declare type debug = any

export declare var debugLib: any
export declare type debugLib = any

export declare var InternalDatasource: any
export declare type InternalDatasource = any

export declare var Datasource: any
export declare type Datasource = any

export declare var printDatasources: any
export declare type printDatasources = any

export declare var printStack: any
export declare type printStack = any

export declare var mergeBy: any
export declare type mergeBy = any

export declare var unpack: any
export declare type unpack = any

export declare var getDMMF: any
export declare type getDMMF = any

export declare var stripAnsi: any
export declare type stripAnsi = any

export declare var parseDotenv: any
export declare type parseDotenv = any

export declare var sqlTemplateTag: any
export declare type sqlTemplateTag = any

export declare class PrismaClientKnownRequestError extends Error {
  code: string;
  meta?: object;
  constructor(message: string, code: string, meta?: any);
}

export declare class PrismaClientUnknownRequestError extends Error {
  constructor(message: string);
}

export declare class PrismaClientRustPanicError extends Error {
    constructor(message: string);
}

export declare class PrismaClientInitializationError extends Error {
    constructor(message: string);
}

export declare class PrismaClientValidationError extends Error {
    constructor(message: string);
}
