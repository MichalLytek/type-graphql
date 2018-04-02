# Unions
Sometimes our API has to be flexible and return not a specific type but the one from the range of possible types. The example might be a movie site's search functionality: using the provided phrase we search in database not only for movies but also for actors, so the query has to return the list `Movie` or `Actor` types. 

You can read more about GraphQL union type in [official docs](http://graphql.org/learn/schema/#union-types).

## Usage
Let's start by creating the object types from example above:

```ts
@ObjectType()
class Movie {
  @Field()
  name: string;

  @Field()
  rating: number;
}
```
```ts
@ObjectType()
class Actor {
  @Field()
  name: string;

  @Field(type => Int)
  age: number;
}
```

Then we have to create the union type from the object types above:
```ts
import { createUnionType } from "type-graphql";

const SearchResultUnion = createUnionType({
  name: "SearchResult",  // the name of the GraphQL union
  types: [Movie, Actor], // array of object types classes
});
```

All that left to do is to use the union type in the query.
Notice, that due to TypeScript's reflection limitation, you have to explicitly use `SearchResultUnion` value in `@Query` decorator return type annotation.
For TS compile-time type safety you can also use `typeof SearchResultUnion` which is equal to type `Movie | Actor`.
```ts
@Resolver()
class SearchResolver {
  @Query(returns => [SearchResultUnion])
  async search(
    @Arg("phrase") phrase: string,
  ): Promise<Array<typeof SearchResultUnion>> {
    const movies = await Movies.findAll(phrase);
    const actors = await Actors.findAll(phrase);

    return movies.concat(actors);
  }
}
```
Be aware that when your query/mutation return type (or field type) is an union, you have to return an specific instance of the object type class. Otherwise, `graphql-js` will not be able to detect the underlying GraphQL type correctly when you use plain JS objects.

**Et Voilà!** You can now build the schema and make the example query :wink:
```graphql
query {
  search(phrase: "Holmes") {
    ... on Actor { # maybe Katie Holmes?
      name
      age
    }
    ... on Movie { # for sure Sherlock Holmes!
      name
      rating
    }
  }
}
```
