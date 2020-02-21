interface Job {
    resolve: (data: any) => void;
    reject: (data: any) => void;
    request: any;
}
export declare class Dataloader {
    private loader;
    currentBatch?: Job[];
    constructor(loader: (data: any[]) => Promise<any[]>);
    request(request: any): Promise<any>;
    private dispatchBatch;
}
export {};
