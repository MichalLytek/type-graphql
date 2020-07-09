export interface ErrorArgs {
    callsite?: string;
    originalMethod: string;
    onUs?: boolean;
    showColors?: boolean;
    renderPathRelative?: boolean;
    printFullStack?: boolean;
    isValidationError?: boolean;
}
export interface PrintStackResult {
    stack: string;
    indent: number;
    lastErrorHeight: number;
    afterLines: string;
}
export declare const printStack: ({ callsite, originalMethod, onUs, showColors, renderPathRelative, printFullStack, isValidationError, }: ErrorArgs) => PrintStackResult;
