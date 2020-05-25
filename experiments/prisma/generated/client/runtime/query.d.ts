import { /*dmmf, */ DMMFClass } from './dmmf';
import { DMMF } from './dmmf-types';
import { ArgError, FieldError, InvalidArgError, InvalidFieldError } from './error-types';
import { MissingItem } from './utils/printJsonErrors';
export declare class Document {
    readonly type: 'query' | 'mutation';
    readonly children: Field[];
    constructor(type: 'query' | 'mutation', children: Field[]);
    toString(): string;
    validate(select?: any, isTopLevelQuery?: boolean, originalMethod?: string, errorFormat?: 'pretty' | 'minimal' | 'colorless', validationCallsite?: any): void;
    protected printFieldError: ({ error, path }: FieldError, missingItems: MissingItem[], minimal: boolean) => string;
    protected printArgError: ({ error, path }: ArgError, hasMissingItems: boolean, minimal: boolean) => string;
    /**
     * As we're allowing both single objects and array of objects for list inputs, we need to remove incorrect
     * zero indexes from the path
     * @param inputPath e.g. ['where', 'AND', 0, 'id']
     * @param select select object
     */
    private normalizePath;
}
export declare class PrismaClientValidationError extends Error {
}
export interface FieldArgs {
    name: string;
    schemaField?: DMMF.SchemaField;
    args?: Args;
    children?: Field[];
    error?: InvalidFieldError;
}
export declare class Field {
    readonly name: string;
    readonly args?: Args;
    readonly children?: Field[];
    readonly error?: InvalidFieldError;
    readonly hasInvalidChild: boolean;
    readonly hasInvalidArg: boolean;
    readonly schemaField?: DMMF.SchemaField;
    constructor({ name, args, children, error, schemaField }: FieldArgs);
    toString(): string;
    collectErrors(prefix?: string): {
        fieldErrors: FieldError[];
        argErrors: ArgError[];
    };
}
export declare class Args {
    readonly args: Arg[];
    readonly hasInvalidArg: boolean;
    constructor(args?: Arg[]);
    toString(): string;
    collectErrors(): ArgError[];
}
interface ArgOptions {
    key: string;
    value: ArgValue;
    argType?: DMMF.ArgType;
    isEnum?: boolean;
    error?: InvalidArgError;
    schemaArg?: DMMF.SchemaArg;
}
export declare class Arg {
    readonly key: string;
    readonly value: ArgValue;
    readonly error?: InvalidArgError;
    readonly hasError: boolean;
    readonly isEnum: boolean;
    readonly schemaArg?: DMMF.SchemaArg;
    readonly argType?: DMMF.ArgType;
    readonly isNullable: boolean;
    constructor({ key, value, argType, isEnum, error, schemaArg, }: ArgOptions);
    _toString(value: ArgValue, key: string): string | undefined;
    toString(): string;
    collectErrors(): ArgError[];
}
export declare type ArgValue = string | boolean | number | undefined | Args | string[] | boolean[] | number[] | Args[] | null;
export interface DocumentInput {
    dmmf: DMMFClass;
    rootTypeName: 'query' | 'mutation';
    rootField: string;
    select?: any;
}
export declare function makeDocument({ dmmf, rootTypeName, rootField, select, }: DocumentInput): Document;
export declare function transformDocument(document: Document): Document;
export declare function selectionToFields(dmmf: DMMFClass, selection: any, schemaField: DMMF.SchemaField, path: string[]): Field[];
export declare function isInputArgType(argType: DMMF.ArgType): argType is DMMF.InputType;
export interface UnpackOptions {
    document: Document;
    path: string[];
    data: any;
}
/**
 * Unpacks the result of a data object and maps DateTime fields to instances of `Date` inplace
 * @param options: UnpackOptions
 */
export declare function unpack({ document, path, data }: UnpackOptions): any;
export interface MapDatesOptions {
    field: Field;
    data: any;
}
export declare function mapDates({ field, data }: MapDatesOptions): any;
export declare function mapJson({ field, data }: MapDatesOptions): any;
export declare function getField(document: Document, path: string[]): Field;
export {};
