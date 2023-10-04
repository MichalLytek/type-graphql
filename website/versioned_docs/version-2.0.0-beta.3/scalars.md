---
title: Scalars
id: version-2.0.0-beta.3-scalars
original_id: scalars
---

## Aliases

TypeGraphQL provides aliases for 3 basic scalars:

- Int --> GraphQLInt;
- Float --> GraphQLFloat;
- ID --> GraphQLID;

This shorthand allows you to save keystrokes when declaring field types:

```ts
// Import the aliases
import { ID, Float, Int } from "type-graphql";

@ObjectType()
class MysteryObject {
  @Field(type => ID)
  readonly id: string;

  @Field(type => Int)
  notificationsCount: number;

  @Field(type => Float)
  probability: number;
}
```

In the last case you can omit the `type => Float` since JavaScript `Number` will become `GraphQLFloat` in the schema automatically.

Other scalars - i.e. `GraphQLString` and `GraphQLBoolean` - do not need aliases. When possible, they will be reflected automatically:

```ts
@ObjectType()
class User {
  @Field()
  name: string;

  @Field()
  isOld: boolean;
}
```

However in some cases we must explicitly declare the string/bool scalar type. Use JS constructor functions (`String`, `Boolean`) then:

```ts
@ObjectType()
class SampleObject {
  @Field(type => String, { nullable: true })
  // TS reflected type is `Object` :(
  get optionalInfo(): string | undefined {
    if (Math.random() > 0.5) {
      return "Gotcha!";
    }
  }
}
```

## Custom Scalars

TypeGraphQL also supports custom scalar types!

First of all, we need to create our own `GraphQLScalarType` instance or import a scalar type from a 3rd-party npm library. For example, Mongo's ObjectId:

```ts
import { GraphQLScalarType, Kind } from "graphql";
import { ObjectId } from "mongodb";

export const ObjectIdScalar = new GraphQLScalarType({
  name: "ObjectId",
  description: "Mongo object id scalar type",
  serialize(value: unknown): string {
    // Check type of value
    if (!(value instanceof ObjectId)) {
      throw new Error("ObjectIdScalar can only serialize ObjectId values");
    }
    return value.toHexString(); // Value sent to client
  },
  parseValue(value: unknown): ObjectId {
    // Check type of value
    if (typeof value !== "string") {
      throw new Error("ObjectIdScalar can only parse string values");
    }
    return new ObjectId(value); // Value from client input variables
  },
  parseLiteral(ast): ObjectId {
    // Check type of value
    if (ast.kind !== Kind.STRING) {
      throw new Error("ObjectIdScalar can only parse string values");
    }
    return new ObjectId(ast.value); // Value from client query
  },
});
```

Then we can just use it in our field decorators:

```ts
// Import earlier created const
import { ObjectIdScalar } from "../my-scalars/ObjectId";

@ObjectType()
class User {
  @Field(type => ObjectIdScalar) // Explicitly use it
  readonly id: ObjectId;

  @Field()
  name: string;

  @Field()
  isOld: boolean;
}
```

Optionally, we can declare the association between the reflected property type and our scalars to automatically map them (no need for explicit type annotation!):

```ts
@ObjectType()
class User {
  @Field() // Magic goes here - no type annotation for custom scalar
  readonly id: ObjectId;
}
```

All we need to do is register the association map in the `buildSchema` options:

```ts
import { ObjectId } from "mongodb";
import { ObjectIdScalar } from "../my-scalars/ObjectId";
import { buildSchema } from "type-graphql";

const schema = await buildSchema({
  resolvers,
  scalarsMap: [{ type: ObjectId, scalar: ObjectIdScalar }],
});
```

However, we must be aware that this will only work when the TypeScript reflection mechanism can handle it. So our class property type must be a `class`, not an enum, union or interface.

## Date Scalars

TypeGraphQL provides built-in scalars for the `Date` type. There are two versions of this scalar:

- ISO-formatted string: `"2023-05-19T21:04:39.573Z"`
- timestamp-based number: `1518037458374`

They are exported from the `type-graphql` package as `GraphQLISODateTime` and `GraphQLTimestamp` but comes from `graphql-scalars` npm package.

By default, TypeGraphQL uses the ISO date format, however we can change it to timestamp format using the mentioned above `scalarsMap` option of `buildSchema` configuration:

```ts
import { buildSchema, GraphQLTimestamp } from "type-graphql";

const schema = await buildSchema({
  resolvers,
  scalarsMap: [{ type: Date, scalar: GraphQLTimestamp }],
});
```

There's no need then to explicitly declare the field type:

```ts
@ObjectType()
class User {
  @Field()
  registrationDate: Date;
}
```

We can of course use any other `Date` scalar from `graphql-scalars` or any other npm package.
