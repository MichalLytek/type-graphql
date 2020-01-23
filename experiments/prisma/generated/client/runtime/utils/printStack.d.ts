export interface ErrorArgs {
    callsite?: string;
    originalMethod: string;
    onUs?: boolean;
}
export interface PrintStackResult {
    stack: string;
    indent: number;
    lastErrorHeight: number;
    afterLines: string;
}
export declare const printStack: ({ callsite, originalMethod, onUs, }: ErrorArgs) => PrintStackResult;
