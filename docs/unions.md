---
title: Unions
---

Sometimes our API has to be flexible and return a type that is not specific but one from a range of possible types. An example might be a movie site's search functionality: using the provided phrase we search the database for movies but also actors. So the query has to return a list of `Movie` or `Actor` types.

Read more about the GraphQL Union Type in the [official GraphQL docs](http://graphql.org/learn/schema/#union-types).

## Usage

Let's start by creating the object types from the example above:

```typescript
@ObjectType()
class Movie {
  @Field()
  name: string;

  @Field()
  rating: number;
}
```

```typescript
@ObjectType()
class Actor {
  @Field()
  name: string;

  @Field(type => Int)
  age: number;
}
```

Now let's create a union type from the object types above:

```typescript
import { createUnionType } from "type-graphql";

const SearchResultUnion = createUnionType({
  name: "SearchResult", // the name of the GraphQL union
  types: () => [Movie, Actor], // function that returns array of object types classes
});
```

Now we can use the union type in the query.
Notice, that due to TypeScript's reflection limitation, we have to explicitly use the `SearchResultUnion` value in the `@Query` decorator return type annotation.
For TypeScript compile-time type safety we can also use `typeof SearchResultUnion` which is equal to type `Movie | Actor`.

```typescript
@Resolver()
class SearchResolver {
  @Query(returns => [SearchResultUnion])
  async search(@Arg("phrase") phrase: string): Promise<Array<typeof SearchResultUnion>> {
    const movies = await Movies.findAll(phrase);
    const actors = await Actors.findAll(phrase);

    return [...movies, ...actors];
  }
}
```

## Resolving Type

Be aware that when the query/mutation return type (or field type) is a union, we have to return a specific instance of the object type class. Otherwise, `graphql-js` will not be able to detect the underlying GraphQL type correctly when we use plain JS objects.

However, we can also provide our own `resolveType` function implementation to the `createUnionType` options. This way we can return plain objects in resolvers and then determine the returned object type by checking the shape of the data object, e.g.:

```typescript
const SearchResultUnion = createUnionType({
  name: "SearchResult",
  types: () => [Movie, Actor],
  // our implementation of detecting returned object type
  resolveType: value => {
    if ("rating" in value) {
      return Movie; // we can return object type class (the one with `@ObjectType()`)
    }
    if ("age" in value) {
      return "Actor"; // or the schema name of the type as a string
    }
    return undefined;
  },
});
```

**Et Voilà!** We can now build the schema and make the example query 😉

```graphql
query {
  search(phrase: "Holmes") {
    ... on Actor {
      # maybe Katie Holmes?
      name
      age
    }
    ... on Movie {
      # for sure Sherlock Holmes!
      name
      rating
    }
  }
}
```

## Examples

More advanced usage examples of unions (and enums) are located in [this examples folder](https://github.com/19majkel94/type-graphql/tree/master/examples/enums-and-unions).
