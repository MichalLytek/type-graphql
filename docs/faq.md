---
title: Frequently Asked Questions
---

## Resolvers

### Should I implement a field's resolver as a object type's getter, method or as a resolver class's method?

It really depends on various factors:

- if your resolver need access only to the root/object value - use a getter
- if your field has arguments
  - and need to perform side effects (like db call) - use resolver class's method (leverage dependency injection mechanism)
  - otherwise - use object type's methods (pure function, calculate based on object value and arguments)
- if you want to separate business logic from type definition - use resolver class's method

### Are there any global error handlers to catch errors from a resolver or service?

You can use middleware for this purpose - just wrap `await next()` in a try-catch block then register it as the first global middleware.

### I got an error like `GraphQLError: Expected value of type "MyType" but got: [object Object]`. Why?

This error occurs when the resolver (query, mutation, field) type is an interface/union and you return a plain object from it.
In this case you have to return an instance of the selected object type class in your resolvers.
Otherwise, `graphql-js` will not be able to detect the underlying GraphQL type correctly.

## Bootstrapping

### Should I use an array of manually imported resolver classes or use a glob path string?

Using a path to resolver module files force you to structure our project folders or constantly name files with prefix/suffix.
When there are several resolver classes, it might be easier than always remembering to import and register each new class.

### I got an error like `Cannot use GraphQLSchema "[object Object]" from another module or realm`. How do I fix that?

This error occurs mostly when there are more than one version of `graphql-js` in our project.
In most cases it means that one of our dependencies has a dependency on a different version of `graphql-js`, e.g. we, or TypeGraphQL uses `v14.0.2` but `apollo-server-express` depends on `v0.13.2`.
We can print the dependency tree by running `npm ls graphql` (or yarn's equivalent) to find the faulty dependencies.
Then we have to update or downgrade them until they all match the semver on `graphql`, like `^14.0.0`.
Dependencies may also need to be flattened, so that they all share a single instance of the `graphql` module in the `node_modules` directory - to achieve this, just run `npm dedupe` (or yarn's equivalent).

The same rule applies to an error like `node_modules/type-graphql/node_modules/@types/graphql/type/schema").GraphQLSchema' is not assignable to type 'import("node_modules/@types/graphql/type/schema").GraphQLSchema'`.
In this case we must do the same checks but for the `@types/graphql` module in our dependencies.

## Types

### Is `@InputType()` different from `@ArgsType()`?

Of course!
`@InputType` will generate real `GraphQLInputType` and should be used when we want to have nested object in args:

```graphql
updateItem(data: UpdateItemInput!): Item!
```

`@ArgsType` is virtual and it will be flattened in schema:

```graphql
updateItem(id: Int!, userId: Int!): Item!
```

### When should I use the `() => [ItemType]` syntax?

We should use the `[ItemType]` syntax every time our field type is an array or a return array from a query or mutation.

Even though we can technically omit the array notation (when the base type is not `Promise`) and only provide the type of array item (e.g. `@Field(() => ItemType) field: ItemType[]`) - it's better to be consistent with other annotations by explicitly defining the type.

### In many cases I have a situation where InputType and ObjectType have exactly the same shape. How can I share the definitions?

In GraphQL, input objects have a separate type in the system because object types can contain fields that express circular references or references to interfaces and unions, neither of which is appropriate for use as an input argument.
However if you have only simple fields in your class definition, you can reuse the code between the InputType and the ObjectType - just decorate the ObjectType class with `@InputType`. But remember to set a new name of the type in decorator parameter:

```typescript
@ObjectType() // name inferred to `Person`
@InputType("PersonInput")
export class Person {}
```
