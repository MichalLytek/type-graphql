// tslint:disable
import "reflect-metadata";

export type ReturnTypeFunc = (returnType: void) => any;
export interface ReturnTypeOptions {
    array?: boolean;
    nullable?: boolean;
}

const dummyDecorator = () => {};

export function Field(typeFunc?: (type?: void) => any): PropertyDecorator {
    return dummyDecorator;
    // return (target, propertyKey) => {
    //     const ParamType = Reflect.getMetadata("design:type", target, propertyKey);
    // }
}

export function GraphQLResolver(type: any): ClassDecorator {
    return dummyDecorator;
}

export function GraphQLType(): ClassDecorator {
    return dummyDecorator;
}

export function GraphQLArgumentType(): ClassDecorator {
    return dummyDecorator;
}

export function GraphQLInputType(): ClassDecorator {
    return dummyDecorator;
}

export function Query(returnTypeFunction?: ReturnTypeFunc, options?: ReturnTypeOptions): MethodDecorator;
export function Query(returnType?: any, options?: ReturnTypeOptions): MethodDecorator;
export function Query(returnTypeFunc?: ReturnTypeFunc| any, options?: ReturnTypeOptions): MethodDecorator {
    return dummyDecorator;
}

export function Mutation(returnTypeFunction?: ReturnTypeFunc, options?: ReturnTypeOptions): MethodDecorator;
export function Mutation(returnType?: any, options?: ReturnTypeOptions): MethodDecorator;
export function Mutation(returnTypeFunc?: ReturnTypeFunc, options?: ReturnTypeOptions): MethodDecorator {
    return dummyDecorator;
}

export function Subscription(returnTypeFunc?: ReturnTypeFunc, options?: ReturnTypeOptions): MethodDecorator {
    return dummyDecorator;
}

export function FieldResolver(returnTypeFunc?: ReturnTypeFunc, options?: ReturnTypeOptions): MethodDecorator {
    return dummyDecorator;
}

export function Authorized(...roles: string[]): MethodDecorator {
    return dummyDecorator;
}

export function Context(): ParameterDecorator {
    return dummyDecorator;
}

export function Root(): ParameterDecorator {
    return dummyDecorator;
}

export function Arguments(): ParameterDecorator {
    return dummyDecorator;
}

export function Argument(name: string): ParameterDecorator {
    return dummyDecorator;
}

