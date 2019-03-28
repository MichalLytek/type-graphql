---
title: Frequently Asked Questions
id: version-0.17.0-faq
original_id: faq
---

## Resolvers

### Should I implement a field's resolver as a object type's getter, method or as a resolver class's method?

It really depends on various factors:

- if your resolver need access only to the root/object value - use a getter
- if your field has arguments
  - and need to perform side effects (like db call) - use resolver class's method (leverage dependency injection mechanism)
  - otherwise - use object type's methods (pure function, calculate based on object value and arguments)
- if you want to separate business logic from type definition - use resolver class's method

### Is there any global error handler to catch the error from resolver or a service?

You can use middlewares for this purpose - just wrap `await next()` in try-catch block and do the magic. Then register it as a first global middleware.

### I got error like `GraphQLError: Expected value of type "MyType" but got: [object Object]`. Why?

This error shows when your resolver (query, mutation, field) type is an interface/union and you return a plain object from it.
In this case you have to return an instance of the selected object type class in your resolvers.
Otherwise, `graphql-js` will not be able to detect the underlying GraphQL type correctly.

## Bootstrapping

### Should I use array of manually imported resolver classes or use a glob path string?

Using path to resolver module files force you to structure yours project folders or constantly name files with prefix/suffix.
When you have several dozen of resolver classes, it might be easier than always remember about importing and registering each new class.

### I got error like `Cannot use GraphQLSchema "[object Object]" from another module or realm`. How to fix that?

This error happens mostly when you have more than one version of `graphql-js` in your project.
In most cases it means that one of your dependencies has a dependency on different version of `graphql-js`, e.g. you use or TypeGraphQL uses `v14.0.2` but `apollo-server-express` depends on `v0.13.2`.
You can print the dependency tree by running `npm ls graphql` (or yarn's equivalent) to find the faulty dependencies.
Then you have to update or downgrade them until they all match the semver on `graphql`, like `^14.0.0`.
You may also need to flatten your dependencies, so that they all will share a single instance of `graphql` module in `node_modules` directory - to achieve this, just run `npm dedupe` (or yarn's equivalent).

The same rule goes to the error like `node_modules/type-graphql/node_modules/@types/graphql/type/schema").GraphQLSchema' is not assignable to type 'import("node_modules/@types/graphql/type/schema").GraphQLSchema'`.
In that case you have to do the same checks but for the `@types/graphql` module in your dependencies.

## Types

### Is `@InputType()` different from `@ArgsType()`?

Of course!
`@InputType` will generate real `GraphQLInputType` and should be used when you want to have nested object in args:

```graphql
updateItem(data: UpdateItemInput!): Item!
```

`@ArgsType` is virtual and it will be flattened in schema:

```graphql
updateItem(id: Int!, userId: Int!): Item!
```

### When I have to use the `() => [ItemType]` syntax?

You should use `[ItemType]` syntax every time when your field type is array or you return array from query/mutation.

Even if you technically can omit the array notation (when the base type is not `Promise`) and provide only the type of array item (e.g. `@Field(() => ItemType) field: ItemType[]`) - it's better to be consistent with other annotations by explicit defining the type.

### How can I define the two-dimension array (nested arrays, array of arrays)?

Unfortunately, [GraphQL spec doesn't support 2D arrays](https://github.com/graphql/graphql-spec/issues/423), so you can't just use `data: [[Float]]` as a GraphQL type.

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

### In many cases I have a situation where InputType and ObjectType have exactly the same shape. How can I share the definitions?

In GraphQL, input objects have a separate type in the system because object types can contain fields that express circular references or references to interfaces and unions, neither of which is appropriate for use as an input argument.
However if you have only simple fields in your class definition, you can reuse the code between InputType and ObjectType - just decorate the ObjectType class with `@InputType`. But remember to set a new name of the type in decorator parameter:

```typescript
@ObjectType() // name inferred to `Person`
@InputType("PersonInput")
export class Person {}
```
