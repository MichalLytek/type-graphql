export interface ErrorArgs {
    callsite?: string;
    originalMethod: string;
    onUs?: boolean;
    showColors?: boolean;
    renderPathRelative?: boolean;
    printFullStack?: boolean;
}
export interface PrintStackResult {
    stack: string;
    indent: number;
    lastErrorHeight: number;
    afterLines: string;
}
export declare const printStack: ({ callsite, originalMethod, onUs, showColors, renderPathRelative, printFullStack, }: ErrorArgs) => PrintStackResult;
