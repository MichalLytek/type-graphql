import { Dictionary } from './common';
export declare type ConnectorType = 'mysql' | 'mongo' | 'sqlite' | 'postgresql';
export interface GeneratorConfig {
    name: string;
    output: string | null;
    provider: string;
    config: Dictionary<string>;
}
export declare type Datasource = string | {
    url: string;
    [key: string]: any | undefined;
};
export interface InternalDatasource {
    name: string;
    connectorType: ConnectorType;
    url: EnvValue;
    config: any;
}
export interface EnvValue {
    fromEnvVar: null | string;
    value: string;
}
export declare function printDatasources(dataSources: Dictionary<Datasource | undefined>, internalDatasources: InternalDatasource[]): string;
export declare function printDatamodelObject(obj: any): string;
