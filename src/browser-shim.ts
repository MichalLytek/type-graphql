/*
This "shim" can be used on the frontend to prevent from errors on undefined decorators,
when you are sharing same classes across backend and frontend in TypeScript projects.
To use this shim, simply set up your TypeScript configuration
to use this file instead of a normal TypeGraphQL module.

tsconfig.json:
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "type-graphql": [
        "./node_modules/type-graphql/dist/browser-shim"
      ]
    }
  }
}

Note:
Angular's AoT compiler requires that a full .ts file is provided instead of just
a .d.ts file so that the full TypeScript function definitions are available.
It also requires that dummyFn and dummyDecorator are not function expressions
(i.e. are not lambda functions) and that they are exported.
*/

export function dummyFn(...args: any[]) {
  void 0;
}
export function dummyDecorator(...args: any[]) {
  return dummyFn;
}
const dummyValue = "";

export const registerEnumType = dummyFn;
export const createUnionType = dummyFn;

export const Arg = dummyDecorator;
export const Args = dummyDecorator;
export const ArgsType = dummyDecorator;
export const Authorized = dummyDecorator;
export const Ctx = dummyDecorator;
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
export const UseMiddleware = dummyDecorator;

export const Int = dummyValue;
export const Float = dummyValue;
export const ID = dummyValue;
export const GraphQLISODateTime = dummyValue;
export const GraphQLTimestamp = dummyValue;
