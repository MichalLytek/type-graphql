---
title: Frequently Asked Questions
---

## Resolvers

### Should I implement field resolver as a object type's getter, method or as a resolver class's method?
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
