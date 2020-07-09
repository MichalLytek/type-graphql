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
    activeProvider: ConnectorType;
    provider: ConnectorType[];
    url: EnvValue;
    config: any;
}
export interface EnvValue {
    fromEnvVar: null | string;
    value: string;
}
