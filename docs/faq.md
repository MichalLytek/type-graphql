---
title: Frequently Asked Questions
---

## Resolvers

### Should I implement a field resolver as an object type getter, a method or a resolver class method?

This depends on various factors:

- if the resolver only needs access to the root/object value - use a getter
- if the field has arguments
  - and must perform side effects e.g. a database call - use a resolver class method and leverage the dependency injection mechanism
  - otherwise, use object type methods (pure functions, calculations based on object values and arguments)
- if the business logic must be separated from the type definition - use a resolver class method

### Are there any global error handlers to catch errors from resolvers or services?

Use middleware for this purpose - just wrap `await next()` in a try-catch block then register it as the first global middleware.

### Why did I receive this error? `GraphQLError: Expected value of type "MyType" but got: [object Object]`

This error occurs when the resolver (query, mutation, field) type is an interface/union and a plain object is returned from it.
In this case, what should be returned is an instance of the selected object type class in the resolver.
Otherwise, `graphql-js` will not be able to correctly detect the underlying GraphQL type.

## Bootstrapping

### Should I use an array of manually imported resolver classes or a glob path string?

Using a path to resolver module files compels us to structure our project folders or consistently name files with a prefix/suffix and when there are several resolver classes, this might be easier than having to remember to import and register every new class.

### How do I fix this error? `Cannot use GraphQLSchema "[object Object]" from another module or realm`

This error occurs mostly when there are more than one version of the `graphql-js` module in the project.
In most cases it means that one of our dependencies has a dependency on a different version of `graphql-js`, e.g. we, or TypeGraphQL use `v14.0.2` but `apollo-server-express` depends on `v0.13.2`.
We can print the dependency tree by running `npm ls graphql` (or the yarn equivalent) to find the faulty dependencies.
Then we should update or downgrade them until they all match the semver on `graphql`, e.g. `^14.0.0`.
Dependencies may also need to be flattened, so that they all share a single instance of the `graphql` module in the `node_modules` directory - to achieve this, just run `npm dedupe` (or the yarn equivalent).

The same rule applies to this error: `node_modules/type-graphql/node_modules/@types/graphql/type/schema").GraphQLSchema' is not assignable to type 'import("node_modules/@types/graphql/type/schema").GraphQLSchema'`.
In this case we repeat the same checks but for the `@types/graphql` module in our dependencies.

## Types

### Is `@InputType()` different from `@ArgsType()`?

Of course!
`@InputType` will generate a real `GraphQLInputType` type and should be used when we need a nested object in the args:

```graphql
updateItem(data: UpdateItemInput!): Item!
```

`@ArgsType` is virtual and it will be flattened in schema:

```graphql
updateItem(id: Int!, userId: Int!): Item!
```

### When should I use the `() => [ItemType]` syntax?

We should use the `[ItemType]` syntax any time the field type or the return type is an array from a query or mutation.

Even though technically the array notation can be omitted (when the base type is not `Promise`) and only provide the type of array item (e.g. `@Field(() => ItemType) field: ItemType[]`) - it's better to be consistent with other annotations by explicitly defining the type.

### How can I define a tuple?

Unfortunately, [GraphQL spec doesn't support tuples](https://github.com/graphql/graphql-spec/issues/423), so you can't just use `data: [Int, Float]` as a GraphQL type.

Instead, you have to create a transient object (or input) type that fits your data, e.g.:

```graphql
type DataPoint {
  x: Int
  y: Float
}
```

and then use it in the list type as your GraphQL type:

```graphql
data: [DataPoint]
```

### Situations frequently arise where InputType and ObjectType have exactly the same shape. How can I share the definitions?

In GraphQL, input objects have a separate type in the system because object types can contain fields that express circular references or references to interfaces and unions, neither of which are appropriate for use as input arguments.
However, if there are only simple fields in the class definition, reuse the code between the InputType and the ObjectType by decorating the ObjectType class with `@InputType`. Remember to set a new name of the type in the decorator parameter:

```typescript
@ObjectType() // name inferred to `Person`
@InputType("PersonInput")
export class Person {}
```
