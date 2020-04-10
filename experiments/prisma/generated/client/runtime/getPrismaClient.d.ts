import { DMMF } from './dmmf-types';
import { DatasourceOverwrite } from '@prisma/engine-core/dist/NodeEngine';
import { Document } from './query';
import { GeneratorConfig } from '@prisma/generator-helper/dist/types';
import { Dataloader } from './Dataloader';
import { InternalDatasource } from './utils/printDatasources';
export declare type ErrorFormat = 'pretty' | 'colorless' | 'minimal';
export declare type Datasources = any;
export interface PrismaClientOptions {
    datasources?: Datasources;
    /**
     * @default "pretty"
     */
    errorFormat?: ErrorFormat;
    log?: Array<LogLevel | LogDefinition>;
    /**
     * You probably don't want to use this. \`__internal\` is used by internal tooling.
     */
    __internal?: {
        debug?: boolean;
        hooks?: Hooks;
        engine?: {
            cwd?: string;
            binaryPath?: string;
        };
        measurePerformance?: boolean;
    };
    /**
     * Useful for pgbouncer
     */
    forceTransactions?: boolean;
}
export declare type Hooks = {
    beforeRequest?: (options: {
        query: string;
        path: string[];
        rootField?: string;
        typeName?: string;
        document: any;
    }) => any;
};
export declare type LogLevel = 'info' | 'query' | 'warn';
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
    internalDatasources: InternalDatasource[];
}
export declare function getPrismaClient(config: GetPrismaClientOptions): any;
export declare class PrismaClientFetcher {
    prisma: any;
    debug: boolean;
    hooks: any;
    dataloader: Dataloader<{
        document: Document;
    }>;
    constructor(prisma: any, enableDebug?: boolean, hooks?: any);
    request({ document, dataPath, rootField, typeName, isList, callsite, collectTimestamps, clientMethod, }: {
        document: Document;
        dataPath: string[];
        rootField: string;
        typeName: string;
        isList: boolean;
        clientMethod: string;
        callsite?: string;
        collectTimestamps?: any;
    }): Promise<any>;
    sanitizeMessage(message: any): any;
    unpack(document: any, data: any, path: any, rootField: any): any;
}
export declare function getOperation(action: DMMF.ModelAction): 'query' | 'mutation';
