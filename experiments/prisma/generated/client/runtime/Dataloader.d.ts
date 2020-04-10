interface Job {
    resolve: (data: any) => void;
    reject: (data: any) => void;
    request: any;
}
export declare type DataloaderOptions<T> = {
    singleLoader: (request: T) => Promise<any>;
    batchLoader: (request: T[]) => Promise<any[]>;
    batchBy: (request: T) => string | null;
};
export declare class Dataloader<T = any> {
    private options;
    batches: {
        [key: string]: Job[];
    };
    private tickActive;
    constructor(options: DataloaderOptions<T>);
    request(request: T): Promise<any>;
    private dispatchBatches;
}
export {};
