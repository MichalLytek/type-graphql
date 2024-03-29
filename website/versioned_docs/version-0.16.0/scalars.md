---
title: Scalars
id: version-0.16.0-scalars
original_id: scalars
---

## Aliases

TypeGraphQL provides aliases for 3 basic scalars:

- Int --> GraphQLInt;
- Float --> GraphQLFloat;
- ID --> GraphQLID;

This shorthand allows you to save keystrokes when declaring field type:

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

However in some cases you will have to explicitly declare the string/bool scalar type. Use JS constructor functions (`String`, `Boolean`) then:

```typescript
@ObjectType()
class SampleObject {
  @Field(type => String, { nullable: true })
  get optionalInfo(): string | undefined {
    // TS reflected type is `Object` :(
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

They are exported from `type-graphql` package as `GraphQLISODateScalar` and `GraphQLTimestampScalar`.

By default TypeGraphQL use the ISO date format, however you can change it in `buildSchema` options:

```typescript
import { buildSchema } from "type-graphql";

const schema = await buildSchema({
  resolvers,
  dateScalarMode: "timestamp", // "timestamp" or "isoDate"
});
```

There's no need to explicitly declare the field type then:

```typescript
@ObjectType()
class User {
  @Field()
  registrationDate: Date;
}
```

If you use `ts-node`, be aware you must execute it with the `--type-check` flag due to a [Date reflection bug](https://github.com/TypeStrong/ts-node/issues/511).

## Custom Scalars

TypeGraphQL also support custom scalar types.

First of all, you need to create your own `GraphQLScalarType` instance or import the scalar type from a 3rd-party npm library. For example, Mongo's ObjectId:

```typescript
import { GraphQLScalarType, Kind } from "graphql";
import { ObjectId } from "mongodb";

export const ObjectIdScalar = new GraphQLScalarType({
  name: "ObjectId",
  description: "Mongo object id scalar type",
  parseValue(value: string) {
    return new ObjectId(value); // value from the client input variables
  },
  serialize(value: ObjectId) {
    return value.toHexString(); // value sent to the client
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new ObjectId(ast.value); // value from the client query
    }
    return null;
  },
});
```

Then you can just use it in your field decorators:

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

Optionally, you can declare the association between the reflected property type and your scalars to automatically map them (no need to explicit type annotation!):

```typescript
@ObjectType()
class User {
  @Field() // magic goes here - no type annotation for custom scalar
  readonly id: ObjectId;
}
```

All you need to do is register the association map in the `buildSchema` options:

```typescript
import { ObjectId } from "mongodb";
import { ObjectIdScalar } from "../my-scalars/ObjectId";
import { buildSchema } from "type-graphql";

const schema = await buildSchema({
  resolvers,
  scalarsMap: [{ type: ObjectId, scalar: ObjectIdScalar }],
});
```

However, be aware that this will work only when the TypeScript reflection mechanism can handle it. So your class property type must be the `class`, not an enum, union or an interface.
