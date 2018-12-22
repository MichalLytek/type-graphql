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

const dummyFn = () => void 0;
const dummyDecorator = () => dummyFn;

export const Arg = dummyDecorator;
export const Args = dummyDecorator;
export const ArgsType = dummyDecorator;
export const Authorized = dummyDecorator;
export const Ctx = dummyDecorator;
export const registerEnumType = dummyFn;
export const Field = dummyDecorator;
export const FieldResolver = dummyDecorator;
export const Info = dummyDecorator;
export const InputType = dummyDecorator;
export const InterfaceType = dummyDecorator;
export const Mutation = dummyDecorator;
export const ObjectType = dummyDecorator;
export const PubSub = dummyDecorator;
export const Query = dummyDecorator;
export const Resolver = dummyDecorator;
export const Root = dummyDecorator;
export const Subscription = dummyDecorator;
export const createUnionType = dummyFn;
export const UseMiddleware = dummyDecorator;
