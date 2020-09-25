---
title: Scalars
---

## Aliases

TypeGraphQL provides aliases for 3 basic scalars:

- Int --> GraphQLInt;
- Float --> GraphQLFloat;
- ID --> GraphQLID;

This shorthand allows you to save keystrokes when declaring field types:

```typescript
// import the aliases
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

```typescript
@ObjectType()
class User {
  @Field()
  name: string;

  @Field()
  isOld: boolean;
}
```

However in some cases we must explicitly declare the string/bool scalar type. Use JS constructor functions (`String`, `Boolean`) then:

```typescript
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

## Date Scalars

TypeGraphQL provides built-in scalars for the `Date` type. There are two versions of this scalar:

- timestamp based (`"timestamp"`) - `1518037458374`
- ISO format (`"isoDate"`) - `"2018-02-07T21:04:39.573Z"`

They are exported from the `type-graphql` package as `GraphQLISODateTime` and `GraphQLTimestamp`.

By default, TypeGraphQL uses the ISO date format, however you can change it in the `buildSchema` options:

```typescript
import { buildSchema } from "type-graphql";

const schema = await buildSchema({
  resolvers,
  dateScalarMode: "timestamp", // "timestamp" or "isoDate"
});
```

There's no need then to explicitly declare the field type:

```typescript
@ObjectType()
class User {
  @Field()
  registrationDate: Date;
}
```

## Custom Scalars

TypeGraphQL also supports custom scalar types!

First of all, we need to create our own `GraphQLScalarType` instance or import a scalar type from a 3rd-party npm library. For example, Mongo's ObjectId:

```typescript
import { GraphQLScalarType, Kind } from "graphql";
import { ObjectId } from "mongodb";

export const ObjectIdScalar = new GraphQLScalarType({
  name: "ObjectId",
  description: "Mongo object id scalar type",
  serialize(value: unknown): string {
    // check the type of received value
    if (!(value instanceof ObjectId)) {
      throw new Error("ObjectIdScalar can only serialize ObjectId values");
    }
    return value.toHexString(); // value sent to the client
  },
  parseValue(value: unknown): ObjectId {
    // check the type of received value
    if (typeof value !== "string") {
      throw new Error("ObjectIdScalar can only parse string values");
    }
    return new ObjectId(value); // value from the client input variables
  },
  parseLiteral(ast): ObjectId {
    // check the type of received value
    if (ast.kind !== Kind.STRING) {
      throw new Error("ObjectIdScalar can only parse string values");
    }
    return new ObjectId(ast.value); // value from the client query
  },
});
```

Then we can just use it in our field decorators:

```typescript
// import the earlier created const
import { ObjectIdScalar } from "../my-scalars/ObjectId";

@ObjectType()
class User {
  @Field(type => ObjectIdScalar) // and explicitly use it
  readonly id: ObjectId;

  @Field()
  name: string;

  @Field()
  isOld: boolean;
}
```

Optionally, we can declare the association between the reflected property type and our scalars to automatically map them (no need for explicit type annotation!):

```typescript
@ObjectType()
class User {
  @Field() // magic goes here - no type annotation for custom scalar
  readonly id: ObjectId;
}
```

All we need to do is register the association map in the `buildSchema` options:

```typescript
import { ObjectId } from "mongodb";
import { ObjectIdScalar } from "../my-scalars/ObjectId";
import { buildSchema } from "type-graphql";

const schema = await buildSchema({
  resolvers,
  scalarsMap: [{ type: ObjectId, scalar: ObjectIdScalar }],
});
```

However, we must be aware that this will only work when the TypeScript reflection mechanism can handle it. So our class property type must be a `class`, not an enum, union or interface.
