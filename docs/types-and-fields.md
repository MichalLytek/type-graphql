---
title: Types and Fields
---

The main idea of TypeGraphQL is to automatically create GraphQL schema definitions from TypeScript classes. To avoid the need for schema definition files and interfaces describing the schema, we use decorators and a bit of reflection magic.

Let's start by defining our example TypeScript class which represents our `Recipe` model with fields for storing the recipe data:

```typescript
class Recipe {
  id: string;
  title: string;
  ratings: Rate[];
  averageRating?: number;
}
```

The first thing we must do is decorate the class with the `@ObjectType` decorator. It marks the class as the `type` known from the GraphQL SDL or `GraphQLObjectType` from `graphql-js`:

```typescript
@ObjectType()
class Recipe {
  id: string;
  title: string;
  ratings: Rate[];
  averageRating: number;
}
```

Then we declare which class properties should be mapped to the GraphQL fields.
To do this, we use the `@Field` decorator, which is also used to collect metadata from the TypeScript reflection system:

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

For simple types (like `string` or `boolean`) this is all that's needed but due to a limitation in TypeScript's reflection, we need to provide info about generic types (like `Array` or `Promise`). So to declare the `Rate[]` type, we have to use the explicit `[ ]` syntax for array types - `@Field(type => [Rate])`.
For nested arrays, we just use the explicit `[ ]` notation to determine the depth of the array, e.g. `@Field(type => [[Int]])` would tell the compiler we expect an integer array of depth 2.

Why use function syntax and not a simple `{ type: Rate }` config object? Because, by using function syntax we solve the problem of circular dependencies (e.g. Post <--> User), so it was adopted as a convention. You can use the shorthand syntax `@Field(() => Rate)` if you want to save some keystrokes but it might be less readable for others.

By default, all fields are non nullable, just like properties in TypeScript. However, you can change that behavior by providing `nullableByDefault: true` option in `buildSchema` settings, described in [bootstrap guide](./bootstrap.md).

So for nullable properties like `averageRating` which might not be defined when a recipe has no ratings yet, we mark the class property as optional with a `?:` operator and also have to pass the `{ nullable: true }` decorator parameter. We should be aware that when we declare our type as a nullable union (e.g. `string | null`), we need to explicitly provide the type to the `@Field` decorator.

In the case of lists, we may also need to define their nullability in a more detailed form. The basic `{ nullable: true | false }` setting only applies to the whole list (`[Item!]` or `[Item!]!`), so if we need a sparse array, we can control the list items' nullability via `nullable: "items"` (for `[Item]!`) or `nullable: "itemsAndList"` (for the `[Item]`) option. Be aware that setting `nullableByDefault: true` option will also apply to lists, so it will produce `[Item]` type, just like with `nullable: "itemsAndList"`.

For nested lists, those options apply to the whole depth of the array: `@Field(() => [[Item]]` would by defaut produce `[[Item!]!]!`, setting `nullable: "itemsAndList"` would produce `[[Item]]` while `nullable: "items"` would produce `[[Item]]!`

In the config object we can also provide the `description` and `deprecationReason` properties for GraphQL schema purposes.

So after these changes our example class would look like this:

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

Which will result in generating the following part of the GraphQL schema in SDL:

```graphql
type Recipe {
  id: ID!
  title: String!
  ratings: [Rate!]!
  averageRating: Float
}
```

Similarly, the `Rate` type class would look like this:

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

which results in this equivalent of the GraphQL SDL:

```graphql
type Rate {
  value: Int!
  date: Date!
}
```

As we can see, for the `id` property of `Recipe` we passed `type => ID` and for the `value` field of `Rate` we passed `type => Int`. This way we can overwrite the inferred type from the reflection metadata. We can read more about the ID and Int scalars in [the scalars docs](scalars.md). There is also a section about the built-in `Date` scalar.

Also the `user` property doesn't have a `@Field()` decorator - this way we can hide some properties of our data model. In this case, we need to store the `user` field of the `Rate` object to the database in order to prevent multiple rates, but we don't want to make it publicly accessible.

Note that if a field of an object type is purely calculable (e.g. `averageRating` from `ratings` array) and we don't want to pollute the class signature, we can omit it and just implement the field resolver (described in [resolvers doc](resolvers.md)).

Be aware that **defining constructors is strictly forbidden** and we shouldn't use them there, as TypeGraphQL creates instances of object type classes under the hood by itself.
