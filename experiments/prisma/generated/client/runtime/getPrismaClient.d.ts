import { DMMF } from './dmmf-types';
import { DatasourceOverwrite } from '@prisma/engine-core/dist/NodeEngine';
import { Document } from './query';
import { GeneratorConfig } from '@prisma/generator-helper/dist/types';
import { Dataloader } from './Dataloader';
export declare type ErrorFormat = 'pretty' | 'colorless' | 'minimal';
export declare type Datasource = {
    url?: string;
};
export declare type Datasources = Record<string, Datasource>;
export interface PrismaClientOptions {
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
    log?: Array<LogLevel | LogDefinition>;
    /**
     * @internal
     * You probably don't want to use this. \`__internal\` is used by internal tooling.
     */
    __internal?: {
        debug?: boolean;
        hooks?: Hooks;
        engine?: {
            cwd?: string;
            binaryPath?: string;
            endpoint?: string;
            enableEngineDebugMode?: boolean;
        };
    };
}
export declare type HookParams = {
    query: string;
    path: string[];
    rootField?: string;
    typeName?: string;
    document: any;
    clientMethod: string;
    args: any;
};
/**
 * These options are being passed in to the middleware as "params"
 */
export declare type MiddlewareParams = {
    model?: string;
    action: Action;
    args: any;
    dataPath: string[];
    runInTransaction: boolean;
};
/**
 * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
 */
export declare type Middleware<T = any> = (params: MiddlewareParams, next: (params: MiddlewareParams) => Promise<T>) => Promise<T>;
export interface InternalRequestParams extends MiddlewareParams {
    /**
     * The original client method being called.
     * Even though the rootField / operation can be changed,
     * this method stays as it is, as it's what the user's
     * code looks like
     */
    clientMethod: string;
    callsite?: string;
    headers?: Record<string, string>;
}
export declare type HookPoint = 'all' | 'engine';
export declare type EngineMiddlewareParams = {
    document: Document;
    runInTransaction?: boolean;
};
export declare type AllHookArgs = {
    params: HookParams;
    fetch: (params: HookParams) => Promise<any>;
};
/**
 * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
 */
export declare type EngineMiddleware<T = any> = (params: EngineMiddlewareParams, next: (params: EngineMiddlewareParams) => Promise<T>) => Promise<T>;
export declare type Hooks = {
    beforeRequest?: (options: HookParams) => any;
};
export declare type LogLevel = 'info' | 'query' | 'warn' | 'error';
export declare type LogDefinition = {
    level: LogLevel;
    emit: 'stdout' | 'event';
};
export declare type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never;
export declare type GetEvents<T extends Array<LogLevel | LogDefinition>> = GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]>;
export declare type QueryEvent = {
    timestamp: Date;
    query: string;
    params: string;
    duration: number;
    target: string;
};
export declare type LogEvent = {
    timestamp: Date;
    message: string;
    target: string;
};
export interface GetPrismaClientOptions {
    document: DMMF.Document;
    generator?: GeneratorConfig;
    sqliteDatasourceOverrides?: DatasourceOverwrite[];
    relativePath: string;
    dirname: string;
    clientVersion?: string;
    engineVersion?: string;
}
export declare type Action = 'findOne' | 'findMany' | 'create' | 'update' | 'updateMany' | 'upsert' | 'delete' | 'deleteMany' | 'executeRaw' | 'queryRaw' | 'aggregate';
export declare function getPrismaClient(config: GetPrismaClientOptions): any;
export declare class PrismaClientFetcher {
    prisma: any;
    debug: boolean;
    hooks: any;
    dataloader: Dataloader<{
        document: Document;
        runInTransaction?: boolean;
        headers?: Record<string, string>;
    }>;
    constructor(prisma: any, enableDebug?: boolean, hooks?: any);
    request({ document, dataPath, rootField, typeName, isList, callsite, clientMethod, runInTransaction, showColors, engineHook, args, headers, }: {
        document: Document;
        dataPath: string[];
        rootField: string;
        typeName: string;
        isList: boolean;
        clientMethod: string;
        callsite?: string;
        runInTransaction?: boolean;
        showColors?: boolean;
        engineHook?: EngineMiddleware;
        args: any;
        headers?: Record<string, string>;
    }): Promise<any>;
    sanitizeMessage(message: any): any;
    unpack(document: any, data: any, path: any, rootField: any): any;
}
export declare function getOperation(action: DMMF.ModelAction): 'query' | 'mutation';
