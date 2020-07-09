export interface MissingItem {
    path: string;
    isRequired: boolean;
    type: string | object;
}
export declare type PrintJsonWithErrorsArgs = {
    ast: object;
    keyPaths: string[];
    valuePaths: string[];
    missingItems: MissingItem[];
};
export declare function printJsonWithErrors({ ast, keyPaths, valuePaths, missingItems, }: PrintJsonWithErrorsArgs): any;
