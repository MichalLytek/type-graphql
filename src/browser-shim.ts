/*
This "shim" can be used on the frontend to prevent from errors on undefined decorators,
when you are sharing same classes across backend and frontend.
To use this shim, simply configure your Webpack configuration to use this file
instead of normal TypeGraphQL module.

plugins: [
    ..., // any existing plugins that you already have
    new webpack.NormalModuleReplacementPlugin(/type-graphql$/, function (result) {
        result.request = result.request.replace(/type-graphql/, "type-graphql/browser-shim");
    }),
]
*/

const dummyFn = () => () => void 0;

export const Arg = dummyFn;
export const Args = dummyFn;
export const ArgsType = dummyFn;
export const Authorized = dummyFn;
export const Ctx = dummyFn;
export const registerEnumType = dummyFn;
export const Field = dummyFn;
export const FieldResolver = dummyFn;
export const Info = dummyFn;
export const InputType = dummyFn;
export const InterfaceType = dummyFn;
export const Mutation = dummyFn;
export const ObjectType = dummyFn;
export const PubSub = dummyFn;
export const Query = dummyFn;
export const Resolver = dummyFn;
export const Root = dummyFn;
export const Subscription = dummyFn;
export const createUnionType = dummyFn;
export const UseMiddleware = dummyFn;
