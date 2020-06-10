declare type LogLevel = 'info' | 'query' | 'warn' | 'error';
declare type LogDefinition = {
    level: LogLevel;
    emit: 'stdout' | 'event';
};
export declare function getLogLevel(log: LogLevel | Array<LogLevel | LogDefinition>): LogLevel | undefined;
export {};
