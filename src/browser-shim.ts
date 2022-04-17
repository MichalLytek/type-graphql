/*
  This "shim" can be used on the frontend to prevent from errors on undefined decorators,
  when you are sharing same classes across backend and frontend.

  To use this shim, simply set up your Webpack configuration
  to use this file instead of a normal TypeGraphQL module.

  ```js
  plugins: [
    // ...here are any other existing plugins that you already have
    new webpack.NormalModuleReplacementPlugin(/type-graphql$/, resource => {
      resource.request = resource.request.replace(/type-graphql/, "type-graphql/dist/browser-shim");
    }),
  ]
  ```

  However, in some TypeScript projects like the ones using Angular,
  which AoT compiler requires that a full `*.ts` file is provided
  instead of just a `*.js` and `*.d.ts` files, to use this shim
  we have to simply set up our TypeScript configuration in `tsconfig.json`
  to use this file instead of a normal TypeGraphQL module:

  ```json
  {
    "compilerOptions": {
      "baseUrl": ".",
      "paths": {
        "type-graphql": [
          "./node_modules/type-graphql/dist/browser-shim.ts"
        ]
      }
    }
  }
  ```
*/

import * as src from './index'

export const dummyValue = ''

export function dummyFn(): void {}

export function dummyDecorator(): any {
  return dummyFn
}

export const Arg: typeof src.Arg = dummyDecorator
export const Args: typeof src.Args = dummyDecorator
export const ArgsType: typeof src.ArgsType = dummyDecorator
export const Authorized: typeof src.Authorized = dummyDecorator
export const Ctx: typeof src.Ctx = dummyDecorator
export const registerEnumType: typeof src.registerEnumType = dummyFn
export const Field: typeof src.Field = dummyDecorator
export const FieldResolver: typeof src.FieldResolver = dummyDecorator
export const Info: typeof src.Info = dummyDecorator
export const InputType: typeof src.InputType = dummyDecorator
export const InterfaceType: typeof src.InterfaceType = dummyDecorator
export const Mutation: typeof src.Mutation = dummyDecorator
export const ObjectType: typeof src.ObjectType = dummyDecorator
export const PubSub: typeof src.PubSub = dummyDecorator
export const Query: typeof src.Query = dummyDecorator
export const Resolver: typeof src.Resolver = dummyDecorator
export const Root: typeof src.Root = dummyDecorator
export const Subscription: typeof src.Subscription = dummyDecorator
export const createUnionType: typeof src.createUnionType = dummyFn as any
export const UseMiddleware: typeof src.UseMiddleware = dummyDecorator

export const Int: typeof src.Int = dummyValue as any
export const Float: typeof src.Float = dummyValue as any
export const ID: typeof src.ID = dummyValue as any
export const GraphQLISODateTime: typeof src.GraphQLISODateTime = dummyValue as any
export const GraphQLTimestamp: typeof src.GraphQLTimestamp = dummyValue as any
