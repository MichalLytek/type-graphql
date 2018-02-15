# Types

## Aliases
<dl>
  <dt>GraphQLObjectType</dt>
  <dd>Define Types using the same TypeORM entity class.</dd>
  <dd>Marks the class as the object shape known from GraphQL SDL as type.</dd>

  <dt>Field</dt>
  <dd>Marks the property as the object's field - it is also used to collect type metadata from TypeScript reflection system.</dd>
  <dd>The parameter function in decorator `@Field(type => ID)` is used to declare the GraphQL scalar type like the builit-in ID</dd>
</dl>

## How-To use types
```ts
import { Field, GraphQLObjectType } from 'type-graphql';

@GraphQLObjectType()
class Recipe {
  @Field(type => ID)
  readonly id: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field(type => Rate)
  ratings: Rate[];

  @Field({ nullable: true })
  averageRating?: number;
}
```