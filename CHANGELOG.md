# Changelog and release notes

## Unreleased
### Features
- **Breaking Change**: change `ClassType` type and export it in package index
- **Breaking Change**: refactor generic `createUnionType` to remove the 10 types limit (note: requires TypeScript 3.0.1)
- add support for subscribing to dynamic topics - based on args/ctx/root (#137)
- add support for query complexity analysis - integration with `graphql-query-complexity` (#139)

## v0.13.1
### Fixes
- fix missing loosely typed overload signature for `createUnionType` (remove the 10 types limit)

## v0.13.0
### Features
- make `class-validator` a virtual peer dependency and update it to newest `0.9.1` version
- add support for creating scoped containers (#113)

## v0.12.3
### Features
- add reflect-metadata checks and informative error if no polyfill provided
- update `@types/graphql` to latest version (`^0.13.3`)
### Fixes
- fix throwing error when `of => objectType` wasn't provided in abstract resolver class
- fix calling `Object.assign` with boolean arguments (#111)

## v0.12.2
### Features
- add support for using type classes in browser (configure webpack to use decorators shim)
### Fixes
- fix swallowing false argument value (#101)

## v0.12.1
### Fixes
- fix bug with overriding methods from parent resolver class (#95)

## v0.12.0
### Features
- **Breaking Change**: remove deprecated `ActionData` and `FilterActionData` interfaces
- add support for resolver classes inheritance
- add `name` decorator option for `@Field` and `@FieldResolver` decorators that allows to set the schema name different than the property name

## v0.11.3
### Features
- make auth checker feature generic typed (default `string` for backward compatibility)

## v0.11.2
### Features
- attach `MetadataStorage` to global scope (support multiple packages/modules)
- rename and deprecate `ActionData` and `FilterActionData` interfaces to `ResolverData` and `ResolverFilterData`

## v0.11.1
### Features
- add support for returning null instead of throwing authorization error (`authMode` property of `buildSchema` config)
- add support for generating object type field in schema from method with `@FieldResolver`
### Fixes
- fix bug when converting object scalars to target class instance (#65)

## v0.11.0
### Features
- add support for creating and attaching middlewares, guards and interceptors to fields and resolvers
- **Breaking Change**: remove deprecated decorators with `GraphQL` prefix and `{ array: true }` type option

## v0.10.0
### Features
- add `buildSchemaSync` function to build the schema synchronously (unsafe! without additional errors checks)
- update package dependencies
- **Breaking Change**: update `@types/graphql` to `0.13.0`
### Fixes
- decorator option `validate` is now merged with `buildSchema`'s `validate` config instead of overwriting it

## v0.9.1
### Fixes
- fix bug with extending non-TypeGraphQL classes

## v0.9.0
### Features
- add support for GraphQL subscriptions using `graphql-subscriptions`
- update package dependencies
- deprecate `{ array: true }` type option

## v0.8.1
### Features
- add `@Info()` decorator for injecting GraphQL resolve info to resolvers
- add support for injecting parts of `root` and `context` objects with `@Root("field")` and `@Ctx("field")` decorators

## v0.8.0
### Features
- add base support for GraphQL enums using TypeScript enums
- add support for defining GraphQL unions
- add support for importing resolvers from file path glob
- deprecate decorators with `GraphQL` prefix - use `@ArgsType`, `@InputType`, `@InterfaceType`, `@ObjectType` and `@Resolver` instead
### Fixes
- fix not working array type notation in circular dependencies (correct thunk generation)

## v0.7.0
### Features
- add authorization feature - `@Authorized` decorator and `authChecker` function in schema options ([see docs](https://github.com/19majkel94/type-graphql/blob/master/docs/authorization.md))
- add support for defining array type using mongoose-like notation `[Type]`
- **Breaking Change**: remove deprecated `@GraphQLArgumentType` decorator - use `@GraphQLArgsType` instead

## v0.6.0
### Features
- add support for defining GraphQL interfaces and implementing it by object types
- add support for extending input, args, object and interface types classes
- add support for implementing GraphQL interfaces without decorators duplication
- **Breaking Change**: make `buildSchema` async - now it returns a Promise of `GraphQLSchema`
- rename and deprecate `@GraphQLArgumentType` decorator - use `@GraphQLArgsType` instead
### Fixes
- allow for no args in `@GraphQLResolver` decorator to keep consistency with other resolver classes

## v0.5.0
### Features
- create instance of root object when it's type provided in resolver
- change `Date` scalar names to `GraphQLISODateTime` and `GraphQLTimestamp`
- support only `Date` objects (instances) serialization in `GraphQLTimestamp` (and in `GraphQLISODateTime` too)
- update package dependencies
- add test suite with 92%+ coverage
### Fixes
- **Breaking change**: switch array `nullable` option behavior from `[Type]!` to `[Type!]`
- add more detailed type reflection error message (parameters support)
- fix `ResolverInterface` resolver function type (allow additional parameters)
- add support for named param in `@GraphQLResolver` lambda and for object class as param

## v0.4.0
### Features
- add basic support for automatic arguments and inputs validation using `class-validator`
- add interface `ResolverInterface` for type checking of resolver class methods (field resolvers)
- update `graphql` dependency from `^0.12.3` to `^0.13.0`
### Fixes
- fix default values for arg/input fields (class property initializers) - use `new` instead of `Object.create`

## v0.3.0
### Features
- add support for descriptions in schema (types, args, queries, etc.)
- add support for declaring depreciation reason on object fields and queries/mutations
### Fixes
- fix scalars ID alias (GraphQLID not GraphQLString)

## v0.2.0
### Features
- add support for Date type (built-in scalar)
- add support for custom scalars (and mapping it to TS types)
- change `@Context` decorator name to `@Ctx`

## v0.1.2
### Fixes
- fix missing type args in schema when declared in field resolver
- fix missing resolver function when defined as type field method
- fix creating instances of root object when internal fields are Promises (switch from `plainToClass` to vanilla JS)
- fix converting field and resolvers args errors while converting gql objects (weird `prototype` stuffs)

## v0.1.1
### Features
- add support for omitting return type when use type options, in selected decorators (`@Field`, `@Arg`)
### Fixes
- fix class getter resolvers bug - missing fields from prototype (`plainToClass` bug)

## v0.1.0
### Initial release
