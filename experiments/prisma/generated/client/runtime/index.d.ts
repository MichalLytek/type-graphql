/// <reference types="node" />
import { inspect } from 'util';

declare namespace DMMF {
    interface Document {
        datamodel: Datamodel;
        schema: Schema;
        mappings: Mapping[];
    }
    interface DatamodelEnum {
        name: string;
        values: EnumValue[];
        dbName?: string | null;
        documentation?: string;
    }
    interface SchemaEnum {
        name: string;
        values: string[];
    }
    interface EnumValue {
        name: string;
        dbName: string | null;
    }
    interface Datamodel {
        models: Model[];
        enums: DatamodelEnum[];
    }
    interface uniqueIndex {
        name: string;
        fields: string[];
    }
    interface Model {
        name: string;
        isEmbedded: boolean;
        dbName: string | null;
        fields: Field[];
        fieldMap?: Record<string, Field>;
        uniqueFields: string[][];
        uniqueIndexes: uniqueIndex[];
        documentation?: string;
        idFields: string[];
        [key: string]: any;
    }
    type FieldKind = 'scalar' | 'object' | 'enum';
    interface Field {
        kind: FieldKind;
        name: string;
        isRequired: boolean;
        isList: boolean;
        isUnique: boolean;
        isId: boolean;
        type: string;
        dbNames?: string[] | null;
        isGenerated: boolean;
        hasDefaultValue: boolean;
        default?: FieldDefault | string | boolean | number;
        relationToFields?: any[];
        relationOnDelete?: string;
        relationName?: string;
        documentation?: string;
        [key: string]: any;
    }
    interface FieldDefault {
        name: string;
        args: any[];
    }
    interface Schema {
        rootQueryType?: string;
        rootMutationType?: string;
        inputTypes: InputType[];
        outputTypes: OutputType[];
        enums: SchemaEnum[];
    }
    interface Query {
        name: string;
        args: SchemaArg[];
        output: QueryOutput;
    }
    interface QueryOutput {
        name: string;
        isRequired: boolean;
        isList: boolean;
    }
    type ArgType = string | InputType | SchemaEnum;
    interface SchemaArgInputType {
        isList: boolean;
        type: ArgType;
        kind: FieldKind;
    }
    interface SchemaArg {
        name: string;
        comment?: string;
        isNullable: boolean;
        isRequired: boolean;
        inputTypes: SchemaArgInputType[];
    }
    interface OutputType {
        name: string;
        fields: SchemaField[];
        fieldMap?: Record<string, SchemaField>;
        isEmbedded?: boolean;
    }
    interface SchemaField {
        name: string;
        isRequired: boolean;
        isNullable?: boolean;
        outputType: {
            type: string | OutputType | SchemaEnum;
            isList: boolean;
            kind: FieldKind;
        };
        args: SchemaArg[];
    }
    interface InputType {
        name: string;
        constraints: {
            maxNumFields: number | null;
            minNumFields: number | null;
        };
        fields: SchemaArg[];
        fieldMap?: Record<string, SchemaArg>;
    }
    interface Mapping {
        model: string;
        plural: string;
        findOne?: string | null;
        findFirst?: string | null;
        findMany?: string | null;
        create?: string | null;
        update?: string | null;
        updateMany?: string | null;
        upsert?: string | null;
        delete?: string | null;
        deleteMany?: string | null;
        aggregate?: string | null;
    }
    enum ModelAction {
        findOne = "findOne",
        findFirst = "findFirst",
        findMany = "findMany",
        create = "create",
        update = "update",
        updateMany = "updateMany",
        upsert = "upsert",
        delete = "delete",
        deleteMany = "deleteMany"
    }
}

declare type Dictionary<T> = {
    [key: string]: T;
};
interface GeneratorConfig {
    name: string;
    output: string | null;
    isCustomOutput?: boolean;
    provider: string;
    config: Dictionary<string>;
    binaryTargets: string[];
    previewFeatures: string[];
}
interface EnvValue {
    fromEnvVar: null | string;
    value: string;
}
declare type ConnectorType = 'mysql' | 'mongo' | 'sqlite' | 'postgresql' | 'sqlserver';
interface DataSource {
    name: string;
    activeProvider: ConnectorType;
    provider: ConnectorType[];
    url: EnvValue;
    config: {
        [key: string]: string;
    };
}

interface Dictionary$1<T> {
    [key: string]: T;
}

declare class DMMFClass implements DMMF.Document {
    datamodel: DMMF.Datamodel;
    schema: DMMF.Schema;
    mappings: DMMF.Mapping[];
    queryType: DMMF.OutputType;
    mutationType: DMMF.OutputType;
    outputTypes: DMMF.OutputType[];
    outputTypeMap: Dictionary$1<DMMF.OutputType>;
    inputTypes: DMMF.InputType[];
    inputTypeMap: Dictionary$1<DMMF.InputType>;
    enumMap: Dictionary$1<DMMF.SchemaEnum>;
    modelMap: Dictionary$1<DMMF.Model>;
    mappingsMap: Dictionary$1<DMMF.Mapping>;
    rootFieldMap: Dictionary$1<DMMF.SchemaField>;
    constructor({ datamodel, schema, mappings }: DMMF.Document);
    protected outputTypeToMergedOutputType: (outputType: DMMF.OutputType) => DMMF.OutputType;
    protected resolveOutputTypes(types: DMMF.OutputType[]): void;
    protected resolveInputTypes(types: DMMF.InputType[]): void;
    protected resolveFieldArgumentTypes(types: DMMF.OutputType[], inputTypeMap: Dictionary$1<DMMF.InputType>): void;
    protected getQueryType(): DMMF.OutputType;
    protected getMutationType(): DMMF.OutputType;
    protected getOutputTypes(): DMMF.OutputType[];
    protected getEnumMap(): Dictionary$1<DMMF.SchemaEnum>;
    protected getModelMap(): Dictionary$1<DMMF.Model>;
    protected getMergedOutputTypeMap(): Dictionary$1<DMMF.OutputType>;
    protected getInputTypeMap(): Dictionary$1<DMMF.InputType>;
    protected getMappingsMap(): Dictionary$1<DMMF.Mapping>;
    protected getRootFieldMap(): Dictionary$1<DMMF.SchemaField>;
}

interface ArgError {
    path: string[];
    error: InvalidArgError;
}
interface FieldError {
    path: string[];
    error: InvalidFieldError;
}
declare type InvalidFieldError = InvalidFieldNameError | InvalidFieldTypeError | EmptySelectError | NoTrueSelectError | IncludeAndSelectError | EmptyIncludeError;
interface InvalidFieldTypeError {
    type: 'invalidFieldType';
    modelName: string;
    fieldName: string;
    providedValue: any;
}
interface InvalidFieldNameError {
    type: 'invalidFieldName';
    modelName: string;
    didYouMean?: string | null;
    providedName: string;
    isInclude?: boolean;
    isIncludeScalar?: boolean;
    outputType: DMMF.OutputType;
}
interface EmptySelectError {
    type: 'emptySelect';
    field: DMMF.SchemaField;
}
interface EmptyIncludeError {
    type: 'emptyInclude';
    field: DMMF.SchemaField;
}
interface NoTrueSelectError {
    type: 'noTrueSelect';
    field: DMMF.SchemaField;
}
interface IncludeAndSelectError {
    type: 'includeAndSelect';
    field: DMMF.SchemaField;
}
declare type InvalidArgError = InvalidArgNameError | MissingArgError | InvalidArgTypeError | AtLeastOneError | AtMostOneError | InvalidNullArgError;
/**
 * This error occurs if the user provides an arg name that doens't exist
 */
interface InvalidArgNameError {
    type: 'invalidName';
    providedName: string;
    providedValue: any;
    didYouMeanArg?: string;
    didYouMeanField?: string;
    originalType: DMMF.ArgType;
    possibilities?: DMMF.SchemaArgInputType[];
    outputType?: DMMF.OutputType;
}
/**
 * Opposite of InvalidArgNameError - if the user *doesn't* provide an arg that should be provided
 * This error both happens with an implicit and explicit `undefined`
 */
interface MissingArgError {
    type: 'missingArg';
    missingName: string;
    missingArg: DMMF.SchemaArg;
    atLeastOne: boolean;
    atMostOne: boolean;
}
/**
 * If a user incorrectly provided null where she shouldn't have
 */
interface InvalidNullArgError {
    type: 'invalidNullArg';
    name: string;
    invalidType: DMMF.SchemaArgInputType[];
    atLeastOne: boolean;
    atMostOne: boolean;
}
interface AtMostOneError {
    type: 'atMostOne';
    key: string;
    inputType: DMMF.InputType;
    providedKeys: string[];
}
interface AtLeastOneError {
    type: 'atLeastOne';
    key: string;
    inputType: DMMF.InputType;
}
/**
 * If the scalar type of an arg is not matching what is required
 */
interface InvalidArgTypeError {
    type: 'invalidType';
    argName: string;
    requiredType: {
        bestFittingType: DMMF.SchemaArgInputType;
        inputType: DMMF.SchemaArgInputType[];
    };
    providedValue: any;
}

interface MissingItem {
    path: string;
    isRequired: boolean;
    type: string | object;
}

declare class Document {
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
declare class PrismaClientValidationError extends Error {
}
interface FieldArgs {
    name: string;
    schemaField?: DMMF.SchemaField;
    args?: Args;
    children?: Field[];
    error?: InvalidFieldError;
}
declare class Field {
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
declare class Args {
    args: Arg[];
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
declare class Arg {
    key: string;
    value: ArgValue;
    error?: InvalidArgError;
    hasError: boolean;
    isEnum: boolean;
    schemaArg?: DMMF.SchemaArg;
    argType?: DMMF.ArgType;
    isNullable: boolean;
    constructor({ key, value, argType, isEnum, error, schemaArg, }: ArgOptions);
    _toString(value: ArgValue, key: string): string | undefined;
    toString(): string;
    collectErrors(): ArgError[];
}
declare type ArgValue = string | boolean | number | undefined | Args | string[] | boolean[] | number[] | Args[] | null;
interface DocumentInput {
    dmmf: DMMFClass;
    rootTypeName: 'query' | 'mutation';
    rootField: string;
    select?: any;
}
declare function makeDocument({ dmmf, rootTypeName, rootField, select, }: DocumentInput): Document;
declare function transformDocument(document: Document): Document;
interface UnpackOptions {
    document: Document;
    path: string[];
    data: any;
}
/**
 * Unpacks the result of a data object and maps DateTime fields to instances of `Date` inplace
 * @param options: UnpackOptions
 */
declare function unpack({ document, path, data }: UnpackOptions): any;

// Type definitions for debug 4.1
// Project: https://github.com/visionmedia/debug
// Definitions by: Seon-Wook Park <https://github.com/swook>
//                 Gal Talmor <https://github.com/galtalmor>
//                 John McLaughlin <https://github.com/zamb3zi>
//                 Brasten Sager <https://github.com/brasten>
//                 Nicolas Penin <https://github.com/npenin>
//                 Kristian Brünn <https://github.com/kristianmitk>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

declare var debug: debug.Debug & { debug: debug.Debug; default: debug.Debug };


export as namespace debug;

declare namespace debug {
    interface Debug {
        (namespace: string): Debugger;
        coerce: (val: any) => any;
        disable: () => string;
        enable: (namespaces: string) => void;
        enabled: (namespaces: string) => boolean;
        log: (...args: any[]) => any;

        names: RegExp[];
        skips: RegExp[];

        formatters: Formatters;
    }

    type IDebug = Debug;

    interface Formatters {
        [formatter: string]: (v: any) => string;
    }

    type IDebugger = Debugger;

    interface Debugger {
        (formatter: any, ...args: any[]): void;

        color: string;
        enabled: boolean;
        log: (...args: any[]) => any;
        namespace: string;
        destroy: () => boolean;
        extend: (namespace: string, delimiter?: string) => Debugger;
    }
}

declare function Debug(namespace: string): debug.Debugger;
declare namespace Debug {
    var enable: (namespace: string) => void;
    var enabled: (namespace: string) => boolean;
}

declare type LogLevel = 'info' | 'trace' | 'debug' | 'warn' | 'error' | 'query';
interface RustLog {
    timestamp: Date;
    level: LogLevel;
    target: string;
    fields: LogFields;
}
declare type LogFields = {
    [key: string]: any;
};

declare class PrismaClientKnownRequestError extends Error {
    code: string;
    meta?: object;
    clientVersion: string;
    constructor(message: string, code: string, clientVersion: string, meta?: any);
}
declare class PrismaClientUnknownRequestError extends Error {
    clientVersion: string;
    constructor(message: string, clientVersion: string);
}
declare class PrismaClientRustPanicError extends Error {
    clientVersion: string;
    constructor(message: string, clientVersion: string);
}
declare class PrismaClientInitializationError extends Error {
    clientVersion: string;
    constructor(message: string, clientVersion: string);
}

declare type Platform = 'native' | 'darwin' | 'debian-openssl-1.0.x' | 'debian-openssl-1.1.x' | 'rhel-openssl-1.0.x' | 'rhel-openssl-1.1.x' | 'linux-musl' | 'linux-nixos' | 'windows' | 'freebsd11' | 'freebsd12' | 'openbsd' | 'netbsd' | 'arm';

declare class Undici {
    private pool;
    private closed;
    constructor(url: any, moreArgs?: any);
    request(body: any, customHeaders?: Record<string, string>): Promise<unknown>;
    status(): Promise<unknown>;
    close(): void;
}

interface DatasourceOverwrite {
    name: string;
    url: string;
}
interface EngineConfig {
    cwd?: string;
    datamodelPath: string;
    enableDebugLogs?: boolean;
    enableEngineDebugMode?: boolean;
    prismaPath?: string;
    fetcher?: (query: string) => Promise<{
        data?: any;
        error?: any;
    }>;
    generator?: GeneratorConfig;
    datasources?: DatasourceOverwrite[];
    showColors?: boolean;
    logQueries?: boolean;
    logLevel?: 'info' | 'warn';
    env?: Record<string, string>;
    flags?: string[];
    clientVersion?: string;
    enableExperimental?: string[];
    engineEndpoint?: string;
    useUds?: boolean;
}
declare type GetConfigResult = {
    datasources: DataSource[];
    generators: GeneratorConfig[];
};
declare type Deferred = {
    resolve: () => void;
    reject: (err: Error) => void;
};
declare type StopDeferred = {
    resolve: (code: number | null) => void;
    reject: (err: Error) => void;
};
declare class NodeEngine {
    private logEmitter;
    private showColors;
    private logQueries;
    private logLevel?;
    private env?;
    private flags;
    private port?;
    private enableDebugLogs;
    private enableEngineDebugMode;
    private child?;
    private clientVersion?;
    private lastPanic?;
    private globalKillSignalReceived?;
    private restartCount;
    private backoffPromise?;
    private queryEngineStarted;
    private enableExperimental;
    private engineEndpoint?;
    private lastLog?;
    private lastErrorLog?;
    private lastError?;
    private useUds;
    private socketPath?;
    private getConfigPromise?;
    private stopPromise?;
    exitCode: number;
    /**
     * exiting is used to tell the .on('exit') hook, if the exit came from our script.
     * As soon as the Prisma binary returns a correct return code (like 1 or 0), we don't need this anymore
     */
    queryEngineKilled: boolean;
    managementApiEnabled: boolean;
    datamodelJson?: string;
    cwd: string;
    datamodelPath: string;
    prismaPath?: string;
    url: string;
    ready: boolean;
    stderrLogs: string;
    stdoutLogs: string;
    currentRequestPromise?: any;
    cwdPromise: Promise<string>;
    platformPromise: Promise<Platform>;
    platform?: Platform | string;
    generator?: GeneratorConfig;
    incorrectlyPinnedBinaryTarget?: string;
    datasources?: DatasourceOverwrite[];
    startPromise?: Promise<any>;
    engineStartDeferred?: Deferred;
    engineStopDeferred?: StopDeferred;
    undici: Undici;
    constructor({ cwd, datamodelPath, prismaPath, generator, datasources, showColors, logLevel, logQueries, env, flags, clientVersion, enableExperimental, engineEndpoint, enableDebugLogs, enableEngineDebugMode, useUds, }: EngineConfig);
    private resolveCwd;
    on(event: 'query' | 'info' | 'warn' | 'error', listener: (log: RustLog) => any): void;
    getPlatform(): Promise<Platform>;
    private getQueryEnginePath;
    private handlePanic;
    private resolvePrismaPath;
    private getPrismaPath;
    private getFixedGenerator;
    printDatasources(): string;
    /**
     * Starts the engine, returns the url that it runs on
     */
    start(): Promise<void>;
    private getEngineEnvVars;
    private internalStart;
    stop(): Promise<void>;
    /**
     * If Prisma runs, stop it
     */
    _stop(): Promise<void>;
    kill(signal: string): Promise<void>;
    /**
     * Use the port 0 trick to get a new port
     */
    protected getFreePort(): Promise<number>;
    getConfig(): Promise<GetConfigResult>;
    _getConfig(): Promise<GetConfigResult>;
    version(): Promise<string>;
    request<T>(query: string, headers: Record<string, string>, numTry?: number): Promise<T>;
    requestBatch<T>(queries: string[], transaction?: boolean, numTry?: number): Promise<T>;
    private handleRequestError;
    private getLastLog;
    private graphQLToJSError;
}

declare type ErrorFormat = 'pretty' | 'colorless' | 'minimal';
declare type Datasource = {
    url?: string;
};
declare type Datasources = Record<string, Datasource>;
interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your prisma.schema file
     */
    datasources?: Datasources;
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat;
    /**
     * @example
     * \`\`\`
     * // Defaults to stdout
     * log: ['query', 'info', 'warn']
     *
     * // Emit as events
     * log: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     * ]
     * \`\`\`
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: Array<LogLevel$1 | LogDefinition>;
    /**
     * @internal
     * You probably don't want to use this. \`__internal\` is used by internal tooling.
     */
    __internal?: {
        debug?: boolean;
        hooks?: Hooks;
        useUds?: boolean;
        engine?: {
            cwd?: string;
            binaryPath?: string;
            endpoint?: string;
            enableEngineDebugMode?: boolean;
        };
    };
}
declare type HookParams = {
    query: string;
    path: string[];
    rootField?: string;
    typeName?: string;
    document: any;
    clientMethod: string;
    args: any;
};
declare type Hooks = {
    beforeRequest?: (options: HookParams) => any;
};
declare type LogLevel$1 = 'info' | 'query' | 'warn' | 'error';
declare type LogDefinition = {
    level: LogLevel$1;
    emit: 'stdout' | 'event';
};
interface GetPrismaClientOptions {
    document: DMMF.Document;
    generator?: GeneratorConfig;
    sqliteDatasourceOverrides?: DatasourceOverwrite[];
    relativePath: string;
    dirname: string;
    clientVersion?: string;
    engineVersion?: string;
}
declare function getPrismaClient(config: GetPrismaClientOptions): any;

declare type Value = string | number | boolean | object | null | undefined;
declare type RawValue = Value | Sql;
/**
 * A SQL instance can be nested within each other to build SQL strings.
 */
declare class Sql {
    values: Value[];
    strings: string[];
    constructor(rawStrings: ReadonlyArray<string>, rawValues: ReadonlyArray<RawValue>);
    get text(): string;
    get sql(): string;
    [inspect.custom](): {
        text: string;
        sql: string;
        values: Value[];
    };
}
/**
 * Create a SQL query for a list of values.
 */
declare function join(values: RawValue[], separator?: string): Sql;
/**
 * Create raw SQL statement.
 */
declare function raw(value: string): Sql;
/**
 * Placeholder value for "no text".
 */
declare const empty: Sql;
/**
 * Create a SQL object from a template string.
 */
declare function sqltag(strings: TemplateStringsArray, ...values: RawValue[]): Sql;

export { DMMF, DMMFClass, NodeEngine as Engine, PrismaClientInitializationError, PrismaClientKnownRequestError, PrismaClientOptions, PrismaClientRustPanicError, PrismaClientUnknownRequestError, PrismaClientValidationError, RawValue, Sql, Value, Debug as debugLib, empty, getPrismaClient, join, makeDocument, raw, sqltag, transformDocument, unpack };
