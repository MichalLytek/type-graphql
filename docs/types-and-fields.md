---
title: Types and fields
---

The main idea of TypeGraphQL is to automatically create GraphQL schema definition from TypeScript's classes. To avoid the need of schema definion files and interfaces describing the schema, we use a bit of reflection magic and decorators.

Let's start with defining the example TypeScript class. It will represent our `Recipe` model with fields storing recipe's data:
```typescript
class Recipe {
  id: string;
  title: string;
  ratings: Rate[];
  averageRating?: number;
}
```

First what we have to do is to decorate the class with e.g. `@ObjectType` decorator. It marks the class as the `type` known from GraphQL SDL or `GraphQLObjectType` from `graphql-js`:
```typescript
@ObjectType()
class Recipe {
  id: string;
  title: string;
  ratings: Rate[];
  averageRating: number;
}
```

Then we need to declare which class properties should be mapped to GraphQL fields.
To do this, we use `@Field` decorator, which is also used to collect the metadata from TypeScript reflection system:
```typescript
@ObjectType()
class Recipe {
  @Field()
  id: string;

  @Field()
  title: string;

  @Field()
  ratings: Rate[];

  @Field()
  averageRating: number;
}
```

For simple types (like `string` or `boolean`) it's enough but unfortunately, due to TypeScript's reflection limitation, we need to provide info about generic types (like `Array` or `Promise`). So to declare `Rate[]` type, there are two options available:
- `@Field(type => [Rate])` (the recommended way - explicit `[ ]` syntax for Array)
- `@Field(itemType => Rate)` (`array` is inferred from reflection - also ok but prone to error)

Why function syntax, not simple `{ type: Rate }` config object? Because this way we solve problems with circular dependencies (e.g. Post <--> User), so it was adopted as a convention. You can use the shorthand syntax `@Field(() => Rate)` if you want to safe some keystrokes but it might be less readable for others.

For nullable properties, like `averageRating` (it might be not defined when recipe has no ratings yet), we mark the class property as optional with `?:` operator and also have to pass `{ nullable: true }` decorator parameter. Be aware, that when you declare your type as e.g. `string | null`, you need to explicit provide the type to `@Field` decorator.

In config object we can also provide `description` and `depreciationReason` for GraphQL schema purposes.

So after this changes our example class would look like this:
```typescript
@ObjectType({ description: "The recipe model" })
class Recipe {
  @Field(type => ID)
  id: string;

  @Field({ description: "The title of the recipe" })
  title: string;

  @Field(type => [Rate])
  ratings: Rate[];

  @Field({ nullable: true })
  averageRating?: number;
}
```

Which in result will generate following part of GraphQL schema in SDL:
```graphql
type Recipe {
  id: ID!
  title: String!
  ratings: [Rate!]
  averageRating: Float
}
```

Analogously, the `Rate` type class would look like this:
```typescript
@ObjectType()
class Rate {
  @Field(type => Int)
  value: number;

  @Field()
  date: Date;

  user: User;
}
```
which results in this equivalent of GraphQL's SDL:
```graphql
type Rate {
  value: Int!
  date: Date!
}
```

As you could see, for `id` property of `Recipe` we've passed `type => ID` and for `value` field of `Rate` - `type => Int`. This way we can overwrite the inferred type from reflection metadata, in this case for ID and Int scalars - you can read more about them in [scalars docs](./scalars.md), there is also a section about the built-in `Date` scalar. 

Also the `user` property doesn't have `@Field()` decorator - this way we can hide some properties of our data model. In this case we need to store in database `user` info inside `Rate` object to prevent multiple rates but we don't want to make it public, accessible to every API consumer.

Note that if a field of an object type is purely calculable (eg. `averageRating` from `ratings` array) and you don't want to pollute the class signature, you can omit it and just implement the field resolver (described in [resolvers doc](./resolvers.md)).
